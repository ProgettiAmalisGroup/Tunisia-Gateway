import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllOrientationSessions,
  updateOrientationSessionAdminFields,
} from './services/orientationSessions';
import type {
  OrientationSession,
  OrientationSessionStatus,
} from './types/database';

const STATUS_OPTIONS: OrientationSessionStatus[] = [
  'new',
  'in_review',
  'contacted',
  'waiting_documents',
  'documents_under_review',
  'qualified',
  'approved',
  'rejected',
];

const STATUS_LABELS: Record<OrientationSessionStatus, string> = {
  new: 'Nuovo',
  in_review: 'In revisione',
  contacted: 'Contattato',
  waiting_documents: 'In attesa documenti',
  documents_under_review: 'Documenti in revisione',
  qualified: 'Qualificato',
  approved: 'Approvato',
  rejected: 'Rifiutato',
};

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

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<OrientationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadSessions() {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllOrientationSessions();
      setSessions(data);
    } catch (err) {
      console.error('Errore caricamento sessioni admin:', err);
      setError('Non sono riuscito a caricare le richieste.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  const stats = useMemo(() => {
    return {
      total: sessions.length,
      newCount: sessions.filter((s) => s.status === 'new').length,
      inReviewCount: sessions.filter(
        (s) =>
          s.status === 'in_review' || s.status === 'documents_under_review'
      ).length,
      approvedCount: sessions.filter((s) => s.status === 'approved').length,
    };
  }, [sessions]);

  async function handleStatusChange(
    sessionId: number,
    status: OrientationSessionStatus
  ) {
    try {
      setUpdatingId(sessionId);

      const updated = await updateOrientationSessionAdminFields(sessionId, {
        status,
      });

      if (!updated) return;

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId ? updated : session
        )
      );
    } catch (err) {
      console.error('Errore aggiornamento stato:', err);
      alert('Non sono riuscito ad aggiornare lo stato.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard Admin
            </h1>
            <p className="mt-2 text-slate-600">
              Qui gestisci richieste, stati pratica e prossimi passi.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadSessions}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Aggiorna
            </button>

            <button
  type="button"
  onClick={() => {
    window.location.hash = '/';
  }}
  className="rounded-2xl bg-[#103a52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3145]"
>
  Torna alla landing
</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Lead totali</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Nuovi</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.newCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">In lavorazione</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.inReviewCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approvati</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.approvedCount}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 text-sm text-slate-500">
              Caricamento richieste...
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              Nessuna richiesta trovata.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-slate-100 text-sm text-slate-600">
                  <tr>
                    <th className="px-5 py-3">Nome</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Telefono</th>
                    <th className="px-5 py-3">Paese</th>
                    <th className="px-5 py-3">Città</th>
                    <th className="px-5 py-3">Durata</th>
                    <th className="px-5 py-3">Decisione</th>
                    <th className="px-5 py-3">Persone</th>
                    <th className="px-5 py-3">Data invio</th>
                    <th className="px-5 py-3">Stato</th>
                  </tr>
                </thead>

                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-t align-top">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {session.full_name}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.email || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.phone || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.country || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.city || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.duration || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.decision_stage || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {session.travel_party || '—'}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(session.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={session.status}
                          disabled={updatingId === session.id}
                          onChange={(e) =>
                            handleStatusChange(
                              session.id,
                              e.target.value as OrientationSessionStatus
                            )
                          }
                          className="min-w-[210px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-60"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>

                        {session.notes ? (
                          <p className="mt-2 max-w-[260px] text-xs text-slate-500">
                            Note cliente: {session.notes}
                          </p>
                        ) : null}

                        {session.admin_notes ? (
                          <p className="mt-1 max-w-[260px] text-xs text-slate-500">
                            Note admin: {session.admin_notes}
                          </p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}