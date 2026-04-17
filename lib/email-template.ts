import type { Orientation } from "./analyzer/prompts";

function row(label: string, value: string | number) {
  return `<tr>
    <td style="padding:6px 0;color:#6b7280;font-size:13px;vertical-align:top;width:40%">${label}</td>
    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600">${value}</td>
  </tr>`;
}

function section(title: string, body: string) {
  return `<div style="margin-top:24px">
    <h3 style="margin:0 0 12px;font-size:15px;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:8px">${title}</h3>
    ${body}
  </div>`;
}

function pill(text: string, bg = "#f3f4f6", color = "#374151") {
  return `<span style="display:inline-block;padding:2px 10px;border-radius:999px;background:${bg};color:${color};font-size:12px;margin:2px">${text}</span>`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildBody(orientation: Orientation, result: any): string {
  if (orientation === "vibes") {
    const scores = Object.entries(result.scores ?? {})
      .map(([k, v]: [string, any]) =>
        `<div style="margin-bottom:8px"><span style="font-weight:600;text-transform:capitalize">${k}:</span> ${v.valor}/100 — ${v.descripcion}</div>`
      )
      .join("");

    const participants = (result.participantes ?? [])
      .map((p: any) =>
        `<div style="margin-bottom:12px;padding:12px;background:#f9fafb;border-radius:8px">
          <strong>${p.nombre}</strong> · ${p.tipo_personalidad_internet}<br/>
          <span style="font-size:12px;color:#6b7280">${p.descripcion_tipo}</span>
        </div>`
      )
      .join("");

    const redFlags = (result.red_flags ?? [])
      .map((f: any) => `<li style="margin-bottom:4px">${f.flag} <span style="color:#9ca3af;font-size:12px">(${f.gravedad})</span></li>`)
      .join("");

    return `
      ${section("🎯 Puntajes", scores)}
      ${result.frase_del_chat ? section("💬 Frase del chat", `<em style="color:#374151">"${result.frase_del_chat}"</em>`) : ""}
      ${section("👤 Participantes", participants)}
      ${redFlags ? section("🚩 Red Flags", `<ul style="margin:0;padding-left:20px">${redFlags}</ul>`) : ""}
      ${result.vibe_summary ? section("📝 Resumen", `<p style="color:#374151;font-size:13px;margin:0">${result.vibe_summary}</p>`) : ""}
      ${result.veredicto ? `<div style="margin-top:20px;padding:16px;background:linear-gradient(to right,#f97316,#fbbf24);border-radius:12px;color:white"><strong>Veredicto:</strong> ${result.veredicto}</div>` : ""}
    `;
  }

  if (orientation === "psych") {
    const participants = (result.participantes ?? [])
      .map((p: any) =>
        `<div style="margin-bottom:16px;padding:12px;background:#f9fafb;border-radius:8px">
          <strong>${p.nombre}</strong> · Apego ${p.estilo_apego?.tipo} · Madurez emocional ${p.madurez_emocional?.score}/100<br/>
          <span style="font-size:12px;color:#6b7280;margin-top:4px;display:block">${p.perfil_narrativo ?? ""}</span>
        </div>`
      )
      .join("");

    return `
      ${section("🧠 Perfiles", participants)}
      ${result.dinamica_grupal ? section("🔗 Dinámica grupal", `<p style="color:#374151;font-size:13px;margin:0">${result.dinamica_grupal.descripcion}</p>`) : ""}
    `;
  }

  if (orientation === "professional") {
    const participants = (result.participantes ?? [])
      .map((p: any) =>
        `<div style="margin-bottom:16px;padding:12px;background:#f9fafb;border-radius:8px">
          <strong>${p.nombre}</strong> · Estilo: ${p.estilo_comunicacion} · Idoneidad equipo: ${p.idoneidad_equipo?.score}/100<br/>
          <span style="font-size:12px;color:#6b7280;margin-top:4px;display:block">${p.descripcion_estilo ?? ""}</span>
        </div>`
      )
      .join("");

    const recs = (result.recomendaciones ?? [])
      .map((r: string) => `<li style="margin-bottom:4px">${r}</li>`)
      .join("");

    return `
      ${section("💼 Perfiles", participants)}
      ${result.dinamica_colaborativa ? section("🤝 Dinámica colaborativa", `<p style="color:#374151;font-size:13px;margin:0">${result.dinamica_colaborativa}</p>`) : ""}
      ${recs ? section("💡 Recomendaciones", `<ul style="margin:0;padding-left:20px;font-size:13px;color:#374151">${recs}</ul>`) : ""}
    `;
  }

  // social / relational / fallback
  const entries = Object.entries(result)
    .filter(([k]) => !["meta"].includes(k))
    .map(([k, v]) => {
      const display = typeof v === "string" ? v : typeof v === "number" ? String(v) : JSON.stringify(v).slice(0, 200);
      return `<div style="margin-bottom:8px"><strong style="text-transform:capitalize">${k.replace(/_/g, " ")}:</strong> <span style="color:#374151">${display}</span></div>`;
    })
    .join("");

  return section("Resultados", entries);
}

export function buildAnalysisEmail({
  title,
  orientation,
  modelName,
  msgCount,
  participants,
  result,
  orientationLabel,
}: {
  title: string;
  orientation: Orientation;
  modelName: string;
  msgCount: number;
  participants: string[];
  result: unknown;
  orientationLabel: string;
}) {
  const body = buildBody(orientation, result);

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
    <!-- Header -->
    <div style="background:#111827;padding:28px 32px">
      <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;letter-spacing:.05em;text-transform:uppercase">ChatAnalyzer</p>
      <h1 style="margin:0;font-size:22px;color:white;line-height:1.3">${title}</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#9ca3af">${orientationLabel} · ${modelName}</p>
    </div>

    <!-- Meta -->
    <div style="padding:20px 32px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
      <table style="width:100%;border-collapse:collapse">
        ${row("Mensajes analizados", msgCount.toLocaleString("es"))}
        ${row("Participantes", participants.join(", ") || "—")}
        ${row("Modelo", modelName)}
      </table>
    </div>

    <!-- Content -->
    <div style="padding:24px 32px">
      ${body}
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Generado por ChatAnalyzer · Este análisis es orientativo y no reemplaza evaluación profesional.</p>
    </div>
  </div>
</body>
</html>`;
}
