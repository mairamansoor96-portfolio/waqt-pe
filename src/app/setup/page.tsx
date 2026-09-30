"use client";

import { useEffect } from "react";
import { usePlan } from "@/lib/plan-store";
import { stepPath } from "@/lib/steps";

// /setup/ on its own goes to the first question, keeping any plan in the link.
export default function SetupIndex() {
  const { status, go } = usePlan();
  useEffect(() => {
    if (status !== "loading") go(stepPath("name"), { replace: true });
  }, [status, go]);
  return null;
}
