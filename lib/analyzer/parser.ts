export type { ParsedChat };
interface ParsedChat {
  messages: { sender: string; text: string; date?: string; time?: string }[];
  msgCount: number;
  participantNames: string[];
  dateRange: string;
  chatText: string;
}

// Detect and parse WhatsApp .txt export (Android & iOS) or plain "Name: message" format
export function parseChat(rawText: string): ParsedChat {
  const wa = parseWhatsApp(rawText);
  if (wa.msgCount > 0) return wa;
  return parsePlain(rawText);
}

function parseWhatsApp(rawText: string): ParsedChat {
  const lines = rawText.split("\n");
  const messages: ParsedChat["messages"] = [];

  // Covers Android: "12/3/24, 14:05 - Name: msg"
  // iOS (brackets, no dash): "[12/3/24, 14:05:33] Name: msg"
  // European dots: "12.03.2024, 14:05 - Name: msg"
  const regex =
    /^[\[\(]?(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]\.?\s?m\.?)?)\]?\s?(?:[-–]\s)?(.+?):\s(.+)$/i;

  let current: ParsedChat["messages"][0] | null = null;

  const systemPhrases = [
    "cifrado de extremo",
    "mensajes están cifrados",
    "se eliminó este mensaje",
    "imagen omitida",
    "audio omitido",
    "video omitido",
    "documento omitido",
    "sticker omitido",
    "gif omitido",
    "creó el grupo",
    "te añadió",
    "abandonó el grupo",
    "cambió el icono",
    "cambió el asunto",
    "you were added",
    "messages and calls are end-to-end",
  ];

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      if (current) messages.push(current);
      current = {
        date: match[1],
        time: match[2],
        sender: match[3].trim(),
        text: match[4].trim(),
      };
    } else if (current && line.trim()) {
      current.text += " " + line.trim();
    }
  }
  if (current) messages.push(current);

  const filtered = messages.filter(
    (m) => !systemPhrases.some((p) => m.text.toLowerCase().includes(p))
  );

  return buildResult(filtered);
}

function parsePlain(rawText: string): ParsedChat {
  const lines = rawText.split("\n").filter((l) => l.trim());
  const messages: ParsedChat["messages"] = [];

  for (const line of lines) {
    const match = line.match(/^(.+?):\s+(.+)$/);
    if (match) {
      const sender = match[1].trim();
      // Skip lines where "sender" looks like a date/timestamp fragment (WhatsApp format that failed to parse)
      if (/^\d{1,2}[\/\.\-]\d{1,2}/.test(sender)) continue;
      messages.push({ sender, text: match[2].trim() });
    }
  }

  return buildResult(messages);
}

function buildResult(messages: ParsedChat["messages"]): ParsedChat {
  const participants = Array.from(new Set(messages.map((m) => m.sender)));
  const dates = messages.map((m) => m.date).filter(Boolean) as string[];
  const dateRange =
    dates.length > 0 ? `${dates[0]} al ${dates[dates.length - 1]}` : "no especificado";

  return {
    messages,
    msgCount: messages.length,
    participantNames: participants,
    dateRange,
    chatText: messages.map((m) => `${m.sender}: ${m.text}`).join("\n"),
  };
}
