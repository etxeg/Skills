let container = document.querySelector('.svg-container');

window.onload = async function () {
    try {
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

        // Fetch skills from the backend API
        let response = await fetch('/skills/api/skills');
        if (!response.ok) throw new Error('Error fetching skills from the API');

        let skills = await response.json(); // Parse JSON response

        // Fetch user skills from the backend API
        let response2 = await fetch('/userSkill/api/user-skills');
        if (!response2.ok) throw new Error('Error fetching user skills from the API');

        let userSkills = await response2.json();

        let cardsArray = [];

        for (let i = 0; i < skills.length; i++) {
            let imagen = `/electronics/icons/icon${skills[i].id}.svg`; // Adjust path as needed
            let carta = createSkillCard(skills[i], imagen);
            cardsArray.push(carta);
        }

        let skillCounts = {};
        let skillCounts2 = {};
        userSkills.forEach(userSkill => {
            if (!userSkill.verified) {
                if (skillCounts[userSkill.skill]) {
                    skillCounts[userSkill.skill]++;
                } else {
                    skillCounts[userSkill.skill] = 1;
                }
            }else{
                if (skillCounts2[userSkill.skill]) {
                    skillCounts2[userSkill.skill]++;
                } else {
                    skillCounts2[userSkill.skill] = 1;
                }
            }

        });

        userSkills.forEach(userSkill => {
            // Find the card element with the matching skill ID (using data-id attribute)
            let skillId = userSkill.skill;
            let hexagon = document.querySelector(`[data-id="${userSkill.skill}"]`);
            if (hexagon && skillCounts[skillId] >= 1) {
                let count = skillCounts[skillId];
                addRedCircle(hexagon, count); // Add red circle if there's a match
            }else if(hexagon && skillCounts2[skillId] >= 1){
                let count2 = skillCounts2[skillId];
                addGreenCircle(hexagon, count2);
            }
        });

        let buttons = document.querySelectorAll('.svg-wrapper');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', handleButtonHover);
            button.addEventListener('mouseleave', handleButtonHover);
            button.querySelector('.notebook-icon').addEventListener('click', handleNotebookIconClick);
            button.querySelector('.pencil-icon').addEventListener('click', handlePencilIconClick);
        });

    } catch (error) {
        console.error('Error loading skills:', error);
    }
};


function addRedCircle(carta, count) {
    let redIcon = document.createElement('div');
    redIcon.classList.add('icon', 'red-icon');
    redIcon.innerHTML = '🔴';

    let redNumber = document.createElement('span');
    redNumber.textContent = count; // Set the number dynamically
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

function addGreenCircle(carta, count) {
    let greenIcon = document.createElement('div');
    greenIcon.classList.add('icon', 'green-icon');
    greenIcon.innerHTML = '🟢';
    carta.querySelector('polygon').style.fill = 'green';

    let greenNumber = document.createElement('span');
    greenNumber.textContent = count; // Set the number dynamically
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

function handlePencilIconClick(event) {
    event.stopPropagation();

    // Get the parent svg-wrapper element
    const parentWrapper = event.currentTarget.closest('.svg-wrapper');
    const hexagonId = parentWrapper?.getAttribute('data-id');

    console.log('Navigating to edit page for ID:', hexagonId); // Debug log

    if (!hexagonId) {
        console.error('Hexagon ID not found!');
        return;
    }

    window.location.href = `/skills/electronics/edit/${hexagonId}`;
}


function handleNotebookIconClick(event) {
    //when clicked, serve the new ejs file
    event.stopPropagation();

    // Get the parent svg-wrapper element which contains the data-id
    const parentWrapper = event.currentTarget.closest('.svg-wrapper');
    const hexagonId = parentWrapper.getAttribute('data-id');

    // Navigate to the notebook page with the hexagon ID
    window.location.href = `/skills/electronics/view/${hexagonId}`;
}
