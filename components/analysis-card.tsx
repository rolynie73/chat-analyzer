import Link from "next/link";
import { ORIENTATION_META, type Orientation } from "@/lib/analyzer/prompts";
import { PROVIDER_COLORS, type AIProvider } from "@/lib/ai-models";
import { formatDate } from "@/lib/utils";

interface AnalysisCardProps {
  analysis: {
    id: string;
    title: string;
    orientation: string;
    provider: string;
    modelName: string;
    msgCount: number;
    participants: string[];
    createdAt: Date;
  };
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  const meta = ORIENTATION_META[analysis.orientation as Orientation];

  return (
    <Link
      href={`/analysis/${analysis.id}`}
      className="group block bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${meta?.gradient} shadow-sm`}
        >
          {meta?.emoji}
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            PROVIDER_COLORS[analysis.provider as AIProvider]
          }`}
        >
          {analysis.modelName}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-gray-700 line-clamp-2">
        {analysis.title}
      </h3>

      <p className="text-xs text-gray-400 mb-3">
        {analysis.participants.slice(0, 3).join(", ")}
        {analysis.participants.length > 3 && ` +${analysis.participants.length - 3}`}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{analysis.msgCount} msgs</span>
        <span>{formatDate(analysis.createdAt)}</span>
      </div>
    </Link>
  );
}
