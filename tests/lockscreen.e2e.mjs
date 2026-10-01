// Milestone 9: the lock-screen card. For both phone presets and both layouts,
// with a typical and a crowded plan, this checks:
//  - the downloaded PNG is exactly the preset's size;
//  - every drawn piece sits inside the safe area, and the drawn pixels in the
//    top 30% (clock) and bottom 10% (shortcuts, home bar) are plain background;
//  - the chosen fields appear, a field switched off disappears, and there's no
//    address option.
// The real "done when" (it sets as a wallpaper on two real phones) needs real
// phones; see SPEC.md.
//
// Run after `npm run build`:  node tests/lockscreen.e2e.mjs [screenshotDir]

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

const plan = (person, contacts) => ({
  schemaVersion: 1,
  person,
  giver: { type: "self" },
  anchors: {
    mode: "meals",
    labels: {
      morning: { en: "Breakfast", ur: "ناشتہ" },
      midday: { en: "Lunch", ur: "دوپہر کا کھانا" },
      evening: { en: "Dinner", ur: "رات کا کھانا" },
      night: { en: "Bedtime", ur: "سونے سے پہلے" },
    },
  },
  // Not checked against the prescription: the lock screen doesn't wait for that.
  medicines: [{ id: "m1", name: "Metformin 500 mg", purpose: "", form: "tablet", symbol: { colour: "#0072B2", shape: "star" }, reviewed: false, doses: [{ slot: "morning", quantity: 1, food: "after" }] }],
  contacts,
  sheetVersion: { number: 1, borderColour: "#2B2D6E", printedAt: "" },
  settings: { paper: "A4", foodVariant: "sequence", tickVariant: "weekSheet" },
});
const typical = plan(
  { name: "Ammi", bloodGroup: "B+", conditions: ["Type 2 diabetes", "Takes a blood thinner"], allergies: ["Penicillin"] },
  [
    { id: "c1", name: "Maira", relation: "daughter", phone: "+92 300 1234567" },
    { id: "c2", name: "بلال", relation: "بیٹا", phone: "+92 321 7654321" },
  ],
);
const crowded = plan(
  {
    name: "Ammi Jaan with a rather long name to wrap",
    bloodGroup: "AB-",
    conditions: Array.from({ length: 10 }, (_, i) => `Condition number ${i + 1} that changes treatment`),
    allergies: ["Penicillin", "Sulfa drugs", "Peanuts", "Latex", "Aspirin"],
  },
  [1, 2, 3].map((n) => ({ id: `c${n}`, name: `Contact with a long name ${n}`, relation: "grandson-in-law", phone: "+92 300 1234567 ext 890" })),
);
const link = (p) => `${origin}/outputs/lockscreen/#p=${LZString.compressToEncodedURIComponent(JSON.stringify(p))}`;
const PRESETS = { "iPhone, 1170 × 2532": [1170, 2532], "Android, 1080 × 2400": [1080, 2400] };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const offOrigin = [];
const newPage = async () => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  page.on("request", (r) => {
    if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) offOrigin.push(r.url());
  });
  page.on("pageerror", (e) => {
    throw e;
  });
  return page;
};

/** Wait for the canvas to be drawn at this size, then read its layout. */
async function layoutFor(page, w, h) {
  await page.waitForFunction(
    ([w, h]) => {
      const c = document.querySelector("[data-lockscreen]");
      return c && c.width === w && c.height === h && c.dataset.layout;
    },
    [w, h],
  );
  return page.locator("[data-lockscreen]").evaluate((c) => JSON.parse(c.dataset.layout));
}

/** Count drawn (non-background) pixels in the top 30% and bottom 10% of the canvas. */
const pixelsInClearZones = (page) =>
  page.locator("[data-lockscreen]").evaluate((c) => {
    const ctx = c.getContext("2d");
    const bg = [0x1e, 0x23, 0x40];
    const count = (y0, y1) => {
      const { data } = ctx.getImageData(0, y0, c.width, y1 - y0);
      let n = 0;
      for (let i = 0; i < data.length; i += 4) if (data[i] !== bg[0] || data[i + 1] !== bg[1] || data[i + 2] !== bg[2]) n++;
      return n;
    };
    return { top: count(0, Math.floor(c.height * 0.3)), bottom: count(Math.ceil(c.height * 0.9), c.height) };
  });

const pngSize = (buf) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), png: buf.subarray(1, 4).toString() === "PNG" });

try {
  for (const [label, p] of [["typical", typical], ["crowded", crowded]]) {
    for (const [presetChip, [w, h]] of Object.entries(PRESETS)) {
      for (const layout of ["text", "faces"]) {
        const page = await newPage();
        await page.goto(link(p));
        await page.locator("[data-lockscreen]").waitFor();
        // No lock: this output has no medicines on it.
        assert.equal(await page.getByText("Check the medicines first").count(), 0);
        await page.getByText(presetChip).tap();
        if (layout === "faces") await page.getByText(/if they don't read/).tap();
        const result = await layoutFor(page, w, h);
        const { safe, boxes, scale } = result;

        assert.ok(safe.top >= h * 0.3 && safe.bottom <= h * 0.9, "safe area keeps clear of the top 30% and bottom 10%");
        for (const b of boxes) {
          assert.ok(b.y >= safe.top - 0.5 && b.y + b.height <= safe.bottom + 0.5, `${b.kind} "${b.text}" is inside the safe area vertically`);
          assert.ok(b.x >= safe.left - 1 && b.x + b.width <= safe.right + 1, `${b.kind} "${b.text}" is inside the safe area horizontally`);
        }
        const clear = await pixelsInClearZones(page);
        assert.deepEqual(clear, { top: 0, bottom: 0 }, "nothing drawn under the clock or the buttons");

        const kinds = new Set(boxes.map((b) => b.kind));
        const texts = boxes.map((b) => b.text).join(" | ");
        assert.ok(texts.includes("In an emergency") && texts.includes("ایمرجنسی میں"), "emergency banner in English and Urdu");
        if (layout === "text") {
          for (const k of ["name", "blood", "conditions", "allergies", "contact", "phone"]) assert.ok(kinds.has(k), `${label} shows ${k}`);
          // Order: emergency, name, blood group, conditions, allergies, contacts.
          const firstY = (k) => Math.min(...boxes.filter((b) => b.kind === k).map((b) => b.y));
          const order = ["banner", "name", "blood", "conditions", "allergies", "phone"].map(firstY);
          assert.deepEqual(order, [...order].sort((a, b) => a - b), "spec order");
        } else {
          assert.equal(boxes.filter((b) => b.kind === "face").length, p.contacts.length, "a face per contact");
        }
        if (label === "crowded" && layout === "text") {
          assert.ok(scale < 1, `crowded card shrinks to fit (scale ${scale})`);
          if (scale < 0.75) await page.getByText("There's a lot on this card").waitFor();
        }
        // A phone number is never split across lines.
        const phones = boxes.filter((b) => b.kind === "phone").map((b) => b.text);
        for (const c of p.contacts) assert.ok(phones.includes(c.phone), `"${c.phone}" drawn whole on one line`);

        // The PNG is exactly the preset's size.
        const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download lock-screen picture" }).tap()]);
        const file = await readFile(await download.path());
        assert.deepEqual(pngSize(file), { width: w, height: h, png: true }, "PNG size");
        assert.match(download.suggestedFilename(), new RegExp(`^waqt-pe-emergency-.*${w}x${h}\\.png$`));
        await page.getByText("Picture saved. Now set it as the lock screen:").waitFor();
        console.log(`${label.padEnd(8)} ${String(w).padEnd(4)}×${h} ${layout.padEnd(5)} scale ${scale.toFixed(2)}, ${boxes.length} pieces inside the safe area, PNG ${w}×${h}`);

        if (shots && label === "typical") {
          await page.locator("[data-lockscreen]").scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${shots}/lock-${layout}-${w}.png`, fullPage: true });
          await writeCanvas(page, `${shots}/lock-${layout}-${w}-image.png`);
        }
      }
    }
  }

  // Switching a field off removes it; there's no address option at all.
  const page = await newPage();
  await page.goto(link(typical));
  await layoutFor(page, 1170, 2532);
  const chips = await page.locator('fieldset:has(legend:text("What to show")) label').allTextContents();
  assert.deepEqual(chips.map((c) => c.trim()), ["Name", "Blood group", "Conditions", "Allergies", "People to call"]);
  // No control anywhere offers an address (the warning and a note mention it, deliberately).
  assert.equal(await page.locator("label, input, button, select, textarea").filter({ hasText: /address/i }).count(), 0, "no address option");
  await page.getByText("Allergies", { exact: true }).tap();
  await page.waitForFunction(() => !JSON.parse(document.querySelector("[data-lockscreen]").dataset.layout).boxes.some((b) => b.kind === "allergies"));

  assert.deepEqual(offOrigin, [], "no request leaves the origin");
  console.log("ok: lock-screen PNGs are exactly the preset size, with nothing in the clock or button areas");
} finally {
  await browser.close();
  server.close();
}

async function writeCanvas(page, path) {
  const b64 = await page.locator("[data-lockscreen]").evaluate((c) => c.toDataURL("image/png").split(",")[1]);
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path, Buffer.from(b64, "base64"));
}
