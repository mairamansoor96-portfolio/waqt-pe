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
