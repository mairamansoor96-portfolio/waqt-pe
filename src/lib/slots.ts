import type { MessageKey } from "./messages";
import type { Slot } from "./plan";

/** Time-of-day tints: pale backgrounds only, never text. */
export const slotTint: Record<Slot, string> = {
  morning: "bg-dawn",
  midday: "bg-noon",
  evening: "bg-dusk",
  night: "bg-night",
};

export const slotText: Record<Slot, MessageKey> = {
  morning: "slotMorning",
  midday: "slotMidday",
  evening: "slotEvening",
  night: "slotNight",
};
