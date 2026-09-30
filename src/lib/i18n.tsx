"use client";

// UI language and document direction. The chosen language is a per-device
// preference (localStorage), not part of the plan, so it never goes in the link.
// Urdu strings need native review before launch.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ur";
export const LANG_STORAGE_KEY = "waqtpe.lang";

export const dirFor = (lang: Lang) => (lang === "ur" ? "rtl" : "ltr");

/**
 * Runs before first paint (inlined in <head>) so an Urdu reader never sees a
 * flash of left-to-right layout. First-party inline script, no network.
 */
export const langBootScript = `try{var l=localStorage.getItem("${LANG_STORAGE_KEY}");if(l==="ur"){document.documentElement.lang="ur";document.documentElement.dir="rtl"}}catch(e){}`;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (document.documentElement.lang === "ur") setLangState("ur");
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    document.documentElement.dir = dirFor(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Storage blocked; the choice lasts for this visit only.
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Pick the string for the current UI language. */
export function useT() {
  const { lang } = useLang();
  return useCallback(<K extends keyof typeof messages>(key: K) => messages[key][lang], [lang]);
}

export const messages = {
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
  switchLang: { en: "اردو", ur: "English" },
  switchLangLabel: { en: "Switch to Urdu", ur: "انگریزی میں دیکھیں" },
  earlyBuild: {
    en: "Early build. The step-by-step setup comes next; for now you can try the basics here.",
    ur: "ابتدائی ورژن۔ قدم بہ قدم سیٹ اپ اگلے مرحلے میں آئے گا؛ ابھی آپ یہاں بنیادی چیزیں آزما سکتے ہیں۔",
  },
  personHeading: { en: "Who is this plan for?", ur: "یہ پلان کس کے لیے ہے؟" },
  nameLabel: { en: "Their name, as the family says it", ur: "ان کا نام، جیسے گھر والے پکارتے ہیں" },
  nameHelp: { en: "For example, Ammi or Abbu.", ur: "مثلاً امی یا ابو۔" },
  bloodGroupLabel: { en: "Blood group (optional)", ur: "بلڈ گروپ (اختیاری)" },
  bloodGroupUnknown: { en: "Not sure", ur: "معلوم نہیں" },
  conditionsLabel: { en: "Conditions a doctor should know about (optional)", ur: "بیماریاں جو ڈاکٹر کو معلوم ہونی چاہییں (اختیاری)" },
  conditionsHelp: { en: "One per line, like diabetes or blood thinners.", ur: "ہر لائن میں ایک، جیسے شوگر یا خون پتلا کرنے کی دوا۔" },
  allergiesLabel: { en: "Allergies (optional)", ur: "الرجی (اختیاری)" },
  allergiesHelp: { en: "One per line.", ur: "ہر لائن میں ایک۔" },
  giverQuestionNamed: { en: "Who usually gives {name} the medicines?", ur: "{name} کو دوائیں عام طور پر کون دیتا ہے؟" },
  giverQuestion: { en: "Who usually gives the medicines?", ur: "دوائیں عام طور پر کون دیتا ہے؟" },
  giverSelf: { en: "They take them on their own", ur: "وہ خود لیتے ہیں" },
  giverSelfHelp: { en: "Large text, pictures, box photos if you like.", ur: "بڑا لکھا ہوا، تصویریں، چاہیں تو ڈبوں کی تصویریں۔" },
  giverFamily: { en: "A family member", ur: "گھر کا کوئی فرد" },
  giverFamilyHelp: { en: "Words and pictures, balanced.", ur: "الفاظ اور تصویریں، برابر۔" },
  giverHelperReads: { en: "A helper who reads", ur: "مددگار جو پڑھ سکتے ہیں" },
  giverHelperReadsHelp: { en: "The helper is named on the sheet.", ur: "شیٹ پر مددگار کا نام لکھا ہوگا۔" },
  giverHelperNoRead: { en: "A helper who doesn't read", ur: "مددگار جو پڑھ نہیں سکتے" },
  giverHelperNoReadHelp: { en: "Box photos, matching stickers, and a voice-note script.", ur: "ڈبوں کی تصویریں، ملتے جلتے اسٹیکر، اور وائس نوٹ کا متن۔" },
  helperNameLabel: { en: "Helper's name (optional)", ur: "مددگار کا نام (اختیاری)" },
  helperNameHelp: { en: "So the sheet and voice note can speak to them directly.", ur: "تاکہ شیٹ اور وائس نوٹ میں انہیں نام سے مخاطب کیا جا سکے۔" },
  anchorsHeading: { en: "What does the day run by?", ur: "دن کس حساب سے چلتا ہے؟" },
  anchorMeals: { en: "Meals", ur: "کھانے" },
  anchorPrayers: { en: "Prayers", ur: "نماز" },
  anchorClock: { en: "Clock times", ur: "گھڑی کا وقت" },
  slotMorning: { en: "Morning", ur: "صبح" },
  slotMidday: { en: "Midday", ur: "دوپہر" },
  slotEvening: { en: "Evening", ur: "شام" },
  slotNight: { en: "Night", ur: "رات" },
  savedRestored: { en: "Plan restored from this link.", ur: "پلان اس لنک سے واپس آ گیا۔" },
  savedNew: { en: "Changes save to this page's link as you type.", ur: "آپ کی تبدیلیاں لکھتے ہی اس صفحے کے لنک میں محفوظ ہو جاتی ہیں۔" },
  linkInvalid: {
    en: "This link doesn't hold a plan Waqt Pe can read. It may have been cut short when it was copied. Ask for the link again, or start a new plan here.",
    ur: "اس لنک میں ایسا پلان نہیں جو وقت پہ پڑھ سکے۔ شاید کاپی کرتے وقت لنک ادھورا رہ گیا۔ لنک دوبارہ منگوا لیں، یا یہاں نیا پلان شروع کریں۔",
  },
  copyLink: { en: "Copy private link", ur: "نجی لنک کاپی کریں" },
  linkCopied: { en: "Private link copied", ur: "نجی لنک کاپی ہو گیا" },
  copyFailed: {
    en: "Couldn't copy automatically. Copy the address from the browser's address bar instead.",
    ur: "خود بخود کاپی نہیں ہو سکا۔ براؤزر کے ایڈریس بار سے پتا کاپی کر لیں۔",
  },
  loadSample: { en: "Load a sample plan", ur: "نمونے کا پلان دیکھیں" },
  clearHeading: { en: "Clear everything on this device", ur: "اس ڈیوائس سے سب کچھ مٹا دیں" },
  clearBody: {
    en: "Removes the plan from this page and deletes anything Waqt Pe stored in this browser. Links you've already shared keep working.",
    ur: "اس صفحے سے پلان ہٹا دیتا ہے اور وقت پہ نے اس براؤزر میں جو کچھ محفوظ کیا ہے وہ مٹا دیتا ہے۔ جو لنک آپ پہلے بھیج چکے ہیں وہ چلتے رہیں گے۔",
  },
  clearConfirm: { en: "Clear everything on this device? This can't be undone.", ur: "اس ڈیوائس سے سب کچھ مٹا دیں؟ یہ واپس نہیں ہو سکتا۔" },
  cleared: { en: "Everything on this device has been cleared.", ur: "اس ڈیوائس سے سب کچھ مٹا دیا گیا۔" },
  planSummary: { en: "What's in the link", ur: "لنک میں کیا ہے" },
  medicinesCount: { en: "Medicines", ur: "دوائیں" },
  contactsCount: { en: "Contacts", ur: "رابطے" },
  linkLength: { en: "Link length", ur: "لنک کی لمبائی" },
  characters: { en: "characters", ur: "حروف" },
  back: { en: "Back", ur: "واپس" },
  stepOf: { en: "Step {n} of {total}", ur: "مرحلہ {n} از {total}" },
  loading: { en: "Opening your plan…", ur: "آپ کا پلان کھل رہا ہے…" },
} satisfies Record<string, Record<Lang, string>>;

/** Fill {placeholders}. Values are inserted as plain text. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}

/**
 * Like fill(), but returns nodes and wraps each value in <bdi>, so a name in
 * one script inside a sentence in another keeps its order.
 */
export function fillNodes(template: string, values: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    return m ? <bdi key={i}>{values[m[1]]}</bdi> : part;
  });
}
