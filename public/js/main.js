let container = document.querySelector('.svg-container');

window.onload = async function() {
    try {
        let response = await fetch('/scripts/data.json');
        if (!response.ok) throw new Error('Error al cargar el JSON');

        let data = await response.json();

        let cardsArray = [];

        for (let i = 0; i < data.length-1; i++) {
            let imagen = `/electronics/icons/icon${data[i].id}.svg`;
            let carta = createSkillCard(data[i], imagen);
            cardsArray.push(carta);
        }

        addRedCircle(cardsArray[0]);
        addGreenCircle(cardsArray[1]);

        let buttons = document.querySelectorAll('.svg-wrapper');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', handleButtonHover);
            button.addEventListener('mouseleave', handleButtonHover);
        });

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }

    
};

function addRedCircle (carta) {
    let redIcon = document.createElement('div');
    redIcon.classList.add('icon', 'red-icon');
    redIcon.innerHTML = '🔴';  // You can replace with SVG icon if available
    carta.appendChild(redIcon);
}

function addGreenCircle (carta) {
    let greenIcon = document.createElement('div');
    greenIcon.classList.add('icon', 'green-icon');
    greenIcon.innerHTML = '🟢';  // You can replace with SVG icon if available
    carta.querySelector('polygon').style.fill = 'green';
    carta.appendChild(greenIcon);
}

function createSkillCard(data, imagen) {
    let carta = document.createElement('div');
    carta.classList.add('svg-wrapper');
    carta.setAttribute('data-id', data.id);
    carta.setAttribute('data-custom', 'false');

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.setAttribute("viewBox", "0 0 100 100");

    let polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5");
    polygon.classList.add("hexagon");
    svg.appendChild(polygon);

    // Crear el elemento de texto y ajustar la posición inicial y el espaciado
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "25");  // Posición inicial más alta
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "9");
    text.setAttribute("font-family", "Arial");
    text.setAttribute("fill", "black");
    text.setAttribute("font-weight", "bold");

    // Dividir el texto en líneas de acuerdo con el límite de caracteres por línea
    let maxCharsPerLine = 18;
    let words = data.text.split(' ');
    let line = '';
    let dyIncrement = 1;  // Incremento para el desplazamiento vertical

    for (let word of words) {
        if ((line + word).length > maxCharsPerLine) {
            let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan.setAttribute("x", "50%");
            tspan.setAttribute("dy", `${dyIncrement}em`);  // Incremento acumulativo
            tspan.textContent = line.trim();
            text.appendChild(tspan);
            line = word + ' ';
        } else {
            line += word + ' ';
        }
    }

    // Agregar la última línea
    if (line) {
        let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", "50%");
        tspan.setAttribute("dy", `${dyIncrement}em`);
        tspan.textContent = line.trim();
        text.appendChild(tspan);
    }

    svg.appendChild(text);

    // Agregar la imagen
    let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("x", "35%");
    image.setAttribute("y", "60%");
    image.setAttribute("width", "30");
    image.setAttribute("height", "30");
    image.setAttribute("href", imagen);

    svg.appendChild(image);
    carta.appendChild(svg);
    container.appendChild(carta);

    // Pencil icon (hover effect)
    let pencilIcon = document.createElement('div');
    pencilIcon.classList.add('icon', 'pencil-icon');
    pencilIcon.innerHTML = '✏️';  // You can replace with SVG icon if available
    carta.appendChild(pencilIcon);

    // Notebook icon (hover effect)
    let notebookIcon = document.createElement('div');
    notebookIcon.classList.add('icon', 'notebook-icon');
    notebookIcon.innerHTML = '📒';  // You can replace with SVG icon if available
    carta.appendChild(notebookIcon);

    return carta;
}

function handleButtonHover(event) {
    let button = event.currentTarget;
    let hoverInfo = button.querySelector('.hover-info');
    let hoverButtons = button.querySelector('.hover-buttons');

    if (event.type === 'mouseenter') {
        button.classList.add('hover-button');
        hoverInfo.style.display = 'block';
        hoverButtons.style.display = 'flex';
    } else {
        button.classList.remove('hover-button');
        hoverInfo.style.display = 'none';
        hoverButtons.style.display = 'none';
    }
}
