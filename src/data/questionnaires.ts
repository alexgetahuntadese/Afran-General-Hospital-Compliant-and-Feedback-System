export interface DepartmentQuestion {
  id: string;
  en: string;
  am: string;
  scale?: 'likelihood';
}

const sharedQuestions: DepartmentQuestion[] = [
  {
    id: 'respect',
    en: 'Were you treated with respect and kindness?',
    am: 'በአክብሮትና በደግነት ተስተናግደዋል?',
  },
  {
    id: 'communication',
    en: 'Did staff listen carefully and explain things clearly?',
    am: 'ሰራተኞቹ በጥንቃቄ አዳምጠው ጉዳዮችን በግልጽ አብራርተዋል?',
  },
  {
    id: 'privacy',
    en: 'Was your privacy and confidentiality respected?',
    am: 'የግል ሚስጥርዎና ግላዊነትዎ ተጠብቀዋል?',
  },
  {
    id: 'cleanliness',
    en: 'Was the care area clean and comfortable?',
    am: 'የእንክብካቤ ቦታው ንጹህና ምቹ ነበር?',
  },
  {
    id: 'overall',
    en: 'Overall, how satisfied were you with the care you received?',
    am: 'በአጠቃላይ ባገኙት እንክብካቤ ምን ያህል ረክተዋል?',
  },
  {
    id: 'recommend',
    en: 'Would you recommend this hospital to family or friends?',
    am: 'ይህንን ሆስፒታል ለቤተሰብዎ ወይም ለጓደኞችዎ ይመክራሉ?',
    scale: 'likelihood',
  },
];

const questionsByDepartment: Record<string, DepartmentQuestion[]> = {
  Emergency: [
    { id: 'triage', en: 'Were you assessed promptly when you arrived?', am: 'እንደደረሱ በፍጥነት ተመርምረዋል?' },
    { id: 'urgency', en: 'Was the urgency of your condition handled appropriately?', am: 'የሕመምዎ አስቸኳይነት በተገቢው ሁኔታ ተይዟል?' },
    { id: 'wait', en: 'Were waiting times communicated clearly?', am: 'የመጠበቂያ ጊዜው በግልጽ ተነግሮዎታል?' },
    { id: 'safety', en: 'Did you feel safe while receiving emergency care?', am: 'የድንገተኛ እንክብካቤ ሲያገኙ ደህንነት ተሰምቶዎታል?' },
    ...sharedQuestions,
  ],
  'Outpatient (OPD)': [
    { id: 'registration', en: 'Was registration and finding the clinic straightforward?', am: 'ምዝገባ ማድረግና ክሊኒኩን ማግኘት ቀላል ነበር?' },
    { id: 'wait', en: 'Was your waiting time reasonable?', am: 'የጠበቁት ጊዜ ተገቢ ነበር?' },
    { id: 'clinician', en: 'Did the clinician listen to your concerns?', am: 'የጤና ባለሙያው ስጋቶችዎን አዳምጠዋል?' },
    { id: 'next-steps', en: 'Were your diagnosis and next steps explained clearly?', am: 'የምርመራ ውጤትና ቀጣይ እርምጃዎች በግልጽ ተብራርተዋል?' },
    ...sharedQuestions,
  ],
  'Adult ICU (AICU)': [
    { id: 'updates', en: 'Were updates about the patient’s condition communicated clearly?', am: 'ስለ ታካሚው ሁኔታ የሚሰጡ መረጃዎች በግልጽ ተነግረዋል?' },
    { id: 'family', en: 'Were family questions and concerns addressed in a timely way?', am: 'የቤተሰብ ጥያቄዎችና ስጋቶች በወቅቱ ተመልሰዋል?' },
    { id: 'comfort', en: 'Was the patient’s comfort and dignity maintained?', am: 'የታካሚው ምቾትና ክብር ተጠብቀዋል?' },
    { id: 'safety', en: 'Did staff appear attentive to the patient’s safety?', am: 'ሰራተኞቹ ለታካሚው ደህንነት ትኩረት ሰጥተዋል?' },
    ...sharedQuestions,
  ],
  'Intensive Care Unit (ICU)': [
    { id: 'monitoring', en: 'Did staff respond promptly when the patient needed help?', am: 'ታካሚው እርዳታ ሲፈልግ ሰራተኞቹ በፍጥነት ምላሽ ሰጥተዋል?' },
    { id: 'updates', en: 'Were updates about care and progress understandable?', am: 'ስለ እንክብካቤና እድገት የተሰጠው መረጃ ግልጽ ነበር?' },
    { id: 'family', en: 'Were family members treated with consideration?', am: 'የቤተሰብ አባላት በተገቢው አክብሮት ተስተናግደዋል?' },
    { id: 'comfort', en: 'Was the patient’s comfort and privacy protected?', am: 'የታካሚው ምቾትና ግላዊነት ተጠብቀዋል?' },
    ...sharedQuestions,
  ],
  'Neonatal ICU (NICU)': [
    { id: 'newborn-care', en: 'Did the team handle and care for the newborn gently?', am: 'ቡድኑ አራሱን በጥንቃቄና በርህራሄ ተንከባክቧል?' },
    { id: 'parent-updates', en: 'Were you kept informed about your newborn’s condition?', am: 'ስለ አራሱ ሁኔታ በተከታታይ መረጃ ተሰጥቶዎታል?' },
    { id: 'parent-guidance', en: 'Did staff explain how you could participate in your newborn’s care?', am: 'በአራሱ እንክብካቤ እንዴት መሳተፍ እንደሚችሉ ተብራርቶልዎታል?' },
    { id: 'infection-safety', en: 'Did the unit appear clean and safe for newborns?', am: 'ክፍሉ ለአራሶች ንጹህና ደህንነቱ የተጠበቀ ሆኖ ታይቷል?' },
    ...sharedQuestions,
  ],
  Maternity: [
    { id: 'birth-plan', en: 'Were your preferences and choices listened to during care?', am: 'በእንክብካቤ ጊዜ ምርጫዎና ፍላጎትዎ ተደምጠዋል?' },
    { id: 'labor-support', en: 'Did you receive timely support during labor or delivery?', am: 'በምጥ ወይም በወሊድ ጊዜ በወቅቱ ድጋፍ አግኝተዋል?' },
    { id: 'newborn-guidance', en: 'Were you given clear guidance about your and your baby’s care?', am: 'ስለ እርስዎና ስለ ሕፃኑ እንክብካቤ ግልጽ መመሪያ ተሰጥቶዎታል?' },
    ...sharedQuestions,
  ],
  Pediatrics: [
    { id: 'child-friendly', en: 'Was care provided in a way that helped your child feel at ease?', am: 'ልጅዎ ምቾት እንዲሰማው በሚያግዝ ሁኔታ እንክብካቤ ተሰጥቷል?' },
    { id: 'guardian-updates', en: 'Were you kept informed and included in decisions about your child?', am: 'ስለ ልጅዎ ውሳኔዎች መረጃ ተሰጥቶዎትና ተሳትፈዋል?' },
    { id: 'pain-comfort', en: 'Did staff respond to your child’s discomfort or pain?', am: 'ሰራተኞቹ ለልጅዎ ህመም ወይም ምቾት ማጣት ምላሽ ሰጥተዋል?' },
    ...sharedQuestions,
  ],
  Surgery: [
    { id: 'procedure-info', en: 'Were the procedure and its risks explained before treatment?', am: 'ከሕክምናው በፊት ሂደቱና አደጋዎቹ ተብራርተዋል?' },
    { id: 'consent', en: 'Were you given time to ask questions and make an informed choice?', am: 'ጥያቄ ለመጠየቅና በቂ መረጃ ያለው ውሳኔ ለመስጠት ጊዜ ተሰጥቶዎታል?' },
    { id: 'recovery', en: 'Were pain control and recovery instructions explained clearly?', am: 'የህመም ቁጥጥርና የማገገሚያ መመሪያዎች በግልጽ ተብራርተዋል?' },
    ...sharedQuestions,
  ],
  Laboratory: [
    { id: 'instructions', en: 'Were test preparation instructions easy to understand?', am: 'የምርመራ ዝግጅት መመሪያዎች ለመረዳት ቀላል ነበሩ?' },
    { id: 'sample', en: 'Was your sample collected carefully and respectfully?', am: 'ናሙናዎ በጥንቃቄና በአክብሮት ተወስዷል?' },
    { id: 'results', en: 'Were you told how and when to receive your results?', am: 'የምርመራ ውጤትዎን እንዴትና መቼ እንደሚያገኙ ተነግሮዎታል?' },
    ...sharedQuestions,
  ],
  Pharmacy: [
    { id: 'availability', en: 'Were your prescribed medicines available?', am: 'የታዘዙልዎት መድኃኒቶች ነበሩ?' },
    { id: 'medicine-instructions', en: 'Were the dose and instructions for your medicines explained clearly?', am: 'የመድኃኒቶቹ መጠንና አጠቃቀም በግልጽ ተብራርተዋል?' },
    { id: 'medicine-questions', en: 'Could you ask questions about your medicines and get helpful answers?', am: 'ስለ መድኃኒቶችዎ ጥያቄ ጠይቀው አጋዥ መልስ አግኝተዋል?' },
    ...sharedQuestions,
  ],
  Radiology: [
    { id: 'preparation', en: 'Were instructions before the imaging test explained clearly?', am: 'ከራጅ ምርመራው በፊት የሚያስፈልጉ መመሪያዎች ተብራርተዋል?' },
    { id: 'procedure', en: 'Did staff explain what would happen during the imaging test?', am: 'በራጅ ምርመራው ወቅት ምን እንደሚደረግ ሰራተኞቹ አብራርተዋል?' },
    { id: 'comfort', en: 'Were your comfort and privacy respected during the test?', am: 'በምርመራው ወቅት ምቾትዎና ግላዊነትዎ ተጠብቀዋል?' },
    ...sharedQuestions,
  ],
  'Billing & Records': [
    { id: 'bill-clarity', en: 'Were charges and payment requirements explained clearly?', am: 'ክፍያዎችና የክፍያ መስፈርቶች በግልጽ ተብራርተዋል?' },
    { id: 'accuracy', en: 'Were your bill and records accurate?', am: 'የክፍያ ደረሰኝዎና መዝገቦችዎ ትክክለኛ ነበሩ?' },
    { id: 'resolution', en: 'Were billing or records questions resolved helpfully?', am: 'የክፍያ ወይም የመዝገብ ጥያቄዎች በአጋዥ ሁኔታ ተፈትተዋል?' },
    ...sharedQuestions,
  ],
  'Reception & Security': [
    { id: 'welcome', en: 'Were you welcomed and directed to the right service?', am: 'በደህና ተቀብለው ወደ ትክክለኛው አገልግሎት መርተውዎታል?' },
    { id: 'directions', en: 'Were directions and information easy to understand?', am: 'አቅጣጫዎችና መረጃዎች ለመረዳት ቀላል ነበሩ?' },
    { id: 'safety', en: 'Did you feel safe while entering and moving around the hospital?', am: 'ወደ ሆስፒታሉ ሲገቡና ውስጥ ሲንቀሳቀሱ ደህንነት ተሰምቶዎታል?' },
    ...sharedQuestions,
  ],
  'Cleanliness & Facilities': [
    { id: 'public-areas', en: 'Were waiting areas and public spaces clean?', am: 'የመጠበቂያ ቦታዎችና የጋራ ቦታዎች ንጹህ ነበሩ?' },
    { id: 'restrooms', en: 'Were restrooms clean and usable?', am: 'መጸዳጃ ቤቶች ንጹህና ለመጠቀም ምቹ ነበሩ?' },
    { id: 'maintenance', en: 'Were facility problems addressed promptly?', am: 'የተቋሙ ችግሮች በፍጥነት ተፈትተዋል?' },
    { id: 'hand-hygiene', en: 'Were handwashing or hand-sanitizing facilities available?', am: 'የእጅ መታጠቢያ ወይም ማጽጃ አገልግሎቶች ነበሩ?' },
    ...sharedQuestions,
  ],
};

export const QUESTIONNAIRE_VERSION = 'agh-department-survey-2026-01';

export function getDepartmentQuestions(department: string): DepartmentQuestion[] {
  return questionsByDepartment[department] ?? sharedQuestions;
}

export const SATISFACTION_OPTIONS = [
  { value: 5, en: 'Excellent', am: 'በጣም ጥሩ' },
  { value: 4, en: 'Good', am: 'ጥሩ' },
  { value: 3, en: 'Fair', am: 'መካከለኛ' },
  { value: 2, en: 'Poor', am: 'ደካማ' },
  { value: 1, en: 'Very poor', am: 'በጣም ደካማ' },
];

export const LIKELIHOOD_OPTIONS = [
  { value: 5, en: 'Very likely', am: 'በጣም የሚመከር' },
  { value: 4, en: 'Likely', am: 'የሚመከር' },
  { value: 3, en: 'Not sure', am: 'እርግጠኛ አይደለሁም' },
  { value: 2, en: 'Unlikely', am: 'የማይመከር' },
  { value: 1, en: 'Very unlikely', am: 'በፍጹም የማይመከር' },
];
