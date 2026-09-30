import { describe, expect, it } from "vitest";
import { decodePlan, encodePlan } from "@/lib/hash";
import {
  SYMBOLS,
  VERSION_BORDER_COLOURS,
  canPrint,
  createEmptyPlan,
  createMedicine,
  editMedicine,
  nextSheetVersion,
  nextSymbol,
  unitFor,
  type Medicine,
} from "@/lib/plan";
import { sanitisePlan } from "@/lib/sanitise";
import { samplePlan } from "@/lib/sample";

describe("URL hash", () => {
  it("round-trips a full plan exactly", () => {
    const plan = samplePlan();
    const result = decodePlan("#" + encodePlan(plan));
    expect(result).toEqual({ status: "ok", plan });
  });

  it("round-trips Urdu text and names", () => {
    const plan = createEmptyPlan();
    plan.person.name = "امی";
    plan.giver = { type: "helperReads", helperName: "شبنم" };
    const result = decodePlan(encodePlan(plan));
    expect(result.status === "ok" && result.plan.person.name).toBe("امی");
    expect(result.status === "ok" && result.plan.giver.helperName).toBe("شبنم");
  });

  it("uses only URL-safe characters", () => {
    expect(encodePlan(samplePlan())).toMatch(/^p=[A-Za-z0-9+\-$_]*$/);
  });

  it("reports an empty hash as empty and junk as invalid", () => {
    expect(decodePlan("").status).toBe("empty");
    expect(decodePlan("#").status).toBe("empty");
    expect(decodePlan("#hello").status).toBe("invalid");
    expect(decodePlan("#p=%%%not-lz").status).toBe("invalid");
    // A link cut short while copying.
    const full = encodePlan(samplePlan());
    expect(decodePlan(full.slice(0, full.length / 2)).status).toBe("invalid");
  });

  it("never puts photos in the link, only ids", () => {
    const plan = samplePlan();
    plan.medicines[0].photoId = "photo-1";
    const result = decodePlan(encodePlan(plan));
    expect(result.status === "ok" && result.plan.medicines[0].photoId).toBe("photo-1");
  });
});

describe("sanitisePlan", () => {
  it("turns anything into a valid empty plan", () => {
    for (const junk of [null, 42, "x", [], { person: "no" }]) {
      expect(sanitisePlan(junk)).toEqual(createEmptyPlan());
    }
  });

  it("drops unknown fields and bad enum values", () => {
    const plan = sanitisePlan({
      person: { name: "Ammi", evil: "<script>" },
      giver: { type: "robot" },
      anchors: { mode: "tides" },
      settings: { paper: "A3" },
      extra: true,
    });
    expect(plan.person).toEqual({ name: "Ammi", bloodGroup: undefined, conditions: [], allergies: [] });
    expect(plan.giver.type).toBe("family");
    expect(plan.anchors.mode).toBe("meals");
    expect(plan.settings.paper).toBe("A4");
    expect("extra" in plan).toBe(false);
  });

  it("keeps symbols unique, reassigning duplicates", () => {
    const med = (id: string) => ({ id, name: id, form: "tablet", symbol: { colour: "#0072B2", shape: "star" }, doses: [] });
    const plan = sanitisePlan({ medicines: [med("a"), med("b")] });
    expect(plan.medicines[0].symbol).toEqual({ colour: "#0072B2", shape: "star" });
    expect(plan.medicines[1].symbol).toEqual({ colour: "#E69F00", shape: "circle" });
  });

  it("snaps quantities to half tablets and whole units", () => {
    const plan = sanitisePlan({
      medicines: [
        { form: "tablet", doses: [{ slot: "morning", quantity: 0.7, food: "after" }] },
        { form: "syrup", doses: [{ slot: "night", quantity: 0.5 }] },
      ],
    });
    expect(plan.medicines[0].doses[0]).toEqual({ slot: "morning", quantity: 0.5, food: "after" });
    expect(plan.medicines[1].doses[0]).toEqual({ slot: "night", quantity: 1, food: "any" });
  });

  it("caps text length", () => {
    expect(sanitisePlan({ person: { name: "a".repeat(1000) } }).person.name).toHaveLength(80);
  });
});

describe("rules", () => {
  it("gives 8 medicines 8 unique colour-shape pairs, then stops", () => {
    const meds: Medicine[] = [];
    for (let i = 0; i < 8; i++) meds.push(createMedicine(meds)!);
    expect(new Set(meds.map((m) => m.symbol.colour)).size).toBe(8);
    expect(new Set(meds.map((m) => m.symbol.shape)).size).toBe(8);
    expect(nextSymbol(meds)).toBeUndefined();
    expect(meds.map((m) => m.symbol.colour)).toEqual(SYMBOLS.map((s) => s.colour));
  });

  it("resets reviewed on any edit and blocks printing until all are reviewed", () => {
    const plan = samplePlan();
    expect(canPrint(plan)).toBe(false);
    plan.medicines = plan.medicines.map((m) => ({ ...m, reviewed: true }));
    expect(canPrint(plan)).toBe(true);
    plan.medicines[0] = editMedicine(plan.medicines[0], { purpose: "for sugar, after food" });
    expect(plan.medicines[0].reviewed).toBe(false);
    expect(canPrint(plan)).toBe(false);
    expect(canPrint(createEmptyPlan())).toBe(false);
  });

  it("increments sheet version and cycles border colour on changed prints", () => {
    let v = createEmptyPlan().sheetVersion;
    v = nextSheetVersion(v, true, new Date("2026-01-01"));
    expect(v.number).toBe(1); // first print only stamps the date
    expect(v.printedAt).toBe("2026-01-01T00:00:00.000Z");
    v = nextSheetVersion(v, false);
    expect(v.number).toBe(1);
    const colours = [];
    for (let i = 0; i < 4; i++) {
      v = nextSheetVersion(v, true);
      colours.push(v.borderColour);
    }
    expect(v.number).toBe(5);
    expect(colours).toEqual([...VERSION_BORDER_COLOURS.slice(1), VERSION_BORDER_COLOURS[0]]);
  });

  it("names units by form", () => {
    expect(unitFor("tablet", 0.5).en).toBe("tablet");
    expect(unitFor("syrup", 2).en).toBe("spoons");
    expect(unitFor("inhaler", 2).en).toBe("puffs");
    expect(unitFor("insulin", 10).en).toBe("units");
  });
});
