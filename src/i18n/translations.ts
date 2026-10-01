export type Language = 'en' | 'am';

export interface CloneTranslations {
  emergencyBanner: string;
  hospitalName: string;
  patientRelations: string;
  navSubmit: string;
  navTrack: string;
  navStaffLogin: string;
  navStaff: string;
  navSignOut: string;
  
  heroTitle: string;
  heroSubtitle: string;
  
  kindComplaint: string;
  kindSuggestion: string;
  kindCompliment: string;
  kindFeedback: string;
  
  chooseDept: string;
  overallExperience: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitAnonymously: string;
  anonymousNote: string;
  confidentialityNote: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  submitButton: string;
  submitting: string;
  
  thankYouTitle: string;
  keepRefNotice: string;
  trackThisCase: string;
  submitAnother: string;
  
  trackHeading: string;
  trackPlaceholder: string;
  trackButton: string;
  noCaseFound: string;
  checkRefAgain: string;
  responseFromPR: string;
  awaitingResponse: string;
  submittedAnonymously: string;
  statusReceived: string;
  statusInReview: string;
  statusResolved: string;
  
  caseDashboard: string;
  staffSignIn: string;
  staffSignInDesc: string;
  staffUsernamePlaceholder: string;
  signInBtn: string;
  signingIn: string;
  passwordSignIn: string;
  managerProvisionNote: string;
  saving: string;
  searching: string;
  roleStaff: string;
  roleDepartmentHead: string;
  roleCeo: string;
  managerScope: string;
  ceoScope: string;
  staffScope: string;
  escalated: string;
  markEscalated: string;
  filterAll: string;
  filterReceived: string;
  filterInReview: string;
  filterResolved: string;
  searchCasesPlaceholder: string;
  noCasesHere: string;
  newSubmissionsAuto: string;
  reviewCase: string;
  close: string;
  saveChanges: string;
  responseVisibleNote: string;
  statusLabel: string;
  staffAccessTitle: string;
  staffAccessDesc: string;

  // Analytics summary dashboard
  summaryDashboard: string;
  categoriesDistribution: string;
  statusDistribution: string;
  resolutionRate: string;
  avgRating: string;
  anonymousRate: string;
  totalCases: string;
  showCharts: string;
  hideCharts: string;
}

export const translations: Record<Language, CloneTranslations> = {
  en: {
    emergencyBanner: 'For medical emergencies, go to the Emergency Department immediately.',
    hospitalName: 'Afran General Hospital',
    patientRelations: 'Patient Relations',
    navSubmit: 'Submit',
    navTrack: 'Track',
    navStaffLogin: 'Staff login',
    navStaff: 'Staff',
    navSignOut: 'Sign out',
    
    heroTitle: 'Your voice helps us care better.',
    heroSubtitle: 'Share a complaint, suggestion or compliment about your visit to Afran General Hospital. Every submission is read by our Patient Relations team.',
    
    kindComplaint: 'Complaint',
    kindSuggestion: 'Suggestion',
    kindCompliment: 'Compliment',
    kindFeedback: 'Feedback',
    
    chooseDept: 'Choose a department',
    overallExperience: 'Overall experience (optional)',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Add a short subject',
    messageLabel: 'Tell us what happened',
    messagePlaceholder: 'Please add a bit more detail...',
    submitAnonymously: 'Submit anonymously',
    anonymousNote: 'We will not store your contact details.',
    confidentialityNote: 'Handled with confidentiality and care.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    submitButton: 'Submit',
    submitting: 'Submitting...',
    
    thankYouTitle: 'Thank you. We have received it.',
    keepRefNotice: 'Keep this reference number to check progress:',
    trackThisCase: 'Track this case',
    submitAnother: 'Submit another',
    
    trackHeading: 'Track your case',
    trackPlaceholder: 'AGH-7K2P9Q',
    trackButton: 'Track',
    noCaseFound: 'No case found',
    checkRefAgain: 'Check the reference number and try again.',
    responseFromPR: 'Response from Patient Relations',
    awaitingResponse: 'Our Patient Relations team is reviewing your submission. Updates will appear here.',
    submittedAnonymously: 'Submitted anonymously',
    statusReceived: 'Received',
    statusInReview: 'Under review',
    statusResolved: 'Resolved',
    
    caseDashboard: 'Case dashboard',
    staffSignIn: 'Staff sign in',
    staffSignInDesc: 'Sign in with your staff account to review cases.',
    staffUsernamePlaceholder: 'username@afran.com',
    signInBtn: 'Sign in',
    signingIn: 'Signing in...',
    passwordSignIn: 'Sign in with your assigned username and password.',
    managerProvisionNote: 'Only accounts created by a superadmin can access staff cases.',
    saving: 'Saving...',
    searching: 'Searching...',
    roleStaff: 'Patient Relations staff',
    roleDepartmentHead: 'Department head',
    roleCeo: 'CEO',
    managerScope: 'Customer Service Manager · full access to all cases',
    ceoScope: 'Showing escalated issues only',
    staffScope: 'No case access assigned',
    escalated: 'Escalated',
    markEscalated: 'Escalate this issue for CEO review',
    filterAll: 'All',
    filterReceived: 'Received',
    filterInReview: 'Under review',
    filterResolved: 'Resolved',
    searchCasesPlaceholder: 'Search cases...',
    noCasesHere: 'No cases here',
    newSubmissionsAuto: 'New submissions will appear here automatically.',
    reviewCase: 'Review case',
    close: 'Close',
    saveChanges: 'Save changes',
    responseVisibleNote: 'Response (visible to the person on the tracking page)',
    statusLabel: 'Status',
    staffAccessTitle: 'Staff access',
    staffAccessDesc: 'Superadmins can create staff accounts and assign each person a role and (for department heads) department.',

    summaryDashboard: 'Analytics & Trends',
    categoriesDistribution: 'Feedback Categories Distribution',
    statusDistribution: 'Case Status Distribution',
    resolutionRate: 'Resolution Rate',
    avgRating: 'Average Rating',
    anonymousRate: 'Anonymous',
    totalCases: 'Total Cases',
    showCharts: 'Show Analytics',
    hideCharts: 'Hide Analytics',
  },
  am: {
    emergencyBanner: 'ለአስቸኳይ የህክምና ድንገተኛ አደጋ፣ ወዲያውኑ ወደ ድንገተኛ ክፍል ይሂዱ።',
    hospitalName: 'አፍራን አጠቃላይ ሆስፒታል',
    patientRelations: 'የታካሚዎች ተሞክሮ',
    navSubmit: 'ቅሬታ/አስተያየት',
    navTrack: 'ጉዳይ መከታተያ',
    navStaffLogin: 'የሰራተኞች መግቢያ',
    navStaff: 'የስራ አመራር',
    navSignOut: 'ውጣ',
    
    heroTitle: 'የእርስዎ ድምፅ የተሻለ ህክምና እንድንሰጥ ይረዳናል።',
    heroSubtitle: 'ስለ አፍራን አጠቃላይ ሆስፒታል ቆይታዎ ቅሬታ፣ የማሻሻያ ሀሳብ ወይም ምስጋና ያጋሩን። እያንዳንዱ ማመልከቻ በታካሚዎች ተሞክሮ ቡድናችን በጥንቃቄ ይነበባል።',
    
    kindComplaint: 'ቅሬታ',
    kindSuggestion: 'የማሻሻያ ሀሳብ',
    kindCompliment: 'ምስጋና',
    kindFeedback: 'አስተያየት',
    
    chooseDept: 'የሆስፒታሉን ክፍል ይምረጡ',
    overallExperience: 'አጠቃላይ ተሞክሮ (አማራጭ)',
    subjectLabel: 'ርዕስ',
    subjectPlaceholder: 'አጭር ርዕስ ያስገቡ',
    messageLabel: 'የተከሰተውን ሁኔታ ያብራሩልን',
    messagePlaceholder: 'እባክዎ የተወሰነ ዝርዝር ማብራሪያ ይጻፉ...',
    submitAnonymously: 'በሚስጥር (ያለ ስም) አቅርብ',
    anonymousNote: 'የእርስዎን የእውቂያ መረጃ አናስቀምጥም።',
    confidentialityNote: 'በሚስጥራዊነትና በጥንቃቄ ይካሄዳል።',
    nameLabel: 'ስም',
    emailLabel: 'ኢሜይል',
    phoneLabel: 'ስልክ ቁጥር',
    submitButton: 'አስገባ',
    submitting: 'በመላክ ላይ...',
    
    thankYouTitle: 'እናመሰግናለን። ማመልከቻዎ ደርሶናል።',
    keepRefNotice: 'የጉዳይዎን ሂደት ለመከታተል ይህንን መለያ ቁጥር ይያዙ:',
    trackThisCase: 'ይህንን ጉዳይ ተከታተል',
    submitAnother: 'ሌላ ማመልከቻ አስገባ',
    
    trackHeading: 'ጉዳይዎን ይከታተሉ',
    trackPlaceholder: 'AGH-7K2P9Q',
    trackButton: 'ፈልግ',
    noCaseFound: 'ጉዳዩ አልተገኘም',
    checkRefAgain: 'እባክዎ የመለያ ቁጥሩን አረጋግጠው በድጋሚ ይሞክሩ።',
    responseFromPR: 'ከታካሚዎች ተሞክሮ የተሰጠ ይፋዊ ምላሽ',
    awaitingResponse: 'የታካሚዎች ተሞክሮ ቡድናችን ማመልከቻዎን እየተመለከተው ነው። ምላሹ እዚህ ይለጠፋል።',
    submittedAnonymously: 'ማንነት ሳይገለጽ የቀረበ',
    statusReceived: 'ደርሷል',
    statusInReview: 'በማጣራት ላይ',
    statusResolved: 'ተፈትቷል',
    
    caseDashboard: 'የጉዳዮች ዳሽቦርድ',
    staffSignIn: 'የሰራተኞች መግቢያ',
    staffSignInDesc: 'ጉዳዮችን ለመገምገም በሰራተኛ መለያዎ ይግቡ።',
    staffUsernamePlaceholder: 'username@afran.com',
    signInBtn: 'ግባ',
    signingIn: 'በመግባት ላይ...',
    passwordSignIn: 'በተመደበልዎት የተጠቃሚ ስምና የይለፍ ቃል ይግቡ።',
    managerProvisionNote: 'በሱፐር አስተዳዳሪ የተፈጠሩ መለያዎች ብቻ የሰራተኛ ጉዳዮችን ማየት ይችላሉ።',
    saving: 'በማስቀመጥ ላይ...',
    searching: 'በመፈለግ ላይ...',
    roleStaff: 'የታካሚ ግንኙነት ሰራተኛ',
    roleDepartmentHead: 'የክፍል ኃላፊ',
    roleCeo: 'ዋና ሥራ አስፈጻሚ',
    managerScope: 'የደንበኛ አገልግሎት አስተዳዳሪ · ሁሉንም ጉዳዮች የማየት ፈቃድ',
    ceoScope: 'የተላለፉ ጉዳዮች ብቻ እየታዩ ነው',
    staffScope: 'የጉዳይ መዳረሻ አልተመደበም',
    escalated: 'የተላለፈ',
    markEscalated: 'ለዋና ሥራ አስፈጻሚ ግምገማ ይህን ጉዳይ አስተላልፍ',
    filterAll: 'ሁሉም',
    filterReceived: 'የደረሱ',
    filterInReview: 'በማጣራት ላይ',
    filterResolved: 'የተፈቱ',
    searchCasesPlaceholder: 'ጉዳዮችን ፈልግ...',
    noCasesHere: 'እዚህ ምንም ጉዳይ የለም',
    newSubmissionsAuto: 'አዳዲስ ማመልከቻዎች እዚህ በራሳቸው ይመጣሉ።',
    reviewCase: 'ጉዳዩን መርምር',
    close: 'ዝጋ',
    saveChanges: 'ለውጦችን መዝግብ',
    responseVisibleNote: 'ምላሽ (በመከታተያ ገጹ ላይ ለተገልጋዩ የሚታይ)',
    statusLabel: 'ሁኔታ',
    staffAccessTitle: 'የሰራተኞች ፈቃድ',
    staffAccessDesc: 'በSupabase Auth የሰራተኛ መለያ ይፍጠሩ፤ ከዚያም በstaff_profiles ሰንጠረዥ ውስጥ ሚናና የክፍል ኃላፊ ክፍል ይመድቡ።',

    summaryDashboard: 'ትንታኔ እና የሂደት መረጃ',
    categoriesDistribution: 'የአስተያየት አይነቶች ስርጭት',
    statusDistribution: 'የጉዳዮች ሁኔታ ስርጭት',
    resolutionRate: 'የመፍትሄ ምጣኔ',
    avgRating: 'አማካይ ደረጃ',
    anonymousRate: 'ማንነት ያልተገለጸበት',
    totalCases: 'አጠቃላይ ጉዳዮች',
    showCharts: 'ትንታኔ አሳይ',
    hideCharts: 'ትንታኔ ደብቅ',
  }
};
