const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki#listado-de-rangos';

let datuakjaso = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    const data = await page.evaluate(() => {
      const rango = Array.from(document.querySelectorAll("table:nth-child(n+37) > tbody > tr > td:nth-child(3)"));
      const png = Array.from(document.querySelectorAll("table:nth-child(n+37) > tbody > tr > td:nth-child(2) > img"));
      let num = 0;

      return rango.map((_, i) => {
        const item = {
          'rango': rango[i] ? rango[i].textContent.trim() : 'N/A',
          'bitpoints-min': num,
          'bitpoints-max': num + 9,
          'png': png[i] ? png[i].getAttribute("src") : 'N/A',
        };
        num += 10;  // Incrementa num solo dentro del map
        return item;
      });
    });

    fs.writeFileSync('databadget.json', JSON.stringify(data, null, 2));

    console.log('Data saved to databadget.json');

    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

datuakjaso();
