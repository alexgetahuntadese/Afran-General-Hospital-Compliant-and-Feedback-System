import { CaseSubmission, StaffUser, SubmissionKind, SubmissionStatus, StaffRole } from '../types/hospital';
import { supabase } from './supabase';

interface CaseRow {
  id: string;
  reference: string;
  kind: SubmissionKind;
  department: string;
  subject: string;
  message: string;
  rating: number;
  anonymous: boolean;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: SubmissionStatus;
  escalated: boolean;
  submitted_at: string;
  updated_at: string;
  response: string | null;
  responded_at: string | null;
  questionnaire_version: string | null;
  questionnaire_answers: Record<string, number> | null;
  audio_path: string | null;
}

interface StaffProfileRow {
  id: string;
  username: string;
  full_name: string;
  role: StaffRole;
  department: string | null;
  created_at: string;
}

type PublicCaseRow = Omit<CaseRow, 'name' | 'email' | 'phone' | 'escalated' | 'questionnaire_version' | 'questionnaire_answers' | 'audio_path'>;

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

function mapCaseRow(row: CaseRow | PublicCaseRow): CaseSubmission {
  return {
    id: row.id,
    reference: row.reference,
    kind: row.kind,
    department: row.department,
    subject: row.subject,
    message: row.message,
    rating: row.rating,
    anonymous: row.anonymous,
    name: 'name' in row ? row.name ?? undefined : undefined,
    email: 'email' in row ? row.email ?? undefined : undefined,
    phone: 'phone' in row ? row.phone ?? undefined : undefined,
    status: row.status,
    escalated: 'escalated' in row ? row.escalated : undefined,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
    response: row.response ?? undefined,
    respondedAt: row.responded_at ?? undefined,
    questionnaireVersion: 'questionnaire_version' in row ? row.questionnaire_version ?? undefined : undefined,
    questionnaireAnswers: 'questionnaire_answers' in row && row.questionnaire_answers && Object.keys(row.questionnaire_answers).length > 0
      ? row.questionnaire_answers
      : undefined,
    audioPath: 'audio_path' in row ? row.audio_path ?? undefined : undefined,
  };
}

function mapStaffProfile(row: StaffProfileRow): StaffUser {
  return {
    username: row.username,
    name: row.full_name,
    role: row.role,
    department: row.department ?? undefined,
    addedAt: row.created_at,
  };
}

export async function getCases(): Promise<CaseSubmission[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('feedback_cases')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data as CaseRow[]).map(mapCaseRow);
}

export async function createCase(newCase: CaseSubmission): Promise<void> {
  const client = requireSupabase();
  const caseRow = {
    id: newCase.id,
    reference: newCase.reference,
    kind: newCase.kind,
    department: newCase.department,
    subject: newCase.subject,
    message: newCase.message,
    rating: newCase.rating,
    anonymous: newCase.anonymous,
    name: newCase.name ?? null,
    email: newCase.email ?? null,
    phone: newCase.phone ?? null,
    status: newCase.status,
    escalated: false,
    questionnaire_version: newCase.questionnaireVersion ?? null,
    questionnaire_answers: newCase.questionnaireAnswers ?? {},
    submitted_at: newCase.submittedAt,
    updated_at: newCase.updatedAt,
  };
  const { error } = await client.from('feedback_cases').insert({
    ...caseRow,
    ...(newCase.audioPath ? { audio_path: newCase.audioPath } : {}),
  });
  if (error) throw error;
}

export async function uploadComplaintAudio(reference: string, audio: Blob): Promise<string> {
  const client = requireSupabase();
  const extensionByType: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mp4': 'mp4',
    'audio/wav': 'wav',
  };
  const mediaType = audio.type.split(';')[0].toLowerCase();
  const extension = extensionByType[mediaType];
  if (!extension) {
    throw new Error('This browser produced an unsupported audio format. Please record again using a supported browser.');
  }

  const path = `${reference}/complaint.${extension}`;
  const { error } = await client.storage
    .from('complaint-audio')
    .upload(path, audio, { contentType: mediaType, upsert: false });
  if (error) throw error;
  return path;
}

export async function removeUnlinkedComplaintAudio(path: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.storage.from('complaint-audio').remove([path]);
  if (error) throw error;
}

export async function getComplaintAudioUrl(path: string): Promise<string> {
  const client = requireSupabase();
  const { data, error } = await client.storage
    .from('complaint-audio')
    .createSignedUrl(path, 15 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function updateCase(updatedCase: CaseSubmission): Promise<void> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('feedback_cases')
    .update({
      status: updatedCase.status,
      escalated: Boolean(updatedCase.escalated),
      response: updatedCase.response ?? null,
      responded_at: updatedCase.respondedAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', updatedCase.id)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This account is not allowed to update this case.');
}

export async function getCaseByReference(reference: string): Promise<CaseSubmission | null> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('track_case_by_reference', {
    lookup_reference: reference.trim().toUpperCase(),
  });
  if (error) throw error;
  const rows = data as PublicCaseRow[];
  return rows.length ? mapCaseRow(rows[0]) : null;
}

export async function getCurrentUserProfile(userId: string): Promise<StaffUser | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('staff_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapStaffProfile(data as StaffProfileRow) : null;
}

export async function getStaffProfiles(): Promise<StaffUser[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('staff_profiles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as StaffProfileRow[]).map(mapStaffProfile);
}

export async function updateStaffProfile(username: string, role: StaffRole, department?: string): Promise<void> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('staff_profiles')
    .update({
      role,
      department: role === 'department_head' ? department ?? null : null,
    })
    .eq('username', username.trim().toLowerCase())
    .select('id')
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This account is not allowed to manage staff roles.');
}

export async function createStaffAccount(input: {
  username: string;
  fullName: string;
  password: string;
  role: StaffRole;
  department?: string;
}): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.functions.invoke('create-staff-account', {
    body: {
      username: input.username.trim().toLowerCase(),
      fullName: input.fullName.trim(),
      password: input.password,
      role: input.role,
      department: input.role === 'department_head' ? input.department?.trim() : undefined,
    },
  });
  if (error) {
    if (error.name === 'FunctionsHttpError' && error.context instanceof Response) {
      const responseBody: unknown = await error.context.clone().json().catch(() => null);
      if (
        typeof responseBody === 'object'
        && responseBody !== null
        && 'error' in responseBody
        && typeof responseBody.error === 'string'
      ) {
        throw new Error(responseBody.error);
      }
    }
    throw error;
  }
}
