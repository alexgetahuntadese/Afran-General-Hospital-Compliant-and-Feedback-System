export interface DepartmentQuestion {
  id: string;
  en: string;
  am: string;
  om: string;
  scale?: 'likelihood';
}

const sharedQuestions: DepartmentQuestion[] = [
  {
    id: 'respect',
    en: 'Were you treated with respect and kindness?',
    am: 'በአክብሮትና በደግነት ተስተናግደዋል?',
    om: 'Kabajaanii fi gaarummaan isin keessummeessaniiruu?',
  },
  {
    id: 'communication',
    en: 'Did staff listen carefully and explain things clearly?',
    am: 'ሰራተኞቹ በጥንቃቄ አዳምጠው ጉዳዮችን በግልጽ አብራርተዋል?',
    om: 'Hojjettoonni sirriitti isin dhaggeeffatanii dhimma sana ifatti ibsaniiruu?',
  },
  {
    id: 'privacy',
    en: 'Was your privacy and confidentiality respected?',
    am: 'የግል ሚስጥርዎና ግላዊነትዎ ተጠብቀዋል?',
    om: 'Iccitii fi dhuunfummaan keessan kabajameeraa?',
  },
  {
    id: 'cleanliness',
    en: 'Was the care area clean and comfortable?',
    am: 'የእንክብካቤ ቦታው ንጹህና ምቹ ነበር?',
    om: 'Bakka kunuunsi itti kennamu qulqulluu fi mijataa turee?',
  },
  {
    id: 'overall',
    en: 'Overall, how satisfied were you with the care you received?',
    am: 'በአጠቃላይ ባገኙት እንክብካቤ ምን ያህል ረክተዋል?',
    om: 'Walumaagalatti kunuunsa argattanitti hammam quufuu dandeessan?',
  },
  {
    id: 'recommend',
    en: 'Would you recommend this hospital to family or friends?',
    am: 'ይህንን ሆስፒታል ለቤተሰብዎ ወይም ለጓደኞችዎ ይመክራሉ?',
    om: 'Hospitaala kana maatii keessaniif yookaan hiriyoota keessaniif ni gorsu?',
    scale: 'likelihood',
  },
];

const questionsByDepartment: Record<string, DepartmentQuestion[]> = {
  Emergency: [
    { id: 'triage', en: 'Were you assessed promptly when you arrived?', am: 'እንደደረሱ በፍጥነት ተመርምረዋል?', om: 'Yeroo geessan saffisaan qorannoo argattaniiruu?' },
    { id: 'urgency', en: 'Was the urgency of your condition handled appropriately?', am: 'የሕመምዎ አስቸኳይነት በተገቢው ሁኔታ ተይዟል?', om: 'Haalli fayyaa keessan isa hatattamaa ta’uu isaa irratti tarkaanfiin sirrii fudhatameeraa?' },
    { id: 'wait', en: 'Were waiting times communicated clearly?', am: 'የመጠበቂያ ጊዜው በግልጽ ተነግሮዎታል?', om: 'Yeroon eegumsaa ifatti isinitti himameeraa?' },
    { id: 'safety', en: 'Did you feel safe while receiving emergency care?', am: 'የድንገተኛ እንክብካቤ ሲያገኙ ደህንነት ተሰምቶዎታል?', om: 'Yeroo kunuunsa hatattamaa argattan nageenya isinitti dhaga’ameeraa?' },
    ...sharedQuestions,
  ],
  'Outpatient (OPD)': [
    { id: 'registration', en: 'Was registration and finding the clinic straightforward?', am: 'ምዝገባ ማድረግና ክሊኒኩን ማግኘት ቀላል ነበር?', om: 'Galmeessuun fi kilinika argachuun salphaa turee?' },
    { id: 'wait', en: 'Was your waiting time reasonable?', am: 'የጠበቁት ጊዜ ተገቢ ነበር?', om: 'Yeroon eegumsaa keessan madaalawaa turee?' },
    { id: 'clinician', en: 'Did the clinician listen to your concerns?', am: 'የጤና ባለሙያው ስጋቶችዎን አዳምጠዋል?', om: 'Ogeessi fayyaa yaaddoo keessan dhaggeeffateeraa?' },
    { id: 'next-steps', en: 'Were your diagnosis and next steps explained clearly?', am: 'የምርመራ ውጤትና ቀጣይ እርምጃዎች በግልጽ ተብራርተዋል?', om: 'Bu’aan qorannoo fi tarkaanfiileen itti aanan ifatti ibsamaniiruu?' },
    ...sharedQuestions,
  ],
  'Adult ICU (AICU)': [
    { id: 'updates', en: 'Were updates about the patient’s condition communicated clearly?', am: 'ስለ ታካሚው ሁኔታ የሚሰጡ መረጃዎች በግልጽ ተነግረዋል?', om: 'Haala dhukkubsataa irratti odeeffannoon haaromfame ifatti isinitti himameeraa?' },
    { id: 'family', en: 'Were family questions and concerns addressed in a timely way?', am: 'የቤተሰብ ጥያቄዎችና ስጋቶች በወቅቱ ተመልሰዋል?', om: 'Gaaffii fi yaaddoon maatii yeroo isaatti deebii argateeraa?' },
    { id: 'comfort', en: 'Was the patient’s comfort and dignity maintained?', am: 'የታካሚው ምቾትና ክብር ተጠብቀዋል?', om: 'Mijachuunii fi kabajni dhukkubsataa eegameeraa?' },
    { id: 'safety', en: 'Did staff appear attentive to the patient’s safety?', am: 'ሰራተኞቹ ለታካሚው ደህንነት ትኩረት ሰጥተዋል?', om: 'Hojjettoonni nageenya dhukkubsataaf xiyyeeffannoo kennaniiruu?' },
    ...sharedQuestions,
  ],
  'Intensive Care Unit (ICU)': [
    { id: 'monitoring', en: 'Did staff respond promptly when the patient needed help?', am: 'ታካሚው እርዳታ ሲፈልግ ሰራተኞቹ በፍጥነት ምላሽ ሰጥተዋል?', om: 'Dhukkubsataan yeroo gargaarsa barbaadetti hojjettoonni saffisaan deebii kennaniiruu?' },
    { id: 'updates', en: 'Were updates about care and progress understandable?', am: 'ስለ እንክብካቤና እድገት የተሰጠው መረጃ ግልጽ ነበር?', om: 'Odeeffannoon kunuunsa fi fooyya’iinsa irratti kenname hubatamaa turee?' },
    { id: 'family', en: 'Were family members treated with consideration?', am: 'የቤተሰብ አባላት በተገቢው አክብሮት ተስተናግደዋል?', om: 'Miseensonni maatii kabajaan keessummeeffamaniiruu?' },
    { id: 'comfort', en: 'Was the patient’s comfort and privacy protected?', am: 'የታካሚው ምቾትና ግላዊነት ተጠብቀዋል?', om: 'Mijachuunii fi dhuunfummaan dhukkubsataa eegameeraa?' },
    ...sharedQuestions,
  ],
  'Neonatal ICU (NICU)': [
    { id: 'newborn-care', en: 'Did the team handle and care for the newborn gently?', am: 'ቡድኑ አራሱን በጥንቃቄና በርህራሄ ተንከባክቧል?', om: 'Gareen kun daa’ima haaraa of eeggannoo fi gara laafinaan kunuunseeraa?' },
    { id: 'parent-updates', en: 'Were you kept informed about your newborn’s condition?', am: 'ስለ አራሱ ሁኔታ በተከታታይ መረጃ ተሰጥቶዎታል?', om: 'Haala daa’ima keessanii irratti odeeffannoo yeroo yeroon argattaniiruu?' },
    { id: 'parent-guidance', en: 'Did staff explain how you could participate in your newborn’s care?', am: 'በአራሱ እንክብካቤ እንዴት መሳተፍ እንደሚችሉ ተብራርቶልዎታል?', om: 'Kunuunsa daa’ima keessanii keessatti akkamitti hirmaachuu akka dandeessan hojjettoonni isinitti himaniiruu?' },
    { id: 'infection-safety', en: 'Did the unit appear clean and safe for newborns?', am: 'ክፍሉ ለአራሶች ንጹህና ደህንነቱ የተጠበቀ ሆኖ ታይቷል?', om: 'Kutaan kun daa’imman haaraatiif qulqulluu fi nageenya kan qabu fakkaateeraa?' },
    ...sharedQuestions,
  ],
  Maternity: [
    { id: 'birth-plan', en: 'Were your preferences and choices listened to during care?', am: 'በእንክብካቤ ጊዜ ምርጫዎና ፍላጎትዎ ተደምጠዋል?', om: 'Yeroo kunuunsaa filannoo fi fedhiin keessan dhaggeeffatameeraa?' },
    { id: 'labor-support', en: 'Did you receive timely support during labor or delivery?', am: 'በምጥ ወይም በወሊድ ጊዜ በወቅቱ ድጋፍ አግኝተዋል?', om: 'Yeroo ciniinsuu yookaan da’umsaa deeggarsa yeroo isaatti argattaniiruu?' },
    { id: 'newborn-guidance', en: 'Were you given clear guidance about your and your baby’s care?', am: 'ስለ እርስዎና ስለ ሕፃኑ እንክብካቤ ግልጽ መመሪያ ተሰጥቶዎታል?', om: 'Kunuunsa keessanii fi daa’ima keessanii irratti qajeelfama ifa ta’e argattaniiruu?' },
    ...sharedQuestions,
  ],
  Pediatrics: [
    { id: 'child-friendly', en: 'Was care provided in a way that helped your child feel at ease?', am: 'ልጅዎ ምቾት እንዲሰማው በሚያግዝ ሁኔታ እንክብካቤ ተሰጥቷል?', om: 'Kunuunsi daa’imni keessan akka tasgabbaa’u gargaaru kennamaa turee?' },
    { id: 'guardian-updates', en: 'Were you kept informed and included in decisions about your child?', am: 'ስለ ልጅዎ ውሳኔዎች መረጃ ተሰጥቶዎትና ተሳትፈዋል?', om: 'Waa’ee murtiiwwan daa’ima keessanii odeeffannoo argattanii keessatti hirmaattaniiruu?' },
    { id: 'pain-comfort', en: 'Did staff respond to your child’s discomfort or pain?', am: 'ሰራተኞቹ ለልጅዎ ህመም ወይም ምቾት ማጣት ምላሽ ሰጥተዋል?', om: 'Hojjettoonni dhukkubbii yookaan mijachuu dhabuu daa’ima keessanii irratti deebii kennaniiruu?' },
    ...sharedQuestions,
  ],
  Surgery: [
    { id: 'procedure-info', en: 'Were the procedure and its risks explained before treatment?', am: 'ከሕክምናው በፊት ሂደቱና አደጋዎቹ ተብራርተዋል?', om: 'Yaala dura adeemsi isaa fi balaa isaa isinitti ibsameeraa?' },
    { id: 'consent', en: 'Were you given time to ask questions and make an informed choice?', am: 'ጥያቄ ለመጠየቅና በቂ መረጃ ያለው ውሳኔ ለመስጠት ጊዜ ተሰጥቶዎታል?', om: 'Gaaffii gaafachuu fi odeeffannoo gahaa irratti hundaa’uun murteessuuf yeroo argattaniiruu?' },
    { id: 'recovery', en: 'Were pain control and recovery instructions explained clearly?', am: 'የህመም ቁጥጥርና የማገገሚያ መመሪያዎች በግልጽ ተብራርተዋል?', om: 'To’annoon dhukkubbii fi qajeelfamni fayyinaa ifatti ibsamaniiruu?' },
    ...sharedQuestions,
  ],
  Laboratory: [
    { id: 'instructions', en: 'Were test preparation instructions easy to understand?', am: 'የምርመራ ዝግጅት መመሪያዎች ለመረዳት ቀላል ነበሩ?', om: 'Qajeelfamni qophii qorannoo hubachuuf salphaa turee?' },
    { id: 'sample', en: 'Was your sample collected carefully and respectfully?', am: 'ናሙናዎ በጥንቃቄና በአክብሮት ተወስዷል?', om: 'Fakkeenyi keessan of eeggannoo fi kabajaan fudhatameeraa?' },
    { id: 'results', en: 'Were you told how and when to receive your results?', am: 'የምርመራ ውጤትዎን እንዴትና መቼ እንደሚያገኙ ተነግሮዎታል?', om: 'Bu’aa qorannoo keessanii akkamitti fi yoom akka argattan isinitti himameeraa?' },
    ...sharedQuestions,
  ],
  Pharmacy: [
    { id: 'availability', en: 'Were your prescribed medicines available?', am: 'የታዘዙልዎት መድኃኒቶች ነበሩ?', om: 'Qorichi isiniif ajajame argamuu danda’eeraa?' },
    { id: 'medicine-instructions', en: 'Were the dose and instructions for your medicines explained clearly?', am: 'የመድኃኒቶቹ መጠንና አጠቃቀም በግልጽ ተብራርተዋል?', om: 'Hammamtaa fi akkaataa qoricha itti fayyadaman ifatti ibsameeraa?' },
    { id: 'medicine-questions', en: 'Could you ask questions about your medicines and get helpful answers?', am: 'ስለ መድኃኒቶችዎ ጥያቄ ጠይቀው አጋዥ መልስ አግኝተዋል?', om: 'Waa’ee qoricha keessanii gaaffii gaafattanii deebii gargaaraa argattaniiruu?' },
    ...sharedQuestions,
  ],
  Radiology: [
    { id: 'preparation', en: 'Were instructions before the imaging test explained clearly?', am: 'ከራጅ ምርመራው በፊት የሚያስፈልጉ መመሪያዎች ተብራርተዋል?', om: 'Qorannoo suuraa dura qajeelfamni barbaachisu ifatti ibsameeraa?' },
    { id: 'procedure', en: 'Did staff explain what would happen during the imaging test?', am: 'በራጅ ምርመራው ወቅት ምን እንደሚደረግ ሰራተኞቹ አብራርተዋል?', om: 'Yeroo qorannoo suuraa maaltu akka raawwatamu hojjettoonni isinitti himaniiruu?' },
    { id: 'comfort', en: 'Were your comfort and privacy respected during the test?', am: 'በምርመራው ወቅት ምቾትዎና ግላዊነትዎ ተጠብቀዋል?', om: 'Yeroo qorannoo mijachuunii fi dhuunfummaan keessan kabajameeraa?' },
    ...sharedQuestions,
  ],
  'Billing & Records': [
    { id: 'bill-clarity', en: 'Were charges and payment requirements explained clearly?', am: 'ክፍያዎችና የክፍያ መስፈርቶች በግልጽ ተብራርተዋል?', om: 'Kaffaltiiwwanii fi ulaagaaleen kaffaltii ifatti ibsamaniiruu?' },
    { id: 'accuracy', en: 'Were your bill and records accurate?', am: 'የክፍያ ደረሰኝዎና መዝገቦችዎ ትክክለኛ ነበሩ?', om: 'Herregni kaffaltii fi galmeewwan keessan sirrii turaniiruu?' },
    { id: 'resolution', en: 'Were billing or records questions resolved helpfully?', am: 'የክፍያ ወይም የመዝገብ ጥያቄዎች በአጋዥ ሁኔታ ተፈትተዋል?', om: 'Gaaffileen kaffaltii yookaan galmee karaa gargaaraa ta’een furamaniiruu?' },
    ...sharedQuestions,
  ],
  'Reception & Security': [
    { id: 'welcome', en: 'Were you welcomed and directed to the right service?', am: 'በደህና ተቀብለው ወደ ትክክለኛው አገልግሎት መርተውዎታል?', om: 'Sirriitti isin simatanii gara tajaajila barbaachisaatti isin qajeelchaniiruu?' },
    { id: 'directions', en: 'Were directions and information easy to understand?', am: 'አቅጣጫዎችና መረጃዎች ለመረዳት ቀላል ነበሩ?', om: 'Qajeelfamnii fi odeeffannoon hubachuuf salphaa turaniiruu?' },
    { id: 'safety', en: 'Did you feel safe while entering and moving around the hospital?', am: 'ወደ ሆስፒታሉ ሲገቡና ውስጥ ሲንቀሳቀሱ ደህንነት ተሰምቶዎታል?', om: 'Yeroo hospitaala seenanii fi keessa sochootan nageenya isinitti dhaga’ameeraa?' },
    ...sharedQuestions,
  ],
  'Cleanliness & Facilities': [
    { id: 'public-areas', en: 'Were waiting areas and public spaces clean?', am: 'የመጠበቂያ ቦታዎችና የጋራ ቦታዎች ንጹህ ነበሩ?', om: 'Bakkeewwan eegumsaa fi bakka namoonni waliinii itti fayyadaman qulqulluu turaniiruu?' },
    { id: 'restrooms', en: 'Were restrooms clean and usable?', am: 'መጸዳጃ ቤቶች ንጹህና ለመጠቀም ምቹ ነበሩ?', om: 'Mana fincaaniiwwan qulqulluu fi itti fayyadamuuf mijatoo turaniiruu?' },
    { id: 'maintenance', en: 'Were facility problems addressed promptly?', am: 'የተቋሙ ችግሮች በፍጥነት ተፈትተዋል?', om: 'Rakkooleen dhaabbata kanaa saffisaan furamaniiruu?' },
    { id: 'hand-hygiene', en: 'Were handwashing or hand-sanitizing facilities available?', am: 'የእጅ መታጠቢያ ወይም ማጽጃ አገልግሎቶች ነበሩ?', om: 'Bakka harka dhiqatan yookaan itti qulqulleessan argamaa turee?' },
    ...sharedQuestions,
  ],
};

export const QUESTIONNAIRE_VERSION = 'agh-department-survey-2026-01';

export function getDepartmentQuestions(department: string): DepartmentQuestion[] {
  return questionsByDepartment[department] ?? sharedQuestions;
}

export const SATISFACTION_OPTIONS = [
  { value: 5, en: 'Excellent', am: 'በጣም ጥሩ', om: 'Baay’ee gaarii' },
  { value: 4, en: 'Good', am: 'ጥሩ', om: 'Gaarii' },
  { value: 3, en: 'Fair', am: 'መካከለኛ', om: 'Giddu galeessa' },
  { value: 2, en: 'Poor', am: 'ደካማ', om: 'Gadhee' },
  { value: 1, en: 'Very poor', am: 'በጣም ደካማ', om: 'Baay’ee gadhee' },
];

export const LIKELIHOOD_OPTIONS = [
  { value: 5, en: 'Very likely', am: 'በጣም የሚመከር', om: 'Baay’ee nan gorsa' },
  { value: 4, en: 'Likely', am: 'የሚመከር', om: 'Nan gorsa' },
  { value: 3, en: 'Not sure', am: 'እርግጠኛ አይደለሁም', om: 'Mirkanaa’aa miti' },
  { value: 2, en: 'Unlikely', am: 'የማይመከር', om: 'Gorsuun hin malu' },
  { value: 1, en: 'Very unlikely', am: 'በፍጹም የማይመከር', om: 'Gonkumaa hin gorsu' },
];
