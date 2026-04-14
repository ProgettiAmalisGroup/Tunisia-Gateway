import { supabase } from "../lib/supabase";

const BUCKET_NAME = "documents";

export async function uploadDocumentFile(params: {
  userId: string;
  orientationSessionId: number;
  file: File;
}) {
  const { userId, orientationSessionId, file } = params;

  const safeFileName = file.name.replace(/\s+/g, "-");
  const filePath = `${userId}/${orientationSessionId}/${Date.now()}-${safeFileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: false,
    });

  if (error) {
    console.error("Errore upload file:", error);
    throw error;
  }

  return {
    filePath,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export async function createDocumentRecord(payload: {
  orientation_session_id: number;
  user_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size?: number | null;
  mime_type?: string | null;
}) {
  const { data, error } = await supabase
    .from("application_documents")
    .insert([
      {
        orientation_session_id: payload.orientation_session_id,
        user_id: payload.user_id,
        document_type: payload.document_type,
        file_name: payload.file_name,
        file_path: payload.file_path,
        file_size: payload.file_size ?? null,
        mime_type: payload.mime_type ?? null,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Errore createDocumentRecord:", error);
    throw error;
  }

  return data;
}

export async function getDocumentsBySessionId(orientationSessionId: number) {
  const { data, error } = await supabase
    .from("application_documents")
    .select("*")
    .eq("orientation_session_id", orientationSessionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore getDocumentsBySessionId:", error);
    throw error;
  }

  return data ?? [];
}