// Asegúrate de que el contenedor esté definido correctamente
let container = document.querySelector('body > div');

window.onload = async function() { 
    try {
        // Obtener el archivo JSON
        let response = await fetch('./scripts/data.json');
        if (!response.ok) throw new Error('Error al cargar el JSON');
        
        let data = await response.json();

        // Iterar sobre los datos y crear tarjetas
        for (let i = 0; i < data.length; i++) {
            // Suponiendo que cada entrada en data tiene una propiedad `id`
            let imagen = `../scripts/Public/electronics/icons/icon${data[i].id}.svg`;
            createSkillCard(data[i].text || "Título por defecto", data[i].id, imagen);
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
};

function createSkillCard(data, id, imagen) {
    // Crear el contenedor principal (puedes descomentar si necesitas)
    let carta = document.createElement('div');
    carta.classList.add('svg-wrapper');
    carta.setAttribute('data-id', id);
    carta.setAttribute('data-custom', 'false');

    // Crear el elemento SVG
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.setAttribute("viewBox", "0 0 100 100");

    // Crear el polígono hexagonal
    let polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5");
    polygon.classList.add("hexagon");
    svg.appendChild(polygon); // Agregar el hexágono al SVG

    // Crear el texto
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "20%");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "black");
    text.setAttribute("font-size", "10");
    text.setAttribute("font-weight", "bold");

    // Dividir el texto de data en líneas
    let words = data.split(' '); // Dividir por espacios
    let line = '';
    let maxWidth = 80; // Ancho máximo permitido dentro del hexágono

    // Crear tspans y añadir texto
    for (let word of words) {
        let testLine = line + word + ' ';
        let testText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        testText.setAttribute("font-size", "10");
        testText.textContent = testLine;

        // Crear un SVG temporal para medir el ancho
        svg.appendChild(testText);
        let textWidth = testText.getBBox().width;
        svg.removeChild(testText);

        if (textWidth > maxWidth && line) {
            // Si la línea excede el ancho máximo, agregar el tspans
            let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan.setAttribute("x", "50%");
            tspan.setAttribute("dy", "1.2em");
            tspan.setAttribute("font-weight", "bold");
            tspan.textContent = line.trim(); // Agregar línea completa
            text.appendChild(tspan);

            // Reiniciar línea
            line = word + ' ';
        } else {
            line = testLine;
        }
    }

    // Agregar la última línea si no está vacía
    if (line) {
        let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", "50%");
        tspan.setAttribute("dy", "1.2em");
        tspan.setAttribute("font-weight", "bold");
        tspan.textContent = line.trim();
        text.appendChild(tspan);
    }

    svg.appendChild(text);

    // Crear la imagen SVG
    let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("x", "35%");
    image.setAttribute("y", "50%"); // Cambiado a 50% para centrar mejor
    image.setAttribute("width", "30");
    image.setAttribute("height", "30");
    image.setAttribute("href", imagen);

    // Añadir la imagen al SVG
    svg.appendChild(image);

    // Añadir el SVG al contenedor principal
    carta.appendChild(svg); // Agregar el SVG a la carta
    container.appendChild(carta); // Agregar la carta al contenedor
}
