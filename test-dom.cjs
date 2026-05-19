const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForSelector('.blocklyTreeRow', {timeout: 5000});
  const html = await page.$eval('.blocklyTreeRow', el => el.outerHTML);
  console.log(html);
  await browser.close();
})();
