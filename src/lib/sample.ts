// A sample plan for trying the app and for tests. Not medical advice: it only
// shows the shape of a plan a family would copy from a real prescription.

import { DEFAULT_ANCHOR_LABELS, createEmptyPlan, type Plan } from "./plan";

export function samplePlan(): Plan {
  const plan = createEmptyPlan();
  return {
    ...plan,
    person: {
      name: "Ammi",
      bloodGroup: "B+",
      conditions: ["Type 2 diabetes", "Takes a blood thinner"],
      allergies: ["Penicillin"],
    },
    giver: { type: "helperNoRead", helperName: "Shabnam" },
    anchors: { mode: "meals", labels: structuredClone(DEFAULT_ANCHOR_LABELS.meals) },
    medicines: [
      {
        id: "sample-med-1",
        name: "Metformin 500 mg",
        purpose: "for sugar",
        form: "tablet",
        symbol: { colour: "#0072B2", shape: "star" },
        doses: [
          { slot: "morning", quantity: 1, food: "after" },
          { slot: "evening", quantity: 1, food: "after" },
        ],
        reviewed: false,
      },
      {
        id: "sample-med-2",
        name: "Amlodipine 5 mg",
        purpose: "for blood pressure",
        form: "tablet",
        symbol: { colour: "#E69F00", shape: "circle" },
        doses: [{ slot: "morning", quantity: 0.5, food: "any" }],
        reviewed: false,
      },
      {
        id: "sample-med-3",
        name: "Lactulose syrup",
        purpose: "for the stomach",
        form: "syrup",
        symbol: { colour: "#009E73", shape: "leaf" },
        doses: [{ slot: "night", quantity: 2, food: "any" }],
        reviewed: false,
      },
    ],
    contacts: [
      { id: "sample-contact-1", name: "Maira", relation: "daughter", phone: "+92 300 1234567" },
      { id: "sample-contact-2", name: "Bilal", relation: "son", phone: "+92 321 7654321" },
    ],
  };
}

// The demo plan behind "See a sample for Ammi" on the landing page. It lives
// only in memory under a `#sample` link: it is never written to the user's
// link or to IndexedDB, and its box photos are bundled with the app.

/** Box photo ids that point at bundled images, not IndexedDB. */
export const SAMPLE_PHOTOS: Record<string, string> = {
  "sample-box-metformin": "/sample/box-metformin.png",
  "sample-box-amlodipine": "/sample/box-amlodipine.png",
  "sample-box-atorvastatin": "/sample/box-atorvastatin.png",
};

export const isSamplePhoto = (id: string) => Object.prototype.hasOwnProperty.call(SAMPLE_PHOTOS, id);

/** Ammi's demo plan, already checked against the prescription so every output opens. */
export function demoPlan(): Plan {
  const plan = createEmptyPlan();
  return {
    ...plan,
    person: {
      name: "Ammi",
      bloodGroup: "B+",
      conditions: ["Type 2 diabetes", "High blood pressure"],
      allergies: ["Penicillin"],
    },
    giver: { type: "helperNoRead", helperName: "Shazia" },
    anchors: { mode: "meals", labels: structuredClone(DEFAULT_ANCHOR_LABELS.meals) },
    medicines: [
      {
        id: "demo-med-1",
        name: "Metformin 500 mg",
        purpose: "for sugar",
        form: "tablet",
        photoId: "sample-box-metformin",
        symbol: { colour: "#0072B2", shape: "star" },
        doses: [
          { slot: "morning", quantity: 1, food: "after" },
          { slot: "night", quantity: 1, food: "after" },
        ],
        reviewed: true,
      },
      {
        id: "demo-med-2",
        name: "Amlodipine 5 mg",
        purpose: "for blood pressure",
        form: "tablet",
        photoId: "sample-box-amlodipine",
        symbol: { colour: "#E69F00", shape: "circle" },
        doses: [{ slot: "morning", quantity: 1, food: "any" }],
        reviewed: true,
      },
      {
        id: "demo-med-3",
        name: "Atorvastatin 10 mg",
        purpose: "for cholesterol",
        form: "tablet",
        photoId: "sample-box-atorvastatin",
        symbol: { colour: "#009E73", shape: "leaf" },
        doses: [{ slot: "night", quantity: 1, food: "any" }],
        reviewed: true,
      },
    ],
    contacts: [
      { id: "demo-contact-1", name: "Maira", relation: "daughter", phone: "+92 300 1234567" },
      { id: "demo-contact-2", name: "Bilal", relation: "son", phone: "+92 321 7654321" },
    ],
  };
}
