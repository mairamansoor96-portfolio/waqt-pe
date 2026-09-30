// End-to-end check against the static export in out/, on a phone-sized
// touch screen, with the preinstalled Chromium.
//
// Milestone 1: a plan survives a page reload from the link alone.
// Milestone 2: person, giver, anchors and contacts can be entered on a phone.
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
/** A brand-new browser profile: no cookies, storage or IndexedDB. */
const newPage = async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  const page = await context.newPage();
  page.on("request", (r) => {
    if (!r.url().startsWith(origin) && !r.url().startsWith("data:")) offOrigin.push(r.url());
  });
  page.on("pageerror", (e) => {
    throw e;
  });
  return page;
};
const shot = async (page, name) => {
  if (shots) await page.screenshot({ path: `${shots}/${name}.png`, fullPage: true });
};
const question = (page) => page.locator("h1");
const next = async (page, expected) => {
  await page.getByRole("button", { name: "Continue", exact: true }).tap();
  await question(page).filter({ hasText: expected }).waitFor();
};
const settle = (page) => page.waitForTimeout(400); // debounced save

try {
  const page = await newPage();

  // Landing: start setup in one tap.
  await page.goto(origin + "/");
  await page.getByText("Nothing you enter leaves this device.").waitFor();
  await shot(page, "01-landing");
  await page.getByRole("button", { name: "Start a plan" }).tap();

  // 1. Name is the only required field.
  await question(page).filter({ hasText: "Who is this plan for?" }).waitFor();
  assert.match(await page.getByText("Step 1 of 8").textContent(), /Step 1 of 8/);
  await page.getByRole("button", { name: "Continue", exact: true }).tap();
  await page.getByText("Add a name so the sheets can use it.").waitFor();
  await page.getByLabel("Their name, as the family says it").fill("Ammi");
  await next(page, "What should a doctor know about Ammi?");

  // 2. Health.
  await page.getByText("B+", { exact: true }).tap();
  await page.getByText("Diabetes", { exact: true }).tap();
  await page.getByText("Takes a blood thinner", { exact: true }).tap();
  await page.getByLabel("Another condition").fill("Hip replacement");
  await page.getByRole("button", { name: "Add", exact: true }).first().tap();
  await page.getByLabel("Allergy", { exact: true }).fill("Penicillin");
  await page.getByLabel("Allergy", { exact: true }).press("Enter");
  await page.getByRole("button", { name: "Remove Penicillin" }).waitFor();
  await shot(page, "02-health");
  await next(page, "Who usually gives Ammi the medicines?");

  // 3. Giver changes what gets set up.
  assert.match(await page.getByText("Step 3 of 8").textContent(), /Step 3 of 8/);
  await page.getByText("A helper who doesn't read").tap();
  await page.getByLabel(/Helper's name/).fill("Shabnam");
  await page.getByText("A voice-note script to read to Shabnam").waitFor();
  await page.getByText("A photo of every medicine box").waitFor();
  await shot(page, "03-giver");
  await next(page, "What does Ammi's day run by?");

  // 4. Anchors, with sensible defaults per mode and editable labels.
  await page.getByText("Prayers", { exact: true }).tap();
  const morningEn = page.getByLabel("In English").first();
  assert.equal(await morningEn.inputValue(), "Fajr");
  assert.equal(await page.getByLabel("In Urdu").first().inputValue(), "فجر");
  await morningEn.fill("Fajr, after tea");
  await shot(page, "04-anchors");
  await next(page, "What medicines does Ammi take?");

  // 5. Medicines placeholder.
  await page.getByText("Gather Ammi's medicine boxes and the prescription").waitFor();
  await next(page, "Who should people call about Ammi?");

  // 6. Contacts: loose phone check that never blocks.
  await page.getByRole("button", { name: "Add a person to call" }).tap();
  await page.getByLabel("Name", { exact: true }).fill("Maira");
  await page.getByLabel("How they're related").fill("daughter");
  await page.getByLabel("Phone number").fill("123");
  await page.getByLabel("Phone number").blur();
  await page.getByText("This number looks short.").waitFor();
  await page.getByLabel("Phone number").fill("+92 300 1234567");
  await page.getByRole("button", { name: "Add a person to call" }).tap(); // left blank on purpose
  await shot(page, "05-contacts");
  await next(page, "Check each medicine against the prescription");
  await next(page, "Keep Ammi's plan safe");

  // 8. Save: the summary shows everything; blank contact was dropped.
  const summary = page.locator("dl");
  for (const text of ["Ammi", "B+, Diabetes, Takes a blood thinner, Hip replacement, Penicillin", "Shabnam", "Prayers", "Maira"]) {
    assert.ok((await summary.textContent()).includes(text), `summary shows ${text}`);
  }
  assert.equal(await summary.locator("li").count(), 1, "blank contact dropped");
  await settle(page);
  await shot(page, "06-save");
  const link = page.url();
  assert.match(link, /\/setup\/save\/#p=/);

  // Milestone 1: the link alone restores the plan in a fresh browser.
  const fresh = await newPage();
  await fresh.goto(link);
  await question(fresh).filter({ hasText: "Keep Ammi's plan safe" }).waitFor();
  assert.ok((await fresh.locator("dl").textContent()).includes("Maira"));
  await fresh.getByRole("button", { name: /Change.*People to call/ }).tap();
  await question(fresh).filter({ hasText: "Who should people call about Ammi?" }).waitFor();
  assert.equal(await fresh.getByLabel("Phone number").inputValue(), "+92 300 1234567");
  await fresh.getByLabel("How they're related").fill("eldest daughter");
  await settle(fresh);
  // The browser's back button restores an older link; it must be brought up to date.
  await fresh.goBack();
  await question(fresh).filter({ hasText: "Keep Ammi's plan safe" }).waitFor();
  await settle(fresh);
  await fresh.reload();
  await question(fresh).filter({ hasText: "Keep Ammi's plan safe" }).waitFor();
  assert.ok((await fresh.locator("dl").textContent()).includes("eldest daughter"), "edit survives back + reload");

  // Every step restores from the link too.
  const restored = await newPage();
  await restored.goto(fresh.url().replace("/setup/save/", "/setup/anchors/"));
  await question(restored).filter({ hasText: "What does Ammi's day run by?" }).waitFor();
  assert.equal(await restored.getByLabel("In English").first().inputValue(), "Fajr, after tea");
  assert.equal(await restored.getByRole("radio", { name: /Prayers/ }).isChecked(), true);
  await restored.goto(fresh.url().replace("/setup/save/", "/setup/giver/"));
  await question(restored).filter({ hasText: "Who usually gives Ammi the medicines?" }).waitFor();
  assert.equal(await restored.getByRole("radio", { name: /A helper who doesn't read/ }).isChecked(), true);
  assert.equal(await restored.getByLabel(/Helper's name/).inputValue(), "Shabnam");

  // Landing with a plan offers to continue it.
  await restored.goto(fresh.url().replace("/setup/save/", "/"));
  await restored.getByRole("button", { name: "Continue Ammi's plan" }).waitFor();

  // A cut-short link says so instead of silently starting over.
  const broken = await newPage();
  await broken.goto(link.slice(0, link.length - 20).replace("/setup/save/", "/"));
  await broken.getByText("This link doesn't hold a plan").waitFor();

  // /setup/ on its own goes to the first question.
  await broken.goto(origin + "/setup/");
  await question(broken).filter({ hasText: "Who is this plan for?" }).waitFor();

  // Urdu: whole document right-to-left, and it sticks across screens.
  const ur = await newPage();
  await ur.goto(fresh.url().replace("/setup/save/", "/setup/giver/"));
  await ur.getByRole("button", { name: "Switch to Urdu" }).tap();
  assert.equal(await ur.evaluate(() => document.documentElement.dir), "rtl");
  await ur.reload();
  assert.equal(await ur.evaluate(() => document.documentElement.dir), "rtl");
  await question(ur).filter({ hasText: "کو دوائیں عام طور پر کون دیتا ہے؟" }).waitFor();
  await ur.waitForTimeout(300);
  await shot(ur, "07-giver-ur");
  await ur.goto(fresh.url().replace("/setup/save/", "/setup/contacts/"));
  await ur.waitForTimeout(300);
  await shot(ur, "08-contacts-ur");

  // Clear everything, confirmed in the page.
  await fresh.getByRole("button", { name: /Change.*Name/ }).waitFor();
  await fresh.getByRole("button", { name: "Clear everything on this device" }).tap();
  await fresh.getByRole("button", { name: "Yes, clear everything" }).tap();
  await fresh.getByText("Everything on this device has been cleared.").waitFor();
  assert.equal(new URL(fresh.url()).hash, "");

  if (shots) {
    const landing = await newPage();
    await landing.goto(origin + "/");
    await landing.getByText("What the fridge sheet looks like").waitFor();
    await landing.waitForTimeout(300);
    await shot(landing, "00-landing-full");
  }

  assert.deepEqual(offOrigin, [], "no request leaves the origin");
  console.log("ok: setup flow works on a phone; plan survives reload from the link alone; no off-origin requests");
} finally {
  await browser.close();
  server.close();
}
