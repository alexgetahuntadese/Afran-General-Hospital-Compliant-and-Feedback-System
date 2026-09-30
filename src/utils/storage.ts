import { CaseSubmission, StaffUser } from '../types/hospital';
import { INITIAL_CASES, INITIAL_STAFF } from '../data/seedData';

const CASES_STORAGE_KEY = 'afran_cases_v2';
const STAFF_STORAGE_KEY = 'afran_staff_v2';
const CURRENT_USER_KEY = 'afran_auth_user_v2';

export function getStoredCases(): CaseSubmission[] {
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading cases', e);
    return INITIAL_CASES;
  }
}

export function saveCases(cases: CaseSubmission[]): void {
  try {
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error('Failed saving cases', e);
  }
}

export function getCaseByReference(ref: string): CaseSubmission | undefined {
  const cases = getStoredCases();
  const normalized = ref.trim().toUpperCase();
  return cases.find(c => c.reference.toUpperCase() === normalized || c.id.toUpperCase() === normalized);
}

export function addCase(newCase: CaseSubmission): void {
  const cases = getStoredCases();
  const updated = [newCase, ...cases];
  saveCases(updated);
}

export function updateCase(updatedCase: CaseSubmission): void {
  const cases = getStoredCases();
  const index = cases.findIndex(c => c.id === updatedCase.id);
  if (index !== -1) {
    cases[index] = {
      ...updatedCase,
      updatedAt: new Date().toISOString()
    };
    saveCases(cases);
  }
}

export function getStoredStaff(): StaffUser[] {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_STAFF;
  }
}

export function addStaff(user: StaffUser): void {
  const list = getStoredStaff();
  if (!list.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    const updated = [...list, user];
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
  }
}

export function getCurrentUser(): StaffUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StaffUser | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function resetDemoData(): void {
  localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(INITIAL_CASES));
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
}
