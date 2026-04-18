import Link from "next/link";
import Footer from "@/components/footer";

export const metadata = {
  title: "Términos y Condiciones — ChatAnalyzer",
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
          <p className="text-sm text-gray-400 mt-2">Última actualización: abril 2025</p>
        </div>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y usar ChatAnalyzer (el "Servicio"), aceptás en su totalidad estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no podés usar el Servicio. El uso continuado del Servicio implica la aceptación de cualquier modificación futura de estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. Descripción del servicio</h2>
            <p>
              ChatAnalyzer es una plataforma que utiliza modelos de inteligencia artificial de terceros (Anthropic, OpenAI, Google) para analizar conversaciones de texto y generar interpretaciones sobre patrones comunicacionales, dinámicas relacionales y estilos de personalidad. Los resultados son de carácter <strong>orientativo e informativo</strong> únicamente.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. Uso aceptable</h2>
            <p className="mb-2">Al usar ChatAnalyzer, te comprometés a:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Utilizar el Servicio únicamente con conversaciones sobre las que tenés derecho de acceso y análisis.</li>
              <li>No subir contenido que viole derechos de privacidad de terceros sin su consentimiento.</li>
              <li>No usar el Servicio para actividades ilegales, fraudulentas o que causen daño a terceros.</li>
              <li>No intentar acceder a cuentas, datos o sistemas de otros usuarios.</li>
              <li>No usar los resultados del análisis para discriminar, hostigar o perjudicar a personas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. Privacidad y datos</h2>
            <p className="mb-2">
              Los chats que subís son procesados por modelos de IA de terceros y almacenados en nuestra base de datos asociados a tu cuenta. Al usar el Servicio, aceptás que:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>El contenido de los chats se transmite a los proveedores de IA que selecciones (Anthropic, OpenAI o Google) según sus propias políticas de privacidad.</li>
              <li>Los análisis generados se guardan en tu cuenta y podés eliminarlos en cualquier momento.</li>
              <li>No compartimos tu información personal ni el contenido de tus chats con terceros fuera de los proveedores de IA necesarios para el funcionamiento del Servicio.</li>
              <li>Sos responsable de obtener el consentimiento de las personas cuyas conversaciones cargues en el Servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. API Keys y facturación</h2>
            <p>
              ChatAnalyzer utiliza las API keys que vos mismo proporcionás para conectarse a los modelos de IA. Los costos de uso de dichas APIs son de tu exclusiva responsabilidad y se rigen por los términos de cada proveedor. ChatAnalyzer no cobra comisiones ni tiene acceso a tus claves más allá de su uso para procesar los análisis solicitados.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Limitación de responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley aplicable, ChatAnalyzer no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso del Servicio, incluyendo pero no limitado a: decisiones tomadas en base a los análisis generados, pérdida de datos, o interpretaciones incorrectas de los resultados.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">7. Propiedad intelectual</h2>
            <p>
              El código, diseño, marca y contenido original de ChatAnalyzer son propiedad de sus creadores. Los análisis generados a partir de tus chats son tuyos. Los modelos de IA utilizados son propiedad de sus respectivos proveedores (Anthropic, OpenAI, Google).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">8. Modificaciones del servicio</h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio en cualquier momento, con o sin previo aviso. También podemos actualizar estos Términos y Condiciones. El uso continuado del Servicio después de cualquier cambio implica tu aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">9. Ley aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a la jurisdicción de los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Para consultas sobre estos términos, podés contactarnos a través de la plataforma.{" "}
              <Link href="/disclaimer" className="underline hover:text-gray-600">
                Ver también el Deslinde de Responsabilidad →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
