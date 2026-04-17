import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Nav from "@/components/nav";
import AnalysisResults from "@/components/analysis-results";
import AnalysisActions from "@/components/analysis-actions";
import { ORIENTATION_META, type Orientation } from "@/lib/analyzer/prompts";
import { PROVIDER_COLORS } from "@/lib/ai-models";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const analysis = await prisma.analysis.findUnique({ where: { id } });

  if (!analysis || analysis.clerkUserId !== userId) notFound();

  const meta = ORIENTATION_META[analysis.orientation as Orientation];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← Volver al dashboard
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{meta?.emoji}</span>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r ${meta?.gradient} text-white`}
                >
                  {meta?.label}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${PROVIDER_COLORS[analysis.provider as keyof typeof PROVIDER_COLORS]}`}>
                  {analysis.modelName}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{analysis.title}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {analysis.msgCount} mensajes · {analysis.participants.join(", ")} ·{" "}
                {formatDate(analysis.createdAt)}
              </p>
            </div>
            <AnalysisActions
              analysisId={analysis.id}
              title={analysis.title}
              orientationLabel={meta?.label ?? analysis.orientation}
            />
          </div>
        </div>

        <AnalysisResults
          orientation={analysis.orientation as Orientation}
          result={analysis.result}
        />
      </main>
    </div>
  );
}
