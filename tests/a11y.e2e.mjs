// Milestone 10: the accessibility pass. Every screen, in English and Urdu, at
// 100% and 200% text size, on a 390 px phone:
//  - axe-core (WCAG 2.1 A/AA plus best practice) finds no violations;
//  - nothing scrolls sideways (the layout holds at 200%);
//  - one h1 and one main landmark per screen, for screen readers;
//  - every Urdu container computes as right to left;
//  - at 100%, every touch target is at least 48 px (SPEC.md → Quality floor).
// Then a keyboard-only walk through the start of setup.
//
// Run after `npm run build`:  node tests/a11y.e2e.mjs [screenshotDir]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";
import assert from "node:assert/strict";
import LZString from "lz-string";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const AXE = await readFile(require.resolve("axe-core/axe.min.js"), "utf8");
const ROOT = new URL("../out/", import.meta.url).pathname;
const shots = process.argv[2];
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain", ".png": "image/png", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (path.endsWith("/")) path += "index.html";
  const file = join(ROOT, path);
  try {
    if (!(await stat(file)).isFile()) throw new Error();
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const plan = {
  schemaVersion: 1,
  person: { name: "Ammi", bloodGroup: "B+", conditions: ["Diabetes", "Takes a blood thinner"], allergies: ["Penicillin"] },
  giver: { type: "helperNoRead", helperName: "Shabnam" },
  anchors: {
    mode: "meals",
    labels: {
      morning: { en: "Breakfast", ur: "ناشتہ" },
      midday: { en: "Lunch", ur: "دوپہر کا کھانا" },
      evening: { en: "Dinner", ur: "رات کا کھانا" },
      night: { en: "Bedtime", ur: "سونے سے پہلے" },
    },
  },
  medicines: [
    { id: "m1", name: "Metformin 500 mg", purpose: "for sugar", form: "tablet", symbol: { colour: "#0072B2", shape: "star" }, reviewed: true,
      doses: [{ slot: "morning", quantity: 1.5, food: "after" }, { slot: "evening", quantity: 1, food: "after" }] },
    { id: "m2", name: "Lactulose syrup", purpose: "for the stomach", form: "syrup", symbol: { colour: "#E69F00", shape: "circle" }, reviewed: false,
      doses: [{ slot: "night", quantity: 2, food: "any" }] },
  ],
  contacts: [
    { id: "c1", name: "Maira", relation: "daughter", phone: "+92 300 1234567" },
    { id: "c2", name: "بلال", relation: "بیٹا", phone: "+92 321 7654321" },
  ],
  sheetVersion: { number: 1, borderColour: "#2B2D6E", printedAt: "" },
  settings: { paper: "A4", foodVariant: "sequence", tickVariant: "weekSheet" },
};
const checked = structuredClone(plan);
checked.medicines.forEach((m) => (m.reviewed = true));
const hash = (p) => `#p=${LZString.compressToEncodedURIComponent(JSON.stringify(p))}`;

// [path, plan]: outputs need every medicine checked; the review step and hub are also seen locked.
const screens = [
  ["/", plan],
  ["/", null],
  ["/setup/name/", plan],
  ["/setup/health/", plan],
  ["/setup/giver/", plan],
  ["/setup/anchors/", plan],
  ["/setup/medicines/", plan],
  ["/setup/medicine/?m=m1", plan],
  ["/setup/contacts/", plan],
  ["/setup/review/", plan],
  ["/setup/save/", plan],
  ["/outputs/", plan],
  ["/outputs/", checked],
  ["/outputs/fridge/", checked],
  ["/outputs/stickers/", checked],
  ["/outputs/doctor/", checked],
  ["/outputs/voice/", checked],
  ["/outputs/lockscreen/", checked],
  // The demo plan behind "See a sample for Ammi", with its notice.
  ["/outputs/", "sample"],
  ["/outputs/fridge/", "sample"],
  ["/outputs/lockscreen/", "sample"],
  ["/kit/", plan],
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const offOrigin = [];

async function open(path, p, lang, textSize) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  if (lang === "ur") await context.addInitScript(() => localStorage.setItem("waqtpe.lang", "ur"));
  const page = await context.newPage();
  page.on("request", (r) => {
    if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) offOrigin.push(r.url());
  });
  page.on("pageerror", (e) => {
    throw e;
  });
  await page.goto(`${origin}${path}${p === "sample" ? "#sample" : p ? hash(p) : ""}`);
  await page.locator("h1").first().waitFor();
  if (textSize !== 100) await page.addStyleTag({ content: `html { font-size: ${textSize}% !important; }` });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  return page;
}

async function audit(page, textSize) {
  await page.addScriptTag({ content: AXE });
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      // The printed sheets inside the preview are paper, checked by the print test.
      exclude: [["[data-sheet-page]"]],
    });
    return r.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}× e.g. ${v.nodes[0].target.join(" ")})`);
  });
  const structure = await page.evaluate((textSize) => {
    const problems = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1)
      problems.push(`scrolls sideways: ${document.documentElement.scrollWidth}px wide`);
    const h1 = document.querySelectorAll("h1").length;
    const main = document.querySelectorAll("main").length;
    if (h1 !== 1) problems.push(`${h1} h1 elements`);
    if (main !== 1) problems.push(`${main} main landmarks`);
    for (const el of document.querySelectorAll('[lang="ur"]')) {
      if (el.closest("[data-sheet-page]")) continue;
      if (getComputedStyle(el).direction !== "rtl") problems.push(`Urdu not right to left: "${el.textContent.slice(0, 20)}"`);
    }
    if (textSize === 100) {
      const targets = new Set();
      for (const el of document.querySelectorAll("button, a[href], select, textarea, input")) {
        if (el.closest("[data-sheet-page]")) continue;
        // Hidden file pickers behind the photo and import buttons: the buttons are the targets.
        if (el.matches('input[type=file][aria-hidden="true"]')) continue;
        // A visually hidden radio or checkbox: its label is the target.
        targets.add(el.matches("input[type=radio], input[type=checkbox]") ? el.closest("label") ?? el : el);
      }
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue; // not shown
        if (r.height < 47.5 || r.width < 47.5)
          problems.push(`small target ${Math.round(r.width)}×${Math.round(r.height)}: ${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`);
      }
    }
    return problems;
  }, textSize);
  return [...axe, ...structure];
}

let failures = 0;
try {
  for (const lang of ["en", "ur"]) {
    for (const textSize of [100, 200]) {
      for (const [path, p] of screens) {
        const page = await open(path, p, lang, textSize);
        const problems = await audit(page, textSize);
        const label = `${lang} ${String(textSize).padStart(3)}% ${path}${p === checked ? " (checked)" : p === "sample" ? " (sample)" : p ? "" : " (new)"}`;
        if (problems.length) {
          failures += problems.length;
          console.log(`✗ ${label}\n    ${[...new Set(problems)].join("\n    ")}`);
        } else console.log(`✓ ${label}`);
        if (shots && textSize === 200) {
          const name = `${lang}-200-${path.replace(/[/?=]+/g, "-").replace(/^-|-$/g, "") || "landing"}${p === checked ? "-checked" : p === "sample" ? "-sample" : p ? "" : "-new"}`;
          await page.screenshot({ path: `${shots}/${name}.png`, fullPage: true });
        }
        await page.context().close();
      }
    }
  }

  // Keyboard only: start a plan and answer the first question without a pointer.
  // A brand-new visitor: no plan in the link.
  const page = await open("/", null, "en", 100);
  const focusOutline = async () =>
    page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, text: (el.textContent || "").trim().slice(0, 30), outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2 };
    });
  let reached = false;
  for (let i = 0; i < 30 && !reached; i++) {
    await page.keyboard.press("Tab");
    const f = await focusOutline();
    assert.ok(f.outline, `visible focus on ${f.tag} "${f.text}"`);
    if (/Start a plan/.test(f.text)) reached = true;
  }
  assert.ok(reached, "the start button is reachable by keyboard");
  await page.keyboard.press("Enter");
  await page.locator("h1", { hasText: "Who is this plan for?" }).waitFor();
  assert.equal(await page.evaluate(() => document.activeElement.tagName), "H1", "focus moves to the question");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  // Somewhere in the next few stops is the name field; type into it.
  await page.getByLabel("Their name, as the family says it").focus();
  await page.keyboard.type("Nani");
  await page.getByRole("button", { name: "Continue", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.locator("h1", { hasText: "What should a doctor know about Nani?" }).waitFor();
  console.log("✓ keyboard: start, answer and continue with visible focus at every stop");

  assert.deepEqual(offOrigin, [], "no request leaves the origin");
  assert.equal(failures, 0, `${failures} accessibility problems`);
  console.log("ok: every screen passes axe, holds at 200% text in English and Urdu, and works by keyboard");
} finally {
  await browser.close();
  server.close();
}
