"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { SetupScreen, useNamed } from "@/components/SetupScreen";
import { TextField } from "@/components/TextField";
import { fill, useFillNodes, useT } from "@/lib/i18n";
import { phoneWarning } from "@/lib/phone";
import { usePlan } from "@/lib/plan-store";
import { MAX_CONTACTS, newId, type Contact } from "@/lib/plan";

const isBlank = (c: Contact) => !c.name.trim() && !c.relation.trim() && !c.phone.trim();

export default function ContactsStep() {
  const t = useT();
  const fillNodes = useFillNodes();
  const named = useNamed();
  const { plan, setPlan } = usePlan();
  const [checkedPhones, setCheckedPhones] = useState<Set<string>>(new Set());
  const personName = plan.person.name.trim();
  const { contacts } = plan;

  const update = (id: string, changes: Partial<Contact>) =>
    setPlan((p) => ({ ...p, contacts: p.contacts.map((c) => (c.id === id ? { ...c, ...changes } : c)) }));
  const remove = (id: string) => setPlan((p) => ({ ...p, contacts: p.contacts.filter((c) => c.id !== id) }));
  const add = () =>
    setPlan((p) =>
      p.contacts.length >= MAX_CONTACTS
        ? p
        : { ...p, contacts: [...p.contacts, { id: newId(), name: "", relation: "", phone: "" }] },
    );

  return (
    <SetupScreen
      step="contacts"
      question={named("qContactsNamed", "qContacts")}
      help={t("contactsHelp")}
      onContinue={() => {
        // Nothing here blocks saving; just drop cards left completely empty.
        if (contacts.some(isBlank)) setPlan((p) => ({ ...p, contacts: p.contacts.filter((c) => !isBlank(c)) }));
        return true;
      }}
    >
      {contacts.length === 0 && <p>{t("contactsEmpty")}</p>}

      <ol className="flex flex-col gap-4">
        {contacts.map((c, i) => {
          const warning = checkedPhones.has(c.id) ? phoneWarning(c.phone) : undefined;
          return (
            <li key={c.id}>
              <fieldset className="frame flex flex-col gap-4 rounded-card bg-surface p-4">
                <legend className="sr-only">{fill(t("contactHeading"), { n: i + 1 })}</legend>
                <p aria-hidden="true" className="type-heading">
                  {fill(t("contactHeading"), { n: i + 1 })}
                </p>
                <TextField
                  label={t("contactName")}
                  value={c.name}
                  maxLength={80}
                  autoComplete="off"
                  onChange={(e) => update(c.id, { name: e.target.value })}
                />
                <TextField
                  label={t("contactRelation")}
                  help={personName ? fill(t("contactRelationHelpNamed"), { name: personName }) : t("contactRelationHelp")}
                  value={c.relation}
                  maxLength={60}
                  autoComplete="off"
                  onChange={(e) => update(c.id, { relation: e.target.value })}
                />
                <TextField
                  label={t("contactPhone")}
                  help={t("contactPhoneHelp")}
                  warning={warning ? t(warning) : undefined}
                  type="tel"
                  inputMode="tel"
                  lang="en"
                  dir="ltr"
                  value={c.phone}
                  maxLength={40}
                  autoComplete="off"
                  onChange={(e) => update(c.id, { phone: e.target.value })}
                  onBlur={() => setCheckedPhones((s) => new Set(s).add(c.id))}
                />
                <Button variant="secondary" onClick={() => remove(c.id)}>
                  {c.name.trim() ? fillNodes(t("removeContactNamed"), { name: c.name.trim() }) : t("removeContact")}
                </Button>
              </fieldset>
            </li>
          );
        })}
      </ol>

      {contacts.length < MAX_CONTACTS ? (
        <Button variant="secondary" full onClick={add}>
          {t("addContact")}
        </Button>
      ) : (
        <p className="text-ink-soft">{t("contactsFull")}</p>
      )}
      <p className="type-helper text-ink-soft">{t("contactPhotoLater")}</p>
    </SetupScreen>
  );
}
