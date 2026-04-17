import ScoreBar from "@/components/score-bar";

interface RelParticipant {
  nombre: string;
  nivel_interes: { valor: number; descripcion: string };
  estilo_apego_relacional: { tipo: string; evidencias: string[] };
  intensidad_emocional: { valor: number; descripcion: string };
  señales_interes: { señal: string; evidencia: string }[];
  señales_desinteres: { señal: string; evidencia: string }[];
}

interface RelationalResult {
  meta: { mensajes: number; tipo_vinculo_inferido: string };
  temperatura: { valor: number; label: string };
  interacciones: { iniciativa: string; balance: string };
  participantes: RelParticipant[];
  compatibilidad: { valor: number; descripcion: string };
  drama_score: { valor: number; descripcion: string };
  fase_relacion: string;
  dinamica: string;
  hay_futuro: { evaluacion: string; justificacion: string; consejo: string };
}

const TEMP_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  "gélida":   { emoji: "🧊", color: "text-blue-300", bg: "from-blue-100 to-blue-50" },
  "fría":     { emoji: "❄️", color: "text-blue-500", bg: "from-blue-200 to-blue-50" },
  "tibia":    { emoji: "🌤️", color: "text-yellow-600", bg: "from-yellow-100 to-amber-50" },
  "cálida":   { emoji: "☀️", color: "text-orange-500", bg: "from-orange-100 to-amber-50" },
  "ardiente": { emoji: "🔥", color: "text-red-500", bg: "from-red-100 to-orange-50" },
};

const FUTURO_CONFIG: Record<string, { color: string; icon: string }> = {
  "muy probable":    { color: "bg-green-500", icon: "🟢" },
  "probable":        { color: "bg-emerald-400", icon: "🟡" },
  "incierto":        { color: "bg-yellow-400", icon: "🟡" },
  "improbable":      { color: "bg-orange-400", icon: "🟠" },
  "muy improbable":  { color: "bg-red-500", icon: "🔴" },
};

const APEGO_STYLE: Record<string, string> = {
  seguro: "bg-green-100 text-green-800",
  ansioso: "bg-yellow-100 text-yellow-800",
  evitativo: "bg-blue-100 text-blue-800",
  desorganizado: "bg-red-100 text-red-800",
};

export default function RelationalResultView({ result }: { result: RelationalResult }) {
  const tempConfig = TEMP_CONFIG[result.temperatura?.label] ?? TEMP_CONFIG["tibia"];
  const futuroConfig = FUTURO_CONFIG[result.hay_futuro?.evaluacion] ?? FUTURO_CONFIG["incierto"];

  return (
    <div className="space-y-6">
      {/* Temperature + overview */}
      <div className={`bg-gradient-to-r ${tempConfig.bg} rounded-2xl border border-pink-100 p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Temperatura del vínculo</p>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{tempConfig.emoji}</span>
              <div>
                <p className={`text-2xl font-black capitalize ${tempConfig.color}`}>
                  {result.temperatura?.label}
                </p>
                <p className="text-sm text-gray-500">{result.temperatura?.valor}/100</p>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p className="font-medium text-gray-700">{result.meta?.tipo_vinculo_inferido}</p>
            <p className="text-xs">{result.fase_relacion}</p>
          </div>
        </div>
      </div>

      {/* Compatibility + drama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Compatibilidad</p>
          <ScoreBar label="" value={result.compatibilidad?.valor ?? 0} colorOverride="bg-pink-400" />
          <p className="text-xs text-gray-500 mt-2">{result.compatibilidad?.descripcion}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Drama score 🎭</p>
          <ScoreBar label="" value={result.drama_score?.valor ?? 0} />
          <p className="text-xs text-gray-500 mt-2">{result.drama_score?.descripcion}</p>
        </div>
      </div>

      {/* Interactions summary */}
      {result.interacciones && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-800 mb-3">⚖️ Interacciones</h2>
          <div className="flex flex-wrap gap-3">
            <div className="text-sm">
              <span className="text-gray-400">Iniciativa: </span>
              <span className="font-medium text-gray-800">{result.interacciones.iniciativa}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Balance: </span>
              <span className="font-medium text-gray-800">{result.interacciones.balance}</span>
            </div>
            {result.dinamica && (
              <div className="text-sm">
                <span className="text-gray-400">Dinámica: </span>
                <span className="font-medium text-gray-800">{result.dinamica}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Participants */}
      {result.participantes?.map((p, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-lg">{p.nombre}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${APEGO_STYLE[p.estilo_apego_relacional?.tipo] ?? "bg-white/20 text-white"}`}>
                Apego {p.estilo_apego_relacional?.tipo}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScoreBar
                label="Nivel de interés"
                value={p.nivel_interes?.valor ?? 0}
                description={p.nivel_interes?.descripcion}
                colorOverride="bg-pink-400"
              />
              <ScoreBar
                label="Intensidad emocional"
                value={p.intensidad_emocional?.valor ?? 0}
                description={p.intensidad_emocional?.descripcion}
                colorOverride="bg-rose-400"
              />
            </div>

            {p.estilo_apego_relacional?.evidencias?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {p.estilo_apego_relacional.evidencias.map((e, i) => (
                  <span key={i} className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-lg italic">
                    &ldquo;{e}&rdquo;
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {p.señales_interes?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-green-700 mb-2">✅ Señales de interés</h3>
                  <div className="space-y-1.5">
                    {p.señales_interes.map((s, i) => (
                      <div key={i} className="text-xs bg-green-50 rounded-lg p-2 border border-green-100">
                        <p className="font-medium text-green-800">{s.señal}</p>
                        {s.evidencia && <p className="text-green-600 italic">&ldquo;{s.evidencia}&rdquo;</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {p.señales_desinteres?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-red-600 mb-2">🚫 Señales de desinterés</h3>
                  <div className="space-y-1.5">
                    {p.señales_desinteres.map((s, i) => (
                      <div key={i} className="text-xs bg-red-50 rounded-lg p-2 border border-red-100">
                        <p className="font-medium text-red-800">{s.señal}</p>
                        {s.evidencia && <p className="text-red-500 italic">&ldquo;{s.evidencia}&rdquo;</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* ¿Hay futuro? */}
      {result.hay_futuro && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-4">🔮 ¿Hay futuro?</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{futuroConfig.icon}</span>
            <div>
              <p className="font-bold text-gray-900 capitalize">{result.hay_futuro.evaluacion}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{result.hay_futuro.justificacion}</p>
          {result.hay_futuro.consejo && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-pink-700 mb-1">💡 Consejo</p>
              <p className="text-sm text-pink-800">{result.hay_futuro.consejo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
