import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <div className="min-h-screen bg-[#f7f2ea] text-slate-900 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">

  <h1 className="text-3xl font-bold">Termini e Condizioni</h1>

  <p>
    Il presente sito è gestito da <strong>Amalis Group Srl</strong>, con sede in
    Via San Nicola, snc – 95040 Camporotondo Etneo (CT), Italia,
    P.IVA 06169160873.
  </p>

  <h2 className="text-xl font-semibold">Oggetto del servizio</h2>
  <p>
    Tunisia Gateway è un progetto che offre servizi informativi, orientamento e
    supporto per soggiorni e percorsi di permanenza in Tunisia, con particolare
    riferimento a soluzioni in contesti organizzati come resort.
  </p>

  <h2 className="text-xl font-semibold">Natura del servizio</h2>
  <p>
    I servizi offerti hanno carattere informativo e consulenziale. Tunisia Gateway
    non rappresenta enti pubblici, istituzioni o autorità locali e non fornisce
    garanzie legali, fiscali o amministrative vincolanti.
  </p>

  <h2 className="text-xl font-semibold">Prenotazioni e pagamenti</h2>
  <p>
    Le prenotazioni possono essere effettuate tramite il sito o canali collegati.
    I pagamenti sono gestiti tramite provider esterni sicuri (es. Stripe).
  </p>
  <p>
    I prezzi possono variare in base al periodo, alla disponibilità e alla
    tipologia di soluzione scelta. Eventuali variazioni saranno comunicate prima
    della conferma della prenotazione.
  </p>

  <h2 className="text-xl font-semibold">Condizioni di soggiorno</h2>
  <p>
    Le condizioni specifiche relative al soggiorno (durata, servizi inclusi,
    modalità di utilizzo degli spazi) sono definite da contratto e vengono definite caso per caso e comunicate
    all’utente prima della conferma.
  </p>

  <h2 className="text-xl font-semibold">Responsabilità dell’utente</h2>
  <p>
    L’utente si impegna a fornire informazioni corrette e veritiere e a rispettare
    le condizioni comunicate durante il processo di prenotazione e soggiorno.
  </p>

  <h2 className="text-xl font-semibold">Limitazione di responsabilità</h2>
  <p>
    Amalis Group Srl non è responsabile per decisioni personali prese
    dall’utente sulla base delle informazioni fornite, né per eventuali cambiamenti
    normativi o condizioni locali che possano influenzare il soggiorno.
  </p>

  <h2 className="text-xl font-semibold">Modifiche al servizio</h2>
  <p>
    Ci riserviamo il diritto di modificare, sospendere o interrompere i servizi
    offerti in qualsiasi momento, senza preavviso.
  </p>

  <h2 className="text-xl font-semibold">Modifiche ai termini</h2>
  <p>
    I presenti Termini e Condizioni possono essere aggiornati in qualsiasi momento.
    Le modifiche entrano in vigore dal momento della pubblicazione sul sito.
  </p>

  <h2 className="text-xl font-semibold">Legge applicabile</h2>
  <p>
    I presenti Termini e Condizioni sono regolati dalla legge italiana.
  </p>

  <h2 className="text-xl font-semibold">Contatti</h2>
  <p>
    Per qualsiasi informazione è possibile contattare:
    <br />
    Email: tunisiagateway@coomunity.it
  </p>

</div>
      </div>

      <SiteFooter />
    </>
  );
}