import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <div className="min-h-screen bg-[#f7f2ea] text-slate-900 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">

          <h1 className="text-3xl font-bold">Privacy Policy</h1>

          <p>
            La presente informativa sulla privacy è fornita da <strong>Amalis Group Srl</strong>,
            con sede in Via San Nicola, snc – 95040 Camporotondo Etneo (CT), Italia,
            P.IVA 06169160873, in qualità di titolare del trattamento dei dati personali.
          </p>

          <h2 className="text-xl font-semibold">Tipologia di dati raccolti</h2>
          <p>
            Attraverso il sito Tunisia Gateway possiamo raccogliere dati personali
            forniti volontariamente dall’utente, tra cui nome, cognome, indirizzo email,
            numero di telefono e qualsiasi altra informazione inserita nei moduli di contatto,
            richiesta o prenotazione.
          </p>

          <h2 className="text-xl font-semibold">Finalità del trattamento</h2>
          <p>
            I dati raccolti sono trattati per rispondere alle richieste dell’utente,
            organizzare sessioni conoscitive, gestire eventuali prenotazioni, fornire
            supporto informativo e migliorare l’esperienza di navigazione sul sito.
          </p>

          <h2 className="text-xl font-semibold">Base giuridica del trattamento</h2>
          <p>
            Il trattamento dei dati avviene sulla base del consenso dell’utente,
            dell’esecuzione di misure precontrattuali richieste dall’interessato
            o, ove applicabile, per adempiere a obblighi di legge.
          </p>

          <h2 className="text-xl font-semibold">Modalità di trattamento</h2>
          <p>
            I dati personali sono trattati con strumenti informatici e telematici,
            adottando misure di sicurezza adeguate a prevenire accessi non autorizzati,
            perdita, divulgazione o uso improprio dei dati.
          </p>

          <h2 className="text-xl font-semibold">Conservazione dei dati</h2>
          <p>
            I dati sono conservati per il tempo strettamente necessario alle finalità
            per cui sono stati raccolti e comunque nel rispetto dei termini previsti
            dalla normativa vigente.
          </p>

          <h2 className="text-xl font-semibold">Comunicazione a terzi</h2>
          <p>
            I dati potranno essere trattati da fornitori di servizi tecnici,
            strumenti di pagamento o piattaforme utilizzate per la gestione operativa
            del progetto, esclusivamente nei limiti necessari all’erogazione dei servizi.
          </p>

          <h2 className="text-xl font-semibold">Pagamenti</h2>
          <p>
            Eventuali pagamenti effettuati tramite il sito sono gestiti da provider
            esterni sicuri, come Stripe. I dati di pagamento non vengono conservati
            direttamente da Amalis Group Srl, ma trattati dai rispettivi fornitori
            secondo le loro informative privacy.
          </p>

          <h2 className="text-xl font-semibold">Diritti dell’utente</h2>
          <p>
            L’utente ha il diritto di richiedere in qualsiasi momento l’accesso ai propri dati,
            la rettifica, la cancellazione, la limitazione del trattamento o di opporsi allo stesso,
            nei limiti previsti dal Regolamento UE 2016/679 (GDPR).
          </p>

          <h2 className="text-xl font-semibold">Contatti per la privacy</h2>
          <p>
            Per esercitare i propri diritti o richiedere informazioni sul trattamento dei dati,
            è possibile contattare il titolare scrivendo a:
            <br />
            Email: tunisiagateway@coomunity.it
          </p>

          <h2 className="text-xl font-semibold">Aggiornamenti dell’informativa</h2>
          <p>
            La presente Privacy Policy può essere aggiornata o modificata in qualsiasi momento.
            Le eventuali modifiche saranno pubblicate su questa pagina.
          </p>

        </div>
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