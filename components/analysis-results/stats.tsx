interface StatsResult {
  meta: {
    mensajes_totales: number;
    participantes_count: number;
    tipo_chat: string;
    periodo: string;
    dias_estimados: number;
  };
  actividad: {
    por_participante: {
      nombre: string;
      mensajes: number;
      porcentaje: number;
      promedio_palabras_por_mensaje: number;
      total_palabras_estimado: number;
      estilo_longitud: string;
      inicia_conversaciones: string;
    }[];
    mas_activo: string;
    mas_silencioso: string;
    dia_mas_activo: string;
    franja_horaria_pico: string;
  };
  palabras: {
    top_global: { palabra: string; veces_estimadas: number }[];
    por_participante: {
      nombre: string;
      top_palabras: string[];
      muletilla: string;
    }[];
    frases_repetidas: { frase: string; veces_estimadas: number; quien: string }[];
  };
  emojis: {
    top_emojis: { emoji: string; veces_estimadas: number }[];
    mayor_usuario: string;
    menor_usuario: string;
    chat_sin_emojis: boolean;
  };
  patrones: {
    quien_inicia_mas: string;
    velocidad_respuesta: string;
    uso_preguntas: string;
    uso_monosilabos: string;
    uso_mayusculas_para_enfatizar: string;
    idioma_predominante: string;
  };
  records: {
    mensaje_mas_largo: { extracto: string; autor: string };
    participante_mas_palabras_por_mensaje: string;
    participante_con_mensajes_mas_cortos: string;
    emoji_mas_usado: string;
    palabra_mas_repetida: string;
    hora_pico_estimada: string;
  };
  curiosidades: string[];
  resumen: string;
}

const PARTICIPANT_COLORS = [
  "bg-cyan-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-indigo-500",
];

const PARTICIPANT_LIGHT = [
  "bg-cyan-50 border-cyan-200 text-cyan-800",
  "bg-blue-50 border-blue-200 text-blue-800",
  "bg-violet-50 border-violet-200 text-violet-800",
  "bg-pink-50 border-pink-200 text-pink-800",
  "bg-amber-50 border-amber-200 text-amber-800",
  "bg-emerald-50 border-emerald-200 text-emerald-800",
  "bg-orange-50 border-orange-200 text-orange-800",
  "bg-indigo-50 border-indigo-200 text-indigo-800",
];

function FreqBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function StatsResultView({ result }: { result: StatsResult }) {
  const participantes = result.actividad?.por_participante ?? [];
  const maxMensajes = Math.max(...participantes.map((p) => p.mensajes), 1);

  return (
    <div className="space-y-6">
      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Mensajes totales", value: (result.meta?.mensajes_totales ?? 0).toLocaleString("es"), icon: "💬" },
          { label: "Participantes", value: result.meta?.participantes_count ?? participantes.length, icon: "👥" },
          { label: "Período", value: result.meta?.periodo ?? "N/D", icon: "📅" },
          { label: "Días estimados", value: result.meta?.dias_estimados ? `~${result.meta.dias_estimados}` : "N/D", icon: "🗓️" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-lg font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Actividad por participante */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-800 mb-5">🏆 Actividad por participante</h2>
        <div className="space-y-4">
          {participantes.map((p, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length]}`} />
                  <span className="text-sm font-semibold text-gray-800 truncate">{p.nombre}</span>
                  {p.nombre === result.actividad?.mas_activo && (
                    <span className="shrink-0 text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-1.5 py-0.5 rounded-full">más activo</span>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold text-gray-900">{p.mensajes.toLocaleString("es")}</span>
                  <span className="text-xs text-gray-400 ml-1">({p.porcentaje}%)</span>
                </div>
              </div>
              <FreqBar value={p.mensajes} max={maxMensajes} color={PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length]} />
              <div className="flex gap-3 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-400">~{p.promedio_palabras_por_mensaje} palabras/msg</span>
                <span className="text-xs text-gray-400">{p.estilo_longitud}</span>
                <span className="text-xs text-gray-400">inicia: {p.inicia_conversaciones}</span>
              </div>
            </div>
          ))}
        </div>

        {(result.actividad?.dia_mas_activo && result.actividad.dia_mas_activo !== "N/D") ||
        (result.actividad?.franja_horaria_pico && result.actividad.franja_horaria_pico !== "N/D") ? (
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            {result.actividad?.dia_mas_activo && result.actividad.dia_mas_activo !== "N/D" && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span>📆</span>
                <span>Día más activo: <strong>{result.actividad.dia_mas_activo}</strong></span>
              </div>
            )}
            {result.actividad?.franja_horaria_pico && result.actividad.franja_horaria_pico !== "N/D" && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span>🕐</span>
                <span>Franja pico: <strong>{result.actividad.franja_horaria_pico}</strong></span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Palabras más usadas */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-800 mb-5">💬 Palabras más usadas</h2>

        {result.palabras?.top_global?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Global (top {result.palabras.top_global.length})</p>
            <div className="flex flex-wrap gap-2">
              {result.palabras.top_global.map((w, i) => {
                const max = result.palabras.top_global[0]?.veces_estimadas ?? 1;
                const size = i === 0 ? "text-base" : i < 3 ? "text-sm" : "text-xs";
                const opacity = i < 3 ? "" : "opacity-80";
                return (
                  <span
                    key={i}
                    className={`px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 rounded-full font-medium ${size} ${opacity}`}
                  >
                    {w.palabra}
                    <span className="text-cyan-500 ml-1.5 font-normal text-xs">×{w.veces_estimadas.toLocaleString("es")}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {result.palabras?.por_participante?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Por participante</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.palabras.por_participante.map((p, i) => (
                <div key={i} className={`rounded-xl border p-4 ${PARTICIPANT_LIGHT[i % PARTICIPANT_LIGHT.length]}`}>
                  <p className="text-sm font-bold mb-2">{p.nombre}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.top_palabras?.map((w, j) => (
                      <span key={j} className="text-xs bg-white bg-opacity-70 px-2 py-0.5 rounded-full border border-current border-opacity-30">
                        {w}
                      </span>
                    ))}
                  </div>
                  {p.muletilla && (
                    <p className="text-xs opacity-80">
                      <span className="font-semibold">Muletilla:</span> &ldquo;{p.muletilla}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Frases repetidas */}
      {result.palabras?.frases_repetidas?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold text-gray-800 mb-4">🔁 Frases más repetidas</h2>
          <div className="space-y-3">
            {result.palabras.frases_repetidas.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 italic">&ldquo;{f.frase}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-0.5">{f.quien}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-cyan-600">×{f.veces_estimadas}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emojis */}
      {!result.emojis?.chat_sin_emojis && result.emojis?.top_emojis?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-bold text-gray-800 mb-4">😄 Emojis más usados</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {result.emojis.top_emojis.map((e, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl min-w-[60px]">
                <span className="text-2xl">{e.emoji}</span>
                <span className="text-xs font-bold text-gray-600">×{e.veces_estimadas}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {result.emojis.mayor_usuario && (
              <span>😄 Mayor usuario: <strong className="text-gray-700">{result.emojis.mayor_usuario}</strong></span>
            )}
            {result.emojis.menor_usuario && (
              <span>🪨 Menos emojis: <strong className="text-gray-700">{result.emojis.menor_usuario}</strong></span>
            )}
          </div>
        </div>
      )}

      {/* Patrones */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-800 mb-4">📡 Patrones de conversación</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Inicia más", value: result.patrones?.quien_inicia_mas, icon: "🚀" },
            { label: "Velocidad de respuesta", value: result.patrones?.velocidad_respuesta, icon: "⚡" },
            { label: "Uso de preguntas", value: result.patrones?.uso_preguntas, icon: "❓" },
            { label: "Monosílabos", value: result.patrones?.uso_monosilabos, icon: "💤" },
            { label: "Mayúsculas para énfasis", value: result.patrones?.uso_mayusculas_para_enfatizar, icon: "📢" },
            { label: "Idioma predominante", value: result.patrones?.idioma_predominante, icon: "🌐" },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl">
              <div className="text-lg mb-1">{item.icon}</div>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-gray-800">{item.value ?? "N/D"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Récords */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-gray-800 mb-4">🏅 Récords del chat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Mensaje más largo", value: result.records?.mensaje_mas_largo?.extracto ? `"${result.records.mensaje_mas_largo.extracto}" — ${result.records.mensaje_mas_largo.autor}` : null, icon: "📜" },
            { label: "Más palabras por mensaje", value: result.records?.participante_mas_palabras_por_mensaje, icon: "✍️" },
            { label: "Mensajes más cortos", value: result.records?.participante_con_mensajes_mas_cortos, icon: "🤏" },
            { label: "Emoji más usado", value: result.records?.emoji_mas_usado, icon: "⭐" },
            { label: "Palabra más repetida", value: result.records?.palabra_mas_repetida, icon: "🔤" },
            { label: "Hora pico estimada", value: result.records?.hora_pico_estimada, icon: "🕐" },
          ].filter((r) => r.value && r.value !== "N/D").map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curiosidades */}
      {result.curiosidades?.filter(Boolean).length > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6">
          <h2 className="font-bold text-gray-800 mb-4">🔍 Curiosidades</h2>
          <div className="space-y-3">
            {result.curiosidades.filter(Boolean).map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-200 text-cyan-800 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700">{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen */}
      {result.resumen && (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-400 text-white rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">Resumen estadístico</p>
          <p className="font-medium leading-relaxed">{result.resumen}</p>
        </div>
      )}
    </div>
  );
}
