import { CaseSubmission, StaffUser } from '../types/hospital';

export const DEPARTMENTS = [
  'Emergency',
  'Outpatient (OPD)',
  'Maternity',
  'Pediatrics',
  'Surgery',
  'Laboratory',
  'Pharmacy',
  'Radiology',
  'Billing & Records',
  'Reception & Security',
  'Cleanliness & Facilities'
];

export const DEPARTMENTS_AM: Record<string, string> = {
  'Emergency': 'ድንገተኛ ክፍል (Emergency)',
  'Outpatient (OPD)': 'የተመላላሽ ክሊኒክ (OPD)',
  'Maternity': 'የእናቶችና ወሊድ ህክምና (Maternity)',
  'Pediatrics': 'የህፃናት ህክምና (Pediatrics)',
  'Surgery': 'የቀዶ ጥገና ክፍል (Surgery)',
  'Laboratory': 'ላቦራቶሪ (Laboratory)',
  'Pharmacy': 'መድኃኒት ቤት (Pharmacy)',
  'Radiology': 'ራጅና አልትራሳውንድ (Radiology)',
  'Billing & Records': 'ክፍያና ካርድ ክፍል (Billing & Records)',
  'Reception & Security': 'መስተንግዶና ጥበቃ (Reception & Security)',
  'Cleanliness & Facilities': 'ፅዳትና መስተንግዶ (Cleanliness & Facilities)'
};

export const INITIAL_CASES: CaseSubmission[] = [
  {
    id: 'AGH-7K2P9Q',
    reference: 'AGH-7K2P9Q',
    kind: 'complaint',
    department: 'Emergency',
    subject: 'Long wait time in emergency triage on Sunday evening',
    message: 'Waited over 80 minutes in the triage area with my elderly father who had acute abdominal distress before a nurse took vital signs. The medical doctor was very thorough and kind once seen, but the initial waiting desk triage protocol was delayed.',
    rating: 2,
    anonymous: false,
    name: 'Alemayehu Tadesse',
    email: 'alemayehu.t@example.com',
    phone: '+251 91 123 4567',
    status: 'in_review',
    submittedAt: '2026-09-28T18:30:00Z',
    updatedAt: '2026-09-29T10:15:00Z',
    response: 'Thank you for sharing your experience. Our Chief Medical Officer and Emergency Triage Lead are reviewing the staffing handover log for Sunday evening to reduce triage wait times during intake surges.',
    respondedAt: '2026-09-29T10:15:00Z'
  },
  {
    id: 'AGH-3M8N4X',
    reference: 'AGH-3M8N4X',
    kind: 'compliment',
    department: 'Maternity',
    subject: 'Heartfelt thanks to Midwife Bethelhem and Dr. Solomon',
    message: 'Delivered our baby daughter safely on Tuesday night. Midwife Bethelhem was exceptionally gentle, reassuring, and professional during labor. Our entire family is grateful for the compassionate and dignified care.',
    rating: 5,
    anonymous: false,
    name: 'Selamawit & Dawit',
    email: 'selamawit@example.com',
    phone: '+251 92 112 2334',
    status: 'resolved',
    submittedAt: '2026-09-25T14:20:00Z',
    updatedAt: '2026-09-26T09:00:00Z',
    response: 'Congratulations on the birth of your daughter! Your kind commendation has been passed directly to Midwife Bethelhem and Dr. Solomon, and formally entered in their recognition records.',
    respondedAt: '2026-09-26T09:00:00Z'
  },
  {
    id: 'AGH-9W1C5L',
    reference: 'AGH-9W1C5L',
    kind: 'feedback',
    department: 'Pharmacy',
    subject: 'Separate priority counter for elderly patients and chronic medication refills',
    message: 'Having a dedicated dispensary window for elderly patients picking up monthly hypertension and diabetes medications would reduce congestion and prevent long standing times for seniors.',
    rating: 4,
    anonymous: true,
    status: 'received',
    submittedAt: '2026-09-29T11:45:00Z',
    updatedAt: '2026-09-29T11:45:00Z'
  },
  {
    id: 'AGH-4X8R2P',
    reference: 'AGH-4X8R2P',
    kind: 'complaint',
    department: 'Billing & Records',
    subject: 'Duplicate ultrasound fee on discharge statement',
    message: 'Inpatient billing statement showed two charges for abdominal ultrasound on consecutive days, but procedure was conducted only once because the doctor discontinued the second scan. Cashier requested full settlement before clearance.',
    rating: 2,
    anonymous: false,
    name: 'Yohannes Bekele',
    email: 'yohannes.b@example.com',
    phone: '+251 94 456 7890',
    status: 'resolved',
    submittedAt: '2026-09-24T16:10:00Z',
    updatedAt: '2026-09-25T15:30:00Z',
    response: 'We have investigated the billing ledger and confirmed the duplicate ultrasound order. A full refund of ETB 1,850 has been processed to your bank account. We sincerely apologize for the delay during discharge.',
    respondedAt: '2026-09-25T15:30:00Z'
  },
  {
    id: 'AGH-6P2K7T',
    reference: 'AGH-6P2K7T',
    kind: 'feedback',
    department: 'Cleanliness & Facilities',
    subject: 'Add tactile floor markings and handrail on Gate 3 ramp',
    message: 'The wheelchair access ramp at Outpatient Gate 3 is slippery when wet and lacks continuous handrails on both sides. Adding non-slip tactile rubber strips would make it safer for wheelchair users and crutch users.',
    rating: 3,
    anonymous: true,
    status: 'in_review',
    submittedAt: '2026-09-29T16:00:00Z',
    updatedAt: '2026-09-30T08:00:00Z',
    response: 'Our Facilities and Environmental Safety team inspected Gate 3 this morning. Anti-slip tape installation and secondary handrail fabrication are scheduled for this weekend.',
    respondedAt: '2026-09-30T08:00:00Z'
  }
];

export const INITIAL_STAFF: StaffUser[] = [
  {
    email: 'admin@afranhospital.com',
    name: 'Patient Relations Lead',
    role: 'admin',
    addedAt: '2026-01-15T08:00:00Z'
  },
  {
    email: 'colleague@afranhospital.com',
    name: 'Quality Assurance Officer',
    role: 'staff',
    addedAt: '2026-02-01T09:30:00Z'
  }
];
