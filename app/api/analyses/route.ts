import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const analyses = await prisma.analysis.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      orientation: true,
      provider: true,
      model: true,
      modelName: true,
      msgCount: true,
      participants: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ analyses });
}
