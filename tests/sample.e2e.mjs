// End-to-end check of the landing page's sample plan, against the static
// export in out/, on a phone-sized touch screen with the preinstalled Chromium.
//
// - A first-time visitor sees every output in two taps without typing anything.
// - Every sample screen says it's a sample and offers to start a plan.
// - The sample never overwrites or mixes with the family's own plan: their
//   link comes back unchanged, and nothing is written to IndexedDB.
// - The landing page's bottom bar sticks only after the hero button scrolls away.
//
// Run after `npm run build`:  node tests/sample.e2e.mjs [screenshotDir]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const ROOT = new URL("../out/", import.meta.url).pathname;
const shots = process.argv[2];
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

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

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const offOrigin = [];
const newPage = async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  page.on("request", (r) => {
    if (!r.url().startsWith(origin) && !/^(data|blob):/.test(r.url())) offOrigin.push(r.url());
  });
  page.on("pageerror", (e) => {
    throw e;
  });
  return page;
};
const shot = async (page, name) => {
  if (shots) await page.screenshot({ path: `${shots}/${name}.png`, fullPage: true });
};
const h1 = (page) => page.locator("h1");
const hashOf = (page) => page.evaluate(() => window.location.hash);
const settle = (page) => page.waitForTimeout(400); // debounced save
const waitForPhotos = (page, n) =>
  page.waitForFunction((n) => [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length >= n, n);
/** Every key in idb-keyval's store on this origin (an empty list if it was never opened). */
const storedKeys = (page) =>
  page.evaluate(async () => {
    const dbs = (await indexedDB.databases?.()) ?? [];
    if (!dbs.some((d) => d.name === "keyval-store")) return [];
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("keyval-store");
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("keyval")) return resolve([]);
        const keys = db.transaction("keyval").objectStore("keyval").getAllKeys();
        keys.onsuccess = () => resolve(keys.result.map(String));
      };
    });
  });

const OUTPUTS = [
  { card: "fridge", title: "Fridge sheet", button: /^Preview\s*:\s*Fridge sheet$/, check: async (p) => waitForPhotos(p, 3) },
  { card: "stickers", title: "Sticker sheet", button: /^Print stickers$/, check: async (p) => p.getByText("Atorvastatin 10 mg").first().waitFor() },
  { card: "voice", title: "Voice-note script", button: /^Read it here\s*:\s*Voice-note script$/, check: async (p) => p.getByText(/Shazia/).first().waitFor() },
  { card: "doctor", title: "Doctor's list", button: /^Print or save\s*:\s*Doctor's list$/, check: async (p) => p.getByText("for cholesterol").first().waitFor() },
  { card: "lockscreen", title: "Emergency lock-screen card", button: /^Save wallpaper$/, check: async (p) => p.locator("canvas").first().waitFor() },
];

try {
  // 1. A first-time visitor: every output in two taps, no typing.
  for (const [i, o] of OUTPUTS.entries()) {
    const page = await newPage();
    await page.goto(origin + "/");
    await page.getByText("Nothing you enter leaves this device.").waitFor();
    if (i === 0) {
      // What you'll get: the five outputs, each with its tag.
      assert.equal(await page.locator("[data-output-card]").count(), 5);
      assert.equal(await page.locator("[data-output-card]").filter({ hasText: "Print" }).count(), 3);
      assert.equal(await page.locator("[data-output-card]").filter({ hasText: "Phone" }).count(), 2);
      await shot(page, "01-landing");
    }
    await page.getByRole("button", { name: "See a sample for Ammi" }).tap(); // tap 1
    await h1(page).filter({ hasText: "Ammi's kit is ready" }).waitFor();
    assert.equal(await hashOf(page), "#sample");
    assert.equal(await page.locator('[data-locked="true"]').count(), 0, "every sample output is open");
    await page.getByText("This is a sample. Start your own plan to make one for your family.").waitFor();
    if (i === 0) await shot(page, "02-sample-hub");
    await page.getByRole("button", { name: o.button }).tap(); // tap 2
    await h1(page).filter({ hasText: o.title.split(" ")[0] }).first().waitFor();
    await page.getByText("This is a sample.").first().waitFor();
    await o.check(page);
    await shot(page, `03-sample-${o.card}`);
    assert.deepEqual(await storedKeys(page), [], `nothing stored in IndexedDB on ${o.card}`);
    assert.match(await hashOf(page), /^#sample$/, `no plan written to the link on ${o.card}`);
    await page.context().close();
  }
  console.log("✓ every output opens from the landing page in two taps, each marked as a sample");

  // 2. The family's own plan is never touched.
  const page = await newPage();
  await page.goto(origin + "/setup/name/");
  await page.getByLabel("Their name, as the family says it").fill("Nani");
  await settle(page);
  const own = await hashOf(page);
  assert.match(own, /^#p=/);

  await page.goto(origin + "/" + own);
  await page.getByRole("button", { name: "Continue Nani's plan" }).first().waitFor();
  await page.getByRole("button", { name: "See a sample for Ammi" }).tap();
  await h1(page).filter({ hasText: "Ammi's kit is ready" }).waitFor();
  assert.equal(await hashOf(page), `#sample&${own.slice(1)}`, "the family's plan rides along untouched");

  // Changing a setting on a sample output stays in memory.
  await page.getByRole("button", { name: /^Preview\s*:\s*Fridge sheet$/ }).tap();
  await h1(page).filter({ hasText: "Fridge sheet" }).waitFor();
  await page.getByText("US Letter").tap();
  await settle(page);
  assert.equal(await hashOf(page), `#sample&${own.slice(1)}`);

  // Reloading a sample link stays in the sample.
  await page.reload();
  await page.getByText("This is a sample.").first().waitFor();

  // The browser's back button returns to the family's own plan, unchanged.
  await page.goto(origin + "/" + own);
  await page.getByRole("button", { name: "See a sample for Ammi" }).tap();
  await h1(page).filter({ hasText: "Ammi's kit is ready" }).waitFor();
  await page.goBack();
  await page.getByRole("button", { name: "Continue Nani's plan" }).first().waitFor();
  await settle(page);
  assert.equal(await hashOf(page), own, "back from the sample restores the family's link exactly");

  // The sample's own Back and Start lead back to the family's plan.
  await page.getByRole("button", { name: "See a sample for Ammi" }).tap();
  await h1(page).filter({ hasText: "Ammi's kit is ready" }).waitFor();
  await page.getByRole("button", { name: "Back", exact: true }).tap();
  await page.getByRole("button", { name: "Continue Nani's plan" }).first().waitFor();
  assert.equal(await hashOf(page), own);
  await page.getByRole("button", { name: "See a sample for Ammi" }).tap();
  await page.locator("[data-sample-notice]").getByRole("button", { name: "Start a plan" }).tap();
  await h1(page).filter({ hasText: "Who is this plan for?" }).waitFor();
  assert.equal(await page.getByLabel("Their name, as the family says it").inputValue(), "Nani");
  await settle(page);
  assert.equal(await hashOf(page), own);
  assert.deepEqual(await storedKeys(page), []);
  console.log("✓ the sample never overwrites or mixes with the family's own plan, link or IndexedDB");

  // 3. A sample link can't reach the setup screens (nothing there to edit).
  const stray = await newPage();
  await stray.goto(origin + "/setup/medicines/#sample");
  await h1(stray).filter({ hasText: "Ammi's kit is ready" }).waitFor();
  assert.equal(new URL(stray.url()).pathname, "/outputs/");
  console.log("✓ a sample link on a setup screen goes to the sample's outputs");

  // 4. A new visitor with no plan: Start a plan begins setup with nothing filled in.
  const fresh = await newPage();
  await fresh.goto(origin + "/");
  await fresh.getByRole("button", { name: "See a sample for Ammi" }).tap();
  await fresh.locator("[data-sample-notice]").getByRole("button", { name: "Start a plan" }).tap();
  await h1(fresh).filter({ hasText: "Who is this plan for?" }).waitFor();
  assert.equal(await fresh.getByLabel("Their name, as the family says it").inputValue(), "");
  console.log("✓ starting from the sample opens an empty plan");

  // 5. The bottom bar sticks only once the hero's Start button has scrolled away.
  const scroll = await newPage();
  await scroll.goto(origin + "/");
  await scroll.getByText("Nothing you enter leaves this device.").waitFor();
  const bar = scroll.locator("[data-sticky]");
  assert.equal(await bar.getAttribute("data-sticky"), "false", "not sticky while the hero button shows");
  await scroll.locator("#how").scrollIntoViewIfNeeded();
  await scroll.waitForFunction(() => document.querySelector("[data-sticky]")?.getAttribute("data-sticky") === "true");
  const barBox = await bar.boundingBox();
  assert.ok(Math.abs(barBox.y + barBox.height - 844) < 2, "the bar sits at the bottom of the screen");
  await scroll.evaluate(() => window.scrollTo(0, 0));
  await scroll.waitForFunction(() => document.querySelector("[data-sticky]")?.getAttribute("data-sticky") === "false");
  console.log("✓ the landing bottom bar sticks only after the hero button scrolls out of view");

  assert.deepEqual(offOrigin, [], "no off-origin requests");
  console.log("ok: two taps to every sample output; the sample stays separate from the family's plan");
} finally {
  await browser.close();
  server.close();
}
