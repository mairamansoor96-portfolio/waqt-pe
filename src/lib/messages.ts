// Interface copy in English and Urdu. Warm, plain and specific, using the
// person's name wherever there is one (SPEC.md → Copy voice).
// Every Urdu string is a draft and needs native review before launch.
// {placeholders} are filled with fill() or fillNodes() from i18n.tsx.

type Pair = { en: string; ur: string };

export const messages = {
  // App and landing ----------------------------------------------------------
  appName: { en: "Waqt Pe", ur: "وقت پہ" },
  tagline: { en: "Medicine care anyone can follow.", ur: "دوا کا ایسا انتظام جو ہر کوئی سمجھ سکے۔" },
  intro: {
    en: "Describe one person's medicines once. Waqt Pe makes a fridge schedule anyone can follow, an emergency lock-screen card, and a list for the doctor.",
    ur: "ایک شخص کی دوائیں ایک بار لکھیں۔ وقت پہ فریج پر لگانے کا ایسا شیڈول بناتا ہے جو ہر کوئی سمجھ سکے، ایمرجنسی لاک اسکرین کارڈ، اور ڈاکٹر کے لیے فہرست۔",
  },
  privacyTitle: { en: "Nothing you enter leaves this device.", ur: "آپ جو کچھ لکھیں گے وہ اس فون یا کمپیوٹر سے باہر نہیں جائے گا۔" },
  privacyBody: {
    en: "Your plan is saved inside this page's link, in the part browsers never send to a server. Bookmark the link to come back, or share it with family.",
    ur: "آپ کا پلان اسی صفحے کے لنک میں محفوظ ہوتا ہے، اس حصے میں جو براؤزر کبھی سرور کو نہیں بھیجتا۔ واپس آنے کے لیے لنک بک مارک کر لیں، یا گھر والوں کو بھیج دیں۔",
  },
  startPlan: { en: "Start a plan", ur: "پلان شروع کریں" },
  continuePlanNamed: { en: "Continue {name}'s plan", ur: "{name} کا پلان جاری رکھیں" },
  continuePlan: { en: "Continue your plan", ur: "اپنا پلان جاری رکھیں" },
  startNew: { en: "Start a new plan", ur: "نیا پلان شروع کریں" },
  startNewConfirmTitle: { en: "Start a new plan on this page?", ur: "اس صفحے پر نیا پلان شروع کریں؟" },
  startNewConfirmBody: {
    en: "The plan on this page will be replaced. If you copied or bookmarked its link, that link still opens it.",
    ur: "اس صفحے کا پلان بدل جائے گا۔ اگر آپ نے اس کا لنک کاپی یا بک مارک کیا ہے تو وہ لنک اب بھی اسے کھولے گا۔",
  },
  startNewYes: { en: "Yes, start a new plan", ur: "ہاں، نیا پلان شروع کریں" },
  keepPlan: { en: "Keep this plan", ur: "یہی پلان رکھیں" },
  sampleHeading: { en: "What the fridge sheet looks like", ur: "فریج شیٹ کیسی دکھتی ہے" },
  sampleCaption: {
    en: "A sample for Ammi. Each box gets its own colour and shape, and the pictures show when and how many. Final pictures come after testing with helpers.",
    ur: "امی کے لیے ایک نمونہ۔ ہر ڈبے کا اپنا رنگ اور شکل ہوتی ہے، اور تصویریں بتاتی ہیں کب اور کتنی۔ آخری تصویریں مددگاروں کے ساتھ آزمانے کے بعد آئیں گی۔",
  },
  sampleLabel: { en: "Sample", ur: "نمونہ" },
  switchLang: { en: "اردو", ur: "English" },
  switchLangLabel: { en: "Switch to Urdu", ur: "انگریزی میں دیکھیں" },
  linkInvalid: {
    en: "This link doesn't hold a plan Waqt Pe can read. It may have been cut short when it was copied. Ask for the link again, or start a new plan here.",
    ur: "اس لنک میں ایسا پلان نہیں جو وقت پہ پڑھ سکے۔ شاید کاپی کرتے وقت لنک ادھورا رہ گیا۔ لنک دوبارہ منگوا لیں، یا یہاں نیا پلان شروع کریں۔",
  },
  loading: { en: "Opening your plan…", ur: "آپ کا پلان کھل رہا ہے…" },

  // Setup, shared ------------------------------------------------------------
  continue: { en: "Continue", ur: "آگے چلیں" },
  back: { en: "Back", ur: "واپس" },
  stepOf: { en: "Step {n} of {total}", ur: "مرحلہ {n} از {total}" },
  optional: { en: "optional", ur: "اختیاری" },
  add: { en: "Add", ur: "شامل کریں" },
  removeItem: { en: "Remove {item}", ur: "{item} ہٹائیں" },
  change: { en: "Change", ur: "بدلیں" },
  notBuiltYet: { en: "Coming in the next build", ur: "اگلے ورژن میں آ رہا ہے" },

  // 1. Name ------------------------------------------------------------------
  qName: { en: "Who is this plan for?", ur: "یہ پلان کس کے لیے ہے؟" },
  nameLabel: { en: "Their name, as the family says it", ur: "ان کا نام، جیسے گھر والے پکارتے ہیں" },
  nameHelp: {
    en: "For example, Ammi or Abbu. The sheets and voice note use this name.",
    ur: "مثلاً امی یا ابو۔ شیٹس اور وائس نوٹ میں یہی نام آئے گا۔",
  },
  nameError: {
    en: "Add a name so the sheets can use it. What the family calls them, like Ammi, works best.",
    ur: "نام لکھیں تاکہ شیٹس پر آ سکے۔ جو گھر والے پکارتے ہیں، جیسے امی، وہی بہترین ہے۔",
  },

  // 2. Health ----------------------------------------------------------------
  qHealthNamed: { en: "What should a doctor know about {name}?", ur: "{name} کے بارے میں ڈاکٹر کو کیا معلوم ہونا چاہیے؟" },
  qHealth: { en: "What should a doctor know?", ur: "ڈاکٹر کو کیا معلوم ہونا چاہیے؟" },
  healthHelp: {
    en: "All optional. This goes on the emergency card and the doctor's list, not the fridge sheet.",
    ur: "سب اختیاری ہے۔ یہ ایمرجنسی کارڈ اور ڈاکٹر کی فہرست پر جائے گا، فریج شیٹ پر نہیں۔",
  },
  bloodGroupLabel: { en: "Blood group", ur: "بلڈ گروپ" },
  bloodGroupUnknown: { en: "Not sure", ur: "معلوم نہیں" },
  conditionsLabel: { en: "Conditions that change treatment", ur: "بیماریاں جن سے علاج بدلتا ہے" },
  conditionsHelp: { en: "Tap any that apply, or add your own.", ur: "جو لاگو ہوں ان پر ٹیپ کریں، یا اپنی طرف سے لکھیں۔" },
  addConditionLabel: { en: "Another condition", ur: "کوئی اور بیماری" },
  allergiesLabel: { en: "Allergies", ur: "الرجی" },
  allergiesHelp: { en: "Medicines or foods. Add each one separately.", ur: "دوائیں یا کھانے۔ ہر ایک الگ سے لکھیں۔" },
  addAllergyLabel: { en: "Allergy", ur: "الرجی" },
  condDiabetes: { en: "Diabetes", ur: "شوگر" },
  condBloodThinner: { en: "Takes a blood thinner", ur: "خون پتلا کرنے کی دوا لیتے ہیں" },
  condHeart: { en: "Heart condition", ur: "دل کی بیماری" },
  condBloodPressure: { en: "High blood pressure", ur: "ہائی بلڈ پریشر" },
  condAsthma: { en: "Asthma", ur: "دمہ" },
  condEpilepsy: { en: "Epilepsy", ur: "مرگی" },
  condKidney: { en: "Kidney disease", ur: "گردوں کی بیماری" },

  // 3. Giver -----------------------------------------------------------------
  qGiverNamed: { en: "Who usually gives {name} the medicines?", ur: "{name} کو دوائیں عام طور پر کون دیتا ہے؟" },
  qGiver: { en: "Who usually gives the medicines?", ur: "دوائیں عام طور پر کون دیتا ہے؟" },
  giverSelf: { en: "They take them on their own", ur: "وہ خود لیتے ہیں" },
  giverSelfHelp: { en: "Large text and pictures.", ur: "بڑا لکھا ہوا اور تصویریں۔" },
  giverFamily: { en: "A family member", ur: "گھر کا کوئی فرد" },
  giverFamilyHelp: { en: "Words and pictures, balanced.", ur: "الفاظ اور تصویریں، برابر۔" },
  giverHelperReads: { en: "A helper who reads", ur: "مددگار جو پڑھ سکتے ہیں" },
  giverHelperReadsHelp: { en: "The sheet speaks to the helper by name.", ur: "شیٹ مددگار کو نام سے مخاطب کرتی ہے۔" },
  giverHelperNoRead: { en: "A helper who doesn't read", ur: "مددگار جو پڑھ نہیں سکتے" },
  giverHelperNoReadHelp: { en: "Box photos, stickers and a voice note do the work.", ur: "ڈبوں کی تصویریں، اسٹیکر اور وائس نوٹ سب کچھ بتاتے ہیں۔" },
  helperNameLabel: { en: "Helper's name", ur: "مددگار کا نام" },
  helperNameHelp: {
    en: "So the sheet and voice note can speak to them directly and respectfully.",
    ur: "تاکہ شیٹ اور وائس نوٹ انہیں عزت سے، نام لے کر مخاطب کر سکیں۔",
  },
  giverChanges: { en: "What this sets up", ur: "اس سے کیا ترتیب ہوگا" },
  onLargeText: { en: "Large text on the schedule", ur: "شیڈول پر بڑا لکھا ہوا" },
  onPhotosRequired: { en: "A photo of every medicine box", ur: "ہر دوا کے ڈبے کی تصویر" },
  onPhotosRecommended: { en: "Box photos, recommended", ur: "ڈبوں کی تصویریں، بہتر ہے" },
  onPhotosOptional: { en: "Box photos, if you like", ur: "ڈبوں کی تصویریں، چاہیں تو" },
  onStickers: { en: "A matching sticker for each box", ur: "ہر ڈبے کے لیے ملتا جلتا اسٹیکر" },
  onVoiceNamed: { en: "A voice-note script to read to {helper}", ur: "{helper} کو سنانے کے لیے وائس نوٹ کا متن" },
  onVoice: { en: "A voice-note script to read to the helper", ur: "مددگار کو سنانے کے لیے وائس نوٹ کا متن" },
  onHelperNamed: { en: "The helper's name on the sheet", ur: "شیٹ پر مددگار کا نام" },
  onTextBackground: { en: "Pictures first, words kept small", ur: "پہلے تصویریں، الفاظ چھوٹے" },
  onBalanced: { en: "Words and pictures side by side", ur: "الفاظ اور تصویریں ساتھ ساتھ" },

  // 4. Anchors ---------------------------------------------------------------
  qAnchorsNamed: { en: "What does {name}'s day run by?", ur: "{name} کا دن کس حساب سے چلتا ہے؟" },
  qAnchors: { en: "What does the day run by?", ur: "دن کس حساب سے چلتا ہے؟" },
  anchorsHelp: {
    en: "Medicines are grouped into morning, midday, evening and night. Pick what the home already uses to mark those times.",
    ur: "دوائیں صبح، دوپہر، شام اور رات میں بٹی ہوتی ہیں۔ وہ چنیں جس سے گھر میں یہ وقت پہچانے جاتے ہیں۔",
  },
  anchorMeals: { en: "Meals", ur: "کھانے" },
  anchorMealsHelp: { en: "Breakfast, lunch, dinner, bedtime", ur: "ناشتہ، دوپہر کا کھانا، رات کا کھانا، سونے کا وقت" },
  anchorPrayers: { en: "Prayers", ur: "نماز" },
  anchorPrayersHelp: { en: "Fajr, Zuhr, Maghrib, Isha", ur: "فجر، ظہر، مغرب، عشاء" },
  anchorClock: { en: "Clock times", ur: "گھڑی کا وقت" },
  anchorClockHelp: { en: "Set times, like 8 am", ur: "مقررہ وقت، جیسے صبح 8 بجے" },
  labelsHeading: { en: "What to call each time", ur: "ہر وقت کو کیا کہیں" },
  labelsHelp: {
    en: "Change the words to match your home. The pictures on the sheet stay the same.",
    ur: "الفاظ اپنے گھر کے حساب سے بدل لیں۔ شیٹ پر تصویریں وہی رہیں گی۔",
  },
  labelEn: { en: "In English", ur: "انگریزی میں" },
  labelUr: { en: "In Urdu", ur: "اردو میں" },
  slotMorning: { en: "Morning", ur: "صبح" },
  slotMidday: { en: "Midday", ur: "دوپہر" },
  slotEvening: { en: "Evening", ur: "شام" },
  slotNight: { en: "Night", ur: "رات" },

  // 5. Medicines (placeholder until milestone 3) -----------------------------
  qMedicinesNamed: { en: "What medicines does {name} take?", ur: "{name} کون سی دوائیں لیتے ہیں؟" },
  qMedicines: { en: "What medicines do they take?", ur: "وہ کون سی دوائیں لیتے ہیں؟" },
  medicinesEmptyNamed: {
    en: "Gather {name}'s medicine boxes and the prescription, then add the first one.",
    ur: "{name} کی دواؤں کے ڈبے اور نسخہ اکٹھا کریں، پھر پہلی دوا شامل کریں۔",
  },
  medicinesEmpty: {
    en: "Gather the medicine boxes and the prescription, then add the first one.",
    ur: "دواؤں کے ڈبے اور نسخہ اکٹھا کریں، پھر پہلی دوا شامل کریں۔",
  },
  addMedicine: { en: "Add medicine", ur: "دوا شامل کریں" },
  medicinesFull: {
    en: "That's 8 medicines, one for each colour and shape. Ask the doctor or pharmacist about anything more.",
    ur: "8 دوائیں ہو گئیں، ہر رنگ اور شکل کے لیے ایک۔ اس سے زیادہ کے لیے ڈاکٹر یا فارماسسٹ سے پوچھیں۔",
  },
  editMedicineNamed: { en: "Change {name}", ur: "{name} بدلیں" },
  unnamedMedicine: { en: "Medicine with no name yet", ur: "دوا جس کا ابھی نام نہیں" },
  noDosesYet: { en: "No times added yet", ur: "ابھی کوئی وقت شامل نہیں" },
  noPhotoYet: { en: "No box photo yet", ur: "ابھی ڈبے کی تصویر نہیں" },

  // 5b. Medicine editor ------------------------------------------------------
  qMedicineNew: { en: "Add a medicine", ur: "دوا شامل کریں" },
  qMedicineEdit: { en: "Change {name}", ur: "{name} بدلیں" },
  medicineMissing: {
    en: "This medicine isn't in the plan any more. Go back to the list to see what's there.",
    ur: "یہ دوا اب پلان میں نہیں ہے۔ فہرست پر واپس جا کر دیکھیں کیا موجود ہے۔",
  },
  backToMedicines: { en: "Back to medicines", ur: "دواؤں پر واپس" },
  medNameLabel: { en: "Name, as written on the box", ur: "نام، جیسے ڈبے پر لکھا ہے" },
  medNameHelp: { en: "Copy it exactly, including the strength, like 500 mg.", ur: "بالکل ویسے ہی لکھیں، طاقت سمیت، جیسے 500 mg۔" },
  medNameError: {
    en: "Add the name from the box so the family can check it against the prescription.",
    ur: "ڈبے سے نام لکھیں تاکہ گھر والے اسے نسخے سے ملا سکیں۔",
  },
  medPurposeLabelNamed: { en: "What's it for, in {name}'s words?", ur: "یہ کس لیے ہے، {name} کے الفاظ میں؟" },
  medPurposeLabel: { en: "What's it for, in your own words?", ur: "یہ کس لیے ہے، اپنے الفاظ میں؟" },
  medPurposeHelp: { en: "For example, for sugar or for blood pressure.", ur: "مثلاً شوگر کے لیے یا بلڈ پریشر کے لیے۔" },
  medFormLabel: { en: "What kind of medicine is it?", ur: "یہ کس قسم کی دوا ہے؟" },
  formTablet: { en: "Tablet", ur: "گولی" },
  formCapsule: { en: "Capsule", ur: "کیپسول" },
  formSyrup: { en: "Syrup", ur: "شربت" },
  formDrops: { en: "Drops", ur: "قطرے" },
  formInhaler: { en: "Inhaler", ur: "انہیلر" },
  formInsulin: { en: "Insulin pen", ur: "انسولین پین" },
  medSymbolHeading: { en: "Its sticker", ur: "اس کا اسٹیکر" },
  medSymbolBody: {
    en: "This box gets the {symbol}. The same sticker goes on the box and the fridge sheet, so it's easy to match.",
    ur: "اس ڈبے کا نشان {symbol} ہے۔ یہی اسٹیکر ڈبے اور فریج شیٹ دونوں پر لگے گا، تاکہ ملانا آسان ہو۔",
  },
  medWhenHeadingNamed: { en: "When does {name} take it?", ur: "{name} یہ کب لیتے ہیں؟" },
  medWhenHeading: { en: "When is it taken?", ur: "یہ کب لی جاتی ہے؟" },
  medWhenHelp: {
    en: "Tap each time on the prescription, then say how many and whether it goes with food.",
    ur: "نسخے کے مطابق ہر وقت پر ٹیپ کریں، پھر بتائیں کتنی اور کیا کھانے کے ساتھ۔",
  },
  medWhenError: {
    en: "Tap at least one time of day, so the sheet knows when to give it.",
    ur: "کم از کم ایک وقت پر ٹیپ کریں، تاکہ شیٹ کو پتا ہو کب دینی ہے۔",
  },
  giveAt: { en: "Give at {anchor}", ur: "{anchor} پر دیں" },
  howMany: { en: "How many", ur: "کتنی" },
  fewer: { en: "Fewer", ur: "کم" },
  more: { en: "More", ur: "زیادہ" },
  foodLabel: { en: "Food", ur: "کھانا" },
  foodBefore: { en: "Before food", ur: "کھانے سے پہلے" },
  foodAfter: { en: "After food", ur: "کھانے کے بعد" },
  foodWith: { en: "With food", ur: "کھانے کے ساتھ" },
  foodAny: { en: "Doesn't matter", ur: "کوئی فرق نہیں" },
  saveMedicine: { en: "Save medicine", ur: "دوا محفوظ کریں" },
  removeMedicine: { en: "Remove this medicine", ur: "یہ دوا ہٹائیں" },
  removeMedicineTitleNamed: { en: "Remove {name} from the plan?", ur: "{name} کو پلان سے ہٹائیں؟" },
  removeMedicineTitle: { en: "Remove this medicine from the plan?", ur: "یہ دوا پلان سے ہٹائیں؟" },
  removeMedicineBody: {
    en: "Take its sticker off the box too, so no one gives it by mistake.",
    ur: "اس کا اسٹیکر بھی ڈبے سے اتار دیں، تاکہ کوئی غلطی سے نہ دے۔",
  },
  removeMedicineYes: { en: "Yes, remove it", ur: "ہاں، ہٹا دیں" },
  keepMedicine: { en: "Keep it", ur: "رہنے دیں" },
  boundaryNote: {
    en: "Waqt Pe only arranges what the doctor prescribed. It doesn't check doses or how medicines mix.",
    ur: "وقت پہ صرف وہی ترتیب دیتا ہے جو ڈاکٹر نے لکھا ہے۔ یہ خوراک یا دواؤں کے آپس میں ملنے کو نہیں جانچتا۔",
  },

  // 6. Contacts --------------------------------------------------------------
  qContactsNamed: { en: "Who should people call about {name}?", ur: "{name} کے بارے میں کسے فون کیا جائے؟" },
  qContacts: { en: "Who should people call?", ur: "کسے فون کیا جائے؟" },
  contactsHelp: {
    en: "Up to 3 people. Their names and numbers go on the fridge sheet and the emergency card, in large numerals.",
    ur: "زیادہ سے زیادہ 3 لوگ۔ ان کے نام اور نمبر فریج شیٹ اور ایمرجنسی کارڈ پر بڑے ہندسوں میں آئیں گے۔",
  },
  contactsEmpty: {
    en: "Add the family members a helper or a stranger should call first.",
    ur: "گھر کے وہ لوگ شامل کریں جنہیں مددگار یا کوئی اجنبی سب سے پہلے فون کرے۔",
  },
  contactHeading: { en: "Person {n}", ur: "شخص {n}" },
  contactName: { en: "Name", ur: "نام" },
  contactRelation: { en: "How they're related", ur: "کیا رشتہ ہے" },
  contactRelationHelpNamed: { en: "To {name}. For example, daughter or neighbour.", ur: "{name} سے۔ مثلاً بیٹی یا پڑوسی۔" },
  contactRelationHelp: { en: "For example, daughter or neighbour.", ur: "مثلاً بیٹی یا پڑوسی۔" },
  contactPhone: { en: "Phone number", ur: "فون نمبر" },
  contactPhoneHelp: { en: "Include the country code if they live abroad.", ur: "اگر ملک سے باہر ہیں تو ملک کا کوڈ بھی لکھیں۔" },
  phoneShort: {
    en: "This number looks short. Check it, or keep it as it is.",
    ur: "یہ نمبر چھوٹا لگ رہا ہے۔ دیکھ لیں، یا ایسے ہی رہنے دیں۔",
  },
  phoneLetters: {
    en: "This number has letters in it. Check it, or keep it as it is.",
    ur: "اس نمبر میں حروف ہیں۔ دیکھ لیں، یا ایسے ہی رہنے دیں۔",
  },
  addContact: { en: "Add a person to call", ur: "فون کے لیے کوئی شخص شامل کریں" },
  removeContactNamed: { en: "Remove {name}", ur: "{name} کو ہٹائیں" },
  removeContact: { en: "Remove this person", ur: "یہ شخص ہٹائیں" },
  contactsFull: { en: "That's 3 people, as many as the sheet has room for.", ur: "3 لوگ ہو گئے، شیٹ پر اتنی ہی جگہ ہے۔" },

  // Photos --------------------------------------------------------------------
  photoTake: { en: "Take a photo", ur: "تصویر لیں" },
  photoChoose: { en: "Choose a photo", ur: "تصویر چنیں" },
  photoRetake: { en: "Take a new photo", ur: "نئی تصویر لیں" },
  photoRemove: { en: "Remove photo", ur: "تصویر ہٹائیں" },
  photoSaving: { en: "Saving the photo…", ur: "تصویر محفوظ ہو رہی ہے…" },
  photoUnreadable: {
    en: "Couldn't use that photo. Take it again, or choose a different one.",
    ur: "یہ تصویر استعمال نہیں ہو سکی۔ دوبارہ لیں، یا کوئی اور چنیں۔",
  },
  photoStorage: {
    en: "This browser couldn't store the photo. Private browsing can cause this; try a normal window.",
    ur: "یہ براؤزر تصویر محفوظ نہیں کر سکا۔ پرائیویٹ براؤزنگ کی وجہ سے ایسا ہو سکتا ہے؛ عام ونڈو میں کوشش کریں۔",
  },
  photoMissing: { en: "Photo is on another device", ur: "تصویر دوسری ڈیوائس پر ہے" },
  medPhotoHeading: { en: "Photo of the box", ur: "ڈبے کی تصویر" },
  medPhotoHelp: {
    en: "Photograph the box or strip exactly as it's kept at home, with the name showing. It stays on this device.",
    ur: "ڈبے یا پتے کی تصویر ویسے ہی لیں جیسے گھر میں رکھا ہے، نام نظر آئے۔ یہ اسی ڈیوائس پر رہے گی۔",
  },
  medPhotoNeeded: {
    en: "The helper finds the right box by this photo, so it matters most.",
    ur: "مددگار اسی تصویر سے صحیح ڈبہ پہچانیں گے، اس لیے یہ سب سے اہم ہے۔",
  },
  boxPhotoAltNamed: { en: "Box of {name}", ur: "{name} کا ڈبہ" },
  boxPhotoAlt: { en: "Medicine box", ur: "دوا کا ڈبہ" },
  contactPhotoHeading: { en: "Photo of their face (optional)", ur: "ان کے چہرے کی تصویر (اختیاری)" },
  contactPhotoHelp: {
    en: "Someone who can't read a name can still recognise a face. It stays on this device.",
    ur: "جو نام نہیں پڑھ سکتا وہ چہرہ پہچان سکتا ہے۔ یہ اسی ڈیوائس پر رہے گی۔",
  },
  faceAltNamed: { en: "{name}'s face", ur: "{name} کا چہرہ" },
  faceAlt: { en: "Their face", ur: "ان کا چہرہ" },
  photosMissingTitle: { en: "Photos are on the original device", ur: "تصویریں اصل ڈیوائس پر ہیں" },
  photosMissingBody: {
    en: "The link carries words only. Import the saved file to bring the photos.",
    ur: "لنک میں صرف الفاظ ہوتے ہیں۔ تصویریں لانے کے لیے محفوظ فائل امپورٹ کریں۔",
  },
  photosMissingAction: { en: "Import a saved file", ur: "محفوظ فائل امپورٹ کریں" },

  // 7. Review (placeholder until milestone 5) --------------------------------
  qReview: { en: "Check each medicine against the prescription", ur: "ہر دوا کو نسخے سے ملا لیں" },
  reviewLater: {
    en: "The check comes with the medicines, in a later build. For now, continue to save the plan.",
    ur: "یہ جانچ دواؤں کے ساتھ بعد کے ورژن میں آئے گی۔ ابھی آگے چل کر پلان محفوظ کریں۔",
  },

  // 8. Save ------------------------------------------------------------------
  qSaveNamed: { en: "Keep {name}'s plan safe", ur: "{name} کا پلان محفوظ رکھیں" },
  qSave: { en: "Keep the plan safe", ur: "پلان محفوظ رکھیں" },
  saveBody: {
    en: "The plan lives in this page's link. Copy it and keep it somewhere safe, like a message to yourself or to a brother or sister.",
    ur: "پلان اسی صفحے کے لنک میں ہے۔ اسے کاپی کر کے کسی محفوظ جگہ رکھیں، جیسے خود کو یا بہن بھائی کو بھیجا گیا پیغام۔",
  },
  fileHeading: { en: "Save a copy with photos", ur: "تصویروں سمیت کاپی محفوظ کریں" },
  fileBody: {
    en: "The link can't hold photos. This file holds everything. Keep it as a backup, or send it to family so they can open it on their phone.",
    ur: "لنک میں تصویریں نہیں آ سکتیں۔ اس فائل میں سب کچھ ہے۔ اسے بیک اپ کے طور پر رکھیں، یا گھر والوں کو بھیجیں تاکہ وہ اپنے فون پر کھول سکیں۔",
  },
  downloadFile: { en: "Download saved file", ur: "محفوظ فائل ڈاؤن لوڈ کریں" },
  fileDownloaded: { en: "Saved file downloaded. Photos included: {n}.", ur: "محفوظ فائل ڈاؤن لوڈ ہو گئی۔ شامل تصویریں: {n}۔" },
  fileFailed: {
    en: "Couldn't make the file. Try again, and if it keeps failing, copy the link instead.",
    ur: "فائل نہیں بن سکی۔ دوبارہ کوشش کریں، اور اگر پھر بھی نہ بنے تو لنک کاپی کر لیں۔",
  },
  importHeading: { en: "Open a saved file", ur: "محفوظ فائل کھولیں" },
  importBody: {
    en: "Choose a .waqtpe file saved from Waqt Pe, on this device or another.",
    ur: "وقت پہ سے محفوظ کی گئی .waqtpe فائل چنیں، اس ڈیوائس کی یا کسی اور کی۔",
  },
  importChoose: { en: "Choose a saved file", ur: "محفوظ فائل چنیں" },
  importNotFile: {
    en: "This isn't a Waqt Pe saved file. Choose the file whose name ends in .waqtpe.",
    ur: "یہ وقت پہ کی محفوظ فائل نہیں ہے۔ وہ فائل چنیں جس کا نام .waqtpe پر ختم ہوتا ہے۔",
  },
  importTooBig: {
    en: "This file is too big to be a Waqt Pe saved file. Choose the file whose name ends in .waqtpe.",
    ur: "یہ فائل وقت پہ کی محفوظ فائل ہونے کے لیے بہت بڑی ہے۔ وہ فائل چنیں جس کا نام .waqtpe پر ختم ہوتا ہے۔",
  },
  importConfirmNamed: { en: "Open the saved plan for {name}?", ur: "{name} کا محفوظ پلان کھولیں؟" },
  importConfirm: { en: "Open this saved plan?", ur: "یہ محفوظ پلان کھولیں؟" },
  importConfirmBody: {
    en: "Medicines: {medicines}. Photos: {photos}. It replaces the plan on this page; copy this page's link first if you want to keep it.",
    ur: "دوائیں: {medicines}۔ تصویریں: {photos}۔ یہ اس صفحے کے پلان کی جگہ لے لے گا؛ اگر وہ رکھنا ہے تو پہلے اس صفحے کا لنک کاپی کر لیں۔",
  },
  importYes: { en: "Yes, open it", ur: "ہاں، کھولیں" },
  importCancel: { en: "Cancel", ur: "رہنے دیں" },
  imported: { en: "Opened the saved plan. Photos included: {n}.", ur: "محفوظ پلان کھل گیا۔ شامل تصویریں: {n}۔" },
  summaryHeading: { en: "What's in the plan", ur: "پلان میں کیا ہے" },
  summaryName: { en: "Name", ur: "نام" },
  summaryHealth: { en: "Health", ur: "صحت" },
  summaryGiver: { en: "Gives the medicines", ur: "دوائیں کون دیتا ہے" },
  summaryAnchors: { en: "Day runs by", ur: "دن کا حساب" },
  summaryContacts: { en: "People to call", ur: "فون کے لیے لوگ" },
  summaryNone: { en: "Nothing added", ur: "کچھ شامل نہیں" },
  copyLink: { en: "Copy private link", ur: "نجی لنک کاپی کریں" },
  linkCopied: { en: "Private link copied", ur: "نجی لنک کاپی ہو گیا" },
  copyFailed: {
    en: "Couldn't copy automatically. Copy the address from the browser's address bar instead.",
    ur: "خود بخود کاپی نہیں ہو سکا۔ براؤزر کے ایڈریس بار سے پتا کاپی کر لیں۔",
  },
  clearHeading: { en: "Clear everything on this device", ur: "اس ڈیوائس سے سب کچھ مٹا دیں" },
  clearBody: {
    en: "Removes the plan from this page and deletes anything Waqt Pe stored in this browser. Links you've already shared keep working.",
    ur: "اس صفحے سے پلان ہٹا دیتا ہے اور وقت پہ نے اس براؤزر میں جو کچھ محفوظ کیا ہے وہ مٹا دیتا ہے۔ جو لنک آپ پہلے بھیج چکے ہیں وہ چلتے رہیں گے۔",
  },
  clearConfirmTitle: { en: "Clear everything on this device?", ur: "اس ڈیوائس سے سب کچھ مٹا دیں؟" },
  clearConfirmBody: { en: "This can't be undone.", ur: "یہ واپس نہیں ہو سکتا۔" },
  clearYes: { en: "Yes, clear everything", ur: "ہاں، سب کچھ مٹا دیں" },
  keepEverything: { en: "Keep everything", ur: "سب کچھ رہنے دیں" },
  cleared: { en: "Everything on this device has been cleared.", ur: "اس ڈیوائس سے سب کچھ مٹا دیا گیا۔" },
} satisfies Record<string, Pair>;

export type MessageKey = keyof typeof messages;
