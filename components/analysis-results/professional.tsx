import ScoreBar from "@/components/score-bar";

interface ProfParticipant {
  nombre: string;
  estilo_comunicacion: string;
  descripcion_estilo: string;
  scores: {
    claridad: { valor: number; descripcion: string };
    proactividad: { valor: number; descripcion: string };
    asertividad: { valor: number; descripcion: string };
    sintesis: { valor: number; descripcion: string };
    inteligencia_emocional: { valor: number; descripcion: string };
  };
  competencias_detectadas: { competencia: string; evidencia: string }[];
  areas_mejora: { area: string; recomendacion: string }[];
  palabras_caracteristicas: string[];
  idoneidad_equipo: { score: number; descripcion: string };
}

interface ProfResult {
  meta: { mensajes: number; contexto_inferido: string };
  participantes: ProfParticipant[];
  dinamica_colaborativa: string;
  recomendaciones: string[];
}

const ESTILO_STYLE: Record<string, string> = {
  asertivo: "bg-green-100 text-green-800",
  pasivo: "bg-blue-100 text-blue-800",
  agresivo: "bg-red-100 text-red-800",
  "pasivo-agresivo": "bg-orange-100 text-orange-800",
};

const SCORE_LABELS: Record<string, string> = {
  claridad: "Claridad",
  proactividad: "Proactividad",
  asertividad: "Asertividad",
  sintesis: "Síntesis",
  inteligencia_emocional: "Inteligencia emocional",
};

export default function ProfessionalResultView({ result }: { result: ProfResult }) {
  return (
    <div className="space-y-6">
      {result.meta.contexto_inferido && result.meta.contexto_inferido !== "indeterminado" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Contexto inferido:</span> {result.meta.contexto_inferido}
          </p>
        </div>
      )}

      {result.participantes?.map((p, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-sky-400 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-lg">{p.nombre}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTILO_STYLE[p.estilo_comunicacion] ?? "bg-gray-100 text-gray-700"}`}>
                {p.estilo_comunicacion}
              </span>
            </div>
            <p className="text-sm text-white/80 mt-1">{p.descripcion_estilo}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Competency scores */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Competencias comunicacionales</h3>
              <div className="space-y-3">
                {Object.entries(SCORE_LABELS).map(([key, label]) => {
                  const s = p.scores?.[key as keyof typeof p.scores];
                  if (!s) return null;
                  return (
                    <ScoreBar
                      key={key}
                      label={label}
                      value={s.valor}
                      description={s.descripcion}
                      colorOverride="bg-blue-400"
                    />
                  );
                })}
              </div>
            </div>

            {/* Team fit */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-black text-blue-700">{p.idoneidad_equipo?.score}</p>
                <p className="text-xs text-blue-500">/ 100</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Idoneidad para trabajo en equipo</p>
                <p className="text-xs text-blue-600">{p.idoneidad_equipo?.descripcion}</p>
              </div>
            </div>

            {/* Competences */}
            {p.competencias_detectadas?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">✅ Competencias detectadas</h3>
                <div className="space-y-2">
                  {p.competencias_detectadas.map((c, i) => (
                    <div key={i} className="flex gap-2 p-3 bg-green-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-green-800">{c.competencia}</p>
                        <p className="text-xs text-green-600 italic">&ldquo;{c.evidencia}&rdquo;</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Areas to improve */}
            {p.areas_mejora?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">🎯 Áreas de mejora</h3>
                <div className="space-y-2">
                  {p.areas_mejora.map((a, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm font-semibold text-gray-800">{a.area}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.recomendacion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Characteristic words */}
            {p.palabras_caracteristicas?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">Vocabulario característico</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.palabras_caracteristicas.map((w, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Collaborative dynamics + recommendations */}
      {(result.dinamica_colaborativa || result.recomendaciones?.length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {result.dinamica_colaborativa && (
            <>
              <h2 className="font-bold text-gray-800 mb-2">🤝 Dinámica colaborativa</h2>
              <p className="text-gray-600 mb-5">{result.dinamica_colaborativa}</p>
            </>
          )}
          {result.recomendaciones?.length > 0 && (
            <>
              <h2 className="font-bold text-gray-800 mb-2">💡 Recomendaciones</h2>
              <ul className="space-y-2">
                {result.recomendaciones.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-400 mt-0.5">→</span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
