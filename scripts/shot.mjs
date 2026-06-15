import { chromium } from "@playwright/test";

const url = process.argv[2] || "http://localhost:5173/grade/RTN-10481";
const out = process.argv[3] || "/tmp/grade.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
const mode = process.argv[4];
await page.waitForTimeout(mode && mode.startsWith("sel:") ? 700 : 3800);
if (mode === "full") {
  await page.screenshot({ path: out, fullPage: true });
} else if (mode && mode.startsWith("sel:")) {
  await page.locator(mode.slice(4)).first().screenshot({ path: out });
} else {
  await page.locator(".aspect-square").first().screenshot({ path: out });
}
await browser.close();
console.log("saved", out);
