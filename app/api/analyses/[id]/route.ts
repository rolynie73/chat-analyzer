import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const analysis = await prisma.analysis.findUnique({ where: { id } });

    if (!analysis || analysis.clerkUserId !== userId) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    await prisma.analysis.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/analyses/:id]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
