// Milestone 1 "done when": a plan survives a page reload from the link alone.
// Serves the static export in out/, fills in a plan, then opens the copied
// link in a brand-new browser context (no cookies, storage or IndexedDB) and
// checks everything comes back. Also checks no request leaves the origin.
//
// Run after `npm run build`:  node tests/reload.e2e.mjs [screenshotDir]

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import assert from "node:assert/strict";
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

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const offOrigin = [];
const newPage = async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("request", (r) => {
    if (!r.url().startsWith(origin) && !r.url().startsWith("data:")) offOrigin.push(r.url());
  });
  return page;
};

try {
  // 1. Fill in a plan.
  const page = await newPage();
  await page.goto(origin + "/");
  await page.getByLabel("Their name, as the family says it").fill("Ammi");
  await page.getByLabel("Blood group (optional)").selectOption("O+");
  await page.getByLabel("Conditions a doctor should know about (optional)").fill("Type 2 diabetes\nHeart condition");
  await page.getByLabel("Allergies (optional)").fill("Penicillin");
  await page.getByText("A helper who doesn't read").click();
  await page.getByLabel("Helper's name (optional)").fill("شبنم");
  await page.getByText("Prayers", { exact: true }).click();
  await page.waitForFunction(() => location.hash.length > 3);
  await page.waitForTimeout(400); // let the debounced save land
  const link = page.url();
  assert.match(link, /#p=/, "plan is saved in the hash");
  if (shots) await page.screenshot({ path: `${shots}/en.png`, fullPage: true });

  // 2. Reload in the same tab.
  await page.reload();
  await page.getByText("Plan restored from this link.").waitFor();
  assert.equal(await page.getByLabel("Their name, as the family says it").inputValue(), "Ammi");

  // 3. Open the link in a fresh browser context: the link alone.
  const fresh = await newPage();
  await fresh.goto(link);
  await fresh.getByText("Plan restored from this link.").waitFor();
  assert.equal(await fresh.getByLabel("Their name, as the family says it").inputValue(), "Ammi");
  assert.equal(await fresh.getByLabel("Blood group (optional)").inputValue(), "O+");
  assert.equal(await fresh.getByLabel("Conditions a doctor should know about (optional)").inputValue(), "Type 2 diabetes\nHeart condition");
  assert.equal(await fresh.getByLabel("Allergies (optional)").inputValue(), "Penicillin");
  assert.equal(await fresh.getByRole("radio", { name: /A helper who doesn't read/ }).isChecked(), true);
  assert.equal(await fresh.getByLabel("Helper's name (optional)").inputValue(), "شبنم");
  assert.equal(await fresh.getByRole("radio", { name: "Prayers" }).isChecked(), true);
  assert.ok(await fresh.getByText("Fajr").isVisible(), "prayer anchors restored");
  assert.ok(await fresh.getByText("Who usually gives Ammi the medicines?").isVisible());

  // 4. Sample plan with medicines and contacts survives too.
  await fresh.getByRole("button", { name: "Load a sample plan" }).click();
  await fresh.waitForTimeout(400);
  const sampleLink = fresh.url();
  const third = await newPage();
  await third.goto(sampleLink);
  await third.getByText("Plan restored from this link.").waitFor();
  assert.equal(await third.locator("dt:has-text('Medicines') + dd").textContent(), "3");
  assert.equal(await third.locator("dt:has-text('Contacts') + dd").textContent(), "2");

  // 5. A cut-short link says so instead of silently starting over.
  const broken = await newPage();
  await broken.goto(link.slice(0, link.length - 20));
  await broken.getByText("This link doesn't hold a plan").waitFor();

  // 6. Urdu switches the whole document to right-to-left, and it sticks.
  await third.getByRole("button", { name: "Switch to Urdu" }).click();
  assert.equal(await third.evaluate(() => document.documentElement.dir), "rtl");
  await third.reload();
  assert.equal(await third.evaluate(() => document.documentElement.dir), "rtl");
  assert.equal(await third.evaluate(() => document.documentElement.lang), "ur");
  await third.waitForTimeout(300);
  if (shots) await third.screenshot({ path: `${shots}/ur.png`, fullPage: true });

  // 7. Clear everything resets the plan and the link.
  third.once("dialog", (d) => d.accept());
  await third.getByRole("button", { name: "اس ڈیوائس سے سب کچھ مٹا دیں" }).click();
  await third.getByText("اس ڈیوائس سے سب کچھ مٹا دیا گیا۔").waitFor();
  assert.equal(new URL(third.url()).hash, "");

  if (shots) {
    const kit = await newPage();
    await kit.goto(origin + "/kit/");
    await kit.waitForTimeout(300);
    await kit.screenshot({ path: `${shots}/kit.png`, fullPage: true });
  }

  assert.deepEqual(offOrigin, [], "no request leaves the origin");
  console.log("ok: plan survives reload from the link alone; no off-origin requests");
} finally {
  await browser.close();
  server.close();
}
