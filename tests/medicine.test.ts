import { describe, expect, it } from "vitest";
import { clampQuantity, formatQuantity, isBlankMedicine, quantityText, symbolName, withDose, withForm } from "@/lib/medicine";
import { createMedicine, type Medicine } from "@/lib/plan";

const med = (fields: Partial<Medicine> = {}): Medicine => ({ ...createMedicine([])!, reviewed: true, ...fields });

describe("medicine helpers", () => {
  it("writes quantities with halves", () => {
    expect(formatQuantity(0.5)).toBe("½");
    expect(formatQuantity(1)).toBe("1");
    expect(formatQuantity(1.5)).toBe("1½");
    expect(quantityText("tablet", 0.5).en).toBe("½ tablet");
    expect(quantityText("syrup", 2).en).toBe("2 spoons");
  });

  it("names symbols for the voice note", () => {
    expect(symbolName({ colour: "#0072B2", shape: "star" })).toEqual({ en: "blue star", ur: "نیلا ستارہ" });
    // A colour and shape from different rows, as after a removal.
    expect(symbolName({ colour: "#E69F00", shape: "star" }).en).toBe("orange star");
  });

  it("keeps doses in day order and resets review on every edit", () => {
    let m = med();
    m = withDose(m, "night", { quantity: 1, food: "any" });
    m = withDose(m, "morning", { quantity: 2, food: "after" });
    expect(m.doses.map((d) => d.slot)).toEqual(["morning", "night"]);
    expect(m.reviewed).toBe(false);
    m = { ...m, reviewed: true };
    m = withDose(m, "night", undefined);
    expect(m.doses.map((d) => d.slot)).toEqual(["morning"]);
    expect(m.reviewed).toBe(false);
  });

  it("snaps half tablets to whole units when the form changes", () => {
    let m = med({ form: "tablet", doses: [{ slot: "morning", quantity: 0.5, food: "any" }, { slot: "night", quantity: 1.5, food: "any" }] });
    m = withForm(m, "capsule");
    expect(m.doses.map((d) => d.quantity)).toEqual([1, 2]);
    expect(m.reviewed).toBe(false);
  });

  it("clamps quantities to the form's steps", () => {
    expect(clampQuantity("tablet", 0)).toBe(0.5);
    expect(clampQuantity("tablet", 1.3)).toBe(1.5);
    expect(clampQuantity("insulin", 12.4)).toBe(12);
    expect(clampQuantity("syrup", 1000)).toBe(100);
    expect(clampQuantity("drops", Number.NaN)).toBe(1);
  });

  it("recognises a medicine left empty", () => {
    expect(isBlankMedicine(med())).toBe(true);
    expect(isBlankMedicine(med({ name: "Metformin" }))).toBe(false);
  });
});
