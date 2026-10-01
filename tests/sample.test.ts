import { describe, expect, it } from "vitest";
import { decodePlan, encodePlan, parseSampleHash, sampleHash } from "@/lib/hash";
import { canPrint, SYMBOLS } from "@/lib/plan";
import { sanitisePlan } from "@/lib/sanitise";
import { SAMPLE_PHOTOS, demoPlan, isSamplePhoto, samplePlan } from "@/lib/sample";

describe("sample links", () => {
  it("are only #sample, optionally carrying the family's own plan", () => {
    expect(parseSampleHash("#sample")).toEqual({ back: "" });
    const own = encodePlan(samplePlan());
    expect(parseSampleHash(`#${sampleHash(own)}`)).toEqual({ back: own });
    expect(sampleHash("")).toBe("sample");
    expect(parseSampleHash(`#${own}`)).toBeNull();
    expect(parseSampleHash("")).toBeNull();
    expect(parseSampleHash("#samples")).toBeNull();
    // Anything after & that isn't a plan is dropped, never decoded.
    expect(parseSampleHash("#sample&junk")).toEqual({ back: "" });
  });

  it("are never mistaken for a plan", () => {
    expect(decodePlan("#sample").status).toBe("invalid");
  });
});

describe("demo plan", () => {
  const demo = demoPlan();

  it("is Ammi's three medicines, checked so every output opens", () => {
    expect(demo.person.name).toBe("Ammi");
    expect(demo.giver).toEqual({ type: "helperNoRead", helperName: "Shazia" });
    expect(demo.medicines.map((m) => m.name.split(" ")[0])).toEqual(["Metformin", "Amlodipine", "Atorvastatin"]);
    expect(demo.medicines.map((m) => m.purpose)).toEqual(["for sugar", "for blood pressure", "for cholesterol"]);
    expect(demo.medicines[0].doses.map((d) => [d.slot, d.food])).toEqual([["morning", "after"], ["night", "after"]]);
    expect(demo.contacts).toHaveLength(2);
    expect(canPrint(demo)).toBe(true);
  });

  it("uses the first symbols in order, like a real plan would", () => {
    expect(demo.medicines.map((m) => m.symbol)).toEqual(SYMBOLS.slice(0, 3).map((s) => ({ colour: s.colour, shape: s.shape })));
  });

  it("points only at bundled box photos", () => {
    for (const m of demo.medicines) expect(isSamplePhoto(m.photoId!)).toBe(true);
    expect(Object.values(SAMPLE_PHOTOS).every((p) => p.startsWith("/sample/"))).toBe(true);
    expect(isSamplePhoto("0123456789abcdef")).toBe(false);
  });

  it("survives sanitising unchanged", () => {
    expect(sanitisePlan(JSON.parse(JSON.stringify(demo)))).toEqual(demo);
  });

  it("is a fresh copy each time", () => {
    const a = demoPlan();
    a.medicines[0].name = "changed";
    expect(demoPlan().medicines[0].name).toBe("Metformin 500 mg");
  });
});
