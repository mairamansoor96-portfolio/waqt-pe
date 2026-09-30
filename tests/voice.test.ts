import { describe, expect, it } from "vitest";
import { samplePlan } from "@/lib/sample";
import { tickRows } from "@/lib/sheet";
import { scriptText, spokenQuantity, spokenSymbol, voiceScript } from "@/lib/voice";
import { SYMBOLS } from "@/lib/plan";

/** Drop the invisible direction marks, to compare the words. */
const plain = (s: string) => s.replace(/[⁦-⁩]/g, "");
const texts = (plan = samplePlan(), lang: "en" | "ur" = "en") => voiceScript(plan, lang).map((l) => plain(l.text));

describe("voice-note script", () => {
  it("matches the spec's example in both languages", () => {
    expect(texts()[1]).toBe("Morning, after breakfast. The blue star box. One tablet.");
    expect(texts(samplePlan(), "ur")[1]).toBe("صبح، ناشتے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔");
  });

  it("opens with the helper's name and closes with a call", () => {
    expect(texts()[0]).toBe("Shabnam, here's how Ammi's medicines go.");
    expect(texts(samplePlan(), "ur")[0]).toBe("Shabnam، یہ Ammi کی دوائیوں کا طریقہ ہے۔");
    expect(texts().at(-1)).toBe("If anything is unclear, call me.");
    const noHelper = { ...samplePlan(), giver: { type: "family" as const } };
    expect(texts(noHelper)[0]).toBe("Here's how Ammi's medicines go.");
  });

  it("follows the fridge sheet's order exactly", () => {
    const plan = samplePlan();
    const doseKeys = voiceScript(plan, "en").filter((l) => l.medicineId).map((l) => l.key);
    expect(doseKeys).toEqual(tickRows(plan).map((r) => `${r.slot}-${r.medicine.id}`));
    expect(texts()).toEqual([
      "Shabnam, here's how Ammi's medicines go.",
      "Morning, after breakfast. The blue star box. One tablet.",
      "Morning, at breakfast time. The orange circle box. Half a tablet.",
      "Evening, after dinner. The blue star box. One tablet.",
      "Night, at bedtime. The green leaf box. Two spoons.",
      "If anything is unclear, call me.",
    ]);
    expect(texts(plan, "ur")).toEqual([
      "Shabnam، یہ Ammi کی دوائیوں کا طریقہ ہے۔",
      "صبح، ناشتے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔",
      "صبح، ناشتے کے وقت۔ نارنجی دائرے والا ڈبہ۔ آدھی گولی۔",
      "شام، رات کے کھانے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔",
      "رات، سونے سے پہلے۔ سبز پتے والا ڈبہ۔ دو چمچ۔",
      "کچھ سمجھ نہ آئے تو مجھے فون کریں۔",
    ]);
  });

  it("says labels the family typed as they are, with the food after", () => {
    const plan = samplePlan();
    plan.anchors = {
      mode: "prayers",
      labels: { morning: { en: "Fajr", ur: "فجر" }, midday: { en: "Zuhr", ur: "ظہر" }, evening: { en: "Maghrib", ur: "مغرب" }, night: { en: "Isha", ur: "عشاء" } },
    };
    expect(texts(plan)[1]).toBe("Morning, at Fajr, after food. The blue star box. One tablet.");
    expect(texts(plan, "ur")[1]).toBe("صبح، فجر، کھانے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔");
    plan.anchors = { mode: "clock", labels: { ...plan.anchors.labels, morning: { en: "8 am", ur: "صبح 8 بجے" } } };
    expect(texts(plan)[1]).toBe("At 8 am, after food. The blue star box. One tablet.");
    expect(texts(plan, "ur")[1]).toBe("صبح 8 بجے، کھانے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔");
  });

  it("makes colours agree with masculine and feminine shapes", () => {
    const ur = SYMBOLS.map((s) => spokenSymbol(s, "ur"));
    expect(ur).toEqual(["نیلے ستارے", "نارنجی دائرے", "سبز پتے", "لال چوکور", "آسمانی پتنگ", "گلابی پھول", "پیلی تکون", "کالی مچھلی"]);
    expect(spokenSymbol({ colour: "#0072B2", shape: "kite" }, "ur")).toBe("نیلی پتنگ"); // after a removal, pairs can mix
    expect(SYMBOLS.map((s) => spokenSymbol(s, "en"))).toContain("sky blue kite");
  });

  it("spells quantities out for reading aloud", () => {
    expect(spokenQuantity("tablet", 0.5, "en")).toBe("Half a tablet");
    expect(spokenQuantity("tablet", 1.5, "en")).toBe("One and a half tablets");
    expect(spokenQuantity("tablet", 3.5, "en")).toBe("Three and a half tablets");
    expect(spokenQuantity("syrup", 2, "en")).toBe("Two spoons");
    expect(spokenQuantity("insulin", 12, "en")).toBe("12 units");
    expect(spokenQuantity("tablet", 0.5, "ur")).toBe("آدھی گولی");
    expect(spokenQuantity("tablet", 1.5, "ur")).toBe("ڈیڑھ گولی");
    expect(spokenQuantity("tablet", 2.5, "ur")).toBe("ڈھائی گولیاں");
    expect(spokenQuantity("tablet", 3.5, "ur")).toBe("ساڑھے تین گولیاں");
    expect(spokenQuantity("drops", 1, "ur")).toBe("ایک قطرہ");
    expect(spokenQuantity("drops", 3, "ur")).toBe("تین قطرے");
    expect(plain(spokenQuantity("insulin", 12, "ur"))).toBe("12 یونٹ");
  });

  it("keeps a Latin name in order inside Urdu", () => {
    const opening = voiceScript(samplePlan(), "ur")[0].text;
    expect(opening.startsWith("⁨Shabnam⁩،")).toBe(true);
    expect(scriptText(voiceScript(samplePlan(), "en")).split("\n")).toHaveLength(6);
  });
});
