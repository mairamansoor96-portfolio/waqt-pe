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
const link = (plan, research = false, output = "fridge") =>
  `${origin}/outputs/${output}/${research ? "?research=1" : ""}#p=${LZString.compressToEncodedURIComponent(JSON.stringify(plan))}`;
const PX_PER_MM = 96 / 25.4;

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

  // Milestone 7: stickers measure within 1 mm of spec, on both papers, at every size.
  for (const out of ["stickers", "doctor", "voice"]) {
    const l = await newPage();
    await l.goto(link(unchecked, false, out));
    await l.getByText("Check the medicines first").waitFor();
    assert.equal(await l.locator("[data-sheet-page]").count(), 0, `${out} locked until checked`);
  }
  for (const [label, plan] of [["typical", typical], ["worst", worst]]) {
    for (const paper of ["A4", "Letter"]) {
      for (const [size, chip] of [[20, "Small, 20 mm"], [30, "Medium, 30 mm"], [40, "Large, 40 mm"]]) {
        const p = structuredClone(plan);
        p.settings.paper = paper;
        const page = await newPage();
        await page.goto(link(p, false, "stickers"));
        await page.locator("[data-sticker-disc]").first().waitFor();
        if (size !== 30) await page.getByText(chip).click();
        await page.evaluate(() => document.fonts.ready);
        await page.emulateMedia({ media: "print" });
        const sizes = await page.evaluate(
          (pxPerMm) => ({
            discs: [...document.querySelectorAll("[data-sticker-disc]")].map((d) => {
              const r = d.getBoundingClientRect();
              const s = d.querySelector("svg").getBoundingClientRect();
              return { w: r.width / pxPerMm, h: r.height / pxPerMm, symbolInside: s.width <= r.width && s.height <= r.height };
            }),
            line: document.querySelector("[data-calibration-line]").getBoundingClientRect().width / pxPerMm,
          }),
          PX_PER_MM,
        );
        await page.emulateMedia({ media: null });
        assert.equal(sizes.discs.length, p.medicines.length, "one sticker per medicine");
        for (const d of sizes.discs) {
          assert.ok(Math.abs(d.w - size) <= 1 && Math.abs(d.h - size) <= 1, `${size} mm sticker measured ${d.w.toFixed(2)}×${d.h.toFixed(2)} mm`);
          assert.ok(d.symbolInside, "symbol fits inside its sticker");
        }
        assert.ok(Math.abs(sizes.line - 50) <= 0.5, `calibration line measured ${sizes.line.toFixed(2)} mm`);
        assert.deepEqual(await clippedInPrint(page), [], `stickers ${label} ${paper} ${size} mm clipped`);
        const pdf = pdfInfo(await page.pdf({ preferCSSPageSize: true, printBackground: true }));
        const [w, h] = PAPER_PT[paper];
        assert.ok(Math.abs(pdf.width - w) < 3 && Math.abs(pdf.height - h) < 3, `${paper} page size`);
        assert.equal(pdf.pages, 1, `${p.medicines.length} stickers at ${size} mm fit one ${paper} page, got ${pdf.pages}`);
        const worstDisc = Math.max(...sizes.discs.map((d) => Math.abs(d.w - size)));
        console.log(`stickers ${label.padEnd(7)} ${paper.padEnd(6)} ${size} mm: ${sizes.discs.length} stickers, off by at most ${worstDisc.toFixed(2)} mm, line ${sizes.line.toFixed(2)} mm, 1 page`);
        if (shots && label === "typical" && size === 30) {
          await page.emulateMedia({ media: "print" });
          await page.screenshot({ path: `${shots}/print-stickers-${paper}.png`, fullPage: true });
          await page.emulateMedia({ media: null });
        }
      }

      // Doctor's list: one page, nothing clipped.
      const p = structuredClone(plan);
      p.settings.paper = paper;
      const page = await newPage();
      await page.goto(link(p, false, "doctor"));
      await page.locator("[data-doctor-row]").first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.deepEqual(await clippedInPrint(page), [], `doctor's list ${label} ${paper} clipped`);
      const pdf = pdfInfo(await page.pdf({ preferCSSPageSize: true, printBackground: true }));
      if (label === "typical") {
        assert.equal(pdf.pages, 1, `doctor's list fits one ${paper} page`);
        const text = await page.locator("[data-sheet-page]").textContent();
        for (const want of ["1½ tablets, morning (Fajr)", "after food", "None listed by the family (this is not a record of no known allergies)", "B+", "Maira, daughter"])
          assert.ok(text.includes(want), `doctor's list shows "${want}"`);
      }
      console.log(`doctor   ${label.padEnd(7)} ${paper.padEnd(6)} ${pdf.pages} page(s), nothing clipped`);
      if (shots && label === "typical") {
        await page.emulateMedia({ media: "print" });
        await page.screenshot({ path: `${shots}/print-doctor-${paper}.png`, fullPage: true });
        await page.emulateMedia({ media: null });
      }
    }
  }

  // Milestone 8: the voice-note script matches the sheet's order, and Urdu
  // renders right to left.
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const v = await context.newPage();
    v.on("request", (r) => {
      if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) offOrigin.push(r.url());
    });
    await v.goto(link(typical, false, "voice"));
    await v.locator('[data-script="ur"]').waitFor();
    await v.evaluate(() => document.fonts.ready);
    const plain = (s) => s.replace(/[\u2066-\u2069]/g, "");
    const lines = (lang) => v.locator(`[data-script="${lang}"] [data-script-line]`).allTextContents();
    assert.deepEqual((await lines("en")).map(plain), [
      "Shabnam, here's how Ammi's medicines go.",
      "Morning, at Fajr, after food. The blue star box. One and a half tablets.",
      "Morning, at Fajr. The orange circle box. Half a tablet.",
      "Evening, at Maghrib, after food. The blue star box. One tablet.",
      "Night, at Isha, before food. The green leaf box. Two spoons.",
      "If anything is unclear, call me.",
    ]);
    assert.deepEqual((await lines("ur")).map(plain), [
      "Shabnam، یہ Ammi کی دوائیوں کا طریقہ ہے۔",
      "صبح، فجر، کھانے کے بعد۔ نیلے ستارے والا ڈبہ۔ ڈیڑھ گولی۔",
      "صبح، فجر۔ نارنجی دائرے والا ڈبہ۔ آدھی گولی۔",
      "شام، مغرب، کھانے کے بعد۔ نیلے ستارے والا ڈبہ۔ ایک گولی۔",
      "رات، عشاء، کھانے سے پہلے۔ سبز پتے والا ڈبہ۔ دو چمچ۔",
      "کچھ سمجھ نہ آئے تو مجھے فون کریں۔",
    ]);

    // Same order as the fridge sheet's dose cards.
    const scriptOrder = await v.locator('[data-script="en"] [data-script-line]').evaluateAll((els) =>
      els.map((e) => e.dataset.scriptLine).filter((k) => k !== "opening" && k !== "closing"),
    );
    const sheet = await newPage();
    await sheet.goto(link(typical));
    await sheet.locator("[data-dose-card]").first().waitFor();
    const sheetOrder = await sheet.locator("[data-dose-card]").evaluateAll((els) => els.map((e) => e.dataset.dose));
    assert.deepEqual(scriptOrder, sheetOrder, "script follows the fridge sheet's order");

    // Urdu renders right to left, in Nastaliq, whatever the interface language.
    /** Where each line's first visible letter lands: in the right or left half of its line. */
    const firstLetterSide = (lang) =>
      v.locator(`[data-script="${lang}"]`).evaluate((box) => {
        const style = getComputedStyle(box);
        const lines = [...box.querySelectorAll("[data-script-line] > span:last-child")].map((span) => {
          const text = span.firstChild;
          let i = 0;
          while (/[\u2066-\u2069\s]/.test(text.data[i])) i++; // skip the invisible direction marks
          const r = document.createRange();
          r.setStart(text, i);
          r.setEnd(text, i + 1);
          const letter = r.getClientRects()[0];
          const lineBox = span.getBoundingClientRect();
          const mid = lineBox.left + lineBox.width / 2;
          return { direction: getComputedStyle(span).direction, side: letter.left + letter.width / 2 > mid ? "right" : "left" };
        });
        return { lang: box.lang, dir: box.dir, direction: style.direction, font: style.fontFamily, lines };
      });
    const rtl = await firstLetterSide("ur");
    assert.equal(rtl.lang, "ur");
    assert.equal(rtl.dir, "rtl");
    assert.equal(rtl.direction, "rtl");
    assert.match(rtl.font, /Noto Nastaliq Urdu/);
    for (const [i, line] of rtl.lines.entries()) {
      assert.equal(line.direction, "rtl", `Urdu line ${i} is right to left`);
      assert.equal(line.side, "right", `Urdu line ${i} starts on the right`);
    }
    // Control: the same check on the English script finds every line starting on the left.
    const ltrLines = await firstLetterSide("en");
    assert.ok(ltrLines.lines.every((l) => l.side === "left" && l.direction === "ltr"), "English lines start on the left");
    if (shots) await v.screenshot({ path: `${shots}/voice-script.png`, fullPage: true });

    // The copy button copies exactly the script, one sentence group per line.
    await v.getByRole("button", { name: "Copy Urdu script" }).click();
    await v.getByText("Copied. Paste it into WhatsApp").first().waitFor();
    const copied = await v.evaluate(() => navigator.clipboard.readText());
    assert.deepEqual(copied.split("\n").map(plain), (await lines("ur")).map(plain));
    console.log("voice    script matches sheet order; Urdu right to left in Nastaliq; copy works");
  }

  assert.deepEqual(offOrigin, [], "no request leaves the origin");
  console.log("ok: fridge sheet, stickers and doctor's list print cleanly on A4 and Letter; stickers within 1 mm; voice script in sheet order with Urdu right to left; research toggles stay local; versions advance on changed prints");
} finally {
  await browser.close();
  server.close();
}
