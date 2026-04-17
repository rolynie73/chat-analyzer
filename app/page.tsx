import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ORIENTATION_META } from "@/lib/analyzer/prompts";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  const orientations = Object.entries(ORIENTATION_META);

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight">💬 ChatAnalyzer</span>
        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full">
          ✨ Powered by Anthropic · OpenAI · Google
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
          Analizá cualquier chat
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            con inteligencia artificial
          </span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Subí una conversación de WhatsApp o cualquier chat, elegí el enfoque del análisis y descubrí
          personalidades, dinámicas, vibes y mucho más.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors shadow-lg"
        >
          Analizar mi primer chat →
        </Link>
      </section>

      {/* Orientations */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">5 enfoques de análisis</h2>
        <p className="text-center text-gray-500 mb-10">Cada uno con sus propios indicadores, puntajes y prompts especializados.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orientations.map(([key, meta]) => (
            <div
              key={key}
              className={`relative overflow-hidden rounded-2xl border ${meta.border} bg-white p-6 shadow-sm`}
            >
              <div
                className={`absolute inset-0 opacity-5 bg-gradient-to-br ${meta.gradient}`}
              />
              <div className="relative">
                <div className="text-3xl mb-3">{meta.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{meta.label}</h3>
                <p className="text-sm text-gray-500">{meta.description}</p>
              </div>
            </div>
          ))}
          {/* Empty slot with CTA */}
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 flex items-center justify-center">
            <Link href="/sign-up" className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Empezar gratis →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-t border-gray-100 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Subí el chat", desc: "Arrastrá el .txt de WhatsApp o pegá el texto directamente." },
              { step: "02", title: "Elegí el enfoque", desc: "¿Vibes? ¿Psicológico? ¿Qué tan narcisista es alguien? Vos elegís." },
              { step: "03", title: "Analizá", desc: "La IA procesa el chat y te entrega puntajes, evidencias y un análisis detallado." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-3xl font-black text-gray-200 mb-3">{item.step}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        ChatAnalyzer — Usá tus propias API keys. Tus chats no se comparten con nadie más.
      </footer>
    </main>
  );
}
