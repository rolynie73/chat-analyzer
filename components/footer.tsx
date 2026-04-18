import Link from "next/link";

export default function Footer() {
  return (
    <footer className="print:hidden mt-16 border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} ChatAnalyzer — Los análisis son orientativos y no reemplazan asesoramiento profesional.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
            Términos y condiciones
          </Link>
          <Link href="/disclaimer" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
            Deslinde de responsabilidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
