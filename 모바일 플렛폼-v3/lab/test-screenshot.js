const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const filePath = 'file:///C:/01%20클로드코드/50-12%20화이어%20내비/Mobile/site/lab/simulation-concert.html';
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait for canvas to load
  await page.waitForSelector('canvas');

  // Take screenshot before starting
  await page.screenshot({
    path: 'C:\\01 클로드코드\\50-12 화이어 내비\\Mobile\\site\\lab\\screenshot-before.png',
    fullPage: false
  });

  console.log('Screenshot saved: screenshot-before.png');

  await browser.close();
})();
