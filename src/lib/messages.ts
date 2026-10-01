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
    en: "Describe one person's medicines once. Waqt Pe turns them into five things your household can use, even someone who doesn't read.",
    ur: "ایک شخص کی دوائیں ایک بار لکھیں۔ وقت پہ انہیں پانچ ایسی چیزوں میں بدل دیتا ہے جو آپ کے گھر میں ہر کوئی استعمال کر سکے، وہ بھی جو پڑھ نہیں سکتا۔",
  },
  privacyTitle: { en: "Nothing you enter leaves this device.", ur: "آپ جو کچھ لکھیں گے وہ اس فون یا کمپیوٹر سے باہر نہیں جائے گا۔" },
  privacyBody: {
    en: "No account and no server. Your plan is saved inside this page's link and on this phone.",
    ur: "نہ کوئی اکاؤنٹ، نہ کوئی سرور۔ آپ کا پلان اسی صفحے کے لنک میں اور اسی فون پر محفوظ ہوتا ہے۔",
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
  seeSample: { en: "See a sample for Ammi", ur: "امی کے لیے نمونہ دیکھیں" },
  heroHelper: { en: "Keep the medicine boxes and the prescription nearby.", ur: "دواؤں کے ڈبے اور نسخہ پاس رکھیں۔" },
  getHeading: { en: "What you'll get", ur: "آپ کو کیا ملے گا" },
  getHelp: { en: "Some are printed for the fridge, some live on a phone.", ur: "کچھ فریج پر لگانے کے لیے چھپتی ہیں، کچھ فون پر رہتی ہیں۔" },
  tagPrint: { en: "Print", ur: "پرنٹ" },
  tagPhone: { en: "Phone", ur: "فون" },
  getFridge: { en: "Fridge sheet", ur: "فریج شیٹ" },
  getFridgeBody: {
    en: "For whoever gives the medicines, even if they can't read. Box photos, pictures, and a tick grid.",
    ur: "دوا دینے والے کے لیے، چاہے وہ پڑھ نہ سکیں۔ ڈبوں کی تصویریں، اشارے، اور ٹک لگانے کے خانے۔",
  },
  getStickers: { en: "Box stickers", ur: "ڈبوں کے اسٹیکر" },
  getStickersBody: {
    en: "One symbol for each medicine box, matching the sheet, so the right box is easy to find.",
    ur: "ہر دوا کے ڈبے کے لیے ایک نشان، شیٹ سے ملتا ہوا، تاکہ صحیح ڈبہ آسانی سے ملے۔",
  },
  getVoice: { en: "Voice-note script", ur: "وائس نوٹ کا متن" },
  getVoiceBody: {
    en: "Read it aloud in your own voice and send it to the helper on WhatsApp.",
    ur: "اپنی آواز میں پڑھ کر واٹس ایپ پر مددگار کو بھیج دیں۔",
  },
  getDoctor: { en: "Doctor's list", ur: "ڈاکٹر کی فہرست" },
  getDoctorBody: {
    en: "Every medicine, dose, allergy, and condition on one page for appointments.",
    ur: "ہر دوا، خوراک، الرجی اور بیماری ایک صفحے پر، ڈاکٹر کے پاس لے جانے کے لیے۔",
  },
  getLock: { en: "Emergency lock screen", ur: "ایمرجنسی لاک اسکرین" },
  getLockBody: {
    en: "A wallpaper that tells a stranger or paramedic what they need to know.",
    ur: "فون کا ایسا وال پیپر جو کسی اجنبی یا ایمبولینس والے کو ضروری باتیں بتائے۔",
  },
  howHeading: { en: "How it works", ur: "یہ کیسے کام کرتا ہے" },
  how1Title: { en: "Tell us about them", ur: "ان کے بارے میں بتائیں" },
  how1Body: { en: "Their name, who gives the medicines, and when they eat or pray.", ur: "ان کا نام، دوائیں کون دیتا ہے، اور وہ کب کھاتے یا نماز پڑھتے ہیں۔" },
  how2Title: { en: "Add each medicine", ur: "ہر دوا شامل کریں" },
  how2Body: { en: "Type the name from the box and take a photo of it.", ur: "ڈبے سے نام لکھیں اور اس کی تصویر لیں۔" },
  how3Title: { en: "Check, then print", ur: "جانچیں، پھر پرنٹ کریں" },
  how3Body: { en: "Match each one against the prescription. Then everything is ready.", ur: "ہر ایک کو نسخے سے ملائیں۔ پھر سب کچھ تیار ہے۔" },
  openSavedFile: { en: "Open a saved .waqtpe file", ur: "محفوظ کی ہوئی waqtpe فائل کھولیں" },
  sampleNotice: {
    en: "This is a sample. Start your own plan to make one for your family.",
    ur: "یہ ایک نمونہ ہے۔ اپنے گھر والوں کے لیے بنانے کے لیے اپنا پلان شروع کریں۔",
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
  reviewHelp: {
    en: "Hold the prescription next to each box. Tick a medicine only when its name, how many and when all match.",
    ur: "ہر ڈبے کے ساتھ نسخہ رکھیں۔ دوا پر ٹک تب ہی لگائیں جب اس کا نام، کتنی اور کب، سب مل جائیں۔",
  },
  reviewEmpty: {
    en: "There are no medicines to check yet. Add them first.",
    ur: "ابھی جانچنے کے لیے کوئی دوا نہیں۔ پہلے دوائیں شامل کریں۔",
  },
  reviewCount: { en: "Checked: {n} of {total}", ur: "جانچی گئیں: {total} میں سے {n}" },
  reviewMatches: { en: "Matches the prescription", ur: "نسخے سے ملتی ہے" },
  reviewAllDone: {
    en: "Every medicine is checked. The sheets are ready.",
    ur: "ہر دوا جانچ لی گئی۔ شیٹس تیار ہیں۔",
  },
  reviewNoPhoto: { en: "No box photo", ur: "ڈبے کی تصویر نہیں" },
  reviewPhotoNeeded: {
    en: "Add a box photo, so the helper can match the box.",
    ur: "ڈبے کی تصویر شامل کریں، تاکہ مددگار ڈبہ پہچان سکیں۔",
  },
  doseLine: { en: "{anchor}: {quantity}, {food}", ur: "{anchor}: {quantity}، {food}" },
  doseFoodBefore: { en: "before food", ur: "کھانے سے پہلے" },
  doseFoodAfter: { en: "after food", ur: "کھانے کے بعد" },
  doseFoodWith: { en: "with food", ur: "کھانے کے ساتھ" },
  doseFoodAny: { en: "with or without food", ur: "کھانے کے ساتھ یا بغیر" },
  seeSheets: { en: "See the sheets", ur: "شیٹس دیکھیں" },
  cardChecked: { en: "Checked against the prescription", ur: "نسخے سے جانچی گئی" },
  recheckNamed: {
    en: "You changed {name}, so check it against the prescription again before printing.",
    ur: "آپ نے {name} بدلی ہے، اس لیے پرنٹ سے پہلے اسے نسخے سے دوبارہ ملا لیں۔",
  },
  recheck: {
    en: "You changed this medicine, so check it against the prescription again before printing.",
    ur: "آپ نے یہ دوا بدلی ہے، اس لیے پرنٹ سے پہلے اسے نسخے سے دوبارہ ملا لیں۔",
  },

  // 9. Outputs hub -----------------------------------------------------------
  outputsTitleNamed: { en: "{name}'s sheets", ur: "{name} کی شیٹس" },
  outputsTitle: { en: "The sheets", ur: "شیٹس" },
  outputsHelp: {
    en: "Everything here is made on this device from the plan on this page.",
    ur: "یہاں سب کچھ اسی ڈیوائس پر، اسی صفحے کے پلان سے بنتا ہے۔",
  },
  outputsLockedTitle: { en: "Check the medicines first", ur: "پہلے دوائیں جانچ لیں" },
  outputsLockedBody: {
    en: "The fridge sheet, stickers, voice note and doctor's list unlock when every medicine is checked against the prescription.",
    ur: "فریج شیٹ، اسٹیکر، وائس نوٹ اور ڈاکٹر کی فہرست تب کھلیں گے جب ہر دوا نسخے سے جانچ لی جائے۔",
  },
  outputsNotChecked: { en: "Not checked yet: {names}.", ur: "ابھی نہیں جانچی گئیں: {names}۔" },
  outputsNoMedicines: {
    en: "Add medicines first. The sheets are made from them.",
    ur: "پہلے دوائیں شامل کریں۔ شیٹس انہی سے بنتی ہیں۔",
  },
  goReview: { en: "Check the medicines", ur: "دوائیں جانچیں" },
  goMedicines: { en: "Add medicines", ur: "دوائیں شامل کریں" },
  outputFridge: { en: "Fridge sheet", ur: "فریج شیٹ" },
  outputFridgeHelp: {
    en: "The daily schedule with box photos and pictures, and a weekly tick grid.",
    ur: "روزانہ کا شیڈول ڈبوں کی تصویروں اور نشانوں کے ساتھ، اور ہفتہ وار ٹک والا خانہ۔",
  },
  outputStickers: { en: "Sticker sheet", ur: "اسٹیکر شیٹ" },
  outputStickersHelp: { en: "One sticker for each box, matching the fridge sheet.", ur: "ہر ڈبے کے لیے ایک اسٹیکر، فریج شیٹ سے ملتا ہوا۔" },
  outputVoice: { en: "Voice-note script", ur: "وائس نوٹ کا متن" },
  outputVoiceHelpNamed: {
    en: "Words to read aloud and send to {helper} as a WhatsApp voice note.",
    ur: "بلند آواز سے پڑھ کر {helper} کو واٹس ایپ وائس نوٹ میں بھیجنے کے الفاظ۔",
  },
  outputVoiceHelp: {
    en: "Words to read aloud and send as a WhatsApp voice note.",
    ur: "بلند آواز سے پڑھ کر واٹس ایپ وائس نوٹ میں بھیجنے کے الفاظ۔",
  },
  outputDoctor: { en: "Doctor's list", ur: "ڈاکٹر کی فہرست" },
  outputDoctorHelp: {
    en: "One page of medicines, doses, conditions and allergies, for appointments and pharmacies.",
    ur: "دواؤں، خوراک، بیماریوں اور الرجی کا ایک صفحہ، ڈاکٹر اور فارمیسی کے لیے۔",
  },
  outputLockScreen: { en: "Emergency lock-screen card", ur: "ایمرجنسی لاک اسکرین کارڈ" },
  outputLockScreenHelp: {
    en: "A phone wallpaper a stranger can read in an emergency without unlocking the phone.",
    ur: "فون کا وال پیپر جو ایمرجنسی میں کوئی اجنبی فون کھولے بغیر پڑھ سکے۔",
  },
  outputLocked: { en: "Locked until every medicine is checked", ur: "ہر دوا جانچنے تک بند" },
  outputComing: { en: "Coming in a later build", ur: "بعد کے ورژن میں آ رہا ہے" },
  openOutput: { en: "Open", ur: "کھولیں" },

  // 9a. Fridge sheet (screen) --------------------------------------------------
  paperLabel: { en: "Paper size", ur: "کاغذ کا سائز" },
  paperA4: { en: "A4", ur: "A4" },
  paperLetter: { en: "US Letter", ur: "US Letter" },
  versionFirst: {
    en: "This prints as version 1, with a {colour} border.",
    ur: "یہ ورژن 1 کے طور پر پرنٹ ہوگی، {colour} کنارے کے ساتھ۔",
  },
  versionSame: {
    en: "Nothing has changed since version {n} was printed on {date}. Printing again keeps version {n}.",
    ur: "ورژن {n} کے پرنٹ ({date}) کے بعد کچھ نہیں بدلا۔ دوبارہ پرنٹ کرنے پر ورژن {n} ہی رہے گا۔",
  },
  versionChanged: {
    en: "The plan has changed since version {old} was printed. This prints as version {n}, with a {colour} border. Put it up and take the old sheet down.",
    ur: "ورژن {old} کے پرنٹ کے بعد پلان بدل گیا ہے۔ یہ ورژن {n} کے طور پر {colour} کنارے کے ساتھ پرنٹ ہوگی۔ اسے لگائیں اور پرانی شیٹ اتار دیں۔",
  },
  borderIndigo: { en: "dark blue", ur: "گہرا نیلا" },
  borderTeal: { en: "teal", ur: "فیروزی" },
  borderMaroon: { en: "maroon", ur: "عنابی" },
  borderOlive: { en: "olive", ur: "زیتونی" },
  page1Label: { en: "Page 1: the schedule", ur: "صفحہ 1: شیڈول" },
  page2Label: { en: "Page 2: the tick grid, to replace each week", ur: "صفحہ 2: ٹک والا خانہ، ہر ہفتے نیا" },
  printFridge: { en: "Print fridge sheet", ur: "فریج شیٹ پرنٹ کریں" },
  printGrid: { en: "Print tick grid only", ur: "صرف ٹک والا خانہ پرنٹ کریں" },
  fridgeReady: { en: "Fridge sheet ready. Version {n} has a {colour} border.", ur: "فریج شیٹ تیار ہے۔ ورژن {n} کا کنارہ {colour} ہے۔" },
  gridReady: { en: "Tick grid ready.", ur: "ٹک والا خانہ تیار ہے۔" },
  printHelp: {
    en: "In the print window, choose the paper size above and turn on background graphics, so the colours print.",
    ur: "پرنٹ کی ونڈو میں اوپر والا کاغذ کا سائز چنیں اور بیک گراؤنڈ گرافکس آن کریں، تاکہ رنگ پرنٹ ہوں۔",
  },
  researchTitle: { en: "Research mode", ur: "تحقیق کا موڈ" },
  researchBody: {
    en: "For test sessions. Changes here only affect this preview and print; the family's plan stays as it is.",
    ur: "آزمائشی سیشن کے لیے۔ یہاں کی تبدیلیاں صرف اس پیش منظر اور پرنٹ پر اثر کرتی ہیں؛ گھر والوں کا پلان ویسا ہی رہتا ہے۔",
  },
  researchFood: { en: "Food pictogram", ur: "کھانے کا نشان" },
  foodSequence: { en: "Sequence with arrow", ur: "تیر کے ساتھ ترتیب" },
  foodPlate: { en: "Full or empty plate", ur: "بھری یا خالی پلیٹ" },
  researchTick: { en: "Tick grid", ur: "ٹک والا خانہ" },
  tickWeekSheet: { en: "One sheet per week", ur: "ہر ہفتے ایک شیٹ" },
  tickColourColumns: { en: "Colour-coded days", ur: "رنگوں والے دن" },

  // 9c. Sticker sheet ------------------------------------------------------------
  stickerSizeLabel: { en: "Sticker size", ur: "اسٹیکر کا سائز" },
  stickerSmall: { en: "Small, 20 mm", ur: "چھوٹا، 20 ملی میٹر" },
  stickerMedium: { en: "Medium, 30 mm", ur: "درمیانہ، 30 ملی میٹر" },
  stickerLarge: { en: "Large, 40 mm", ur: "بڑا، 40 ملی میٹر" },
  stickersHelp: {
    en: "Cut along the dashed lines and stick each one on the box with the same name, with clear tape or on label paper. The same shape is on the fridge sheet.",
    ur: "کٹی ہوئی لکیروں پر کاٹیں اور ہر ایک کو اسی نام والے ڈبے پر لگائیں، شفاف ٹیپ سے یا لیبل پیپر پر۔ یہی نشان فریج شیٹ پر بھی ہے۔",
  },
  actualSizeHelp: {
    en: "In the print window, choose 100% or Actual size, not Fit to page, so the stickers come out the right size. Check the 50 mm line with a ruler.",
    ur: "پرنٹ کی ونڈو میں 100% یا Actual size چنیں، Fit to page نہیں، تاکہ اسٹیکر صحیح سائز میں آئیں۔ 50 ملی میٹر والی لکیر رولر سے ناپ لیں۔",
  },
  printStickers: { en: "Print sticker sheet", ur: "اسٹیکر شیٹ پرنٹ کریں" },
  stickersReady: {
    en: "Sticker sheet ready. Stick each one on the box with the same name.",
    ur: "اسٹیکر شیٹ تیار ہے۔ ہر ایک کو اسی نام والے ڈبے پر لگائیں۔",
  },
  stickerCalibration: {
    en: "This line should measure 50 mm. If it's shorter, print again at 100% (actual size).",
    ur: "یہ لکیر 50 ملی میٹر ہونی چاہیے۔ اگر چھوٹی ہے تو 100% (اصل سائز) پر دوبارہ پرنٹ کریں۔",
  },
  stickerCut: { en: "Cut along the dashed lines", ur: "کٹی ہوئی لکیروں پر کاٹیں" },

  // 9d. Doctor's list ------------------------------------------------------------
  // Printed in clinical English (SPEC.md: "precise text" for doctors). The Urdu
  // is kept for the screen and in case a family asks for an Urdu copy later.
  printDoctor: { en: "Print doctor's list", ur: "ڈاکٹر کی فہرست پرنٹ کریں" },
  doctorReady: { en: "Doctor's list ready.", ur: "ڈاکٹر کی فہرست تیار ہے۔" },
  doctorHelp: {
    en: "One page in plain clinical English, for appointments and pharmacies.",
    ur: "سادہ طبی انگریزی میں ایک صفحہ، ڈاکٹر اور فارمیسی کے لیے۔",
  },
  docTitle: { en: "Current medicines", ur: "موجودہ دوائیں" },
  docColMedicine: { en: "Medicine (as on the box)", ur: "دوا (جیسے ڈبے پر)" },
  docColForm: { en: "Form", ur: "قسم" },
  docColDose: { en: "Dose and timing", ur: "خوراک اور وقت" },
  docColFood: { en: "Food", ur: "کھانا" },
  docColPurpose: { en: "Family's note", ur: "گھر والوں کا نوٹ" },
  docTiming: { en: "{quantity}, {slot} ({anchor})", ur: "{quantity}، {slot} ({anchor})" },
  docConditions: { en: "Conditions", ur: "بیماریاں" },
  docAllergies: { en: "Allergies", ur: "الرجی" },
  docBloodGroup: { en: "Blood group", ur: "بلڈ گروپ" },
  docContacts: { en: "Family contacts", ur: "گھر والوں سے رابطہ" },
  docNotRecorded: { en: "Not recorded", ur: "درج نہیں" },
  docNoneListed: {
    en: "None listed by the family (this is not a record of no known allergies)",
    ur: "گھر والوں نے کوئی درج نہیں کی (اس کا مطلب یہ نہیں کہ کوئی الرجی نہیں)",
  },
  docConditionsNone: { en: "None listed by the family", ur: "گھر والوں نے کوئی درج نہیں کی" },
  docPrinted: { en: "Printed {date}", ur: "پرنٹ {date}" },
  docFooter: {
    en: "Written by the family from the prescription, using Waqt Pe. Please check it against the current prescription. It contains no medical advice.",
    ur: "گھر والوں نے نسخے سے، وقت پہ کی مدد سے لکھی۔ براہ کرم موجودہ نسخے سے ملا لیں۔ اس میں کوئی طبی مشورہ نہیں۔",
  },
  slotLowerMorning: { en: "morning", ur: "صبح" },
  slotLowerMidday: { en: "midday", ur: "دوپہر" },
  slotLowerEvening: { en: "evening", ur: "شام" },
  slotLowerNight: { en: "night", ur: "رات" },

  // 9e. Voice-note script (screen) ------------------------------------------------
  voiceHelpNamed: {
    en: "Read this aloud to {helper} and send it as a WhatsApp voice note. It follows the fridge sheet from top to bottom.",
    ur: "یہ {helper} کو بلند آواز سے پڑھ کر سنائیں اور واٹس ایپ وائس نوٹ میں بھیج دیں۔ یہ فریج شیٹ کی ترتیب سے اوپر سے نیچے چلتا ہے۔",
  },
  voiceHelp: {
    en: "Read this aloud to whoever gives the medicines, and send it as a WhatsApp voice note. It follows the fridge sheet from top to bottom.",
    ur: "جو دوائیں دیتا ہے اسے یہ بلند آواز سے پڑھ کر سنائیں اور واٹس ایپ وائس نوٹ میں بھیج دیں۔ یہ فریج شیٹ کی ترتیب سے اوپر سے نیچے چلتا ہے۔",
  },
  voiceOwnWords: {
    en: "Any language you share is fine, like Punjabi, Sindhi, Pashto or Saraiki. Say it in your own words and keep the same order. Waqt Pe doesn't record or store any audio.",
    ur: "کوئی بھی زبان جو آپ دونوں بولتے ہیں ٹھیک ہے، جیسے پنجابی، سندھی، پشتو یا سرائیکی۔ اپنے الفاظ میں کہیں اور ترتیب وہی رکھیں۔ وقت پہ کوئی آواز ریکارڈ یا محفوظ نہیں کرتا۔",
  },
  copyScriptEn: { en: "Copy English script", ur: "انگریزی متن کاپی کریں" },
  copyScriptUr: { en: "Copy Urdu script", ur: "اردو متن کاپی کریں" },
  scriptCopied: { en: "Copied. Paste it into WhatsApp, or read it from here.", ur: "کاپی ہو گیا۔ واٹس ایپ میں پیسٹ کریں، یا یہیں سے پڑھیں۔" },
  scriptCopyFailed: {
    en: "Couldn't copy automatically. Press and hold the script to select and copy it.",
    ur: "خود بخود کاپی نہیں ہو سکا۔ متن کو دبا کر رکھیں، پھر چن کر کاپی کریں۔",
  },

  // 9f. Voice-note script templates (SPEC.md → Voice-note script) -----------------
  // Fixed templates, never AI. Word tables for agreement live in src/lib/voice.ts.
  voiceOpeningNamed: { en: "{helper}, here's how {person}'s medicines go.", ur: "{helper}، یہ {person} کی دوائیوں کا طریقہ ہے۔" },
  voiceOpening: { en: "Here's how {person}'s medicines go.", ur: "یہ {person} کی دوائیوں کا طریقہ ہے۔" },
  voiceDose: { en: "{when}. The {symbol} box. {quantity}.", ur: "{when}۔ {symbol} والا ڈبہ۔ {quantity}۔" },
  voiceClosing: { en: "If anything is unclear, call me.", ur: "کچھ سمجھ نہ آئے تو مجھے فون کریں۔" },

  // 9g. Lock-screen card (screen) --------------------------------------------------
  lockPrivacyTitle: { en: "Anyone holding the phone can see this", ur: "فون پکڑنے والا ہر شخص یہ دیکھ سکتا ہے" },
  lockPrivacyBodyNamed: {
    en: "Show only what a stranger needs to help {name}. Never put a home address on a lock screen.",
    ur: "صرف وہ دکھائیں جو کسی اجنبی کو {name} کی مدد کے لیے چاہیے۔ لاک اسکرین پر کبھی گھر کا پتا نہ لکھیں۔",
  },
  lockPrivacyBody: {
    en: "Show only what a stranger needs to help. Never put a home address on a lock screen.",
    ur: "صرف وہ دکھائیں جو کسی اجنبی کو مدد کے لیے چاہیے۔ لاک اسکرین پر کبھی گھر کا پتا نہ لکھیں۔",
  },
  lockPhoneLabel: { en: "Phone shape", ur: "فون کی شکل" },
  lockIphone: { en: "iPhone, 1170 × 2532", ur: "آئی فون، 1170 × 2532" },
  lockAndroid: { en: "Android, 1080 × 2400", ur: "اینڈرائیڈ، 1080 × 2400" },
  lockPhoneHelp: {
    en: "Most recent phones are close to one of these. If the picture doesn't fill the screen, try the other.",
    ur: "زیادہ تر نئے فون ان میں سے کسی ایک کے قریب ہیں۔ اگر تصویر پوری اسکرین پر نہ آئے تو دوسرا آزمائیں۔",
  },
  lockLayoutLabel: { en: "Who is it for?", ur: "یہ کس کے لیے ہے؟" },
  lockLayoutText: { en: "Anyone who finds the phone", ur: "جسے بھی فون ملے" },
  lockLayoutTextHelp: {
    en: "Name, health details and who to call, in English and Urdu.",
    ur: "نام، صحت کی معلومات اور کسے فون کرنا ہے، انگریزی اور اردو میں۔",
  },
  lockLayoutFacesNamed: { en: "{name}, if they don't read", ur: "{name} کے لیے، اگر وہ پڑھ نہیں سکتے" },
  lockLayoutFaces: { en: "The owner, if they don't read", ur: "فون والے کے لیے، اگر وہ پڑھ نہیں سکتے" },
  lockLayoutFacesHelp: {
    en: "Large faces of family members with their numbers, to call in an emergency.",
    ur: "گھر والوں کے بڑے چہرے ان کے نمبروں کے ساتھ، ایمرجنسی میں فون کرنے کے لیے۔",
  },
  lockFieldsLabel: { en: "What to show", ur: "کیا دکھانا ہے" },
  lockFieldName: { en: "Name", ur: "نام" },
  lockFieldBlood: { en: "Blood group", ur: "بلڈ گروپ" },
  lockFieldConditions: { en: "Conditions", ur: "بیماریاں" },
  lockFieldAllergies: { en: "Allergies", ur: "الرجی" },
  lockFieldContacts: { en: "People to call", ur: "فون کے لیے لوگ" },
  lockFieldsHelp: {
    en: "Only things you've entered can be shown. There's deliberately no address.",
    ur: "صرف وہی دکھایا جا سکتا ہے جو آپ نے لکھا ہے۔ پتا جان بوجھ کر شامل نہیں۔",
  },
  lockNoFaces: {
    en: "Add people to call first. Their faces and numbers make this card.",
    ur: "پہلے فون کے لیے لوگ شامل کریں۔ ان کے چہرے اور نمبر ہی یہ کارڈ بناتے ہیں۔",
  },
  lockAddPeople: { en: "Add people to call", ur: "فون کے لیے لوگ شامل کریں" },
  lockClockToggle: { en: "Show the clock and buttons on the preview", ur: "پیش منظر پر گھڑی اور بٹن دکھائیں" },
  lockPreviewHelp: {
    en: "Clocks, notifications and buttons sit in different places on different phones, so the card keeps to the middle.",
    ur: "مختلف فونز پر گھڑی، اطلاعات اور بٹن مختلف جگہ ہوتے ہیں، اس لیے کارڈ درمیان میں رہتا ہے۔",
  },
  lockPreviewLabel: { en: "Preview with a pretend clock", ur: "فرضی گھڑی کے ساتھ پیش منظر" },
  lockDownload: { en: "Download lock-screen picture", ur: "لاک اسکرین تصویر ڈاؤن لوڈ کریں" },
  lockDownloaded: { en: "Picture saved. Now set it as the lock screen:", ur: "تصویر محفوظ ہو گئی۔ اب اسے لاک اسکرین بنائیں:" },
  lockHowIphone: {
    en: "iPhone: open Photos, choose the picture, tap Share, then Use as Wallpaper.",
    ur: "آئی فون: فوٹوز کھولیں، تصویر چنیں، شیئر پر ٹیپ کریں، پھر Use as Wallpaper۔",
  },
  lockHowAndroid: {
    en: "Android: open Gallery or Photos, choose the picture, open the menu, then Set as wallpaper and Lock screen.",
    ur: "اینڈرائیڈ: گیلری یا فوٹوز کھولیں، تصویر چنیں، مینو کھولیں، پھر Set as wallpaper اور Lock screen۔",
  },
  lockCheck: {
    en: "Then lock the phone and check that nothing is hidden under the clock or the buttons.",
    ur: "پھر فون لاک کریں اور دیکھیں کہ گھڑی یا بٹنوں کے نیچے کچھ چھپا تو نہیں۔",
  },
  lockMedicalId: {
    en: "If you can, also fill in Medical ID on iPhone or Emergency information on Android. Not every responder checks it, so this card helps as well.",
    ur: "اگر ہو سکے تو آئی فون پر Medical ID یا اینڈرائیڈ پر Emergency information بھی بھر دیں۔ ہر مددگار اسے نہیں دیکھتا، اس لیے یہ کارڈ بھی کام آتا ہے۔",
  },
  lockCrowded: {
    en: "There's a lot on this card, so the words are small. Switching off a few things makes them bigger.",
    ur: "اس کارڈ پر بہت کچھ ہے، اس لیے الفاظ چھوٹے ہیں۔ کچھ چیزیں بند کرنے سے وہ بڑے ہو جائیں گے۔",
  },
  lockFailed: {
    en: "Couldn't make the picture. Try again, or try a different browser.",
    ur: "تصویر نہیں بن سکی۔ دوبارہ کوشش کریں، یا کوئی اور براؤزر آزمائیں۔",
  },

  // 9h. Drawn on the lock-screen card (always both languages) ----------------------
  lockEmergency: { en: "In an emergency", ur: "ایمرجنسی میں" },
  lockBlood: { en: "Blood group", ur: "بلڈ گروپ" },
  lockConditions: { en: "Conditions", ur: "بیماریاں" },
  lockAllergies: { en: "Allergic to", ur: "الرجی" },
  lockCall: { en: "Please call", ur: "براہ کرم فون کریں" },

  // 9b. Printed on the sheet (always both languages) ---------------------------
  sheetFor: { en: "For {helper}", ur: "{helper} کے لیے" },
  sheetCall: { en: "If anything is unclear, call", ur: "کچھ سمجھ نہ آئے تو فون کریں" },
  sheetVersion: { en: "Version {n}", ur: "ورژن {n}" },
  sheetPrinted: { en: "Printed {date}", ur: "پرنٹ {date}" },
  tickTitle: { en: "Tick a box each time you give a medicine", ur: "ہر بار دوا دینے کے بعد خانے میں ٹک لگائیں" },
  weekStarting: { en: "Week starting", ur: "ہفتہ شروع" },
  saveAndShare: { en: "Save and share the plan", ur: "پلان محفوظ کریں اور بھیجیں" },

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
