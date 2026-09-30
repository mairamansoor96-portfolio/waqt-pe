// The setup flow: one question per screen, in this order.
// Screens 5 (medicines), 7 (review) and 8 (save) grow in later milestones.

export const STEPS = ["name", "health", "giver", "anchors", "medicines", "contacts", "review", "save"] as const;
export type StepId = (typeof STEPS)[number];

export const stepPath = (id: StepId) => `/setup/${id}/`;

export function stepNumber(id: StepId): number {
  return STEPS.indexOf(id) + 1;
}

export function prevStep(id: StepId): StepId | undefined {
  return STEPS[STEPS.indexOf(id) - 1];
}

export function nextStep(id: StepId): StepId | undefined {
  return STEPS[STEPS.indexOf(id) + 1];
}
