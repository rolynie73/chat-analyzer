import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.userApiKeys.findUnique({ where: { clerkUserId: userId } });

  return NextResponse.json({
    configured: {
      anthropic: !!keys?.anthropicKey,
      openai: !!keys?.openaiKey,
      google: !!keys?.googleKey,
    },
    masked: {
      anthropic: keys?.anthropicKey ? maskKey(keys.anthropicKey) : null,
      openai: keys?.openaiKey ? maskKey(keys.openaiKey) : null,
      google: keys?.googleKey ? maskKey(keys.googleKey) : null,
    },
  });
}

const bodySchema = z.object({
  anthropicKey: z.string().optional(),
  openaiKey: z.string().optional(),
  googleKey: z.string().optional(),
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  if (parsed.data.anthropicKey !== undefined)
    data.anthropicKey = parsed.data.anthropicKey || null;
  if (parsed.data.openaiKey !== undefined)
    data.openaiKey = parsed.data.openaiKey || null;
  if (parsed.data.googleKey !== undefined)
    data.googleKey = parsed.data.googleKey || null;

  await prisma.userApiKeys.upsert({
    where: { clerkUserId: userId },
    create: { clerkUserId: userId, ...data },
    update: data,
  });

  return NextResponse.json({ ok: true });
}

function maskKey(key: string) {
  if (key.length <= 8) return "••••••••";
  return key.slice(0, 4) + "••••••••" + key.slice(-4);
}
