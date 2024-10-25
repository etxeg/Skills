const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Carpeta donde se guardarán los íconos
const iconsDir = path.resolve(__dirname, 'public/electronics/icons');

// Crea la carpeta si no existe
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Cargar el archivo JSON con los enlaces de los íconos
const datajson = require('./data.json'); // Asegúrate de tener el archivo icons.json con los enlaces
const iconLinks = datajson.map((item) => item.icon);
// Función para descargar archivos desde una URL
const downloadIcon = async (url, filename) => {
  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(path.resolve(iconsDir, filename));
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(true));
      writer.on('error', () => reject(false));
    });
  } catch (error) {
    return false;
  }
};

let loadIconsFromJson = async () => {
  try {
    const linkzati='https://tinkererway.dev/';
    // Itera sobre cada URL en el archivo JSON para descargar los íconos
    await Promise.all(
        iconLinks.map(async (item, i) => {
        const itemgarbi = item.replace(/^(\.\.\/)+/, '');
        const iconUrl = linkzati+itemgarbi;
        const success = await downloadIcon(iconUrl, `icon${i + 1}.svg`);
      

      if (success) {
        console.log(`Ikono ${i + 1} deskargatuta arrakastaz: ${iconUrl}`);
      } else {
        console.log(`Errorea ikono ${i + 1} deskargatzean: ${iconUrl}`);
      }
    }));
    

    console.log('Ikono guztiak deskargatu dira');
  } catch (error) {
    console.error('Errorea gertatu da:', error);
  }
};

loadIconsFromJson();
