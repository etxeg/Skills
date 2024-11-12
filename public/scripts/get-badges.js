const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Directorio donde se guardarán los badges descargados
const badgesDir = path.join(__dirname, '../badges');

// Crear el directorio si no existe
if (!fs.existsSync(badgesDir)) {
  fs.mkdirSync(badgesDir);
}

// Cargar el archivo JSON que contiene los enlaces de los badges
const datajson = require('./databadget.json');
const badgeLinks = datajson.map((item) => item.png); // Obtener las URLs de los badges

// Función para descargar un badge
const downloadBadge = async (url, filename) => {
  try {
    // Realizar la solicitud HTTP para obtener el archivo como stream
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    });

    // Crear el archivo en el directorio de badges
    const writer = fs.createWriteStream(path.resolve(badgesDir, filename));
    response.data.pipe(writer);

    // Devolver una promesa que resuelve cuando el archivo se ha guardado correctamente
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(true));
      writer.on('error', () => reject(false));
    });
  } catch (error) {
    console.error(`Error al descargar el badge: ${url}`, error);
    return false;
  }
};

// Función principal para cargar los badges desde el JSON
let loadBadgesFromJson = async () => {
  try {
    await Promise.all( // Descargar todos los badges en paralelo
      badgeLinks.map(async (item, i) => {
        // Asegurarse de que la URL sea válida, y en este caso quitar el sufijo -min.png si no es necesario
        const badgeUrl = item.replace(/\.png$/, '-min.png');

        // Generar el nombre del archivo (usando el índice para asegurarse de que no haya conflictos)
        const filename = `badge-${i + 1}.png`;

        // Llamar a la función de descarga
        const success = await downloadBadge(badgeUrl, filename);

        // Informar si la descarga fue exitosa o no
        if (success) {
          console.log(`Badge ${i + 1} descargado con éxito: ${badgeUrl}`);
        } else {
          console.log(`Error al descargar el badge ${i + 1}: ${badgeUrl}`);
        }
      })
    );
  } catch (error) {
    console.error('Error al cargar los badges:', error);
  }
};

// Llamar a la función para cargar y descargar los badges
loadBadgesFromJson();
