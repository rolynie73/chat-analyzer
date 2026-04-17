import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import Nav from "@/components/nav";
import AnalysisCard from "@/components/analysis-card";
import { ORIENTATION_META } from "@/lib/analyzer/prompts";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tus análisis</h1>
            <p className="text-sm text-gray-500 mt-1">
              {analyses.length === 0
                ? "Todavía no analizaste ningún chat."
                : `${analyses.length} análisis guardado${analyses.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors"
          >
            + Nuevo análisis
          </Link>
        </div>

        {analyses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((a) => (
              <AnalysisCard key={a.id} analysis={a} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  const orientations = Object.entries(ORIENTATION_META);
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">💬</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Empezá tu primer análisis</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Subí un chat de WhatsApp o cualquier conversación y elegí el enfoque que más te interese.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {orientations.map(([key, meta]) => (
          <span
            key={key}
            className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-full text-gray-600"
          >
            {meta.emoji} {meta.label}
          </span>
        ))}
      </div>
      <Link
        href="/analyze"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors"
      >
        Analizar ahora →
      </Link>
    </div>
  );
}
