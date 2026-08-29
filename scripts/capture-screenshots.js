const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');

const screenshots = [
  { name: 'dashboard', url: '/dashboard', width: 1400, height: 900 },
  { name: 'lab-interface', url: '/labs/lab01', width: 1400, height: 900 },
  { name: 'ai-tutor', url: '/tutor', width: 1400, height: 900 },
  { name: 'incidents', url: '/incidents', width: 1400, height: 900 },
  { name: 'network', url: '/network', width: 1400, height: 900 },
  { name: 'skills', url: '/skills', width: 1400, height: 900 },
];

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  });

  console.log('Capturing screenshots...\n');

  for (const shot of screenshots) {
    const page = await context.newPage();
    const url = BASE_URL + shot.url;

    console.log(`Capturing: ${shot.name}`);
    console.log(`  URL: ${url}`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for any React hydration
      await page.waitForTimeout(2000);

      // Take the screenshot
      const screenshotPath = path.join(OUT_DIR, `${shot.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
      });

      console.log(`  Saved: ${screenshotPath}\n`);
    } catch (err) {
      console.error(`  Error capturing ${shot.name}: ${err.message}\n`);
    }

    await page.close();
  }

  await browser.close();
  console.log('Screenshot capture complete!');
}

captureScreenshots().catch(console.error);
