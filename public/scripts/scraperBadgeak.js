const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki#listado-de-rangos';

let datuakjaso = async () => {
  try {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    const data = await page.evaluate(() => {
      const rango;
      const bitpoints_min;
      const bitpoints_max;
      const png;
    });
  } catch (error) {
    
  }
}
