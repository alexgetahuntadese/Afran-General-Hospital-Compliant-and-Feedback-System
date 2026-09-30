export type SubmissionKind = 'complaint' | 'feedback' | 'compliment';

export type SubmissionStatus = 'received' | 'in_review' | 'resolved';

export interface CaseSubmission {
  id: string; // e.g. "AGH-7K2P9Q"
  reference: string; // alias for id
  kind: SubmissionKind;
  department: string;
  subject: string;
  message: string;
  rating: number; // 0 to 5
  anonymous: boolean;
  name?: string;
  email?: string;
  phone?: string;
  status: SubmissionStatus;
  submittedAt: string;
  updatedAt: string;
  response?: string;
  respondedAt?: string;
}

export interface StaffUser {
  email: string;
  name: string;
  role: 'admin' | 'staff';
  addedAt: string;
}
