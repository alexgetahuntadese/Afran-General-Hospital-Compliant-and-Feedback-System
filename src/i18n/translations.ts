export type Language = 'en' | 'am' | 'om';

export interface CloneTranslations {
  emergencyBanner: string;
  hospitalName: string;
  splashLocation: string;
  patientRelations: string;
  navSubmit: string;
  navTrack: string;
  navStaffLogin: string;
  navStaff: string;
  navSignOut: string;
  switchToEnglish: string;
  switchToAmharic: string;
  switchToOromo: string;
  wizardStepType: string;
  wizardStepDetails: string;
  wizardStepMessage: string;
  wizardStepReview: string;
  wizardStepProgress: string;
  wizardContinue: string;
  wizardBack: string;
  wizardReviewKind: string;
  wizardReviewDepartment: string;
  wizardReviewMessage: string;
  wizardReviewContact: string;
  wizardAnonymous: string;
  wizardNoMessage: string;
  
  heroTitle: string;
  heroSubtitle: string;
  
  kindComplaint: string;
  kindComplaintDescription: string;
  kindSuggestion: string;
  kindCompliment: string;
  kindFeedback: string;
  kindFeedbackDescription: string;
  
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
  staffPassword: string;
  signInBtn: string;
  signingIn: string;
  passwordSignIn: string;
  managerProvisionNote: string;
  saving: string;
  searching: string;
  roleStaff: string;
  roleSuperadmin: string;
  roleCustomerServiceManager: string;
  roleDepartmentHead: string;
  roleCeo: string;
  managerScope: string;
  departmentHeadScope: string;
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
  staffDepartmentAccessNote: string;
  staffAccessCreateTab: string;
  staffAccessDirectoryTab: string;
  staffAccessManagerDesc: string;
  staffCreateAccount: string;
  staffFullName: string;
  staffUsername: string;
  staffInitialPassword: string;
  staffPasswordMinLength: string;
  staffConfirmPassword: string;
  staffConfirmPasswordHint: string;
  staffPasswordShareNote: string;
  staffRoleLabel: string;
  staffDepartmentLabel: string;
  staffCreatingAccount: string;
  staffCreateAccountButton: string;
  staffDirectoryTitle: string;
  staffEnterNameUsername: string;
  staffInvalidUsername: string;
  staffPasswordTooShort: string;
  staffPasswordsMismatch: string;
  staffDepartmentRequired: string;
  staffCreateError: string;
  staffRoleUpdateError: string;
  staffEditAccount: string;
  staffCancelEdit: string;
  staffUpdateAccount: string;
  staffUpdatingAccount: string;
  staffNewUsername: string;
  staffPasswordReset: string;
  staffPasswordResetDone: string;
  staffPasswordResetError: string;
  staffResetPassword: string;
  staffAccountActive: string;
  staffAccountInactive: string;
  staffActivate: string;
  staffDeactivate: string;
  staffConfirmActivate: string;
  staffConfirmDeactivate: string;
  staffDeleteAccount: string;
  staffDeleteConfirm: string;
  staffAccountDeleteError: string;
  staffAccountUpdateError: string;
  staffConfirmAction: string;
  staffSelfAccountProtected: string;

  // Analytics summary dashboard
  summaryDashboard: string;
  departmentAnalysis: string;
  departmentTotalCases: string;
  departmentComplaints: string;
  departmentFeedback: string;
  departmentResolutionRate: string;
  departmentAverageRating: string;
  noDepartmentCases: string;
  departmentsLabel: string;
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
    splashLocation: 'Addis Ababa · Ethiopia',
    patientRelations: 'Patient Relations',
    navSubmit: 'Submit',
    navTrack: 'Track',
    navStaffLogin: 'Staff login',
    navStaff: 'Staff',
    navSignOut: 'Sign out',
    switchToEnglish: 'Switch to English',
    switchToAmharic: 'Switch to Amharic',
    switchToOromo: 'Switch to Afaan Oromo',
    wizardStepType: 'Type',
    wizardStepDetails: 'Details',
    wizardStepMessage: 'Message',
    wizardStepReview: 'Review',
    wizardStepProgress: 'Step',
    wizardContinue: 'Continue',
    wizardBack: 'Back',
    wizardReviewKind: 'Feedback type',
    wizardReviewDepartment: 'Department',
    wizardReviewMessage: 'Your message',
    wizardReviewContact: 'Contact details',
    wizardAnonymous: 'Submitting anonymously',
    wizardNoMessage: 'No written message',
    
    heroTitle: 'Your voice helps us care better.',
    heroSubtitle: 'Share a complaint, suggestion or compliment about your visit to Afran General Hospital. Every submission is read by our Patient Relations team.',
    
    kindComplaint: 'Complaint',
    kindComplaintDescription: 'Tell us about a problem or concern',
    kindSuggestion: 'Suggestion',
    kindCompliment: 'Compliment',
    kindFeedback: 'Feedback',
    kindFeedbackDescription: 'Share an idea or tell us what went well',
    
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
    staffPassword: 'Password',
    signInBtn: 'Sign In',
    signingIn: 'Signing in...',
    passwordSignIn: 'Sign in with your assigned username and password.',
    managerProvisionNote: 'Only accounts created by a superadmin can access staff cases.',
    saving: 'Saving...',
    searching: 'Searching...',
    roleStaff: 'Patient Relations staff',
    roleSuperadmin: 'Superadmin',
    roleCustomerServiceManager: 'Customer Service Manager',
    roleDepartmentHead: 'Department head',
    roleCeo: 'CEO',
    managerScope: 'Customer Service Manager · full access to all cases',
    departmentHeadScope: 'Only cases for the assigned department',
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
    staffDepartmentAccessNote: 'Department heads can only view and update cases for the department assigned to their account.',
    staffAccessCreateTab: 'Create account',
    staffAccessDirectoryTab: 'Staff directory',
    staffAccessManagerDesc: 'View active staff accounts and their assigned roles.',
    staffCreateAccount: 'Create staff account',
    staffFullName: 'Full name',
    staffUsername: 'Username',
    staffInitialPassword: 'Initial password',
    staffPasswordMinLength: 'At least 12 characters',
    staffConfirmPassword: 'Confirm password',
    staffConfirmPasswordHint: 'Re-enter the initial password',
    staffPasswordShareNote: 'Share the username and initial password with the staff member securely. The password will not be shown again.',
    staffRoleLabel: 'Role',
    staffDepartmentLabel: 'Department',
    staffCreatingAccount: 'Creating account...',
    staffCreateAccountButton: 'Create account',
    staffDirectoryTitle: 'Active staff directory',
    staffEnterNameUsername: 'Enter the staff member’s name and username.',
    staffInvalidUsername: 'Enter a username in the format name@afran.com.',
    staffPasswordTooShort: 'Set an initial password with at least 12 characters.',
    staffPasswordsMismatch: 'The passwords do not match.',
    staffDepartmentRequired: 'Choose a department for department heads.',
    staffCreateError: 'Unable to create this staff account.',
    staffRoleUpdateError: 'Unable to update this staff role.',
    staffEditAccount: 'Edit account',
    staffCancelEdit: 'Cancel',
    staffUpdateAccount: 'Save account changes',
    staffUpdatingAccount: 'Saving account...',
    staffNewUsername: 'Username',
    staffPasswordReset: 'Set a new password (at least 12 characters)',
    staffPasswordResetDone: 'Password reset successfully.',
    staffPasswordResetError: 'Unable to reset this password.',
    staffResetPassword: 'Reset password',
    staffAccountActive: 'Active',
    staffAccountInactive: 'Deactivated',
    staffActivate: 'Reactivate',
    staffDeactivate: 'Deactivate',
    staffConfirmActivate: 'Reactivate this account?',
    staffConfirmDeactivate: 'Deactivate this account?',
    staffDeleteAccount: 'Delete account',
    staffDeleteConfirm: 'Permanently delete this account?',
    staffAccountDeleteError: 'Unable to delete this account.',
    staffAccountUpdateError: 'Unable to update this account.',
    staffConfirmAction: 'Confirm',
    staffSelfAccountProtected: 'Your own superadmin account cannot be edited or removed here.',

    summaryDashboard: 'Analytics & Trends',
    departmentAnalysis: 'Department performance',
    departmentTotalCases: 'cases',
    departmentComplaints: 'Complaints',
    departmentFeedback: 'Feedback',
    departmentResolutionRate: 'Resolved',
    departmentAverageRating: 'Avg. rating',
    noDepartmentCases: 'No department submissions yet.',
    departmentsLabel: 'departments',
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
    splashLocation: 'አዲስ አበባ · ኢትዮጵያ',
    patientRelations: 'የታካሚዎች ተሞክሮ',
    navSubmit: 'ቅሬታ/አስተያየት',
    navTrack: 'ጉዳይ መከታተያ',
    navStaffLogin: 'የሰራተኞች መግቢያ',
    navStaff: 'የስራ አመራር',
    navSignOut: 'ውጣ',
    switchToEnglish: 'ወደ እንግሊዝኛ ቀይር',
    switchToAmharic: 'ወደ አማርኛ ቀይር',
    switchToOromo: 'ወደ ኦሮምኛ ቀይር',
    wizardStepType: 'አይነት',
    wizardStepDetails: 'ዝርዝር',
    wizardStepMessage: 'መልዕክት',
    wizardStepReview: 'ግምገማ',
    wizardStepProgress: 'ደረጃ',
    wizardContinue: 'ቀጥል',
    wizardBack: 'ተመለስ',
    wizardReviewKind: 'የአስተያየት አይነት',
    wizardReviewDepartment: 'መምሪያ',
    wizardReviewMessage: 'መልዕክትዎ',
    wizardReviewContact: 'የእውቂያ መረጃ',
    wizardAnonymous: 'ማንነት ሳይገለጽ ይቀርባል',
    wizardNoMessage: 'የጽሑፍ መልዕክት የለም',
    
    heroTitle: 'የእርስዎ ድምፅ የተሻለ ህክምና እንድንሰጥ ይረዳናል።',
    heroSubtitle: 'ስለ አፍራን አጠቃላይ ሆስፒታል ቆይታዎ ቅሬታ፣ የማሻሻያ ሀሳብ ወይም ምስጋና ያጋሩን። እያንዳንዱ ማመልከቻ በታካሚዎች ተሞክሮ ቡድናችን በጥንቃቄ ይነበባል።',
    
    kindComplaint: 'ቅሬታ',
    kindComplaintDescription: 'ችግር ወይም ስጋት ያጋሩን',
    kindSuggestion: 'የማሻሻያ ሀሳብ',
    kindCompliment: 'ምስጋና',
    kindFeedback: 'አስተያየት',
    kindFeedbackDescription: 'ሀሳብ ወይም የተደሰቱበትን ነገር ያጋሩን',
    
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
    staffPassword: 'የይለፍ ቃል',
    signInBtn: 'ግባ',
    signingIn: 'በመግባት ላይ...',
    passwordSignIn: 'በተመደበልዎት የተጠቃሚ ስምና የይለፍ ቃል ይግቡ።',
    managerProvisionNote: 'በሱፐር አስተዳዳሪ የተፈጠሩ መለያዎች ብቻ የሰራተኛ ጉዳዮችን ማየት ይችላሉ።',
    saving: 'በማስቀመጥ ላይ...',
    searching: 'በመፈለግ ላይ...',
    roleStaff: 'የታካሚ ግንኙነት ሰራተኛ',
    roleSuperadmin: 'ሱፐር አስተዳዳሪ',
    roleCustomerServiceManager: 'የደንበኛ አገልግሎት አስተዳዳሪ',
    roleDepartmentHead: 'የክፍል ኃላፊ',
    roleCeo: 'ዋና ሥራ አስፈጻሚ',
    managerScope: 'የደንበኛ አገልግሎት አስተዳዳሪ · ሁሉንም ጉዳዮች የማየት ፈቃድ',
    departmentHeadScope: 'ለተመደበው መምሪያ የተመደቡ ጉዳዮችን ብቻ ያያሉ',
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
    staffAccessDesc: 'ሱፐር አስተዳዳሪዎች የሰራተኛ መለያ መፍጠርና ሚና እና ክፍል መመደብ ይችላሉ።',
    staffDepartmentAccessNote: 'የክፍል ኃላፊዎች ለመለያቸው የተመደበውን መምሪያ ጉዳዮች ብቻ ማየትና ማዘመን ይችላሉ።',
    staffAccessCreateTab: 'መለያ ፍጠር',
    staffAccessDirectoryTab: 'የሰራተኞች ዝርዝር',
    staffAccessManagerDesc: 'ንቁ የሰራተኛ መለያዎችንና የተመደቡ ሚናዎችን ይመልከቱ።',
    staffCreateAccount: 'የሰራተኛ መለያ ፍጠር',
    staffFullName: 'ሙሉ ስም',
    staffUsername: 'የተጠቃሚ ስም',
    staffInitialPassword: 'የመጀመሪያ የይለፍ ቃል',
    staffPasswordMinLength: 'ቢያንስ 12 ቁምፊዎች',
    staffConfirmPassword: 'የይለፍ ቃሉን ያረጋግጡ',
    staffConfirmPasswordHint: 'የመጀመሪያውን የይለፍ ቃል እንደገና ያስገቡ',
    staffPasswordShareNote: 'የተጠቃሚ ስሙንና የመጀመሪያውን የይለፍ ቃል ለሰራተኛው በደህንነት ያጋሩ። የይለፍ ቃሉ እንደገና አይታይም።',
    staffRoleLabel: 'ሚና',
    staffDepartmentLabel: 'ክፍል',
    staffCreatingAccount: 'መለያ በመፍጠር ላይ...',
    staffCreateAccountButton: 'መለያ ፍጠር',
    staffDirectoryTitle: 'ንቁ የሰራተኞች ዝርዝር',
    staffEnterNameUsername: 'የሰራተኛውን ሙሉ ስምና የተጠቃሚ ስም ያስገቡ።',
    staffInvalidUsername: 'በname@afran.com ቅርጸት የተጠቃሚ ስም ያስገቡ።',
    staffPasswordTooShort: 'ቢያንስ 12 ቁምፊ ያለው የመጀመሪያ የይለፍ ቃል ያዘጋጁ።',
    staffPasswordsMismatch: 'የይለፍ ቃሎቹ አይዛመዱም።',
    staffDepartmentRequired: 'ለክፍል ኃላፊዎች ክፍል ይምረጡ።',
    staffCreateError: 'ይህን የሰራተኛ መለያ መፍጠር አልተቻለም።',
    staffRoleUpdateError: 'የዚህን ሰራተኛ ሚና ማዘመን አልተቻለም።',
    staffEditAccount: 'መለያ አርትዕ',
    staffCancelEdit: 'ሰርዝ',
    staffUpdateAccount: 'የመለያ ለውጦችን አስቀምጥ',
    staffUpdatingAccount: 'መለያውን በማስቀመጥ ላይ...',
    staffNewUsername: 'የተጠቃሚ ስም',
    staffPasswordReset: 'አዲስ የይለፍ ቃል ያስገቡ (ቢያንስ 12 ቁምፊዎች)',
    staffPasswordResetDone: 'የይለፍ ቃሉ በተሳካ ሁኔታ ተቀይሯል።',
    staffPasswordResetError: 'የይለፍ ቃሉን መቀየር አልተቻለም።',
    staffResetPassword: 'የይለፍ ቃል ቀይር',
    staffAccountActive: 'ንቁ',
    staffAccountInactive: 'ቦዝኗል',
    staffActivate: 'እንደገና አንቃ',
    staffDeactivate: 'አቦዝን',
    staffConfirmActivate: 'ይህን መለያ እንደገና ማንቃት ይፈልጋሉ?',
    staffConfirmDeactivate: 'ይህን መለያ ማቦዘን ይፈልጋሉ?',
    staffDeleteAccount: 'መለያ ሰርዝ',
    staffDeleteConfirm: 'ይህን መለያ ለዘላለም መሰረዝ ይፈልጋሉ?',
    staffAccountDeleteError: 'ይህን መለያ መሰረዝ አልተቻለም።',
    staffAccountUpdateError: 'ይህን መለያ ማዘመን አልተቻለም።',
    staffConfirmAction: 'እርግጠኛ ነዎት?',
    staffSelfAccountProtected: 'የራስዎን የሱፐር አስተዳዳሪ መለያ እዚህ ማረም ወይም ማስወገድ አይችሉም።',

    summaryDashboard: 'ትንታኔ እና የሂደት መረጃ',
    departmentAnalysis: 'የመምሪያ አፈጻጸም',
    departmentTotalCases: 'ጉዳዮች',
    departmentComplaints: 'ቅሬታዎች',
    departmentFeedback: 'አስተያየቶች',
    departmentResolutionRate: 'የተፈቱ',
    departmentAverageRating: 'አማካይ ደረጃ',
    noDepartmentCases: 'እስካሁን ለዚህ መምሪያ ጉዳይ አልቀረበም።',
    departmentsLabel: 'መምሪያዎች',
    categoriesDistribution: 'የአስተያየት አይነቶች ስርጭት',
    statusDistribution: 'የጉዳዮች ሁኔታ ስርጭት',
    resolutionRate: 'የመፍትሄ ምጣኔ',
    avgRating: 'አማካይ ደረጃ',
    anonymousRate: 'ማንነት ያልተገለጸበት',
    totalCases: 'አጠቃላይ ጉዳዮች',
    showCharts: 'ትንታኔ አሳይ',
    hideCharts: 'ትንታኔ ደብቅ',
  },
  om: {
    emergencyBanner: 'Yeroo yaala hatattamaa, battalumatti gara Kutaa Balaa deemaa.',
    hospitalName: 'Hospitaala Waliigalaa Afran',
    splashLocation: 'Finfinnee · Itoophiyaa',
    patientRelations: 'Hariiroo Dhukkubsattootaa',
    navSubmit: 'Yaada dhiyeessi',
    navTrack: 'Hordofi',
    navStaffLogin: 'Seensa hojjettootaa',
    navStaff: 'Hojjettoota',
    navSignOut: 'Ba\'i',
    switchToEnglish: 'Gara Afaan Ingiliffaatti jijjiiri',
    switchToAmharic: 'Gara Afaan Amaaraatti jijjiiri',
    switchToOromo: 'Gara Afaan Oromootti jijjiiri',
    wizardStepType: 'Gosa',
    wizardStepDetails: 'Ibsa',
    wizardStepMessage: 'Ergaa',
    wizardStepReview: 'Mirkaneessi',
    wizardStepProgress: 'Sadarkaa',
    wizardContinue: 'Itti fufi',
    wizardBack: 'Duubatti deebi’i',
    wizardReviewKind: 'Gosa yaadaa',
    wizardReviewDepartment: 'Kutaa',
    wizardReviewMessage: 'Ergaa keessan',
    wizardReviewContact: 'Odeeffannoo quunnamtii',
    wizardAnonymous: 'Maqaa malee dhiyaata',
    wizardNoMessage: 'Ergaan barreeffamaa hin jiru',

    heroTitle: 'Sagaleen keessan kunuunsa fooyya’aa akka kenninu nu gargaara.',
    heroSubtitle: 'Daawwannaa Hospitaala Waliigalaa Afran irratti komii, yaada fooyya’iinsaa ykn galata nuuf qoodaa. Ergaan hundi garee Hariiroo Dhukkubsattootaatiin ni ilaalama.',

    kindComplaint: 'Komii',
    kindComplaintDescription: 'Waa’ee rakkoo ykn yaaddoo isin mudate nutti himaa',
    kindSuggestion: 'Yaada fooyya’iinsaa',
    kindCompliment: 'Galata',
    kindFeedback: 'Yaada',
    kindFeedbackDescription: 'Yaada fooyya’iinsaa ykn waan gaarii isin mudate nuuf qoodaa',

    chooseDept: 'Kutaa hospitaalaa filadhaa',
    overallExperience: 'Muuxannoo waliigalaa (filannoo)',
    subjectLabel: 'Mata-duree',
    subjectPlaceholder: 'Mata-duree gabaabaa barreessaa',
    messageLabel: 'Waan isin mudate nutti himaa',
    messagePlaceholder: 'Maaloo ibsa dabalataa barreessaa...',
    submitAnonymously: 'Maqaa malee dhiyeessi',
    anonymousNote: 'Odeeffannoo quunnamtii keessanii hin kuusnu.',
    confidentialityNote: 'Iccitiidhaan fi of eeggannoodhaan ni ilaalama.',
    nameLabel: 'Maqaa',
    emailLabel: 'Imeelii',
    phoneLabel: 'Lakkoofsa bilbilaa',
    submitButton: 'Dhiyeessi',
    submitting: 'Ergaa jira...',

    thankYouTitle: 'Galatoomaa. Ergaan keessan nu gaheera.',
    keepRefNotice: 'Haala dhimma keessanii hordofuuf lakkoofsa wabii kana qabadhaa:',
    trackThisCase: 'Dhimmicha hordofi',
    submitAnother: 'Yaada biraa dhiyeessi',

    trackHeading: 'Dhimmicha hordofaa',
    trackPlaceholder: 'AGH-7K2P9Q',
    trackButton: 'Hordofi',
    noCaseFound: 'Dhimmi hin argamne',
    checkRefAgain: 'Lakkoofsa wabii mirkaneessaa, irra deebi’aatii yaalaa.',
    responseFromPR: 'Deebii garee Hariiroo Dhukkubsattootaa',
    awaitingResponse: 'Gareen Hariiroo Dhukkubsattootaa ergaa keessan ilaalaa jira. Haaromsi asitti ni mul’ata.',
    submittedAnonymously: 'Maqaa malee dhiyaate',
    statusReceived: 'Fudhatame',
    statusInReview: 'Ilaalamaa jira',
    statusResolved: 'Furameera',

    caseDashboard: 'Daashboordii dhimma',
    staffSignIn: 'Seensa hojjettootaa',
    staffSignInDesc: 'Dhimmoota ilaaluuf akkaawuntii hojjettootaa keessaniin seenaa.',
    staffUsernamePlaceholder: 'username@afran.com',
    staffPassword: 'Jecha icciitii',
    signInBtn: 'Seeni',
    signingIn: 'Seenaa jira...',
    passwordSignIn: 'Maqaa fayyadamaa fi jecha icciitii isinif kennameen seenaa.',
    managerProvisionNote: 'Akkaawuntiiwwan bulchaa olaanaadhaan uumaman qofatu dhimmoota hojjettootaa arguu danda’a.',
    saving: 'Olkaa’aa jira...',
    searching: 'Barbaadaa jira...',
    roleStaff: 'Hojjetaa Hariiroo Dhukkubsattootaa',
    roleSuperadmin: 'Bulchaa olaanaa',
    roleCustomerServiceManager: 'Bulchaa Tajaajila Maamilaa',
    roleDepartmentHead: 'Itti gaafatamaa kutaa',
    roleCeo: 'Hoogganaa Olaanaa',
    managerScope: 'Bulchaa Tajaajila Maamilaa · dhimmoota hunda arguu danda’a',
    departmentHeadScope: 'Dhimmoota kutaa akkaawuntii irratti ramadame qofa arguu danda’a',
    ceoScope: 'Dhimmoota olitti dabarfaman qofa agarsiisaa jira',
    staffScope: 'Dhimmoonni akka argaman hin ramadamne',
    escalated: 'Olitti dabarfame',
    markEscalated: 'Dhimmicha gamaaggama Hoogganaa Olaanaaf dabarsi',
    filterAll: 'Hunda',
    filterReceived: 'Fudhataman',
    filterInReview: 'Ilaalamaa jiran',
    filterResolved: 'Furaman',
    searchCasesPlaceholder: 'Dhimmoota barbaadi...',
    noCasesHere: 'Asitti dhimma hin jiru',
    newSubmissionsAuto: 'Ergaawwan haaraan ofumaan asitti ni mul’atu.',
    reviewCase: 'Dhimmicha gamaaggami',
    close: 'Cufi',
    saveChanges: 'Jijjiirama olkaa’i',
    responseVisibleNote: 'Deebii (fuula hordoffii irratti dhiyeessaaf ni mul’ata)',
    statusLabel: 'Haala',
    staffAccessTitle: 'Hayyama hojjettootaa',
    staffAccessDesc: 'Bulchitoonni olaanoon akkaawuntii hojjettootaa uumuu fi nama hundaaf gahee fi (itti gaafatamtoota kutaatiif) kutaa ramaduu danda’u.',
    staffDepartmentAccessNote: 'Itti gaafatamtoonni kutaalee dhimmoota kutaa akkaawuntii isaanii irratti ramadame qofa ilaaluu fi haaromsuu danda’u.',
    staffAccessCreateTab: 'Akkaawuntii uumi',
    staffAccessDirectoryTab: 'Tarree hojjettootaa',
    staffAccessManagerDesc: 'Akkaawuntii hojjettootaa hojii irra jiran fi gahee isaanii ilaalaa.',
    staffCreateAccount: 'Akkaawuntii hojjetaa uumi',
    staffFullName: 'Maqaa guutuu',
    staffUsername: 'Maqaa fayyadamaa',
    staffInitialPassword: 'Jecha icciitii jalqabaa',
    staffPasswordMinLength: 'Qubee ykn mallattoo yoo xiqqaate 12',
    staffConfirmPassword: 'Jecha icciitii mirkaneessi',
    staffConfirmPasswordHint: 'Jecha icciitii jalqabaa irra deebi’ii galchi',
    staffPasswordShareNote: 'Maqaa fayyadamaa fi jecha icciitii jalqabaa hojjetaa sana waliin karaa nageenya qabuun qoodi. Jechi icciitii kun lammaffaa hin agarsiifamu.',
    staffRoleLabel: 'Gahee',
    staffDepartmentLabel: 'Kutaa',
    staffCreatingAccount: 'Akkaawuntii uumaa jira...',
    staffCreateAccountButton: 'Akkaawuntii uumi',
    staffDirectoryTitle: 'Tarree hojjettootaa hojii irra jiran',
    staffEnterNameUsername: 'Maqaa guutuu fi maqaa fayyadamaa hojjetaa galchi.',
    staffInvalidUsername: 'Maqaa fayyadamaa bifa name@afran.com qabu galchi.',
    staffPasswordTooShort: 'Jecha icciitii jalqabaa qubee ykn mallattoo yoo xiqqaate 12 qabu qopheessi.',
    staffPasswordsMismatch: 'Jecha icciitiiwwan wal hin fakkaatan.',
    staffDepartmentRequired: 'Itti gaafatamtoota kutaatiif kutaa filadhaa.',
    staffCreateError: 'Akkaawuntii hojjetaa kana uumuu hin dandeenye.',
    staffRoleUpdateError: 'Gahee hojjetaa kana haaromsuu hin dandeenye.',
    staffEditAccount: 'Akkaawuntii gulaali',
    staffCancelEdit: 'Dhiisi',
    staffUpdateAccount: 'Jijjiirama akkaawuntii olkaa’i',
    staffUpdatingAccount: 'Akkaawuntii olkaa’aa jira...',
    staffNewUsername: 'Maqaa fayyadamaa',
    staffPasswordReset: 'Jecha icciitii haaraa galchi (qubee ykn mallattoo yoo xiqqaate 12)',
    staffPasswordResetDone: 'Jechi icciitii milkaa’inaan haaromfameera.',
    staffPasswordResetError: 'Jecha icciitii haaromsuu hin dandeenye.',
    staffResetPassword: 'Jecha icciitii haaromsi',
    staffAccountActive: 'Hojii irra',
    staffAccountInactive: 'Dhaabbateera',
    staffActivate: 'Irra deebi’ii hojii jalqabi',
    staffDeactivate: 'Dhaabi',
    staffConfirmActivate: 'Akkaawuntii kana irra deebi’anii hojii jalqabsiisuu barbaadduu?',
    staffConfirmDeactivate: 'Akkaawuntii kana dhaabuu barbaadduu?',
    staffDeleteAccount: 'Akkaawuntii haqi',
    staffDeleteConfirm: 'Akkaawuntii kana guutummaatti haquu barbaadduu?',
    staffAccountDeleteError: 'Akkaawuntii kana haquu hin dandeenye.',
    staffAccountUpdateError: 'Akkaawuntii kana haaromsuu hin dandeenye.',
    staffConfirmAction: 'Mirkaneessaa',
    staffSelfAccountProtected: 'Akkaawuntii bulchaa olaanaa keessan asitti gulaaluu ykn haquu hin dandeessan.',

    summaryDashboard: 'Xiinxala fi adeemsa',
    departmentAnalysis: 'Raawwii kutaalee',
    departmentTotalCases: 'dhimmoota',
    departmentComplaints: 'Komiiwwan',
    departmentFeedback: 'Yaadawwan',
    departmentResolutionRate: 'Kan furaman',
    departmentAverageRating: 'Sadarkaa giddugaleessaa',
    noDepartmentCases: 'Hanga ammaatti kutaa kanaaf dhimma hin dhiyaanne.',
    departmentsLabel: 'kutaalee',
    categoriesDistribution: 'Raabsa gosoota yaadaa',
    statusDistribution: 'Raabsa haala dhimma',
    resolutionRate: 'Qixa furmaataa',
    avgRating: 'Sadarkaa giddugaleessaa',
    anonymousRate: 'Maqaa malee',
    totalCases: 'Baay’ina dhimma waliigalaa',
    showCharts: 'Xiinxala agarsiisi',
    hideCharts: 'Xiinxala dhoksi',
  }
};
