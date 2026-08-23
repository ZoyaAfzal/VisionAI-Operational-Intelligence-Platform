import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const svg = readFileSync(process.argv[2], "utf8");
const outPath = process.argv[3];
const size = Number(process.argv[4] || 256);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: size, height: size } });
await page.setContent(
  `<!doctype html><html><body style="margin:0;padding:0;width:${size}px;height:${size}px;">${svg}</body></html>`
);
await page.locator("svg").evaluate((el, s) => {
  el.setAttribute("width", String(s));
  el.setAttribute("height", String(s));
}, size);
await page.locator("svg").screenshot({ path: outPath, omitBackground: true });
await browser.close();
console.log("wrote", outPath);
