const puppeteer = require('puppeteer');
const fs = require('fs');


const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';

let datuakjaso = async () => {
  try {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    
    await page.goto(url, { waitUntil: 'networkidle0' });

    
    const data = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll("body > div.svg-container > div"));
      const texts = Array.from(document.querySelectorAll("body > div.svg-container > div > svg > text"));
      const icons = Array.from(document.querySelectorAll("body > div.svg-container > div > svg > image"));

      
      return ids.map((_, i) => ({
        'id': ids[i] ? ids[i].getAttribute("data-id") : 'N/A',
        'text': texts[i] && texts[i].textContent ? texts[i].textContent.replace(/\s+/g, ' ').trim() : 'N/A',
        'icon': icons[i] && icons[i].getAttribute("href") ? icons[i].getAttribute("href") : 'N/A'
      }));
    });

    
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

    console.log('Data saved to data.json');

    await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

datuakjaso();
