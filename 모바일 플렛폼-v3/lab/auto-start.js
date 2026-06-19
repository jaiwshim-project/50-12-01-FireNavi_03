const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });

  const page = await browser.newPage();

  const filePath = 'file:///C:/01%20클로드코드/50-12%20화이어%20내비/Mobile/site/lab/simulation-concert.html';
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  // Click start button
  await page.evaluate(() => {
    const startBtn = document.querySelector('button.btn');
    if (startBtn) startBtn.click();
  });

  // Wait 8 seconds for simulation
  await page.waitForTimeout(8000);

  // Take screenshot
  await page.screenshot({
    path: 'C:\\01 클로드코드\\50-12 화이어 내비\\Mobile\\site\\lab\\screenshot-running.png',
    fullPage: false
  });

  console.log('Screenshot saved');

  await browser.close();
})();
