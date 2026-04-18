import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatAnalyzer — Analizá conversaciones con IA",
  description: "Descubrí la personalidad, dinámicas y vibes de cualquier chat con inteligencia artificial.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="flex flex-col min-h-screen">
          <div className="flex-1">{children}</div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
