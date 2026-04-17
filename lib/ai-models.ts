export type AIProvider = "anthropic" | "openai" | "google";

export interface AIModel {
  id: string;
  provider: AIProvider;
  name: string;
  description: string;
  speed: "fast" | "balanced" | "powerful";
  free?: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "claude-haiku-4-5-20251001",
    provider: "anthropic",
    name: "Claude Haiku 4.5",
    description: "Rápido y económico",
    speed: "fast",
  },
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    name: "Claude Sonnet 4.6",
    description: "Equilibrado y preciso",
    speed: "balanced",
  },
  {
    id: "claude-opus-4-7",
    provider: "anthropic",
    name: "Claude Opus 4.7",
    description: "Máxima profundidad",
    speed: "powerful",
  },
  {
    id: "gpt-4o-mini",
    provider: "openai",
    name: "GPT-4o Mini",
    description: "Rápido y económico",
    speed: "fast",
  },
  {
    id: "gpt-4o",
    provider: "openai",
    name: "GPT-4o",
    description: "Potente y versátil",
    speed: "balanced",
  },
  {
    id: "gpt-4.1",
    provider: "openai",
    name: "GPT-4.1",
    description: "Alta capacidad",
    speed: "powerful",
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    name: "Gemini 2.5 Flash",
    description: "Ultra rápido",
    speed: "fast",
  },
  {
    id: "gemini-2.5-pro",
    provider: "google",
    name: "Gemini 2.5 Pro",
    description: "Razonamiento avanzado",
    speed: "balanced",
  },
];

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
};

export const PROVIDER_COLORS: Record<AIProvider, string> = {
  anthropic: "bg-orange-100 text-orange-800",
  openai: "bg-green-100 text-green-800",
  google: "bg-blue-100 text-blue-800",
};

export const SPEED_ICONS: Record<string, string> = {
  fast: "⚡",
  balanced: "⚖️",
  powerful: "🔥",
};

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export function getModelsByProvider(provider: AIProvider): AIModel[] {
  return AI_MODELS.filter((m) => m.provider === provider);
}
