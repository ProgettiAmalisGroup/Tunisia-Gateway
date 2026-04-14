export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-lg font-semibold text-white">Tunisia Gateway</p>
            <p className="mt-2 text-sm text-slate-400">
              Vivere in un resort, con servizi, supporto e una nuova qualità della vita.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="/#sessione"
              className="rounded-xl border border-slate-700 px-4 py-2 transition hover:border-slate-500 hover:text-white"
            >
              Prenota la call
            </a>
          </div>

        </div>

        <div className="my-8 border-t border-slate-800"></div>

        <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap gap-4">
            <a href="/#/termini" className="transition hover:text-white">
              Termini e condizioni
            </a>
            <a href="/#/privacy" className="transition hover:text-white">
              Privacy Policy
            </a>
          </div>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} Amalis Group Srl – P.IVA 06169160873
          </div>

        </div>

      </div>
    </footer>
  );
}