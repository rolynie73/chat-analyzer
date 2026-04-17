import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { buildAnalysisEmail } from "@/lib/email-template";
import type { Orientation } from "@/lib/analyzer/prompts";

const ORIENTATION_LABELS: Record<string, string> = {
  vibes: "Vibes",
  psych: "Psicológico",
  professional: "Profesional",
  social: "Social",
  relational: "Relacional",
};

const bodySchema = z.object({
  analysisId: z.string().min(1),
  email: z.string().email("Email inválido"),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }

    const { analysisId, email } = parsed.data;

    const analysis = await prisma.analysis.findUnique({ where: { id: analysisId } });
    if (!analysis || analysis.clerkUserId !== userId) {
      return NextResponse.json({ error: "Análisis no encontrado" }, { status: 404 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Resend no configurado" }, { status: 500 });

    const resend = new Resend(apiKey);

    const html = buildAnalysisEmail({
      title: analysis.title,
      orientation: analysis.orientation as Orientation,
      modelName: analysis.modelName,
      msgCount: analysis.msgCount,
      participants: analysis.participants,
      result: analysis.result,
      orientationLabel: ORIENTATION_LABELS[analysis.orientation] ?? analysis.orientation,
    });

    const from = process.env.RESEND_FROM ?? "ChatAnalyzer <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: `📊 ${analysis.title} — ChatAnalyzer`,
      html,
    });

    if (error) {
      console.error("[send-analysis] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-analysis] Unhandled error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
