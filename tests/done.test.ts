import { describe, expect, it } from "vitest";
import { doneFor, withDone } from "@/lib/done";
import { editMedicine } from "@/lib/plan";
import { samplePlan } from "@/lib/sample";
import { planFingerprint } from "@/lib/sheet";

describe("done states on the outputs hub", () => {
  const plan = samplePlan();
  const at = new Date("2026-10-07T09:00:00Z");

  it("records and undoes an output", () => {
    const fp = planFingerprint(plan);
    let record = withDone(undefined, fp, "fridge", at);
    record = withDone(record, fp, "voice", at);
    expect(doneFor(record, fp)).toEqual({ fridge: at.toISOString(), voice: at.toISOString() });
    record = withDone(record, fp, "fridge", null);
    expect(doneFor(record, fp)).toEqual({ voice: at.toISOString() });
  });

  it("clears every done state once the plan changes", () => {
    const record = withDone(undefined, planFingerprint(plan), "fridge", at);
    const [first, ...rest] = plan.medicines;
    const changed = { ...plan, medicines: [editMedicine(first, { name: "Metformin 1000 mg" }), ...rest] };
    expect(doneFor(record, planFingerprint(changed))).toEqual({});
    const allergy = { ...plan, person: { ...plan.person, allergies: [...plan.person.allergies, "Latex"] } };
    expect(doneFor(record, planFingerprint(allergy))).toEqual({});
    // Marking anything on the new plan drops what was left from the old one.
    expect(withDone(record, planFingerprint(changed), "doctor", at).done).toEqual({ doctor: at.toISOString() });
  });

  it("ignores the review ticks, print settings and key order", () => {
    const fp = planFingerprint(plan);
    const unticked = { ...plan, medicines: plan.medicines.map((m) => ({ ...m, reviewed: false })) };
    expect(planFingerprint(unticked)).toBe(fp);
    expect(planFingerprint({ ...plan, settings: { ...plan.settings, paper: "Letter" } })).toBe(fp);
    const reordered = { ...plan, contacts: plan.contacts.map(({ phone, name, ...c }) => ({ phone, ...c, name })) };
    expect(planFingerprint(reordered)).toBe(fp);
  });
});
