let container = document.querySelector('.svg-container');

window.onload = async function () {
    try {
        
        // Create and style the top-right menu container
        let topMenu = document.createElement('div');
        topMenu.id = 'topMenu';
        topMenu.style.position = 'fixed';
        topMenu.style.top = '10px';
        topMenu.style.right = '10px';
        topMenu.style.display = 'flex';
        topMenu.style.gap = '10px';
        topMenu.style.padding = '10px 20px';
        topMenu.style.backgroundColor = '#ffe865';
        topMenu.style.borderRadius = '8px';
        topMenu.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        topMenu.style.zIndex = '1000';
        topMenu.style.fontSize = '1em';
        topMenu.style.display = 'flex';
        document.body.appendChild(topMenu);

        let menuItems = [
            { text: 'Leaderboard', link: '/leaderboard' },
            { text: 'About', link: '/about' },
            { text: 'Logout', link: 'logout' },
            { text: 'Admin Dashboard', link: '/admin' },
        ];
        
        menuItems.forEach(item => {
            let menuItem = document.createElement('a');
            menuItem.textContent = item.text;
            menuItem.href = item.link;
            menuItem.style.textDecoration = 'none';
            menuItem.style.color = 'blue';
            menuItem.style.fontWeight = 'bold';
            menuItem.style.padding = '5px 10px';
            menuItem.style.border = '1px solid transparent';
            menuItem.style.borderRadius = '4px';
            menuItem.style.transition = 'all 0.3s ease';

            menuItem.addEventListener('mouseover', () => {
                menuItem.style.backgroundColor = '#fff';
                menuItem.style.color = '#000';
                menuItem.style.border = '1px solid #ccc';
            });
        
            menuItem.addEventListener('mouseout', () => {
                menuItem.style.backgroundColor = 'transparent';
                menuItem.style.color = 'blue';
                menuItem.style.border = '1px solid transparent';
            });
        
            topMenu.appendChild(menuItem);
        });

        // Create and style the hover message container dynamically
        let hoverMessage = document.createElement('div');
        hoverMessage.id = 'hover-message';
        hoverMessage.style.position = 'fixed';
        hoverMessage.style.bottom = '0';
        hoverMessage.style.left = '0';
        hoverMessage.style.width = '100%';
        hoverMessage.style.padding = '10px';
        hoverMessage.style.backgroundColor = '#ffe865';
        hoverMessage.style.color = 'black';
        hoverMessage.style.textAlign = 'center';
        hoverMessage.style.fontSize = '1em';
        hoverMessage.style.display = 'none'; // Hidden by default
        hoverMessage.style.display = 'flex';
        hoverMessage.style.justifyContent = 'center';
        hoverMessage.style.alignItems = 'center';
        document.body.appendChild(hoverMessage);

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
            button.querySelector('.notebook-icon').addEventListener('click', handleNotebookIconClick);

        });



    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }




};

function addRedCircle (carta) {
    let redIcon = document.createElement('div');
    redIcon.classList.add('icon', 'red-icon');
    redIcon.innerHTML = '🔴';  // You can replace with SVG icon if available

    let redNumber = document.createElement('span');
    redNumber.textContent = '1'; // Change this to the desired number
    redNumber.style.position = 'absolute';
    redNumber.style.top = '55%';
    redNumber.style.left = '50%';
    redNumber.style.transform = 'translate(-50%, -50%)';
    redNumber.style.color = 'black';
    redNumber.style.fontWeight = 'bold';
    redNumber.style.fontSize = '16px';

    redIcon.appendChild(redNumber);
    carta.appendChild(redIcon);
}

function addGreenCircle (carta) {
    let greenIcon = document.createElement('div');
    greenIcon.classList.add('icon', 'green-icon');
    greenIcon.innerHTML = '🟢';  // You can replace with SVG icon if available
    carta.querySelector('polygon').style.fill = 'green';

    let greenNumber = document.createElement('span');
    greenNumber.textContent = '1'; // Change this to the desired number
    greenNumber.style.position = 'absolute';
    greenNumber.style.top = '55%';
    greenNumber.style.left = '50%';
    greenNumber.style.transform = 'translate(-50%, -50%)';
    greenNumber.style.color = 'black';
    greenNumber.style.fontWeight = 'bold';
    greenNumber.style.fontSize = '16px';

    greenIcon.appendChild(greenNumber);

    carta.appendChild(greenIcon);
}

function createSkillCard(data, imagen) {

    let carta = document.createElement('div');
    carta.classList.add('svg-wrapper');
    carta.setAttribute('data-id', data.id);
    carta.setAttribute('data-custom', 'false');
    carta.setAttribute('data-message', data.text); // Add message data attribute

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

    let message = document.getElementById('hover-message');

    if (event.type === 'mouseenter') {
        button.classList.add('hover-button');

        // Display the message at the bottom of the screen
        message.textContent = button.getAttribute('data-message'); // Dynamically set message
        message.style.display = 'flex';
    } else {
        button.classList.remove('hover-button');

        // Hide the message at the bottom of the screen
        message.style.display = 'none';
    }
}


function handleNotebookIconClick(event) {
    //when clicked, serve the new ejs file
    event.stopPropagation();
    
    // Get the parent svg-wrapper element which contains the data-id
    const parentWrapper = event.currentTarget.closest('.svg-wrapper');
    const hexagonId = parentWrapper.getAttribute('data-id');
    
    // Navigate to the notebook page with the hexagon ID
    window.location.href = `/skill/${hexagonId}`;
}