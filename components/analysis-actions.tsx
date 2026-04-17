"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  analysisId: string;
  title: string;
  orientationLabel: string;
}

export default function AnalysisActions({ analysisId, title, orientationLabel }: Props) {
  const router = useRouter();
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePrint = () => {
    const prev = document.title;
    document.title = `ChatAnalyzer — ${title} — ${orientationLabel}`;
    window.print();
    setTimeout(() => { document.title = prev; }, 1000);
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setSending(true);
    setEmailError("");
    try {
      const res = await fetch("/api/send-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, email }),
      });
      const text = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try { data = JSON.parse(text); } catch { throw new Error("Respuesta inválida"); }
      if (!res.ok) throw new Error(data.error ?? "Error al enviar");
      setSent(true);
      setEmail("");
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/analyses/${analysisId}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="print:hidden flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Exportar PDF
        </button>

        <button
          onClick={() => { setEmailOpen((v) => !v); setSent(false); setEmailError(""); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Enviar por mail
        </button>

        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {deleting ? "Eliminando…" : "Confirmar"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        )}
      </div>

      {emailOpen && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {sent ? (
            <p className="text-sm text-green-700 font-medium">✓ Análisis enviado correctamente</p>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                onClick={handleSendEmail}
                disabled={sending || !email}
                className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? "Enviando…" : "Enviar"}
              </button>
            </div>
          )}
          {emailError && <p className="mt-2 text-xs text-red-600">{emailError}</p>}
        </div>
      )}
    </div>
  );
}
