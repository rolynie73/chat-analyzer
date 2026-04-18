import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { parseChat } from "@/lib/analyzer/parser";
import { buildPrompt, type Orientation } from "@/lib/analyzer/prompts";
import { runAnalysis, parseJsonResponse } from "@/lib/analyzer/runner";
import { getModelById } from "@/lib/ai-models";

const bodySchema = z.object({
  rawChat: z.string().min(10),
  orientation: z.enum(["vibes", "psych", "professional", "social", "relational", "stats"]),
  model: z.string().min(1),
  title: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos: " + parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { rawChat: rawChatRaw, orientation, model, title } = parsed.data;
    const rawChat = rawChatRaw.replace(/\0/g, "");

    const modelDef = getModelById(model);
    if (!modelDef) return NextResponse.json({ error: `Modelo desconocido: ${model}` }, { status: 400 });

    const userKeys = await prisma.userApiKeys.findUnique({ where: { clerkUserId: userId } });
    const apiKey =
      modelDef.provider === "anthropic"
        ? userKeys?.anthropicKey
        : modelDef.provider === "openai"
        ? userKeys?.openaiKey
        : userKeys?.googleKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: `No tenés configurada la API key de ${modelDef.provider}. Configurala en Ajustes.` },
        { status: 400 }
      );
    }

    const chatParsed = parseChat(rawChat);
    if (chatParsed.msgCount === 0) {
      return NextResponse.json(
        { error: "No se encontraron mensajes. Verificá el formato del archivo (.txt de WhatsApp o 'Nombre: mensaje' por línea)." },
        { status: 400 }
      );
    }

    const { system, userMessage } = buildPrompt(orientation as Orientation, {
      chatText: chatParsed.chatText,
      msgCount: chatParsed.msgCount,
      dateRange: chatParsed.dateRange,
      participantNames: chatParsed.participantNames,
    });

    let rawResponse: string;
    try {
      rawResponse = await runAnalysis({ model, system, userMessage, apiKey });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al llamar la API";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const result = parseJsonResponse(rawResponse);
    if (!result.success) {
      return NextResponse.json({ error: result.error, rawResponse }, { status: 422 });
    }

    const autoTitle =
      title ||
      (chatParsed.participantNames.length > 0
        ? `${chatParsed.participantNames.slice(0, 2).join(" & ")} — ${orientationLabel(orientation)}`
        : `Análisis ${orientationLabel(orientation)}`);

    const analysis = await prisma.analysis.create({
      data: {
        clerkUserId: userId,
        title: autoTitle,
        rawChat,
        orientation,
        provider: modelDef.provider,
        model,
        modelName: modelDef.name,
        msgCount: chatParsed.msgCount,
        participants: chatParsed.participantNames,
        result: result.data as object,
      },
    });

    return NextResponse.json({ id: analysis.id, analysis: result.data });
  } catch (err: unknown) {
    console.error("[/api/analyze] Unhandled error:", err);
    const msg = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function orientationLabel(o: string) {
  const labels: Record<string, string> = {
    vibes: "Vibes",
    psych: "Psicológico",
    professional: "Profesional",
    social: "Social",
    relational: "Relacional",
  };
  return labels[o] ?? o;
}
