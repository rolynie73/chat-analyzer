"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";
import { ORIENTATION_META, type Orientation } from "@/lib/analyzer/prompts";
import { AI_MODELS, PROVIDER_LABELS, SPEED_ICONS, type AIProvider } from "@/lib/ai-models";
import { parseChat, type ParsedChat } from "@/lib/analyzer/parser";
import Link from "next/link";

type Step = 1 | 2 | 3;

interface ConfiguredKeys {
  anthropic: boolean;
  openai: boolean;
  google: boolean;
}

const MSG_LIMIT_OPTIONS = [
  { label: "Últimos 300", value: 300 },
  { label: "Últimos 500", value: 500 },
  { label: "Últimos 1 000", value: 1000 },
  { label: "Últimos 2 000", value: 2000 },
  { label: "Últimos 3 000", value: 3000 },
  { label: "Todos (puede fallar)", value: Infinity },
];

const TOKEN_WARN = 100_000;
const SAFE_INPUT_TOKENS = 80_000;

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

function buildChatText(messages: ParsedChat["messages"], limit: number): string {
  const slice = isFinite(limit) ? messages.slice(-limit) : messages;
  return slice.map((m) => `${m.sender}: ${m.text}`).join("\n");
}

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [rawChat, setRawChat] = useState("");
  const [parsed, setParsed] = useState<ParsedChat | null>(null);
  const [msgLimit, setMsgLimit] = useState<number>(Infinity);
  const [orientation, setOrientation] = useState<Orientation | "">("");
  const [model, setModel] = useState("");
  const [configuredKeys, setConfiguredKeys] = useState<ConfiguredKeys | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetch("/api/user-keys")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setConfiguredKeys(data.configured);
        const firstAvailable = AI_MODELS.find((m) => data.configured[m.provider]);
        if (firstAvailable) setModel(firstAvailable.id);
      })
      .catch(() => {});
  }, []);

  const processText = useCallback((text: string) => {
    setRawChat(text);
    const result = parseChat(text);
    if (result.msgCount > 0) {
      setParsed(result);
      setMsgLimit(Infinity);
    } else {
      setParsed(null);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => processText(e.target?.result as string);
    reader.readAsText(file, "utf-8");
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const effectiveChatText = parsed ? buildChatText(parsed.messages, msgLimit) : "";
  const effectiveMsgCount = parsed
    ? isFinite(msgLimit)
      ? Math.min(msgLimit, parsed.msgCount)
      : parsed.msgCount
    : 0;
  const estimatedTokens = estimateTokens(effectiveChatText);
  const tooLong = parsed ? estimateTokens(parsed.chatText) > TOKEN_WARN : false;

  // Smart recommendation: how many messages fit in SAFE_INPUT_TOKENS
  const recommendedLimit = parsed && parsed.msgCount > 0
    ? Math.floor(SAFE_INPUT_TOKENS / (estimateTokens(parsed.chatText) / parsed.msgCount))
    : Infinity;

  const handleAnalyze = async () => {
    if (!effectiveChatText || !orientation || !model) return;
    setIsAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawChat: effectiveChatText, orientation, model }),
      });
      const text = await res.text();
      let data: { id?: string; error?: string } = {};
      try { data = JSON.parse(text); } catch { throw new Error("Respuesta inválida del servidor"); }
      if (!res.ok) throw new Error(data.error || "Error al analizar");
      router.push(`/analysis/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setIsAnalyzing(false);
    }
  };

  const availableModels = configuredKeys
    ? AI_MODELS.filter((m) => configuredKeys[m.provider as keyof ConfiguredKeys])
    : [];
  const hasKeys = availableModels.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => s < step && setStep(s)}
                className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                  step === s
                    ? "bg-gray-900 text-white"
                    : step > s
                    ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > s ? "✓" : s}
              </button>
              <span className={`text-sm font-medium ${step === s ? "text-gray-900" : "text-gray-400"}`}>
                {s === 1 ? "Chat" : s === 2 ? "Enfoque" : "Analizar"}
              </span>
              {s < 3 && <div className={`flex-1 h-px mx-1 ${step > s ? "bg-green-400" : "bg-gray-200"}`} style={{ width: 32 }} />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Upload ───────────────────────────────── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Subí el chat</h1>
            <p className="text-gray-500 mb-4">
              Exportá el chat de WhatsApp como .txt, o pegá cualquier conversación en formato{" "}
              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">Nombre: mensaje</code> por línea.
            </p>

            {/* WhatsApp export instructions */}
            <details className="mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center gap-2 hover:bg-gray-50">
                <span>📱</span> ¿Cómo exportar un chat de WhatsApp?
              </summary>
              <div className="px-4 pb-4 pt-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-bold text-gray-700 mb-1.5">📱 iPhone</p>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Abrí el chat en WhatsApp</li>
                      <li>Tocá el nombre del contacto/grupo</li>
                      <li>Bajá hasta <strong>Exportar chat</strong></li>
                      <li>Elegí <strong>Sin archivos multimedia</strong></li>
                      <li>Compartí el .txt o guardalo</li>
                    </ol>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-bold text-gray-700 mb-1.5">🤖 Android</p>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                      <li>Abrí el chat en WhatsApp</li>
                      <li>Tocá los tres puntos ⋮ arriba a la derecha</li>
                      <li>Seleccioná <strong>Más → Exportar chat</strong></li>
                      <li>Elegí <strong>Sin archivos multimedia</strong></li>
                      <li>Guardá o compartí el archivo .txt</li>
                    </ol>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  💡 También podés copiar y pegar mensajes de Telegram o cualquier app — el formato <em>Nombre: mensaje</em> funciona directamente.
                </p>
              </div>
            </details>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors mb-4 ${
                isDragging ? "border-gray-400 bg-gray-100" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="file"
                accept=".txt"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
              />
              <div className="text-4xl mb-3">📂</div>
              <p className="font-medium text-gray-700">Arrastrá el archivo .txt aquí</p>
              <p className="text-sm text-gray-400 mt-1">o hacé click para seleccionarlo</p>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-sm text-gray-400 bg-gray-50">o pegá el texto directamente</span>
              </div>
            </div>

            <textarea
              value={rawChat}
              onChange={(e) => processText(e.target.value)}
              placeholder={"Copiá y pegá el chat aquí. Formatos soportados:\n• WhatsApp (.txt exportado)\n• Telegram (copiar mensajes)\n• Cualquier formato: Nombre: mensaje"}
              rows={10}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono resize-y"
            />

            {parsed && (
              <div className="mt-4 space-y-3">
                {/* Detection badge */}
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <span className="text-green-600 text-xl">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      {parsed.msgCount.toLocaleString("es")} mensajes detectados
                    </p>
                    <p className="text-xs text-green-600">
                      Participantes: {parsed.participantNames.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Token warning + limit selector */}
                {tooLong && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm font-semibold text-amber-800 mb-1">
                      ⚠️ Chat muy largo — {Math.round(estimateTokens(parsed.chatText) / 1000)}k tokens estimados
                    </p>

                    {/* AI recommendation */}
                    <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-base">🤖</span>
                      <p className="text-xs text-blue-700">
                        <strong>Recomendación:</strong>{" "}
                        {isFinite(recommendedLimit)
                          ? `últimos ${Math.min(recommendedLimit, parsed.msgCount).toLocaleString("es")} mensajes (~${Math.round(SAFE_INPUT_TOKENS / 1000)}k tokens) para análisis confiable`
                          : "el chat entra bien en el modelo"}
                      </p>
                    </div>

                    <p className="text-xs text-amber-700 mb-3">
                      Elegí cuántos mensajes enviar. Los botones en rojo superan el límite seguro del modelo:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MSG_LIMIT_OPTIONS.map((opt) => {
                        const tokens = estimateTokens(buildChatText(parsed.messages, opt.value));
                        const overLimit = tokens > 190_000;
                        const isSelected = msgLimit === opt.value;
                        const isRecommended = isFinite(recommendedLimit) &&
                          isFinite(opt.value) &&
                          opt.value <= recommendedLimit &&
                          (MSG_LIMIT_OPTIONS.find(o => isFinite(o.value) && o.value > recommendedLimit)?.value === opt.value ||
                           MSG_LIMIT_OPTIONS.filter(o => isFinite(o.value) && o.value <= recommendedLimit).at(-1)?.value === opt.value);
                        return (
                          <div key={opt.value} className="relative">
                            {isRecommended && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 bg-blue-50 px-1 rounded whitespace-nowrap">
                                IA recomienda
                              </span>
                            )}
                            <button
                              onClick={() => setMsgLimit(opt.value)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                isSelected
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : isRecommended
                                  ? "bg-blue-50 text-blue-700 border-blue-300 hover:border-blue-500"
                                  : overLimit
                                  ? "bg-white text-red-600 border-red-200 hover:border-red-400"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              {opt.label}
                              <span className={`ml-1 ${overLimit && !isSelected ? "text-red-400" : "opacity-60"}`}>
                                (~{Math.round(tokens / 1000)}k)
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {isFinite(msgLimit) && (
                      <p className="text-xs text-amber-600 mt-2">
                        Se enviarán los últimos {Math.min(msgLimit, parsed.msgCount).toLocaleString("es")} mensajes · ~{Math.round(estimatedTokens / 1000)}k tokens
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!parsed || (tooLong && estimatedTokens > 190_000)}
              className="mt-6 w-full py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {tooLong && estimatedTokens > 190_000
                ? "Seleccioná un límite de mensajes"
                : "Continuar →"}
            </button>
          </div>
        )}

        {/* ── Step 2: Orientation ──────────────────────────── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Qué querés analizar?</h1>
            <p className="text-gray-500 mb-6">Cada enfoque usa prompts especializados con distintos indicadores y puntajes.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(ORIENTATION_META) as [Orientation, typeof ORIENTATION_META[Orientation]][]).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setOrientation(key)}
                  className={`relative overflow-hidden text-left p-5 rounded-2xl border-2 transition-all ${
                    orientation === key
                      ? `border-gray-900 bg-white shadow-md`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {orientation === key && (
                    <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${meta.gradient}`} />
                  )}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{meta.emoji}</span>
                      {orientation === key && (
                        <span className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900">{meta.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{meta.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!orientation}
                className="flex-1 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Model + Analyze ──────────────────────── */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Elegí el modelo</h1>
            <p className="text-gray-500 mb-6">
              Solo se muestran los proveedores con API key configurada.{" "}
              <Link href="/settings" className="text-gray-900 underline underline-offset-2">
                Configurar keys →
              </Link>
            </p>

            {/* Summary chip */}
            <div className="mb-5 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600">
                💬 {effectiveMsgCount.toLocaleString("es")} mensajes
              </span>
              <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600">
                ~{Math.round(estimatedTokens / 1000)}k tokens
              </span>
              {isFinite(msgLimit) && (
                <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700">
                  últimos {msgLimit.toLocaleString("es")} msgs
                </span>
              )}
            </div>

            {!hasKeys ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                <p className="text-amber-800 font-medium mb-3">
                  No tenés ninguna API key configurada.
                </p>
                <Link
                  href="/settings"
                  className="inline-flex px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                >
                  Ir a Ajustes →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {(["anthropic", "openai", "google"] as AIProvider[]).map((provider) => {
                  if (!configuredKeys?.[provider]) return null;
                  const models = availableModels.filter((m) => m.provider === provider);
                  return (
                    <div key={provider}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {PROVIDER_LABELS[provider]}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {models.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setModel(m.id)}
                            className={`p-3 text-left rounded-xl border-2 transition-all ${
                              model === m.id
                                ? "border-gray-900 bg-white shadow-sm"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-gray-800">{m.name}</span>
                              <span title={m.speed}>{SPEED_ICONS[m.speed]}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{m.description}</p>
                            <div className="flex gap-1 flex-wrap">
                              <span className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                                in ${m.pricing.input}/MTok
                              </span>
                              <span className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                                out ${m.pricing.output}/MTok
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                ← Atrás
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!model || !hasKeys || isAnalyzing}
                className="flex-1 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analizando…
                  </>
                ) : (
                  <>
                    {orientation && ORIENTATION_META[orientation as Orientation]?.emoji} Analizar
                  </>
                )}
              </button>
            </div>

            {isAnalyzing && (
              <p className="mt-4 text-center text-sm text-gray-400 animate-pulse">
                La IA está procesando el chat. Puede tomar unos segundos…
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
