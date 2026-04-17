import ScoreBar from "@/components/score-bar";

interface OceanDimension {
  score: number;
  nivel: string;
  evidencias: string[];
}

interface PsychParticipant {
  nombre: string;
  ocean: {
    apertura: OceanDimension;
    responsabilidad: OceanDimension;
    extraversion: OceanDimension;
    afabilidad: OceanDimension;
    neuroticismo: OceanDimension;
  };
  estilo_apego: {
    tipo: string;
    confianza: string;
    evidencias: string[];
    descripcion: string;
  };
  madurez_emocional: { score: number; descripcion: string };
  mecanismos_defensa: { mecanismo: string; evidencia: string; frecuencia: string }[];
  perfil_narrativo: string;
}

interface PsychResult {
  meta: { mensajes: number; confianza: string; advertencias: string[] };
  participantes: PsychParticipant[];
  dinamica_grupal: {
    descripcion: string;
    tension_detectada: boolean;
    factores_tension: string[];
    cohesion: string;
  };
  limitaciones: string;
}

const APEGO_COLOR: Record<string, string> = {
  seguro: "bg-green-100 text-green-800 border-green-200",
  ansioso: "bg-yellow-100 text-yellow-800 border-yellow-200",
  evitativo: "bg-blue-100 text-blue-800 border-blue-200",
  desorganizado: "bg-red-100 text-red-800 border-red-200",
};

const OCEAN_LABELS: Record<string, string> = {
  apertura: "Apertura",
  responsabilidad: "Responsabilidad",
  extraversion: "Extraversión",
  afabilidad: "Afabilidad",
  neuroticismo: "Neuroticismo",
};

export default function PsychResultView({ result }: { result: PsychResult }) {
  return (
    <div className="space-y-6">
      {result.meta.advertencias?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Advertencias</p>
          <ul className="text-sm text-amber-700 list-disc list-inside">
            {result.meta.advertencias.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      {result.participantes?.map((p, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-violet-400 px-6 py-4">
            <h2 className="font-bold text-white text-lg">{p.nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${APEGO_COLOR[p.estilo_apego?.tipo] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                Apego {p.estilo_apego?.tipo}
              </span>
              <span className="text-xs text-white/80">Madurez emocional: {p.madurez_emocional?.score}/100</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* OCEAN */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Modelo OCEAN (Big Five)</h3>
              <div className="space-y-3">
                {Object.entries(OCEAN_LABELS).map(([key, label]) => {
                  const dim = p.ocean?.[key as keyof typeof p.ocean];
                  if (!dim) return null;
                  return (
                    <div key={key}>
                      <ScoreBar
                        label={label}
                        value={dim.score}
                        colorOverride="bg-purple-400"
                      />
                      {dim.nivel && (
                        <p className="text-xs text-gray-400 mt-0.5 ml-0.5">Nivel: {dim.nivel}</p>
                      )}
                      {dim.evidencias?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {dim.evidencias.slice(0, 2).map((e, i) => (
                            <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg italic">
                              &ldquo;{e}&rdquo;
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attachment */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Estilo de apego</h3>
              <p className="text-sm text-gray-600">{p.estilo_apego?.descripcion}</p>
              {p.estilo_apego?.evidencias?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.estilo_apego.evidencias.map((e, i) => (
                    <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg italic border border-gray-100">
                      &ldquo;{e}&rdquo;
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Defense mechanisms */}
            {p.mecanismos_defensa?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">Mecanismos de defensa</h3>
                <div className="space-y-2">
                  {p.mecanismos_defensa.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-800 capitalize">{m.mecanismo}</span>
                          <span className="text-xs text-gray-400">({m.frecuencia})</span>
                        </div>
                        <p className="text-xs text-gray-500 italic mt-0.5">&ldquo;{m.evidencia}&rdquo;</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Narrative profile */}
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-purple-800 mb-1">Perfil narrativo</p>
              <p className="text-sm text-purple-700">{p.perfil_narrativo}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Group dynamics */}
      {result.dinamica_grupal && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-3">🔗 Dinámica grupal</h2>
          <p className="text-gray-600 mb-3">{result.dinamica_grupal.descripcion}</p>
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${result.dinamica_grupal.tension_detectada ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
              {result.dinamica_grupal.tension_detectada ? "⚡ Tensión detectada" : "✓ Sin tensión"}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              Cohesión: {result.dinamica_grupal.cohesion}
            </span>
          </div>
          {result.dinamica_grupal.factores_tension?.length > 0 && (
            <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
              {result.dinamica_grupal.factores_tension.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}
        </div>
      )}

      {result.limitaciones && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">Limitaciones del análisis</p>
          <p className="text-xs text-gray-500">{result.limitaciones}</p>
        </div>
      )}
    </div>
  );
}
