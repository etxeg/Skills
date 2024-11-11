const fs = require('fs');
const path = require('path');
const axios = require('axios');

const badgesDir = path.join(__dirname, '../public/badges');

if (!fs.existsSync(badgesDir)) {
  fs.mkdirSync(badgesDir);
}

const datajson = require('./databadget.json');
const badgeLinks = datajson.map((item) => item.png); //mirar como pillar bien los badges, item.icon??

const downloadBadge = async (url, filename) => {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(path.resolve(badgesDir, filename));
    response.data.pipe(writer);

    return new Promise((resolve,reject) => {
      writer.on('finish', () => resolve(true));
      writer.on('error', () => reject(false));
    });
  } catch (error) {
    return false;
  }
};

let loadBadgesFromJson = async () => {
  try {
    const linkzati = 'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/';

    await Promise.all( //badgeak hemen lortu
      badgeLinks.map(async (item, i) => {
        const itemgarbi = item.replace();
        const badgeUrl = linkzati + itemgarbi;
        const success = await downloadBadge(badgeUrl, ``);

        if (success) {
          console.log(`Ikono ${i + 1} deskargatuta arrakastaz: ${badgeUrl}`);
        } else {
          console.log(`Errorea ikono ${i + 1} deskargatzean: ${badgeUrl}`);
        }
      }));
  }
};

loadBadgesFromJson();
