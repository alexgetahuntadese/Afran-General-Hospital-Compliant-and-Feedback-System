export type Language = 'en' | 'am' | 'om';

export interface CloneTranslations {
  emergencyBanner: string;
  hospitalName: string;
  splashLocation: string;
  splashSubtitle: string;
  footerNotice: string;
  feedbackTypePrompt: string;
  ratingPrompt: string;
  starUnit: string;
  starsUnit: string;
  optionalLabel: string;
  additionalCommentsLabel: string;
  additionalCommentsPlaceholder: string;
  questionnaireTitle: string;
  questionnaireInstructions: string;
  questionnaireMinimumError: string;
  questionnaireAnswered: string;
  voiceComplaintLabel: string;
  recordingStart: string;
  recordingStop: string;
  recordingInProgress: string;
  recordingReady: string;
  recordingRemove: string;
  recordingAttached: string;
  recordingConsent: string;
  recordingUnsupported: string;
  recordingFailed: string;
  recordingTooLarge: string;
  microphoneUnavailable: string;
  voiceRecordingSubmitted: string;
  questionnaireSubmitted: string;
  staffVoiceRecordingTitle: string;
  secureAudioLoading: string;
  audioPrivacyNotice: string;
  staffQuestionnaireTitle: string;
  copyReference: string;
  submittedBy: string;
  undisclosedName: string;
  respondedLabel: string;
  responseTemplates: string;
  templateReceived: string;
  templateReviewing: string;
  templateReceivedMessage: string;
  templateReviewingMessage: string;
  templateResolvedMessage: string;
  noCategoryData: string;
  noStatusData: string;
  casesUnit: string;
  submissionsUnit: string;
  reviewsUnit: string;
  anonymousUnit: string;
  totalUnit: string;
  resolvedUnit: string;
  lightMode: string;
  darkMode: string;
  patientRelations: string;
  mainNavigation: string;
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

  // Notifications
  notificationSuccess: string;
  notificationError: string;
  notificationWarning: string;
  notificationInfo: string;
  submissionSuccess: string;
  submissionError: string;
  networkError: string;
  tryAgain: string;

  // Push notifications
  enableNotifications: string;
  notificationPermission: string;
  notificationDescription: string;
  notificationEnabled: string;
}

export const translations: Record<Language, CloneTranslations> = {
  en: {
    emergencyBanner: 'In a medical emergency, proceed to the Emergency Department immediately.',
    hospitalName: 'Afran General Hospital',
    splashLocation: 'Addis Ababa, Ethiopia',
    splashSubtitle: 'Patient Experience & Relations',
    footerNotice: 'Patient feedback is handled with confidentiality and care.',
    feedbackTypePrompt: 'Select the type of feedback you wish to provide.',
    ratingPrompt: 'Select a rating from 1 to 5.',
    starUnit: 'star',
    starsUnit: 'stars',
    optionalLabel: 'optional',
    additionalCommentsLabel: 'Additional comments (optional)',
    additionalCommentsPlaceholder: 'Share any other details relevant to your experience.',
    questionnaireTitle: 'Department-specific questions',
    questionnaireInstructions: 'Rate from 1 (Very poor) to 5 (Excellent). Answer at least {minimum} questions to submit.',
    questionnaireMinimumError: 'Please answer at least {minimum} department-specific questions before submitting.',
    questionnaireAnswered: 'answered',
    voiceComplaintLabel: 'Voice recording (optional)',
    recordingStart: 'Start recording',
    recordingStop: 'Stop recording',
    recordingInProgress: 'Recording · up to 3 minutes',
    recordingReady: 'Recording ready',
    recordingRemove: 'Remove recording',
    recordingAttached: 'Voice recording attached',
    recordingConsent: 'I consent to attaching this audio to my submission for review by authorized hospital staff.',
    recordingUnsupported: 'Audio recording is not supported by this browser. Please use a supported browser.',
    recordingFailed: 'The recording could not be completed. Please try again.',
    recordingTooLarge: 'The recording exceeds the 10 MB limit. Please make a shorter recording.',
    microphoneUnavailable: 'Microphone access is unavailable. Check your browser permissions and try again.',
    voiceRecordingSubmitted: 'Voice recording attached.',
    questionnaireSubmitted: 'Department questionnaire submitted.',
    staffVoiceRecordingTitle: 'Voice recording',
    secureAudioLoading: 'Loading protected audio...',
    audioPrivacyNotice: 'This recording is private and may be accessed only by staff authorized to review this case.',
    staffQuestionnaireTitle: 'Department questionnaire responses',
    copyReference: 'Copy reference number',
    submittedBy: 'Submitted by',
    undisclosedName: 'Name not provided',
    respondedLabel: 'Response sent',
    responseTemplates: 'Response templates:',
    templateReceived: 'Acknowledgment',
    templateReviewing: 'Under review',
    templateReceivedMessage: 'Thank you for submitting your feedback. We have received it and forwarded it to the appropriate team for review.',
    templateReviewingMessage: 'Your submission is under review by the relevant team. We will provide an update when further information is available.',
    templateResolvedMessage: 'The review is complete, and this case has been marked as resolved.',
    noCategoryData: 'No category data is available.',
    noStatusData: 'No case status data is available.',
    casesUnit: 'cases',
    submissionsUnit: 'submissions',
    reviewsUnit: 'ratings',
    anonymousUnit: 'anonymous',
    totalUnit: 'total',
    resolvedUnit: 'resolved',
    lightMode: 'Switch to light mode',
    darkMode: 'Switch to dark mode',
    patientRelations: 'Patient Experience',
    mainNavigation: 'Main navigation',
    navSubmit: 'Share feedback',
    navTrack: 'Track a case',
    navStaffLogin: 'Staff sign in',
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
    wizardAnonymous: 'Submit anonymously',
    wizardNoMessage: 'No written message provided',
    
    heroTitle: 'Your feedback helps us improve the care we provide.',
    heroSubtitle: 'Share a complaint, suggestion, or compliment about your experience at Afran General Hospital. The Patient Experience team reviews every submission.',
    
    kindComplaint: 'Complaint',
    kindComplaintDescription: 'Describe a concern about your care or hospital experience.',
    kindSuggestion: 'Suggestion',
    kindCompliment: 'Compliment',
    kindFeedback: 'Feedback',
    kindFeedbackDescription: 'Share a suggestion or describe a positive experience.',
    
    chooseDept: 'Select a department',
    overallExperience: 'Overall experience (optional)',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'Enter a brief subject',
    messageLabel: 'Describe your experience',
    messagePlaceholder: 'Provide details relevant to your feedback.',
    submitAnonymously: 'Submit without identifying yourself',
    anonymousNote: 'Your contact details will not be collected for an anonymous submission.',
    confidentialityNote: 'Your feedback will be handled confidentially and with care.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    submitButton: 'Submit',
    submitting: 'Submitting...',
    
    thankYouTitle: 'Thank you. Your submission has been received.',
    keepRefNotice: 'Please retain this reference number to check the status of your submission:',
    trackThisCase: 'Track this submission',
    submitAnother: 'Submit additional feedback',
    
    trackHeading: 'Track a submission',
    trackPlaceholder: 'AGH-7K2P9Q',
    trackButton: 'Track',
    noCaseFound: 'No submission was found',
    checkRefAgain: 'Check the reference number and try again.',
    responseFromPR: 'Response from the Patient Experience team',
    awaitingResponse: 'The Patient Experience team is reviewing your submission. Any updates will appear here.',
    submittedAnonymously: 'Submitted anonymously',
    statusReceived: 'Received',
    statusInReview: 'Under review',
    statusResolved: 'Resolved',
    
    caseDashboard: 'Case management dashboard',
    staffSignIn: 'Staff sign-in',
    staffSignInDesc: 'Sign in with your staff account to review and manage submissions.',
    staffUsernamePlaceholder: 'username@afran.com',
    staffPassword: 'Password',
    signInBtn: 'Sign In',
    signingIn: 'Signing in...',
    passwordSignIn: 'Sign in with your assigned username and password.',
    managerProvisionNote: 'Only accounts created by a system administrator can access staff cases.',
    saving: 'Saving...',
    searching: 'Searching...',
    roleStaff: 'Patient Experience staff',
    roleSuperadmin: 'System administrator',
    roleCustomerServiceManager: 'Customer Service Manager',
    roleDepartmentHead: 'Department head',
    roleCeo: 'CEO',
    managerScope: 'Customer Service Manager · access to all cases',
    departmentHeadScope: 'Access is limited to the assigned department.',
    ceoScope: 'Only escalated cases are displayed.',
    staffScope: 'No case access has been assigned.',
    escalated: 'Escalated',
    markEscalated: 'Escalate this case for executive review',
    filterAll: 'All',
    filterReceived: 'Received',
    filterInReview: 'Under review',
    filterResolved: 'Resolved',
    searchCasesPlaceholder: 'Search cases...',
    noCasesHere: 'No cases are currently available.',
    newSubmissionsAuto: 'New submissions will appear here automatically.',
    reviewCase: 'Review case',
    close: 'Close',
    saveChanges: 'Save changes',
    responseVisibleNote: 'Response (visible to the submitter on the tracking page)',
    statusLabel: 'Status',
    staffAccessTitle: 'Staff account management',
    staffAccessDesc: 'System administrators can create staff accounts and assign roles and departments to department heads.',
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
    staffSelfAccountProtected: 'Your system administrator account cannot be edited or deleted here.',

    summaryDashboard: 'Analytics & Trends',
    departmentAnalysis: 'Department performance',
    departmentTotalCases: 'cases',
    departmentComplaints: 'Complaints',
    departmentFeedback: 'Feedback',
    departmentResolutionRate: 'Resolved',
    departmentAverageRating: 'Average rating',
    noDepartmentCases: 'No submissions have been received for this department.',
    departmentsLabel: 'departments',
    categoriesDistribution: 'Submission categories',
    statusDistribution: 'Case status',
    resolutionRate: 'Resolution Rate',
    avgRating: 'Average rating',
    anonymousRate: 'Anonymous',
    totalCases: 'Total Cases',
    showCharts: 'Show Analytics',
    hideCharts: 'Hide Analytics',

    // Notifications
    notificationSuccess: 'Success',
    notificationError: 'Error',
    notificationWarning: 'Warning',
    notificationInfo: 'Information',
    submissionSuccess: 'Your feedback has been submitted successfully.',
    submissionError: 'Unable to submit your feedback. Please try again.',
    networkError: 'Network error. Please check your connection and try again.',
    tryAgain: 'Please try again.',

    // Push notifications
    enableNotifications: 'Enable push notifications',
    notificationPermission: 'Receive updates on your device',
    notificationDescription: 'Get notified when your case status changes or when staff respond to your feedback.',
    notificationEnabled: 'Push notifications enabled',
  },
  am: {
    emergencyBanner: 'ለአስቸኳይ የህክምና ድንገተኛ አደጋ፣ ወዲያውኑ ወደ ድንገተኛ ክፍል ይሂዱ።',
    hospitalName: 'አፍራን አጠቃላይ ሆስፒታል',
    splashLocation: 'አዲስ አበባ፣ ኢትዮጵያ',
    splashSubtitle: 'የታካሚዎች ተሞክሮ እና ግንኙነት',
    footerNotice: 'የእርስዎ አስተያየት በሚስጥርና በጥንቃቄ ይያዛል።',
    feedbackTypePrompt: 'እባክዎ ማቅረብ የሚፈልጉትን የአስተያየት አይነት ይምረጡ።',
    ratingPrompt: 'ከ1 እስከ 5 ያለውን ደረጃ ይምረጡ።',
    starUnit: 'ኮከብ',
    starsUnit: 'ኮከቦች',
    optionalLabel: 'አማራጭ',
    additionalCommentsLabel: 'ተጨማሪ አስተያየት (አማራጭ)',
    additionalCommentsPlaceholder: 'ከተሞክሮዎ ጋር የተያያዙ ተጨማሪ ዝርዝሮችን ያጋሩ።',
    questionnaireTitle: 'ለመምሪያው የተዘጋጁ ጥያቄዎች',
    questionnaireInstructions: 'ከ1 (በጣም ደካማ) እስከ 5 (በጣም ጥሩ) ድረስ ደረጃ ይስጡ። ለማቅረብ ቢያንስ {minimum} ጥያቄዎችን ይመልሱ።',
    questionnaireMinimumError: 'ማመልከቻዎን ከማቅረብዎ በፊት ቢያንስ {minimum} የመምሪያውን ጥያቄዎች ይመልሱ።',
    questionnaireAnswered: 'ተመልሰዋል',
    voiceComplaintLabel: 'የድምጽ ቅጂ (አማራጭ)',
    recordingStart: 'ቅጂ ጀምር',
    recordingStop: 'ቅጂ አቁም',
    recordingInProgress: 'ቅጂ በመካሄድ ላይ · እስከ 3 ደቂቃ',
    recordingReady: 'ቅጂው ዝግጁ ነው',
    recordingRemove: 'ቅጂውን አስወግድ',
    recordingAttached: 'የድምጽ ቅጂ ተያይዟል',
    recordingConsent: 'ይህ የድምጽ ቅጂ ለጉዳዩ ግምገማ በተፈቀደላቸው የሆስፒታሉ ሰራተኞች እንዲያያዝ ፈቃዴን እሰጣለሁ።',
    recordingUnsupported: 'ይህ አሳሽ የድምጽ ቅጂን አይደግፍም። እባክዎ ቅጂን የሚደግፍ አሳሽ ይጠቀሙ።',
    recordingFailed: 'ቅጂውን ማጠናቀቅ አልተቻለም። እባክዎ እንደገና ይሞክሩ።',
    recordingTooLarge: 'ቅጂው ከ10 ሜባ ገደብ በላይ ነው። እባክዎ አጭር ቅጂ ያድርጉ።',
    microphoneUnavailable: 'ማይክሮፎኑን መጠቀም አልተቻለም። የአሳሽዎን ፈቃድ ያረጋግጡና እንደገና ይሞክሩ።',
    voiceRecordingSubmitted: 'የድምጽ ቅጂ ተያይዟል።',
    questionnaireSubmitted: 'የመምሪያ ጥያቄዎች ቀርበዋል።',
    staffVoiceRecordingTitle: 'የቅሬታ ድምጽ ቅጂ',
    secureAudioLoading: 'የተጠበቀው ድምጽ በመጫን ላይ...',
    audioPrivacyNotice: 'ይህ ቅጂ በግል የተጠበቀ ሲሆን ጉዳዩን ለመገምገም ፈቃድ ያላቸው ሰራተኞች ብቻ ሊያዳምጡት ይችላሉ።',
    staffQuestionnaireTitle: 'የመምሪያ ጥያቄ ምላሾች',
    copyReference: 'የመለያ ቁጥሩን ቅዳ',
    submittedBy: 'ያቀረበው',
    undisclosedName: 'ስም አልተገለጸም',
    respondedLabel: 'ምላሽ ተልኳል',
    responseTemplates: 'የምላሽ አብነቶች፡',
    templateReceived: 'መቀበሉ ተረጋግጧል',
    templateReviewing: 'በግምገማ ላይ',
    templateReceivedMessage: 'አስተያየትዎን ስላቀረቡ እናመሰግናለን። ደርሶናል፤ ለግምገማም ለሚመለከተው ቡድን አስተላልፈነዋል።',
    templateReviewingMessage: 'ማመልከቻዎ በሚመለከተው ቡድን እየተገመገመ ነው። ተጨማሪ መረጃ ሲኖር ዝማኔ እናቀርባለን።',
    templateResolvedMessage: 'ግምገማው ተጠናቋል፤ ይህ ጉዳይ እንደተፈታ ተመዝግቧል።',
    noCategoryData: 'የአስተያየት አይነት መረጃ የለም።',
    noStatusData: 'የጉዳይ ሁኔታ መረጃ የለም።',
    casesUnit: 'ጉዳዮች',
    submissionsUnit: 'ማመልከቻዎች',
    reviewsUnit: 'ደረጃ አሰጣጦች',
    anonymousUnit: 'ማንነት ያልተገለጸ',
    totalUnit: 'ድምር',
    resolvedUnit: 'የተፈቱ',
    lightMode: 'ወደ ብርሃን ገጽታ ቀይር',
    darkMode: 'ወደ ጨለማ ገጽታ ቀይር',
    patientRelations: 'የታካሚዎች ተሞክሮ',
    mainNavigation: 'ዋና ማሰሻ',
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
    
    heroTitle: 'አስተያየትዎ የምንሰጠውን እንክብካቤ ለማሻሻል ይረዳናል።',
    heroSubtitle: 'በአፍራን አጠቃላይ ሆስፒታል ስላጋጠምዎት ተሞክሮ ቅሬታ፣ የማሻሻያ ሀሳብ ወይም ምስጋና ያቅርቡ። የታካሚዎች ተሞክሮ ቡድን እያንዳንዱን ማመልከቻ ይገመግማል።',
    
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
    responseFromPR: 'ከታካሚዎች ተሞክሮ ቡድን የተሰጠ ምላሽ',
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
    roleSuperadmin: 'የስርዓት አስተዳዳሪ',
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

    // Notifications
    notificationSuccess: 'ተሳክቷል',
    notificationError: 'ስህተት',
    notificationWarning: 'ማስጠንቀቂያ',
    notificationInfo: 'መረጃ',
    submissionSuccess: 'አስተያየትዎ በተሳካ ሁኔታ ቀርቧል።',
    submissionError: 'አስተያየትዎን ማቅረብ አልተቻለም። እባክዎ እንደገና ይሞክሩ።',
    networkError: 'የኔትወርክ ስህተት። እባክዎ የኢንተርኔት አገናኝዎን ያረጋግጡና እንደገና ይሞክሩ።',
    tryAgain: 'እባክዎ እንደገና ይሞክሩ።',

    // Push notifications
    enableNotifications: 'የስልክ ማስታወሻዎችን አንቃ',
    notificationPermission: 'በስልክዎ ላይ ዝማኔ ያግኙ',
    notificationDescription: 'የጉዳይዎ ሁኔታ ሲቀይር ወይም ሰራተኞች ምላሽ ሲሰጡ ማስታወሻ ይቀበሉ።',
    notificationEnabled: 'የስልክ ማስታወሻዎች ተንቀልቀሉ',
  },
  om: {
    emergencyBanner: 'Yeroo yaala hatattamaa, battalumatti gara Kutaa Balaa deemaa.',
    hospitalName: 'Hospitaala Waliigalaa Afran',
    splashLocation: 'Finfinnee, Itoophiyaa',
    splashSubtitle: 'Muuxannoo fi Hariiroo Dhukkubsattootaa',
    footerNotice: 'Yaadni keessan iccitiidhaan fi of eeggannoodhaan ni ilaalama.',
    feedbackTypePrompt: 'Maaloo gosa yaada dhiyeessuu barbaaddan filadhaa.',
    ratingPrompt: 'Sadarkaa 1 hanga 5 filadhaa.',
    starUnit: 'urjii',
    starsUnit: 'urjii',
    optionalLabel: 'filannoo',
    additionalCommentsLabel: 'Yaada dabalataa (filannoo)',
    additionalCommentsPlaceholder: 'Odeeffannoo dabalataa muuxannoo keessan ibsu dhiyeessaa.',
    questionnaireTitle: 'Gaaffilee kutaa kanaaf qophaa’an',
    questionnaireInstructions: 'Sadarkaa 1 (baay’ee gadhee) hanga 5 (baay’ee gaarii)tti kennaa. Dhiyeessuuf yoo xiqqaate gaaffii {minimum} deebisaa.',
    questionnaireMinimumError: 'Dhiyeessii keessan dura gaaffilee kutaa kanaa yoo xiqqaate {minimum} deebisaa.',
    questionnaireAnswered: 'deebifaman',
    voiceComplaintLabel: 'Waraabbii sagalee (filannoo)',
    recordingStart: 'Waraabbii jalqabi',
    recordingStop: 'Waraabbii dhaabi',
    recordingInProgress: 'Waraabbiin gaggeeffamaa jira · hanga daqiiqaa 3',
    recordingReady: 'Waraabbiin qophaa’eera',
    recordingRemove: 'Waraabbii haqi',
    recordingAttached: 'Waraabbii sagalee itti dabalameera',
    recordingConsent: 'Waraabbiin sagalee kun gamaaggamaaf hojjettoota hospitaalaa hayyama qaban bira akka ga’u itti dabaluuf hayyama nan kenna.',
    recordingUnsupported: 'Biraawzari kun waraabbii sagalee hin deeggaru. Maaloo biraawzara deeggaru fayyadamaa.',
    recordingFailed: 'Waraabbii xumuruu hin dandeenye. Maaloo irra deebi’ii yaali.',
    recordingTooLarge: 'Waraabbiin kun daangaa 10 MB caaleera. Maaloo waraabbii gabaabaa qopheessi.',
    microphoneUnavailable: 'Mikirofoonii fayyadamuun hin danda’amu. Hayyama biraawzaraa keessanii mirkaneessaa; achiis irra deebi’aa yaalaa.',
    voiceRecordingSubmitted: 'Waraabbii sagalee itti dabalameera.',
    questionnaireSubmitted: 'Gaaffileen kutaa dhiyaataniiru.',
    staffVoiceRecordingTitle: 'Waraabbii sagalee komii',
    secureAudioLoading: 'Sagaleen eegame fe’amaa jira…',
    audioPrivacyNotice: 'Waraabbiin kun iccitiidha; hojjettoonni dhimma kana gamaaggamuuf hayyama qaban qofatu dhaggeeffachuu danda’a.',
    staffQuestionnaireTitle: 'Deebii gaaffilee kutaa',
    copyReference: 'Lakkoofsa wabii waraabi',
    submittedBy: 'Kan dhiyeesse',
    undisclosedName: 'Maqaan hin ibsamne',
    respondedLabel: 'Deebiin ergameera',
    responseTemplates: 'Qabiyyee deebii dursee qophaa’e:',
    templateReceived: 'Fudhachuu mirkaneessuu',
    templateReviewing: 'Gamaaggama irra jira',
    templateReceivedMessage: 'Yaada keessan waan dhiyeessitaniif galatoomaa. Nu gaheera; gamaaggamaaf garee dhimmi ilaallatuuf dabarsineerra.',
    templateReviewingMessage: 'Dhiyeessiin keessan garee dhimmi ilaallatuun gamaaggamaa jira. Yeroo odeeffannoon dabalataa argamu haaromsa isiniif kennina.',
    templateResolvedMessage: 'Gamaaggamni xumurameera; dhimma kana akka furameetti galmeessineerra.',
    noCategoryData: 'Odeeffannoon gosoota yaadaa hin jiru.',
    noStatusData: 'Odeeffannoon haala dhimmaa hin jiru.',
    casesUnit: 'dhimmoota',
    submissionsUnit: 'dhiyeessitoota',
    reviewsUnit: 'sadarkaalee',
    anonymousUnit: 'maqaa malee',
    totalUnit: 'waliigala',
    resolvedUnit: 'furaman',
    lightMode: 'Gara bifa ifaatti jijjiiri',
    darkMode: 'Gara bifa dukkanaatti jijjiiri',
    patientRelations: 'Muuxannoo Dhukkubsattootaa',
    mainNavigation: 'Navigeeshinii ijoo',
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

    heroTitle: 'Yaadni keessan kunuunsa kenninu akka fooyyessu nu gargaara.',
    heroSubtitle: 'Muuxannoo Hospitaala Waliigalaa Afran keessatti argattan irratti komii, yaada fooyya’iinsaa ykn galata dhiyeessaa. Gareen Muuxannoo Dhukkubsattootaa dhiyeessii hunda ni gamaaggama.',

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
    responseFromPR: 'Deebii garee Muuxannoo Dhukkubsattootaa',
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
    roleSuperadmin: 'Bulchaa sirnaa',
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
    totalCases: 'Tuuta Waliigalaa',
    showCharts: 'Garaagaatti agarsiisu',
    hideCharts: 'Garaagaatti qabachiisu',

    notificationSuccess: 'Milkaa\'ina',
    notificationError: 'Dogoggora',
    notificationWarning: 'Yaaddoo',
    notificationInfo: 'Odeeffannoo',
    submissionSuccess: 'Yaada keessan milkaa\'inaan dhiyeessama.',
    submissionError: 'Yaada keessan dhiyeessuu hin danda\'amu. Firiin haaraa deebi\'aa.',
    networkError: 'Dogoggora neettiiorkii. Qabxii keessan ilaali fi deebi\'ii deebi\'aa.',
    tryAgain: 'Deebi\'ii deebi\'aa.',

    // Push notifications
    enableNotifications: 'Yaada bilbila agarsiisuuf eeyyamaa',
    notificationPermission: 'Qabxii keessatti yaada argachuu',
    notificationDescription: 'Yeroon haala dhimma jijjiirama ykn hojjettoonni deebii kennu yaada argachuu dandeessa.',
    notificationEnabled: 'Yaada bilbilaa agarsiifameera',
  },
};
