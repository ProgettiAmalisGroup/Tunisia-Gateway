import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';
import { getMyOrientationSessions } from './services/orientationSessions';
import {
  createDocumentRecord,
  getDocumentsBySessionId,
  uploadDocumentFile,
} from './services/documents';
import type { OrientationSession } from './types/database';

const STATUS_LABELS: Record<string, string> = {
  new: 'Richiesta inviata',
  in_review: 'In revisione',
  contacted: 'Contattato',
  waiting_documents: 'In attesa documenti',
  documents_under_review: 'Documenti in revisione',
  qualified: 'Qualificato',
  approved: 'Approvato',
  rejected: 'Non approvato',
};

function getStatusLabel(status: string | null | undefined) {
  if (!status) return 'Stato non disponibile';
  return STATUS_LABELS[status] ?? status;
}

function formatDate(value: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function buildSteps(session: OrientationSession | null) {
  const status = session?.status;

  return [
    {
      label: 'Richiesta inviata',
      done: !!session,
    },
    {
      label: 'Pagamento / verifica iniziale',
      done:
        status === 'in_review' ||
        status === 'contacted' ||
        status === 'waiting_documents' ||
        status === 'documents_under_review' ||
        status === 'qualified' ||
        status === 'approved',
    },
    {
      label: 'Contatto per fissare la call',
      done:
        status === 'contacted' ||
        status === 'waiting_documents' ||
        status === 'documents_under_review' ||
        status === 'qualified' ||
        status === 'approved',
    },
    {
      label: 'Orientamento e prossimi passi',
      done: status === 'qualified' || status === 'approved',
    },
  ];
}

function getDashboardSection() {
  const hash = window.location.hash || '#/dashboard';
  const cleaned = hash.replace(/^#\/?/, '');
  const parts = cleaned.split('/');

  if (parts[0] !== 'dashboard') return 'overview';
  return parts[1] || 'overview';
}

export default function ClientDashboard() {
  const [sessions, setSessions] = useState<OrientationSession[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [section, setSection] = useState<string>(getDashboardSection());

  async function loadMySessions() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyOrientationSessions();
      setSessions(data);

      if (data.length > 0) {
        const docs = await getDocumentsBySessionId(data[0].id);
        setDocuments(docs);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error('Errore caricamento dashboard cliente:', err);
      setError('Non sono riuscito a caricare i tuoi dati.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMySessions();
  }, []);

  useEffect(() => {
    function handleDashboardSectionChange() {
      setSection(getDashboardSection());
    }

    window.addEventListener('hashchange', handleDashboardSectionChange);

    return () => {
      window.removeEventListener('hashchange', handleDashboardSectionChange);
    };
  }, []);

  useEffect(() => {
    if (section === 'documents') {
      setTimeout(() => {
        const el = document.getElementById('documents');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [section]);

  const currentSession = useMemo(() => {
    return sessions.length > 0 ? sessions[0] : null;
  }, [sessions]);

  const steps = useMemo(() => buildSteps(currentSession), [currentSession]);

  async function handleUploadDocument(
    event: ChangeEvent<HTMLInputElement>,
    documentType: string
  ) {
    try {
      const file = event.target.files?.[0];
      if (!file || !currentSession) return;

      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Devi essere autenticato per caricare documenti.');
        return;
      }

      const uploaded = await uploadDocumentFile({
        userId: user.id,
        orientationSessionId: currentSession.id,
        file,
      });

      await createDocumentRecord({
        orientation_session_id: currentSession.id,
        user_id: user.id,
        document_type: documentType,
        file_name: uploaded.fileName,
        file_path: uploaded.filePath,
        file_size: uploaded.fileSize,
        mime_type: uploaded.mimeType,
      });

      const docs = await getDocumentsBySessionId(currentSession.id);
      setDocuments(docs);

      alert('Documento caricato con successo.');
      event.target.value = '';
    } catch (err) {
      console.error('Errore upload documento:', err);
      alert('Non sono riuscito a caricare il documento.');
    } finally {
      setUploading(false);
    }
  }

  function navItemClass(target: string) {
    const isActive = section === target;
    return [
      'flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition',
      isActive
        ? 'bg-slate-100 text-slate-900'
        : 'text-slate-700 hover:bg-slate-100',
    ].join(' ');
  }

  function renderContent() {
  if (loading) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        Caricamento dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 text-sm text-red-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Non risulta ancora nessuna richiesta collegata al tuo account.
        </p>
      </div>
    );
  }

  if (section === 'profile') {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Il mio profilo</h2>

        <p className="mt-2 text-sm text-slate-600">
          Qui puoi visualizzare i dati principali del tuo profilo e accedere all’area completa.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Nome e cognome</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.full_name || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.email || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Telefono</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.phone || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Paese</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.country || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Città</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.city || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Decision stage</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.decision_stage || '—'}</p>
          </div>
        </div>

        <a
          href="#/profile"
          className="mt-6 inline-flex rounded-2xl bg-[#103a52] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Vai al profilo completo
        </a>
      </div>
    );
  }

  if (section === 'documents') {
    return (
      <div id="documents" className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Documenti per partire</h2>

        <p className="mt-2 text-sm text-slate-600">
          Carica qui i documenti richiesti per proseguire con il percorso.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Preparazione documenti</h3>

          <p className="mt-2 text-sm text-slate-600">
            Se non hai ancora il passaporto, puoi richiederlo online dal portale ufficiale.
            Qui sotto trovi anche il link ai documenti necessari.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://passaportonline.poliziadistato.it/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#103a52] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Richiedi passaporto
            </a>

            <a
              href="https://www.poliziadistato.it/articolo/passaporto"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Documenti necessari
            </a>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Checklist preparazione
          </h3>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-slate-700">Ho un passaporto valido</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-slate-700">Ho controllato la scadenza del passaporto</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-slate-700">Ho preparato i documenti richiesti</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-slate-700">Ho salvato copie digitali dei documenti</span>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-slate-200 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">Passaporto</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading}
              onChange={(e) => handleUploadDocument(e, 'passport')}
              className="block w-full text-sm text-slate-600"
            />
          </label>

          <label className="block rounded-2xl border border-slate-200 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">Carta d'identità</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading}
              onChange={(e) => handleUploadDocument(e, 'id_card')}
              className="block w-full text-sm text-slate-600"
            />
          </label>

          <label className="block rounded-2xl border border-slate-200 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">Prova di residenza</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading}
              onChange={(e) => handleUploadDocument(e, 'proof_of_address')}
              className="block w-full text-sm text-slate-600"
            />
          </label>

          <label className="block rounded-2xl border border-slate-200 p-4">
            <span className="mb-2 block text-sm font-medium text-slate-700">Altro documento</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading}
              onChange={(e) => handleUploadDocument(e, 'other')}
              className="block w-full text-sm text-slate-600"
            />
          </label>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Documenti caricati
          </h3>

          {documents.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Nessun documento caricato.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-900">{doc.file_name}</p>
                  <p className="mt-1 text-xs text-slate-500">Tipo: {doc.document_type}</p>
                  <p className="mt-1 text-xs text-slate-500">Stato: {doc.status}</p>

                  {doc.admin_note ? (
                    <p className="mt-2 text-xs text-slate-600">
                      Nota admin: {doc.admin_note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Stato attuale</p>
        <p className="mt-2 text-xl font-semibold text-[#103a52]">
          {getStatusLabel(currentSession.status)}
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Data invio</p>
            <p className="mt-1 text-sm text-slate-700">{formatDate(currentSession.created_at)}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Formula</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.duration || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Paese</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.country || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Città</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.city || '—'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#103a52] p-6 text-white shadow-sm">
        <h2 className="text-lg font-semibold">Il tuo prossimo passo</h2>

        {currentSession.status === 'waiting_documents' ? (
          <p className="mt-2 text-sm text-white/90">
            Carica i documenti richiesti per proseguire con la verifica del tuo profilo.
          </p>
        ) : currentSession.status === 'contacted' ? (
          <p className="mt-2 text-sm text-white/90">
            Il team ti contatterà per fissare la call e accompagnarti nei prossimi passaggi.
          </p>
        ) : currentSession.status === 'documents_under_review' ? (
          <p className="mt-2 text-sm text-white/90">
            I tuoi documenti sono in revisione. Ti aggiorneremo non appena la verifica sarà completata.
          </p>
        ) : currentSession.status === 'qualified' || currentSession.status === 'approved' ? (
          <p className="mt-2 text-sm text-white/90">
            Il tuo percorso sta andando avanti. Controlla gli aggiornamenti e preparati ai prossimi step.
          </p>
        ) : (
          <p className="mt-2 text-sm text-white/90">
            La tua richiesta è stata ricevuta. Ti guideremo passo dopo passo all’interno del percorso Tunisia Gateway.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Riepilogo richiesta</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Nome e cognome</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.full_name}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.email}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Telefono</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.phone || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Quando vuoi partire</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.target_date || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Decision stage</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.decision_stage || '—'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Persone</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.travel_party || '—'}</p>
          </div>
        </div>

        {currentSession.notes ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Note</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.notes}</p>
          </div>
        ) : null}

        {currentSession.admin_notes ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Nota del team</p>
            <p className="mt-1 text-sm text-slate-700">{currentSession.admin_notes}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Avanzamento percorso</h2>

        <div className="mt-4 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  step.done ? 'bg-[#103a52] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {index + 1}
              </div>

              <p
                className={`text-sm ${
                  step.done ? 'font-medium text-slate-900' : 'text-slate-500'
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="https://wa.me/393000000000"
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex rounded-2xl bg-[#103a52] px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
      >
        Hai bisogno di supporto? Scrivici su WhatsApp
      </a>
    </>
  );
}

  return (
    <div className="min-h-screen bg-[#f7f2ea] p-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <div className="rounded-2xl bg-[#103a52] px-4 py-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Tunisia Gateway
            </p>
            <h2 className="mt-2 text-lg font-semibold">Area Cliente</h2>
            <p className="mt-2 text-sm text-white/80">
              Gestisci il tuo percorso, i documenti e il supporto.
            </p>
          </div>

          <nav className="mt-4 space-y-2">
            <a href="#/dashboard" className={navItemClass('overview')}>
              Dashboard
            </a>

            <a href="#/dashboard/profile" className={navItemClass('profile')}>
              Il mio profilo
            </a>

            <a
              href="#/dashboard/documents"
              className={navItemClass('documents')}
            >
              Documenti per partire
            </a>

            <a
              href="https://wa.me/393000000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Supporto
            </a>
          </nav>
        </aside>

        <div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Dashboard cliente
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                  Il tuo percorso Tunisia Gateway
                </h1>

                <p className="mt-2 text-slate-600">
                  Qui puoi vedere lo stato della tua richiesta, i documenti e i
                  prossimi passi.
                </p>
              </div>

              <button
                type="button"
                onClick={loadMySessions}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Aggiorna
              </button>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}