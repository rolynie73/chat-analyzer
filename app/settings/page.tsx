"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/nav";
import { PROVIDER_LABELS } from "@/lib/ai-models";

interface KeyState {
  value: string;
  masked: string | null;
  configured: boolean;
  dirty: boolean;
}

type Provider = "anthropic" | "openai" | "google";

const PROVIDER_ICONS: Record<Provider, string> = {
  anthropic: "🟠",
  openai: "🟢",
  google: "🔵",
};

const PROVIDER_PLACEHOLDERS: Record<Provider, string> = {
  anthropic: "sk-ant-...",
  openai: "sk-...",
  google: "AIza...",
};

export default function SettingsPage() {
  const [keys, setKeys] = useState<Record<Provider, KeyState>>({
    anthropic: { value: "", masked: null, configured: false, dirty: false },
    openai: { value: "", masked: null, configured: false, dirty: false },
    google: { value: "", masked: null, configured: false, dirty: false },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/user-keys")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setKeys((prev) => ({
          anthropic: { ...prev.anthropic, configured: data.configured.anthropic, masked: data.masked.anthropic },
          openai: { ...prev.openai, configured: data.configured.openai, masked: data.masked.openai },
          google: { ...prev.google, configured: data.configured.google, masked: data.masked.google },
        }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (provider: Provider, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: { ...prev[provider], value, dirty: true } }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const body: Record<string, string> = {};
      (["anthropic", "openai", "google"] as Provider[]).forEach((p) => {
        if (keys[p].dirty) body[`${p}Key`] = keys[p].value;
      });
      const res = await fetch("/api/user-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const body = await res.text();
        let msg = "Error al guardar";
        try { msg = JSON.parse(body).error || msg; } catch { /* empty body */ }
        throw new Error(msg);
      }
      setSaved(true);
      // Refresh masked values
      const updated = await fetch("/api/user-keys").then((r) => r.ok ? r.json() : null);
      if (updated) {
        setKeys((prev) => ({
          anthropic: { ...prev.anthropic, configured: updated.configured.anthropic, masked: updated.masked.anthropic, value: "", dirty: false },
          openai: { ...prev.openai, configured: updated.configured.openai, masked: updated.masked.openai, value: "", dirty: false },
          google: { ...prev.google, configured: updated.configured.google, masked: updated.masked.google, value: "", dirty: false },
        }));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Ajustes de API</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tus claves se guardan de forma privada y solo vos podés usarlas para los análisis.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {(["anthropic", "openai", "google"] as Provider[]).map((provider) => (
            <div key={provider} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>{PROVIDER_ICONS[provider]}</span>
                  <span className="font-semibold text-gray-800">{PROVIDER_LABELS[provider]}</span>
                </div>
                {keys[provider].configured && !keys[provider].dirty && (
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Configurada
                  </span>
                )}
              </div>
              <input
                type="password"
                autoComplete="off"
                placeholder={
                  keys[provider].configured && !keys[provider].dirty
                    ? keys[provider].masked ?? PROVIDER_PLACEHOLDERS[provider]
                    : PROVIDER_PLACEHOLDERS[provider]
                }
                value={keys[provider].value}
                onChange={(e) => handleChange(provider, e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono placeholder:font-sans"
              />
              {keys[provider].configured && !keys[provider].dirty && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Dejá en blanco para mantener la clave actual. Escribí una nueva para reemplazarla.
                </p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            🔒 Las claves se almacenan en tu base de datos privada.
          </p>
          <button
            onClick={handleSave}
            disabled={saving || !Object.values(keys).some((k) => k.dirty)}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar cambios"}
          </button>
        </div>

        <div className="mt-10 p-5 bg-amber-50 border border-amber-200 rounded-xl">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">¿Dónde conseguir las API keys?</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>🟠 <strong>Anthropic:</strong> console.anthropic.com → API Keys</li>
            <li>🟢 <strong>OpenAI:</strong> platform.openai.com → API Keys</li>
            <li>🔵 <strong>Google:</strong> aistudio.google.com → Get API Key</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
