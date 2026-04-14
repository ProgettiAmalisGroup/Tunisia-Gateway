import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Compass,
  CreditCard,
  Globe2,
  Home,
  Info,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import AuthPage from "./AuthPage";
import { supabase } from "./lib/supabase";
import AuthSuccess from "./AuthSuccess";
import WelcomePage from "./WelcomePage";
import ProjectPage from "./ProjectPage";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";

/**
 * Tunisia Gateway MVP
 *
 * Single-file React app designed in the same spirit as a Vite + React + TypeScript + Tailwind project,
 * similar to the structure/style the user already knows from Renthubber.
 *
 * Suggested local usage:
 * 1. Create a Vite React TS app
 * 2. Replace App.tsx with this file
 * 3. Ensure Tailwind is already configured
 * 4. Run npm run dev
 */

type LeadStatus = "Nuovo" | "Contattato" | "Call prenotata" | "Call fatta" | "Cliente";

type Lead = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  duration: string;
  targetDate: string;
  notes: string;
  status: LeadStatus;
  source: string;
};

type SessionFormState = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  duration: string;
  decisionStage: string;
  travelParty: string;
  targetDate: string;
  notes: string;
};

const initialFormState: SessionFormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "", 
  duration: "30 giorni",
  decisionStage: "",
  travelParty: "",
  targetDate: "",
  notes: "",
};

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    alt: "Resort mediterraneo con piscina",
  },
  {
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    alt: "Camera premium luminosa",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    alt: "Area ristorante elegante e rilassata",
  },
];

 const pricingCards = [
  {
    title: "12 mesi",
    price: "1.199€",
    subtitle: "al mese / per camera",
    daily: "a soli 39€ / giorno",
    highlight: true,
  },
  {
    title: "6 mesi",
    price: "1.399€",
    subtitle: "al mese / per camera",
    daily: "a soli 46€ / giorno",
  },
  {
    title: "3 mesi",
    price: "1.499€",
    subtitle: "al mese / per camera",
    daily: "a soli 50€ / giorno",
  },
  {
    title: "30 giorni",
    price: "1.699€",
    subtitle: "al mese / per camera",
    daily: "a soli 56€ / giorno",
  },
];

const includedItems = [
  "Camera privata o bungalow in resort 4 stelle",
  "Colazione, pranzo e cena a buffet",
  "Wi-Fi, utenze e accesso completo ai servizi del resort",
  "Pulizia settimanale e cambio biancheria",
  "Referente dedicato per accompagnarti nelle prime fasi del percorso",
  "Supporto locale per orientarti e gestire l’arrivo",
  "Accesso alla community privata",
  "Attività giornaliere e vita sociale all’interno del resort",
  "Serate a tema, musica e momenti condivisi",
  "Piscine, Spa, palestra e area co-working",
];

const sessionItems = [
  "Come funziona davvero il soggiorno in Tunisia",
  "Differenza tra soluzione organizzata e semplice affitto",
  "Costi reali, tempistiche e formule disponibili",
  "Modalità di arrivo e orientamento iniziale",
  "Domande personalizzate prima di decidere se partire",
];

const faqItems = [
  {
    q: "La sessione di orientamento è obbligatoria?",
    a: "No, ma è fortemente consigliata. Serve a capire se il percorso è adatto alla tua situazione ed evitare errori. I 50€ vengono scalati in caso di prenotazione.",
  },
  {
  q: "È una vacanza?",
  a: "È molto più di una vacanza. Vivi in un contesto resort con comfort, servizi e vita sociale, ma con il tempo e lo spazio per capire davvero se la Tunisia può diventare la tua nuova realtà.",
  },
  {
    q: "Cosa succede dopo il periodo scelto?",
    a: "Alla fine del periodo puoi decidere liberamente se tornare oppure continuare il tuo percorso in Tunisia senza interruzioni.",
  },
  {
    q: "Posso fermarmi più a lungo se mi trovo bene?",
    a: "Sì. Se durante il percorso capisci che vuoi restare, puoi proseguire all’interno del progetto senza dover ricominciare da zero.",
  },
  {
    q: "I prezzi includono tutto?",
    a: "Sì. Sono inclusi alloggio, pasti, utenze, Wi-Fi e accesso ai servizi del resort. Alcuni servizi extra sono opzionali.",
  },
  {
    q: "Posso venire con un’altra persona o con bambini?",
    a: "Sì. Il prezzo base è per una persona. Sono previsti supplementi per altre persone e una gestione dedicata per i bambini in base all’età.",
  },
  {
    q: "È adatto a chi vuole trasferirsi davvero?",
    a: "Sì. È pensato proprio per chi vuole prendersi il tempo per capire se vivere in Tunisia, senza dover prendere decisioni affrettate.",
  },
  {
  q: "Devo organizzare tutto da solo?",
  a: "No. Arrivi in una struttura già organizzata, sarà tutto pronto. Non sarai mai lasciato da solo: hai un punto di riferimento sul posto che ti aiuta a orientarti e a muovere i primi passi senza stress.",
  },
  {
    q: "Dove si trova la base operativa?",
    a: "La base è a Yasmine Hammamet, in un contesto resort organizzato con servizi, sicurezza e vita sociale.",
  },
  {
  q: "Operate solo in questa zona della Tunisia?",
  a: "Al momento sì, lavoriamo su Yasmine Hammamet per garantire una base solida e organizzata. Il progetto però è in evoluzione e l’obiettivo è espandersi anche in altre zone della Tunisia nei prossimi step.",
}
];

const mockLeads: Lead[] = [
  {
    id: 1,
    fullName: "Marco Bianchi",
    email: "marco@example.com",
    phone: "+39 333 0000000",
    country: "Italia",
    duration: "3 mesi",
    targetDate: "Settembre 2026",
    notes: "Interessato a capire differenza tra affitto e formula resort.",
    status: "Call prenotata",
    source: "TikTok",
  },
  {
    id: 2,
    fullName: "Claire Martin",
    email: "claire@example.com",
    phone: "+33 600 000000",
    country: "Francia",
    duration: "12 mesi",
    targetDate: "Ottobre 2026",
    notes: "Vuole soggiorno lungo e supporto iniziale.",
    status: "Contattato",
    source: "Instagram",
  },
  {
    id: 3,
    fullName: "Luca Romano",
    email: "luca@example.com",
    phone: "+39 347 0000000",
    country: "Italia",
    duration: "30 giorni",
    targetDate: "Agosto 2026",
    notes: "Chiede informazioni su sessione orientamento.",
    status: "Nuovo",
    source: "Facebook",
  },
];

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-lg leading-8 text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

function PublicLanding({
  onOpenAdmin,
  onSubmitLead,
}: {
  onOpenAdmin: () => void;
  onSubmitLead: (lead: Omit<Lead, "id" | "status" | "source">) => void;
}) {
  const [form, setForm] = useState<SessionFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof SessionFormState>(key: K, value: SessionFormState[K]) {
  setForm((prev) => ({ ...prev, [key]: value }));
}

async function saveOrientationSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("orientation_sessions")
    .insert([
      {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        city: form.city,
        duration: form.duration,
        decision_stage: form.decisionStage,
        travel_party: form.travelParty,
        target_date: form.targetDate,
        notes: form.notes,
        source: "landing_page",
        user_id: user?.id ?? null,
        status: "new",
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const savedSession = await saveOrientationSession();
  console.log("Sessione salvata:", savedSession);

  try {
    const response = await fetch("https://tunisia-gateway-api.progetti.workers.dev/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      alert(data?.error || "Errore durante la creazione del pagamento.");
      return;
    }

    window.location.href = data.url;
  } catch (error) {
    alert("Si è verificato un errore. Riprova.");
  }
}

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-[#d8cfc1] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-14 w-auto flex items-center">
  <img
    src="https://gwrkwdkshbjgazfzyziq.supabase.co/storage/v1/object/public/landing-images/logo_reasparente.svg"
    alt="Tunisia Gateway"
    className="h-full w-auto"
  />
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
    href="#sessione"
    className="hidden rounded-xl border border-[#d4c6b5] px-4 py-2 text-sm font-medium text-[#103a52] transition hover:border-[#bfae98] hover:bg-[#f4ede3] sm:inline-flex"
  >
    Prenota la Call
  </a>
            {false && (
  <button
    type="button"
    onClick={onOpenAdmin}
    className="rounded-xl bg-[#103a52] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0d3145]"
  >
    Login/Registrati
  </button>
)}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f2ea_0%,#fcfaf6_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,58,82,0.12),transparent_28%),radial-gradient(circle_at_top_left,rgba(196,168,120,0.16),transparent_24%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7c7ae] bg-[#f4ede3] px-4 py-2 text-sm font-medium text-[#103a52]">
                <Globe2 className="h-4 w-4" />
                Soggiorni organizzati in Tunisia, con base operativa in resort a 4 stelle
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Trasferirti in Tunisia può cambiarti la vita. Fallo nel modo giusto.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Tunisia Gateway è un percorso guidato pensato per chi vuole prendersi il tempo necessario
per capire se vivere in Tunisia oppure tornare alle proprie abitudini.

Non si tratta di una vacanza, ma di un periodo reale di prova, in cui puoi vivere il posto,
capire i costi, adattarti gradualmente e prendere una decisione consapevole.

Puoi scegliere formule da 30 giorni, 90 giorni, 6 mesi o 12 mesi,
in base al tempo che senti necessario per decidere davvero.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
Se durante il percorso capisci che la Tunisia è davvero la scelta giusta per te,
avrai la possibilità di proseguire senza interruzioni la tua vita all’interno del Resort o farti aiutare nella ricerca della casa dei tuoi sogni.
</p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#sessione"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Prenota la sessione di orientamento
                </a>
                <a
                  href="#formule"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  Vedi formule e tariffe
                </a>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
  {[
    { label: "Primo passo", value: "Sessione iniziale di Orientamento" },
    { label: "Tempo per decidere", value: "30 giorni, 3, 6 o 12 mesi" },
    { label: "La tua unica scelta", value: "Restare in Tunisia o tornare nel tuo paese" },
  ].map((item) => (
    <div
      key={item.label}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <p className="text-sm text-slate-600">{item.label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
    </div>
  ))}
</div>
            </div>

            <div className="lg:pl-8">
  <div className="grid gap-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="overflow-hidden rounded-[28px] border border-[#e0d5c8] bg-white shadow-xl shadow-[#d8cfc1]/40 sm:col-span-2">
        <img
          src={heroImages[0].src}
          alt={heroImages[0].alt}
          className="h-72 w-full object-cover"
        />
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#e0d5c8] bg-white shadow-sm">
        <img
          src={heroImages[1].src}
          alt={heroImages[1].alt}
          className="h-44 w-full object-cover"
        />
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#e0d5c8] bg-white shadow-sm">
        <img
          src={heroImages[2].src}
          alt={heroImages[2].alt}
          className="h-44 w-full object-cover"
        />
      </div>
    </div>

    
  </div>
</div>
          </div>
        </section>

        <section className="py-16 bg-[#f7f2ea]">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">

    {/* SINISTRA - FOTO */}
    <div className="grid gap-4 sm:grid-cols-2">
  <div className="overflow-hidden rounded-2xl">
    <img
      src="https://gwrkwdkshbjgazfzyziq.supabase.co/storage/v1/object/public/landing-images/IMG_6177.jpg"
      className="h-60 w-full object-cover"
      alt="Hammamet beach"
    />
  </div>

  <div className="overflow-hidden rounded-2xl">
    <img
      src="https://gwrkwdkshbjgazfzyziq.supabase.co/storage/v1/object/public/landing-images/IMG_6178.jpg"
      className="h-60 w-full object-cover"
      alt="Hammamet medina"
    />
  </div>

  <div className="overflow-hidden rounded-2xl sm:col-span-2">
    <img
      src="https://gwrkwdkshbjgazfzyziq.supabase.co/storage/v1/object/public/landing-images/IMG_6176.jpg"
      className="h-72 w-full object-cover"
      alt="Yasmine Hammamet marina"
    />
  </div>
</div>

    {/* DESTRA - CARD */}
    <div className="rounded-[28px] border border-[#e0d5c8] bg-white p-6 shadow-xl shadow-[#d8cfc1]/40">
      <div className="rounded-2xl bg-[#103a52] p-6 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-[#d8c7a8]">
          Prima di partire
        </p>
        <h3 className="mt-3 text-2xl font-semibold">
          Sessione di orientamento personalizzata
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          Un confronto per capire se vivere in Tunisia è davvero la scelta giusta per te,
          evitando errori e perdite di tempo.
        </p>
        <div className="mt-5 flex items-end gap-2">
          <span className="text-4xl font-bold">50€</span>
          <span className="pb-1 text-sm text-slate-300">
            scalati dal soggiorno
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {sessionItems.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f8f3eb] p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#103a52]" />
            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>


        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionTitle
                eyebrow="Il problema"
                title="Trasferirsi o soggiornare a lungo in Tunisia senza struttura può diventare un caos."
                subtitle="Case da cercare, costi da capire, tempi sbagliati, servizi confusi e un’esperienza spesso improvvisata. Tunisia Gateway nasce per dare ordine, supporto e chiarezza fin dal primo passo."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Search,
                  title: "Meno confusione",
                  text: "Hai un percorso chiaro prima ancora di decidere se partire davvero.",
                },
                {
                  icon: Plane,
                  title: "Arrivo più semplice",
                  text: "Orientamento iniziale su modalità di arrivo, tempi e organizzazione.",
                },
                {
                  icon: ShieldCheck,
                  title: "Più sicurezza",
                  text: "Un progetto strutturato, non una soluzione improvvisata o generica.",
                },
                {
                  icon: Home,
                  title: "Formula completa",
                  text: "Alloggio, ristorazione e servizi già organizzati in un contesto resort.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <item.icon className="h-7 w-7 text-cyan-700" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
                </section>

        <section id="incluso" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Cosa è incluso"
              title="Una formula pensata per farti vivere la Tunisia senza stress."
              subtitle="Tunisia Gateway non è un semplice alloggio. È un soggiorno organizzato in resort, con servizi chiari, struttura e supporto già inclusi."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {includedItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-cyan-50 p-2 text-cyan-700">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl shadow-slate-300/30">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Perché è diverso
                </p>
                <h3 className="mt-4 text-2xl font-semibold">
                  Non stai pagando solo una camera.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-200">
                  Stai scegliendo una soluzione organizzata, con alloggio, ristorazione,
                  utenze, servizi e supporto già strutturati in un contesto resort.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-medium text-white">Più semplice</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Arrivi e trovi già tutto pronto, senza dover gestire ogni dettaglio.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-medium text-white">Più chiaro</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Costi, formule e servizi sono definiti in modo trasparente fin dall’inizio.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm font-medium text-white">Più strutturato</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Non una sistemazione improvvisata, ma un progetto costruito con logica operativa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

          <div className="bg-gray-100 py-16 px-6">
  <div className="max-w-3xl mx-auto text-center space-y-6">
    
    <h2 className="text-3xl font-bold">
      Non è solo un soggiorno. È un cambio di vita.
    </h2>

    <p className="text-gray-700">
      Tunisia Gateway è un progetto pensato per aiutarti a ridurre i costi,
      semplificare il trasferimento e accedere a nuove opportunità.
    </p>

    <a
      href="/#/il-progetto"
      className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold"
    >
      Scopri il progetto
    </a>

  </div>
</div>
 
        <section id="formule" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Formule soggiorno"
              title="Scegli la soluzione più adatta a te e blocca subito il tuo posto."
              subtitle="I prezzi possono variare in base al periodo e alla disponibilità, le richieste stanno aumentando rapidamente."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {pricingCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-3xl border p-6 shadow-sm ${
                    card.highlight
                      ? "border-slate-900 bg-slate-900 text-white shadow-slate-300"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    {card.highlight ? (
                      <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                        Più conveniente
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <p className="text-4xl font-bold">{card.price}</p>
                    <p className={`mt-2 text-sm ${card.highlight ? "text-slate-300" : "text-slate-500"}`}>
                      {card.subtitle}
                      {card.daily && (
  <p className={`mt-1 text-xs ${card.highlight ? "text-slate-400" : "text-slate-500"}`}>
    {card.daily}
  </p>
)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
      Supplementi
    </p>

    {/* ADULTI */}
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Persone aggiuntive
      </p>

      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-700">Seconda persona</span>
          <span className="text-sm font-semibold text-[#103a52]">+350€ / mese</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-700">Terza persona</span>
          <span className="text-sm font-semibold text-[#103a52]">+250€ / mese</span>
        </div>
      </div>
    </div>

    {/* BAMBINI */}
    <div className="mt-6 border-t border-slate-200 pt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Bambini
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Pensato per famiglie e soggiorni lunghi
      </p>

      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-700">0–3 anni</span>
          <span className="text-sm font-semibold text-green-600">Gratuito</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-700">4–10 anni</span>
          <span className="text-sm font-semibold text-[#103a52]">+150€ / mese</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-700">11–17 anni</span>
          <span className="text-sm font-semibold text-[#103a52]">+250€ / mese</span>
        </div>
      </div>
    </div>

  </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Incluso</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                  {includedItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-cyan-700" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
    Servizi extra
  </p>

  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
    <li>Ricerca casa e tour immobiliari</li>
    <li>Consulenza amministrativa e fiscale</li>
    <li>Transfer e assistenza all’arrivo</li>
    <li>Upgrade camera premium e servizi dedicati</li>
    <li>Sessione di orientamento iniziale</li>
    <li>Supporto personalizzato pre-partenza</li>
    <li>Assistenza per organizzazione arrivo in Tunisia</li>
    <li>Servizio Lavanderia</li>
  </ul>
</div>
</div>
          </div>
        </section>

        <section id="sessione" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <SectionTitle
                  eyebrow="Primo passo"
                  title="Prenota la sessione di orientamento personalizzata."
                  subtitle="La sessione serve a capire se Tunisia Gateway è davvero adatto a te. Il costo è di 50€ e viene scalato dal soggiorno in caso di prenotazione."
                />

                <div className="mt-8 space-y-4">
                  {[
                    {
                      icon: CalendarDays,
                      title: "Durata 30–45 minuti",
                      text: "Una sessione snella, concreta e focalizzata sulla tua situazione reale.",
                    },
                    {
                      icon: MessageCircle,
                      title: "Call o videochiamata",
                      text: "La sessione si svolge in chiamata o videochiamata, in base alla modalità più adatta alle tue esigenze.",
                    },
                    {
                      icon: CreditCard,
                      title: "Importo scalabile",
                      text: "Se prenoti il soggiorno, i 50€ vengono scalati dal tuo primo pagamento.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Prenota la tua sessione di orientamento</h3>
                    <p className="text-sm text-slate-500">
  Compila i dati e blocca la tua sessione: scoprirai se la Tunisia è davvero la scelta giusta per te.
</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-800">
                    Richiesta registrata correttamente. Nella versione reale potrai collegare questo form a Supabase,
                    email, WhatsApp o pagamento diretto della sessione.
                  </div>
                ) : null}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Nome e cognome</span>
                      <input
                        required
                        value={form.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        placeholder="Mario Rossi"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        placeholder="nome@email.com"
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Telefono / WhatsApp</span>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        placeholder="+39 ..."
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Paese di provenienza</span>
                      <input
                        required
                        value={form.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        placeholder="Italia"
                      />
                    </label>
                  </div>

                  <label className="block">
  <span className="mb-2 block text-sm font-medium text-slate-700">
    Città di partenza
  </span>
  <input
    required
    value={form.city}
    onChange={(e) => updateField("city", e.target.value)}
    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
    placeholder="Es. Milano"
  />
</label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Formula che ti interessa</span>
                      <select
                        value={form.duration}
                        onChange={(e) => updateField("duration", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                      >
                        <option>30 giorni</option>
                        <option>3 mesi</option>
                        <option>6 mesi</option>
                        <option>12 mesi</option>
                      </select>
                    </label>

                    <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">
      Quanto sei vicino a prendere una decisione?
    </span>
    <select
  value={form.decisionStage}
  onChange={(e) => updateField("decisionStage", e.target.value)}
  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
>
  <option value="">Seleziona</option>
  <option>Sto solo valutando</option>
  <option>Sto considerando seriamente</option>
  <option>Voglio partire nei prossimi mesi</option>
  <option>Sono pronto a partire</option>
</select>
</label>

  <label className="block">
  <span className="mb-2 block text-sm font-medium text-slate-700">
    Con quante persone pensi di partire?
  </span>

  <select
    value={form.travelParty}
    onChange={(e) => updateField("travelParty", e.target.value)}
    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
  >
    <option value="">Seleziona</option>
    <option>Da solo</option>
    <option>In coppia</option>
    <option>Con famiglia (bambini)</option>
    <option>Con amici / più persone</option>
  </select>
</label>


                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">Periodo indicativo</span>
                      <input
                        value={form.targetDate}
                        onChange={(e) => updateField("targetDate", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                        placeholder="Es. Settembre 2026"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Note o domande</span>
                    <textarea
                      rows={5}
                      value={form.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                      placeholder="Raccontaci la tua situazione: stai valutando un trasferimento? vuoi fare un periodo di prova?"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
                  >
                   Prenota la sessione di orientamento
                  </button>
                  <p className="text-center text-xs leading-6 text-red-600 mt-2">
  Posti limitati ogni settimana per garantire sessioni personalizzate.
</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="FAQ"
              title="Domande frequenti"
              subtitle="Una base chiara per comunicare il progetto in modo ordinato già dalla prima versione."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item.q} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{item.q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

       <div className="flex justify-center py-10">
  <img
    src="https://gwrkwdkshbjgazfzyziq.supabase.co/storage/v1/object/public/landing-images/logo_reasparente.svg"
    alt="Tunisia Gateway"
    className="h-24 w-auto"
  />
</div>

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

    {/* TOP */}
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

      {/* BRAND */}
      <div className="flex items-center gap-4">

  <div>
    <p className="text-lg font-semibold text-white">Tunisia Gateway</p>
    <p className="mt-1 text-sm text-slate-400">
      Vivere in un resort, con servizi, supporto e una nuova qualità della vita.
    </p>
  </div>
</div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href="#sessione"
          className="rounded-xl border border-slate-700 px-4 py-2 transition hover:border-slate-500 hover:text-white"
        >
          Prenota la call
        </a>

       
      </div>
    </div>

    {/* DIVIDER */}
    <div className="my-8 border-t border-slate-800"></div>

    {/* BOTTOM */}
    <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">

      {/* LEGAL */}
      <div className="flex flex-wrap gap-4">
        <a href="/#/termini" className="transition hover:text-white">
          Termini e condizioni
        </a>
        <a href="/#/privacy" className="transition hover:text-white">
          Privacy Policy
        </a>
      </div>

      {/* COMPANY */}
      <div className="text-xs text-slate-500">
        © {new Date().getFullYear()} Amalis Group Srl – P.IVA 06169160873
      </div>

    </div>

  </div>
</footer>
    </div>
  );
}

function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-[#e0d5c8] bg-white p-8 shadow-xl shadow-[#d8cfc1]/40">
        <h1 className="text-3xl font-bold text-slate-900">
          Pagamento ricevuto correttamente
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">
          La tua sessione di orientamento è stata confermata.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Ora possiamo fissare giorno e orario della call.
        </p>

        <a
          href="https://wa.me/393511478932?text=Ciao%2C%20ho%20appena%20pagato%20la%20sessione%20Tunisia%20Gateway%20e%20vorrei%20fissare%20giorno%20e%20orario."
          className="mt-8 inline-flex rounded-2xl bg-[#103a52] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#0d3145]"
        >
          Fissa la tua call su WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<"public" | "admin" | "auth">("public");
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const getPathFromHash = () => {
  const hash = window.location.hash || '#/';
  const cleaned = hash.replace(/^#\/?/, '');
  const parts = cleaned.split('/');

  return `/${parts[0] || ''}`;
};

const [path, setPath] = useState(getPathFromHash());

useEffect(() => {
  function handleHashChange() {
    setPath(getPathFromHash());
  }

  window.addEventListener("hashchange", handleHashChange);

  return () => {
    window.removeEventListener("hashchange", handleHashChange);
  };
}, []);

function handleSubmitLead(lead: Omit<Lead, "id" | "status" | "source">) {
  setLeads((prev) => [
    {
      id: prev.length + 1,
      ...lead,
      status: "Nuovo",
      source: "Landing page",
    },
    ...prev,
  ]);
}

function handleUpdateLeadStatus(id: number, status: LeadStatus) {
  setLeads((prev) =>
    prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
  );
}

if (path === "/success") {
  return <SuccessPage />;
}

if (path === "/auth-success") {
  return <AuthSuccess />;
}

if (path.startsWith("/welcome")) {
  return <WelcomePage />;
}

if (path.startsWith("/dashboard")) {
  return <ClientDashboard />;
}

if (path.startsWith("/admin")) {
  return <AdminDashboard />;
}

if (path.startsWith("/il-progetto")) {
  return <ProjectPage />;
}

if (path.startsWith("/termini")) {
  return <TermsPage />;
}

if (path.startsWith("/privacy")) {
  return <PrivacyPage />;
}

if (view === "auth") {
  return <AuthPage onBack={() => setView("public")} />;
}

if (view === "admin") {
  return <AdminDashboard />;
}

return (
  <>
    <PublicLanding
      onOpenAdmin={() => setView("auth")}
      onSubmitLead={handleSubmitLead}
    />
  </>
);
}
