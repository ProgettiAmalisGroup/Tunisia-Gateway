export default function WelcomePage() {
  function handleContinue() {
    localStorage.setItem("tg_welcome_seen", "true");
    window.location.href = "/#/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2ea] p-6">
      <div className="max-w-2xl rounded-[32px] border border-[#e0d5c8] bg-white p-8 shadow-xl shadow-[#d8cfc1]/40">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7b68]">
          Benvenuto in Tunisia Gateway
        </p>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Il tuo account è pronto
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">
          Da qui potrai seguire il tuo percorso, vedere lo stato della tua richiesta
          e i prossimi passi.
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-[#f8f3eb] p-4 text-sm text-slate-700">
            1. Accedi alla tua dashboard personale
          </div>
          <div className="rounded-2xl bg-[#f8f3eb] p-4 text-sm text-slate-700">
            2. Controlla lo stato della tua richiesta
          </div>
          <div className="rounded-2xl bg-[#f8f3eb] p-4 text-sm text-slate-700">
            3. Prosegui con i prossimi step del percorso
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-8 w-full rounded-2xl bg-[#103a52] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#0d3145]"
        >
          Entra nella dashboard
        </button>
      </div>
    </div>
  );
}