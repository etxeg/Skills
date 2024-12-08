window.onload = async function() {
    try {
        let response = await fetch('databadget.json');
        if (!response.ok) throw new Error('Error al cargar el JSON');

        let data = await response.json();

        let rowsArray = [];  // Cambié el nombre de cardsArray a rowsArray

        for (let i = 0; i < data.length; i++) {  // Cambié el límite para incluir todos los elementos
            let rango = data[i].rango;  // Usamos el valor de 'rango'
            let id = i+1;
            let imagen = `./badges/badge-${id}.png`;   // Ruta de la imagen en la carpeta 'badges'
            let bitpointsMin = data[i]["bitpoints-min"];  // Usamos 'bitpoints-min'
            let bitpointsMax = data[i]["bitpoints-max"];  // Usamos 'bitpoints-max'
            let row = createRow(rango, imagen, bitpointsMin, bitpointsMax);  // Llamamos a createRow con los nuevos parámetros
            rowsArray.push(row);  // Añadimos las filas al array
        }

        // Aquí podrías añadir las filas a una tabla o a otro contenedor en el DOM, por ejemplo:
        const table = document.querySelector('.tabla');
        rowsArray.forEach(row => {
            table.appendChild(row);  // Añadimos cada fila generada a la tabla
        });

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

function createRow(rango, imagen, bitpointsMin, bitpointsMax) {
    const row = document.createElement('tr');
    
    // Crear celda para el rango
    const rangoCell = document.createElement('td');
    rangoCell.textContent = rango;  // Mostramos el rango
    row.appendChild(rangoCell);
    
    // Crear celda para la imagen
    const imgCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = imagen;  // Usamos la ruta de la imagen generada con el id
    img.width = 50;  // Tamaño de la imagen
    img.height = 50;
    imgCell.appendChild(img);
    row.appendChild(imgCell);
    
    // Crear celda para los bitpoints
    const bitpointsCell = document.createElement('td');
    bitpointsCell.textContent = `${bitpointsMin} - ${bitpointsMax}`;  // Mostramos el rango de bitpoints
    row.appendChild(bitpointsCell);

    return row;
}