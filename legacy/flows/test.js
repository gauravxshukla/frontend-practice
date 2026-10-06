// google-test.js
import puppeteer from 'puppeteer';

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: null, // Use default viewport
    args: ['--start-maximized'] // Start maximized
  });

  // Create new page
  const page = await browser.newPage();

  // Navigate to Google
  await page.goto('https://www.google.com', {
    waitUntil: 'networkidle2' // Wait until network is idle
  });

  // Wait for the search box to be available and type "weather in bangalore"
  await page.waitForSelector('textarea[name="q"], input[name="q"]', { timeout: 10000 });
  await page.type('textarea[name="q"], input[name="q"]', 'weather in bangalore');
  
  // Press Enter to search
  await page.keyboard.press('Enter');
  
  // Wait for the page to load after search
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Take screenshot of search results
  await page.screenshot({ path: 'weather_bangalore_search.png' });

  // Wait for 3 seconds to see the result
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Close browser
  await browser.close();
})();