// Milestone 6: the fridge sheet prints cleanly on A4 and Letter with no
// clipped content. For each paper size, both research variants, a typical
// plan and a worst case (8 medicines at every time of day, long names,
// 3 contacts), this checks in print media that nothing extends outside its
// page, and makes a real PDF to check page size and count.
//
// Run after `npm run build`:  node tests/print.e2e.mjs [screenshotDir]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import assert from "node:assert/strict";
import LZString from "lz-string";
import { chromium } from "playwright-core";

const ROOT = new URL("../out/", import.meta.url).pathname;
const shots = process.argv[2];
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain" };
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

const SYMBOLS = [
  ["#0072B2", "star"], ["#E69F00", "circle"], ["#009E73", "leaf"], ["#D55E00", "square"],
  ["#56B4E9", "kite"], ["#CC79A7", "flower"], ["#F0E442", "triangle"], ["#000000", "fish"],
];
const FORMS = ["tablet", "capsule", "syrup", "drops", "inhaler", "insulin", "tablet", "tablet"];
const base = (medicines, contacts, extra = {}) => ({
  schemaVersion: 1,
  person: { name: "Ammi", bloodGroup: "B+", conditions: [], allergies: [] },
  giver: { type: "helperNoRead", helperName: "Shabnam" },
  anchors: {
    mode: "prayers",
    labels: {
      morning: { en: "Fajr", ur: "فجر" },
      midday: { en: "Zuhr", ur: "ظہر" },
      evening: { en: "Maghrib", ur: "مغرب" },
      night: { en: "Isha", ur: "عشاء" },
    },
  },
  medicines,
  contacts,
  sheetVersion: { number: 1, borderColour: "#2B2D6E", printedAt: "" },
  settings: { paper: "A4", foodVariant: "sequence", tickVariant: "weekSheet" },
  ...extra,
});
const typical = base(
  [
    { id: "m1", name: "Metformin 500 mg", purpose: "for sugar", form: "tablet", symbol: { colour: "#0072B2", shape: "star" }, reviewed: true,
      doses: [{ slot: "morning", quantity: 1.5, food: "after" }, { slot: "evening", quantity: 1, food: "after" }] },
    { id: "m2", name: "Amlodipine 5 mg", purpose: "for blood pressure", form: "tablet", symbol: { colour: "#E69F00", shape: "circle" }, reviewed: true,
      doses: [{ slot: "morning", quantity: 0.5, food: "any" }] },
    { id: "m3", name: "Lactulose syrup", purpose: "for the stomach", form: "syrup", symbol: { colour: "#009E73", shape: "leaf" }, reviewed: true,
      doses: [{ slot: "night", quantity: 2, food: "before" }] },
  ],
  [
    { id: "c1", name: "Maira", relation: "daughter", phone: "+92 300 1234567" },
    { id: "c2", name: "Bilal", relation: "son", phone: "+92 321 7654321" },
  ],
);
const worst = base(
  SYMBOLS.map(([colour, shape], i) => ({
    id: `w${i}`,
    name: `Very long medicine name ${i + 1} extended-release 1000 mg film-coated tablets`,
    purpose: "for something important",
    form: FORMS[i],
    symbol: { colour, shape },
    reviewed: true,
    doses: ["morning", "midday", "evening", "night"].map((slot) => ({ slot, quantity: FORMS[i] === "tablet" ? 5.5 : 6, food: "with" })),
  })),
  [1, 2, 3].map((n) => ({ id: `c${n}`, name: `Contact with a long name ${n}`, relation: "grandson-in-law", phone: "+92 300 1234567 ext 890" })),
);
const link = (plan, research = false) =>
  `${origin}/outputs/fridge/${research ? "?research=1" : ""}#p=${LZString.compressToEncodedURIComponent(JSON.stringify(plan))}`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const offOrigin = [];
const newPage = async () => {
  const page = await (await browser.newContext({ viewport: { width: 900, height: 1200 } })).newPage();
  page.on("request", (r) => {
    if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) offOrigin.push(r.url());
  });
  page.on("pageerror", (e) => {
    throw e;
  });
  return page;
};

/** Every element inside each printed page must stay inside it. */
async function clippedInPrint(page) {
  await page.emulateMedia({ media: "print" });
  const problems = await page.evaluate(() => {
    const out = [];
    for (const sheet of document.querySelectorAll("[data-sheet-page]")) {
      const box = sheet.getBoundingClientRect();
      if (sheet.scrollWidth > sheet.clientWidth + 1) out.push(`page scrolls sideways: ${sheet.getAttribute("aria-label")}`);
      for (const el of sheet.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        if (r.left < box.left - 0.5 || r.right > box.right + 0.5)
          out.push(`${el.tagName.toLowerCase()} "${(el.textContent || "").slice(0, 30)}" sticks out by ${Math.max(box.left - r.left, r.right - box.right).toFixed(1)}px`);
      }
    }
    return out;
  });
  await page.emulateMedia({ media: null }); // reset, so page.pdf() uses print media again
  return problems;
}

/** Page count and first page size (pt) from Chromium's PDF. */
function pdfInfo(buffer) {
  const text = buffer.toString("latin1");
  const pages = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const box = /\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/.exec(text);
  return { pages, width: Number(box?.[1]), height: Number(box?.[2]) };
}
const PAPER_PT = { A4: [595.3, 841.9], Letter: [612, 792] };

try {
  // Locked until every medicine is checked: nothing to print.
  const locked = await newPage();
  const unchecked = structuredClone(typical);
  unchecked.medicines[1].reviewed = false;
  await locked.goto(link(unchecked));
  await locked.getByText("Check the medicines first").waitFor();
  assert.equal(await locked.locator("[data-sheet-page]").count(), 0);
  assert.equal(await locked.getByRole("button", { name: "Print fridge sheet" }).count(), 0);

  for (const [label, plan] of [["typical", typical], ["worst", worst]]) {
    for (const paper of ["A4", "Letter"]) {
      for (const [food, tick] of [["sequence", "weekSheet"], ["plate", "colourColumns"]]) {
        const p = structuredClone(plan);
        p.settings = { paper, foodVariant: food, tickVariant: tick };
        const page = await newPage();
        await page.goto(link(p));
        await page.locator("[data-sheet-page]").nth(1).waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(200);
        const problems = await clippedInPrint(page);
        assert.deepEqual(problems, [], `${label} on ${paper} (${food}, ${tick}) has clipped content`);
        const pdf = pdfInfo(await page.pdf({ preferCSSPageSize: true, printBackground: true }));
        const [w, h] = PAPER_PT[paper];
        assert.ok(Math.abs(pdf.width - w) < 3 && Math.abs(pdf.height - h) < 3, `${paper} page size, got ${pdf.width}×${pdf.height}`);
        if (label === "typical") assert.equal(pdf.pages, 2, `typical plan prints on 2 pages on ${paper}, got ${pdf.pages}`);
        else assert.ok(pdf.pages >= 2, "worst case flows onto more pages instead of clipping");
        console.log(`${label.padEnd(7)} ${paper.padEnd(6)} ${food.padEnd(8)} ${tick.padEnd(13)} ${pdf.pages} pages, nothing clipped`);
        if (shots && (tick === "weekSheet" ? label === "typical" : true)) {
          await page.emulateMedia({ media: "print" });
          await page.screenshot({ path: `${shots}/print-${label}-${paper}-${food}.png`, fullPage: true });
          await page.emulateMedia({ media: null }); // reset, so page.pdf() uses print media again
        }
      }
    }
  }

  // Research mode flips variants without touching the family's plan.
  const r = await newPage();
  await r.goto(link(typical, true));
  await r.locator("[data-research]").waitFor();
  const before = new URL(r.url()).hash;
  const wide = () => r.locator("[data-dose-card] svg[viewBox='0 0 96 48']").count();
  assert.ok((await wide()) > 0, "sequence pictograms by default");
  await r.getByText("Full or empty plate").click();
  assert.equal(await wide(), 0, "plate pictograms after flipping");
  await r.getByText("Colour-coded days").click();
  await r.getByText("Mon", { exact: true }).waitFor();
  await r.waitForTimeout(400);
  assert.equal(new URL(r.url()).hash, before, "research changes stay out of the plan");
  const plain = await newPage();
  await plain.goto(link(typical));
  await plain.locator("[data-sheet-page]").first().waitFor();
  assert.equal(await plain.locator("[data-research]").count(), 0, "no research panel without ?research=1");

  // Printing records the version; a changed plan prints as the next version.
  await plain.getByRole("button", { name: "Print fridge sheet" }).click();
  await plain.getByText("Fridge sheet ready. Version 1 has a dark blue border.").waitFor();
  await plain.waitForTimeout(400);
  const printedHash = new URL(plain.url()).hash.slice(3);
  const printed = JSON.parse(LZString.decompressFromEncodedURIComponent(printedHash));
  assert.ok(printed.sheetVersion.printedAt && printed.sheetVersion.fingerprint, "print recorded in the plan");
  const changed = structuredClone(printed);
  changed.medicines[0].doses[0].quantity = 2;
  const v2 = await newPage();
  await v2.goto(link(changed));
  await v2.getByText("This prints as version 2, with a teal border.").waitFor();
  const sheetBorder = await v2.locator("[data-sheet-page]").first().evaluate((e) => getComputedStyle(e).borderTopColor);
  assert.equal(sheetBorder, "rgb(31, 122, 122)", "teal border on version 2");

  assert.deepEqual(offOrigin, [], "no request leaves the origin");
  console.log("ok: fridge sheet prints cleanly on A4 and Letter; research toggles stay local; versions advance on changed prints");
} finally {
  await browser.close();
  server.close();
}
