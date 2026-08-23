import { chromium } from "playwright";
import path from "node:path";
const outDir = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 400 } });
const logs = [];
page.on("console", (msg) => { if (msg.type() === "error") logs.push(msg.text()); });
page.on("pageerror", (err) => logs.push(String(err)));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.locator("header a svg, aside a svg").first().screenshot({ path: path.join(outDir, "logo-rest.png") });

// hover state
const logoLink = page.locator("aside a").first();
await logoLink.hover();
await page.waitForTimeout(250);
await logoLink.screenshot({ path: path.join(outDir, "logo-hover.png") });

// favicon check
const iconRes = await page.goto("http://localhost:3000/icon.svg");
console.log("icon.svg status:", iconRes.status(), iconRes.headers()["content-type"]);

console.log("CONSOLE_ERRORS:", JSON.stringify(logs));
await browser.close();
