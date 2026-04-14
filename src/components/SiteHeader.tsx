import { Compass } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d8cfc1] bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#103a52] text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">Tunisia Gateway</p>
            <p className="text-xs text-[#8a7b68]">Powered by Coomunity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/#/il-progetto"
            className="hidden rounded-xl border border-[#d4c6b5] px-4 py-2 text-sm font-medium text-[#103a52] transition hover:border-[#bfae98] hover:bg-[#f4ede3] sm:inline-flex"
          >
            Il progetto
          </a>

          <a
            href="/#sessione"
            className="hidden rounded-xl border border-[#d4c6b5] px-4 py-2 text-sm font-medium text-[#103a52] transition hover:border-[#bfae98] hover:bg-[#f4ede3] sm:inline-flex"
          >
            Prenota la Call
          </a>
        </div>
      </div>
    </header>
  );
}