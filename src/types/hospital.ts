export type SubmissionKind = 'complaint' | 'feedback' | 'compliment';

export type SubmissionStatus = 'received' | 'in_review' | 'resolved';
export type StaffRole = 'superadmin' | 'customer_service_manager' | 'staff' | 'department_head' | 'ceo';
export type QuestionnaireAnswers = Record<string, number>;

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
  escalated?: boolean;
  submittedAt: string;
  updatedAt: string;
  response?: string;
  respondedAt?: string;
  questionnaireVersion?: string;
  questionnaireAnswers?: QuestionnaireAnswers;
  audioPath?: string;
  departmentHeadChecked?: boolean;
  departmentHeadCheckedAt?: string;
}

export interface StaffUser {
  username: string;
  name: string;
  role: StaffRole;
  department?: string;
  isActive: boolean;
  addedAt: string;
}

export type StaffAccountAction =
  | {
    action: 'update';
    username: string;
    fullName: string;
    newUsername: string;
    role: StaffRole;
    department?: string;
  }
  | { action: 'reset_password'; username: string; password: string }
  | { action: 'set_active'; username: string; isActive: boolean }
  | { action: 'delete'; username: string };
