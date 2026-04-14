import { supabase } from '../lib/supabase';
import type {
  OrientationSession,
  OrientationSessionStatus,
} from '../types/database';

// Prende TUTTE le sessioni (solo admin può farlo)
export async function getAllOrientationSessions(): Promise<OrientationSession[]> {
  const { data, error } = await supabase
    .from('orientation_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore getAllOrientationSessions:', error);
    throw error;
  }

  return (data ?? []) as OrientationSession[];
}

// Prende solo le sessioni dell'utente loggato
export async function getMyOrientationSessions(): Promise<OrientationSession[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Errore getUser:', userError);
    throw userError;
  }

  if (!user) return [];

  const { data, error } = await supabase
    .from('orientation_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore getMyOrientationSessions:', error);
    throw error;
  }

  return (data ?? []) as OrientationSession[];
}

// Aggiorna stato/admin fields
export async function updateOrientationSessionAdminFields(
  id: number,
  payload: {
    status?: OrientationSessionStatus;
    admin_notes?: string | null;
  }
): Promise<OrientationSession | null> {
  const { data, error } = await supabase
    .from('orientation_sessions')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Errore updateOrientationSession:', error);
    throw error;
  }

  return data as OrientationSession | null;
}