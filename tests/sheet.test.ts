import { describe, expect, it } from "vitest";
import { decodePlan, encodePlan } from "@/lib/hash";
import { markReviewed, withDose } from "@/lib/medicine";
import { VERSION_BORDER_COLOURS } from "@/lib/plan";
import { samplePlan } from "@/lib/sample";
import { changedSinceLastPrint, doctorRows, dosesBySlot, recordPrint, sheetFingerprint, tickRows, upcomingVersion } from "@/lib/sheet";

describe("fridge sheet", () => {
  it("groups doses by time of day and leaves empty times out", () => {
    const rows = dosesBySlot(samplePlan());
    expect(rows.map((r) => r.slot)).toEqual(["morning", "evening", "night"]); // sample has nothing at midday
    expect(rows[0].doses.map((d) => d.medicine.name)).toEqual(["Metformin 500 mg", "Amlodipine 5 mg"]);
    expect(tickRows(samplePlan())).toHaveLength(4);
  });

  it("ignores the review tick in the fingerprint, but not edits", () => {
    const plan = samplePlan();
    const before = sheetFingerprint(plan);
    plan.medicines[0] = markReviewed(plan.medicines[0], true);
    expect(sheetFingerprint(plan)).toBe(before);
    plan.medicines[0] = withDose(plan.medicines[0], "night", { quantity: 1, food: "any" });
    expect(sheetFingerprint(plan)).not.toBe(before);
  });

  it("keeps version 1 for the first print and for unchanged reprints", () => {
    let plan = samplePlan();
    expect(upcomingVersion(plan).number).toBe(1);
    plan = recordPrint(plan, new Date("2026-09-30T10:00:00Z"));
    expect(plan.sheetVersion).toMatchObject({ number: 1, borderColour: VERSION_BORDER_COLOURS[0], printedAt: "2026-09-30T10:00:00.000Z" });
    expect(changedSinceLastPrint(plan)).toBe(false);
    plan = recordPrint(plan, new Date("2026-10-01T10:00:00Z"));
    expect(plan.sheetVersion.number).toBe(1);
  });

  it("moves to the next version and border colour when a changed plan is printed", () => {
    let plan = recordPrint(samplePlan());
    plan.medicines[1] = withDose(plan.medicines[1], "midday", { quantity: 1, food: "after" });
    expect(changedSinceLastPrint(plan)).toBe(true);
    expect(upcomingVersion(plan)).toMatchObject({ number: 2, borderColour: VERSION_BORDER_COLOURS[1] });
    plan = recordPrint(plan);
    expect(plan.sheetVersion).toMatchObject({ number: 2, borderColour: VERSION_BORDER_COLOURS[1] });
    expect(changedSinceLastPrint(plan)).toBe(false);
  });

  it("carries the fingerprint through the link", () => {
    const plan = recordPrint(samplePlan());
    const back = decodePlan(encodePlan(plan));
    expect(back.status === "ok" && back.plan.sheetVersion.fingerprint).toBe(plan.sheetVersion.fingerprint);
    expect(back.status === "ok" && changedSinceLastPrint(back.plan)).toBe(false);
  });

  it("writes the doctor's list in plain clinical English", () => {
    const rows = doctorRows(samplePlan());
    expect(rows[0]).toMatchObject({
      form: "Tablet",
      timing: ["1 tablet, morning (Breakfast)", "1 tablet, evening (Dinner)"],
      food: ["after food", "after food"],
    });
    expect(rows[1].timing).toEqual(["½ tablet, morning (Breakfast)"]);
    expect(rows[1].food).toEqual(["with or without food"]);
    expect(rows[2]).toMatchObject({ form: "Syrup", timing: ["2 spoons, night (Bedtime)"] });
  });
});
