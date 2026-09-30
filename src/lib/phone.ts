// Loose phone checks: advice only, never blocks saving (SPEC.md → Contacts).

export type PhoneWarning = "phoneShort" | "phoneLetters";

export function phoneWarning(phone: string): PhoneWarning | undefined {
  const value = phone.trim();
  if (!value) return undefined;
  if (/\p{L}/u.test(value)) return "phoneLetters";
  const digits = value.replace(/\D/g, "").length;
  if (digits < 7) return "phoneShort";
  return undefined;
}
