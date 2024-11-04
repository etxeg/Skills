fetch("data.json")
    .then(response => response.json())
    .then(icons => {
        const iconsContainer = document.querySelector(".svg-container");

        icons.forEach((icon  => {
            //wrapper for each icon
            const svgWrapper = document.createElement("div");
            svgWrapper.setAttribute("class", "svg-wrapper");
            svgWrapper.setAttribute("data-id", icon.id);
            svgWrapper.setAttribute("data-custom", "false");

            //svg element
            const svg = document.createElement("svg");
            svg.setAttribute("width", "100");  
            svg.setAttribute("height", "100");
            svg.setAttribute("viewBox", "0 0 100 100");

            //hexagon
            const hexagon = document.createElement("polygon");
            hexagon.setAttribute("points", "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5");

