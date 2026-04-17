import ScoreBar from "@/components/score-bar";

interface SocialParticipant {
  nombre: string;
  scores: {
    narcisismo: { valor: number; tipo: string; descripcion: string };
    empatia: { valor: number; descripcion: string };
    necesidad_validacion: { valor: number; descripcion: string };
    toxicidad: { valor: number; descripcion: string };
    dominancia: { valor: number; descripcion: string };
  };
  rol_social: string;
  descripcion_rol: string;
  el_personaje: string;
  señales_manipulacion: { tipo: string; evidencia: string; intensidad: string }[];
}

interface SocialResult {
  meta: { mensajes: number; tipo_conversacion: string };
  participantes: SocialParticipant[];
  dinamica_poder: { descripcion: string; quien_domina: string; patron: string };
  diagnostico_grupal: string;
}

const ROL_EMOJI: Record<string, string> = {
  líder: "👑",
  seguidor: "🐑",
  mediador: "🕊️",
  provocador: "🔥",
  víctima: "😢",
  salvador: "🦸",
  observador: "👁️",
};

const INTENSIDAD_STYLE: Record<string, string> = {
  leve: "bg-yellow-50 border-yellow-200 text-yellow-800",
  moderada: "bg-orange-50 border-orange-200 text-orange-800",
  severa: "bg-red-50 border-red-200 text-red-800",
};

export default function SocialResultView({ result }: { result: SocialResult }) {
  return (
    <div className="space-y-6">
      {result.participantes?.map((p, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-lg">{p.nombre}</h2>
              <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full font-medium">
                {ROL_EMOJI[p.rol_social] ?? "🎭"} {p.rol_social}
              </span>
            </div>
            {p.descripcion_rol && <p className="text-sm text-white/80 mt-1">{p.descripcion_rol}</p>}
          </div>

          <div className="p-6 space-y-6">
            {/* El personaje */}
            {p.el_personaje && (
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-teal-700 mb-1">El personaje</p>
                <p className="text-sm text-teal-900">{p.el_personaje}</p>
              </div>
            )}

            {/* Scores */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4">Indicadores sociales</h3>
              <div className="space-y-3">
                {p.scores?.narcisismo && (
                  <div>
                    <ScoreBar
                      label={`Narcisismo (${p.scores.narcisismo.tipo})`}
                      value={p.scores.narcisismo.valor}
                      description={p.scores.narcisismo.descripcion}
                      colorOverride="bg-teal-400"
                    />
                  </div>
                )}
                {p.scores?.empatia && (
                  <ScoreBar label="Empatía" value={p.scores.empatia.valor} description={p.scores.empatia.descripcion} colorOverride="bg-emerald-400" />
                )}
                {p.scores?.necesidad_validacion && (
                  <ScoreBar label="Necesidad de validación" value={p.scores.necesidad_validacion.valor} description={p.scores.necesidad_validacion.descripcion} colorOverride="bg-cyan-400" />
                )}
                {p.scores?.toxicidad && (
                  <ScoreBar label="Toxicidad" value={p.scores.toxicidad.valor} description={p.scores.toxicidad.descripcion} colorOverride="bg-orange-400" />
                )}
                {p.scores?.dominancia && (
                  <ScoreBar label="Dominancia" value={p.scores.dominancia.valor} description={p.scores.dominancia.descripcion} colorOverride="bg-purple-400" />
                )}
              </div>
            </div>

            {/* Manipulation signals */}
            {p.señales_manipulacion?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">⚠️ Señales de manipulación</h3>
                <div className="space-y-2">
                  {p.señales_manipulacion.map((s, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${INTENSIDAD_STYLE[s.intensidad] ?? "bg-gray-50 border-gray-200"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold capitalize">{s.tipo}</span>
                        <span className="text-xs capitalize opacity-70">{s.intensidad}</span>
                      </div>
                      <p className="text-xs italic opacity-80">&ldquo;{s.evidencia}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Power dynamics */}
      {result.dinamica_poder && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-3">⚡ Dinámica de poder</h2>
          <p className="text-gray-600 mb-4">{result.dinamica_poder.descripcion}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full font-medium">
              Patrón: {result.dinamica_poder.patron}
            </span>
            {result.dinamica_poder.quien_domina && (
              <span className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                Domina: {result.dinamica_poder.quien_domina}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Group diagnosis */}
      {result.diagnostico_grupal && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white rounded-2xl p-6">
          <h2 className="font-bold mb-2">🔮 Diagnóstico grupal</h2>
          <p className="text-white/90">{result.diagnostico_grupal}</p>
        </div>
      )}
    </div>
  );
}
