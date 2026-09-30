import type { ElementType, ReactNode } from "react";

type Role = "question" | "heading" | "body" | "helper";

/**
 * Every Urdu text container gets lang="ur" and dir="rtl", even inside an
 * English layout, so it picks up Nastaliq and the Urdu type sizes.
 */
export function Ur({
  children,
  as: Tag = "span",
  role = "body",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  role?: Role;
  className?: string;
}) {
  return (
    <Tag lang="ur" dir="rtl" className={`type-${role} ${className}`}>
      {children}
    </Tag>
  );
}
