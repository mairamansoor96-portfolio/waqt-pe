import type { Metadata, Viewport } from "next";
import { LangProvider, langBootScript } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waqt Pe",
  description: "Medicine care anyone can follow. Nothing you enter leaves this device.",
  // Plans live in the link; keep them out of search engines and referrers.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langBootScript }} />
      </head>
      <body className="min-h-dvh bg-paper text-ink type-body antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
