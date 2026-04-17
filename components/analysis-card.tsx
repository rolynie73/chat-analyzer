"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();
  const meta = ORIENTATION_META[analysis.orientation as Orientation];
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    await fetch(`/api/analyses/${analysis.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="relative group">
      <Link
        href={`/analysis/${analysis.id}`}
        className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${meta?.gradient} shadow-sm`}>
            {meta?.emoji}
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PROVIDER_COLORS[analysis.provider as AIProvider]}`}>
            {analysis.modelName}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
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

      {/* Delete button */}
      <div className="absolute top-3 right-3">
        {confirming ? (
          <div className="flex gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? "…" : "Eliminar"}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setConfirming(false); }}
              className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Eliminar análisis"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
