import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function ProjectPage() {
  return (
  <>
    <SiteHeader />

    <div className="min-h-screen bg-[#f7f2ea] text-slate-900">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Tunisia Gateway
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Non è solo un soggiorno. È un nuovo inizio.
            </h1>

            <p className="text-lg leading-relaxed text-gray-700">
              Tunisia Gateway nasce per accompagnare chi desidera cambiare vita,
              ridurre i costi, vivere in un contesto più accessibile e iniziare
              un percorso concreto in una struttura pensata per accogliere,
              orientare e semplificare tutto.
            </p>

            <div className="flex flex-wrap gap-4">
             <a
  href="/#formule"
  onClick={(e) => {
    e.preventDefault();

    window.location.href = "/#formule";

    setTimeout(() => {
      const section = document.getElementById("formule");
      if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200);
  }}
  className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold"
>
  Scopri le soluzioni
</a>

              <a
                href="/#/"
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800"
              >
                Torna alla home
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
              alt="Resort con piscina"
              className="h-72 w-full rounded-3xl object-cover shadow-sm sm:h-full"
            />
            <div className="grid gap-4">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
                alt="Paesaggio mediterraneo"
                className="h-34 w-full rounded-3xl object-cover shadow-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80"
                alt="Interni eleganti"
                className="h-34 w-full rounded-3xl object-cover shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cos'è */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Cos’è davvero
              </p>
              <h2 className="text-3xl font-bold">
                Un progetto pensato per accompagnare un cambiamento reale
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                Tunisia Gateway non nasce per proporre una semplice vacanza, ma
                per offrire un accesso concreto a un nuovo stile di vita.
              </p>
              <p>
                Il nostro obiettivo è aiutare le persone a valutare, vivere e
                costruire un trasferimento in modo più semplice, più guidato e
                più sostenibile.
              </p>
              <p>
                Vogliamo creare un punto di riferimento per chi cerca una
                soluzione abitativa, un orientamento pratico e un contesto già
                organizzato in cui sentirsi accolto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resort */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Il resort
            </p>
            <h2 className="mb-4 text-3xl font-bold">
              Il cuore del progetto è il resort dove le persone potranno vivere
            </h2>
            <p className="text-gray-700">
              Tunisia Gateway ruota attorno a una struttura pensata per ospitare
              chi desidera trasferirsi, ambientarsi gradualmente e iniziare un
              nuovo percorso in un luogo accogliente, organizzato e orientato al
              benessere.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Accoglienza e comfort</h3>
              <p className="text-gray-700">
                Camere, spazi comuni e servizi pensati per offrire un soggiorno
                piacevole e una permanenza serena sin dal primo giorno.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Inserimento graduale</h3>
              <p className="text-gray-700">
                Il resort sarà il punto di partenza ideale per conoscere il
                territorio, valutarne le opportunità e capire se questo
                cambiamento è davvero quello giusto.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Esperienza guidata</h3>
              <p className="text-gray-700">
                Non solo ospitalità, ma anche supporto pratico, orientamento e
                un contesto che aiuti le persone a sentirsi seguite passo dopo
                passo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Per chi */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Per chi è pensato
            </p>
            <h2 className="text-3xl font-bold">
              Per chi vuole capire se esiste davvero un’alternativa
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Chi vuole ridurre i costi</h3>
              <p className="text-gray-700">
                Persone che stanno cercando una soluzione più sostenibile per
                vivere meglio e spendere meno.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Chi vuole ricominciare</h3>
              <p className="text-gray-700">
                Chi sente il bisogno di cambiare ambiente, ritmo e prospettiva
                senza affrontare tutto da solo.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold">Chi cerca una guida</h3>
              <p className="text-gray-700">
                Chi vuole valutare questo passo con un percorso più chiaro,
                semplice e accompagnato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Se stai valutando davvero questo cambiamento, puoi iniziare da qui
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-700">
            Scopri le soluzioni disponibili e scegli il percorso più adatto a
            te. Le richieste stanno aumentando e la disponibilità può variare.
          </p>

          <a
  href="/#formule"
  onClick={(e) => {
    e.preventDefault();

    window.location.href = "/#formule";

    setTimeout(() => {
      const section = document.getElementById("formule");
      if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200);
  }}
  className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold"
>
  Scopri le soluzioni
</a>
        </div>
     </section>
</div>

  <div className="flex justify-center py-10">
  <img
    src="https://gwrkwdkshbjgazfzyziq.supabase.co/storage/v1/object/public/landing-images/logo_reasparente.svg"
    alt="Tunisia Gateway"
    className="h-24 w-auto"
  />
</div>

<SiteFooter />
</>
);
}