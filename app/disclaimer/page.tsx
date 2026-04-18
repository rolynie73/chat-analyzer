import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Deslinde de Responsabilidad — ChatAnalyzer",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">💬 ChatAnalyzer</Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Deslinde de Responsabilidad</h1>
          <p className="text-sm text-gray-400 mt-2">Última actualización: abril 2025</p>
        </div>

        {/* Banner */}
        <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Importante antes de continuar</p>
          <p className="text-sm text-amber-700">
            ChatAnalyzer es una herramienta de entretenimiento e introspección basada en inteligencia artificial. Sus análisis <strong>no constituyen diagnósticos clínicos, asesoramiento psicológico, legal ni médico</strong> de ningún tipo.
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. Naturaleza de los análisis</h2>
            <p className="mb-2">
              Los análisis generados por ChatAnalyzer son producidos por modelos de lenguaje artificial (LLMs) que identifican <em>patrones estadísticos en texto</em>. Estos resultados:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Son <strong>probabilísticos y orientativos</strong>, no determinísticos ni definitivos.</li>
              <li>Pueden contener errores, sesgos o interpretaciones incorrectas.</li>
              <li>No reemplazan la evaluación de un profesional de la salud mental, psicólogo, psiquiatra, mediador o asesor legal.</li>
              <li>No deben usarse como base única para tomar decisiones importantes sobre relaciones, trabajo o salud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. No es un diagnóstico clínico</h2>
            <p>
              Los términos psicológicos utilizados en los análisis (OCEAN/Big Five, estilos de apego, mecanismos de defensa, narcisismo, etc.) se emplean como <strong>marcos descriptivos del comportamiento comunicacional observable</strong> y no como diagnósticos clínicos. ChatAnalyzer no diagnostica trastornos de personalidad, condiciones de salud mental ni patologías de ningún tipo.
            </p>
            <p className="mt-2">
              Si identificás conductas preocupantes en una conversación — ya sea hacia vos o hacia otros — te recomendamos consultar con un profesional de salud mental habilitado.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. Precisión y limitaciones de la IA</h2>
            <p className="mb-2">Los modelos de IA tienen limitaciones conocidas:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Sesgos culturales y lingüísticos:</strong> los modelos fueron entrenados principalmente en inglés y pueden interpretar expresiones regionales de forma incorrecta.</li>
              <li><strong>Falta de contexto:</strong> el modelo solo ve el texto del chat, no el tono de voz, el lenguaje corporal, la historia previa ni el contexto cultural completo.</li>
              <li><strong>Alucinaciones:</strong> los modelos pueden generar afirmaciones con aparente confianza que son incorrectas.</li>
              <li><strong>Variabilidad:</strong> dos análisis del mismo chat pueden arrojar resultados distintos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. Privacidad de terceros</h2>
            <p>
              Al cargar una conversación en ChatAnalyzer, sos el único responsable de asegurarte de tener el consentimiento necesario de las personas que participan en esa conversación, según las leyes de privacidad aplicables en tu jurisdicción (incluyendo pero no limitado a la Ley 25.326 de Protección de Datos Personales de Argentina y el RGPD europeo si aplica). ChatAnalyzer no asume responsabilidad por el uso indebido del Servicio en relación con datos de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. Uso responsable</h2>
            <p className="mb-2">Te recomendamos usar ChatAnalyzer como una herramienta de reflexión, <strong>no como un veredicto</strong>. Algunas buenas prácticas:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Tomá los resultados como un punto de partida para la reflexión, no como una conclusión.</li>
              <li>No uses los análisis para confrontar, juzgar o tomar decisiones drásticas sobre otras personas.</li>
              <li>Si el análisis te genera angustia o preocupación, consultá con un profesional.</li>
              <li>Recordá que un chat es solo una fracción de la comunicación humana total.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Exención de responsabilidad</h2>
            <p>
              ChatAnalyzer, sus creadores, colaboradores y proveedores de infraestructura no se hacen responsables por ningún daño — directo, indirecto, emocional, relacional, económico o de cualquier otra índole — que pueda derivarse del uso de los análisis generados. El Servicio se provee "tal como está" sin garantías de exactitud, completitud o idoneidad para ningún propósito específico.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Al usar ChatAnalyzer aceptás este deslinde de responsabilidad y nuestros{" "}
              <Link href="/terms" className="underline hover:text-gray-600">
                Términos y Condiciones
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
