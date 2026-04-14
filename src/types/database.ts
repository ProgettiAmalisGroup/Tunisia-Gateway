export type OrientationSessionStatus =
  | 'new'
  | 'in_review'
  | 'contacted'
  | 'waiting_documents'
  | 'documents_under_review'
  | 'qualified'
  | 'approved'
  | 'rejected';

export interface OrientationSession {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  duration: string | null;
  target_date: string | null;
  notes: string | null;
  status: OrientationSessionStatus;
  payment_status: string | null;
  source: string | null;
  user_id: string | null;
  decision_stage: string | null;
  travel_party: string | null;
  admin_notes: string | null;
  priority: string;
  assigned_to: string | null;
  assigned_at: string | null;
  last_contact_at: string | null;
  updated_at: string | null;
}