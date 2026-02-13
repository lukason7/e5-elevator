import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-slate-900">
            E5 Elevator
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/legal/terms" className="hover:text-slate-700">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/legal/ai-disclaimer" className="hover:text-slate-700">AI Disclaimer</Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        E5 Elevator &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
