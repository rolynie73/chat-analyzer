import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Nav() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight text-gray-900">
          💬 ChatAnalyzer
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/analyze" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            + Nuevo
          </Link>
          <Link href="/settings" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Ajustes
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
