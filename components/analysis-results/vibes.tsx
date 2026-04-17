import ScoreBar from "@/components/score-bar";

interface VibesResult {
  meta: { mensajes: number; confianza: string };
  scores: {
    vibe: { valor: number; descripcion: string };
    humor: { valor: number; descripcion: string };
    cringe: { valor: number; descripcion: string };
    caos: { valor: number; descripcion: string };
  };
  participantes: {
    nombre: string;
    tipo_personalidad_internet: string;
    descripcion_tipo: string;
    signo_comunicacional: string;
    frase_caracteristica: string;
  }[];
  red_flags: { flag: string; evidencia: string; gravedad: string }[];
  green_flags: { flag: string; evidencia: string }[];
  frase_del_chat: string;
  vibe_summary: string;
  veredicto: string;
}

const GRAVEDAD_COLOR: Record<string, string> = {
  leve: "bg-yellow-50 border-yellow-200 text-yellow-800",
  moderada: "bg-orange-50 border-orange-200 text-orange-800",
  grave: "bg-red-50 border-red-200 text-red-800",
};

export default function VibesResultView({ result }: { result: VibesResult }) {
  return (
    <div className="space-y-6">
      {/* Main scores */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-5">🎯 Puntajes generales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ScoreBar label="Vibe Score" value={result.scores.vibe.valor} description={result.scores.vibe.descripcion} colorOverride="bg-orange-400" />
          <ScoreBar label="Humor" value={result.scores.humor.valor} description={result.scores.humor.descripcion} colorOverride="bg-yellow-400" />
          <ScoreBar label="Cringe" value={result.scores.cringe.valor} description={result.scores.cringe.descripcion} colorOverride="bg-pink-400" />
          <ScoreBar label="Caos" value={result.scores.caos.valor} description={result.scores.caos.descripcion} colorOverride="bg-purple-400" />
        </div>
      </div>

      {/* Frase del chat */}
      {result.frase_del_chat && (
        <blockquote className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 rounded-r-2xl p-5">
          <p className="text-lg font-medium text-gray-800 italic">&ldquo;{result.frase_del_chat}&rdquo;</p>
          <p className="text-xs text-gray-400 mt-2">La frase del chat</p>
        </blockquote>
      )}

      {/* Participants */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4">👤 Perfiles de personalidad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.participantes?.map((p, i) => (
            <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{p.nombre}</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
                  ♾ {p.signo_comunicacional}
                </span>
              </div>
              <div className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg inline-block mb-2">
                {p.tipo_personalidad_internet}
              </div>
              <p className="text-xs text-gray-600 mb-3">{p.descripcion_tipo}</p>
              {p.frase_caracteristica && (
                <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-2">
                  &ldquo;{p.frase_caracteristica}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Red & Green flags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-4">🚩 Red Flags ({result.red_flags?.length ?? 0})</h2>
          {result.red_flags?.length > 0 ? (
            <div className="space-y-3">
              {result.red_flags.map((f, i) => (
                <div key={i} className={`rounded-xl border p-3 ${GRAVEDAD_COLOR[f.gravedad] ?? "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{f.flag}</span>
                    <span className="text-xs capitalize opacity-70">{f.gravedad}</span>
                  </div>
                  <p className="text-xs italic opacity-80">&ldquo;{f.evidencia}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Sin red flags detectadas 🎉</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-4">✅ Green Flags ({result.green_flags?.length ?? 0})</h2>
          {result.green_flags?.length > 0 ? (
            <div className="space-y-3">
              {result.green_flags.map((f, i) => (
                <div key={i} className="rounded-xl border bg-green-50 border-green-200 p-3">
                  <p className="text-sm font-semibold text-green-800">{f.flag}</p>
                  <p className="text-xs text-green-600 italic mt-1">&ldquo;{f.evidencia}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No se detectaron green flags</p>
          )}
        </div>
      </div>

      {/* Summary & Veredicto */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-3">📝 Resumen</h2>
        <p className="text-gray-600 mb-4">{result.vibe_summary}</p>
        {result.veredicto && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Veredicto final</p>
            <p className="font-bold">{result.veredicto}</p>
          </div>
        )}
      </div>
    </div>
  );
}
