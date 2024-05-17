import * as lib from './lib.js';

const svg_files = new Array(5).fill(null);
let visualizationType ;
let selectedFile;

let id = 0;
// Fonction pour sélectionner un fichier JSON
function selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function (event) {
        const file = event.target.files[0];
        selectedFile = event.target.files[0]; // Stocker le fichier sélectionné
        window.selectedFile = selectedFile;

        if (file) {
            readFileUsingFetch(file);
        }
    };
    input.click();
}

window.selectFile = selectFile;


function displaySVGFilesVis1(svgFiles) {
    const container = document.getElementById('svgContainer');
    container.innerHTML = ''; // Clear the container
    const nbModeles = Math.sqrt(svgFiles.length);
    let currentRow;

    const svgDocument = new DOMParser().parseFromString(svgFiles[0].svgData, "image/svg+xml");
    const rows = svgDocument.querySelectorAll('.box').length;
    const cols = svgDocument.querySelectorAll('.box').length;

    // Calculate width and height based on rows and columns
    const one_cell_size = 52;

    const svgWidth = one_cell_size * Math.ceil(Math.sqrt(rows)) + 5 ;
    const svgHeight = one_cell_size * Math.ceil(Math.sqrt(cols)) + 5 ; 

    svgFiles.forEach((svgFile, index) => {
        if (index % nbModeles === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            container.appendChild(currentRow);
        }
        const tableCell = createSVGElement(svgFile, svgWidth, svgHeight);
        currentRow.appendChild(tableCell);

    });
}


async function vis1(jsonFile) {
    try {
        let jsonData = await fetch(jsonFile).then(response => response.json());
        const [modelNames, matrix] = new lib.getVis1DataFromJson(jsonData);
        const nbModeles = jsonData.nb_modeles;
        const cellHeight = 50;
        const cellWidth = 50;
        const textSize = 12;
        const selectElement = document.getElementById('colormap-dropdown');
        const selectedColormap = selectElement.value;
        const svgFiles = new lib.drawMatricesForVis1(matrix, modelNames, selectedColormap, cellWidth, cellHeight, textSize, Array.from({ length: nbModeles }, (_, i) => i.toString()));
        svg_files[1] = svgFiles;
        displaySVGFilesVis1(svgFiles);
        // Appel de la fonction pour ajouter les événements
        addEventListenersToSVG(svgFiles);
        console.log("=$= Image SVG chargée avec succès");
    } catch (error) {
        console.error("Erreur lors du chargement du fichier SVG :", error);
    }
}


function addEventListenersToSVG(svgFiles) {
    d3.selectAll("svg[type='svg_data']").each(function () {
        const svgDoc = this;
        const boxes = d3.select(svgDoc).selectAll(".box");
        if (boxes.empty()) {
            console.warn("No elements with class 'box' found in SVG:", svgDoc);
            return;
        }

        boxes.each(function () {
            const originalFill = d3.select(this).attr("fill");
            const originalStroke = d3.select(this).attr("stroke");
            const originalWidth = d3.select(this).attr("width");
            const originalHeight = d3.select(this).attr("height");
            d3.select(this).attr("data-original-fill", originalFill);
            d3.select(this).attr("data-original-stroke", originalStroke);
            d3.select(this).attr("data-original-width", originalWidth);
            d3.select(this).attr("data-original-height", originalHeight);
        })
            .on("mouseenter", function () {
                const className = d3.select(this).attr("class").trim();
                const [i, j] = new lib.extractIndices(className);
                const modelName = d3.select(this).attr("model_name");
                const attrCoords = d3.select(this).attr("original_coordinates").trim();
                const [cm_i, cm_j] = new lib.extractIndices(attrCoords)
                d3.selectAll("svg[type='svg_data']").selectAll(".i-" + i + ".j-" + j)
                    .attr("stroke", "red")
                    .attr("height", function () {
                        return d3.select(this).attr("data-original-height")-3;
                    })
                    .attr("width", function () {
                        return d3.select(this).attr("data-original-width")-3;
                    })
                    .attr("stroke-width", function () {
                        // Définir la valeur par défaut pour la taille du trait ici
                        return 5; // Modifiez cette valeur selon vos besoins
                    });

                // Update the content of the floating div with model name and coordinates
                document.getElementById("specialDiv").innerHTML = `Model : ${modelName}<br> Coords : (i: ${cm_i}, j: ${cm_j})`;

            })
            .on("mouseleave", function () {
                const className = d3.select(this).attr("class").trim();
                const [i, j] = new lib.extractIndices(className);
                d3.selectAll("svg[type='svg_data']").selectAll(".i-" + i + ".j-" + j).attr("width",50).attr("height",50)

                    .attr("stroke", function () {
                        return d3.select(this).attr("data-original-stroke");
                    })
                    .attr("width", function () {
                        return d3.select(this).attr("data-original-width");
                    })
                    .attr("height", function () {
                        return d3.select(this).attr("data-original-height");
                    })
                    .attr("stroke-width", function () {
                        // Définir la valeur par défaut pour la taille du trait ici
                        return 1; // Modifiez cette valeur selon vos besoins
                    });
            });
    });
}



// Fonction pour lire le contenu du fichier JSON en utilisant fetch
async function readFileUsingFetch(file) {
    const reader = new FileReader();
    reader.onload = async function (event) {
        const jsonData = event.target.result;
        const jsonRealData = await fetch(jsonData).then(response => response.json());
        visualizationType = jsonRealData.visualisation_type;
        id = 0;
        // Appel à la fonction de visualisation appropriée en fonction du type sélectionné
        if (visualizationType === 'vis1') {
            vis1(jsonData);
        }else if (visualizationType === 'vis2') {
            vis2(jsonData);
        } else if (visualizationType === 'vis3') {
            vis3(jsonData);
        } else if (visualizationType === 'vis4') {
            vis4(jsonData);
        }
        // // Mettre à jour l'image de la palette de couleurs
        const selectedColormap = document.getElementById('colormap-dropdown').value;
        const paletteImage = document.getElementById('palette-image');
        paletteImage.src = `images/${selectedColormap}.png`;
        paletteImage.style.display = 'block';
    };
    reader.onerror = function (event) {
        console.error("Erreur lors de la lecture du fichier :", event.target.error);
    };
    reader.readAsDataURL(file);
    // document.getElementById('downloadContainer').style.display = 'block';
}

window.readFileUsingFetch = readFileUsingFetch;

function createSVGElement(svgFile, svgWidth, svgHeight) {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('id', `${id++}`);
    svgElement.setAttribute('type', 'svg_data');
    svgElement.setAttribute('width', `${svgWidth}`);
    svgElement.setAttribute('height', `${svgHeight}`);
    svgElement.innerHTML = svgFile.svgData; // Définir le contenu SVG directement
    const tableCell = document.createElement('div');
    tableCell.classList.add('grid-item');
    tableCell.appendChild(svgElement);

    return tableCell;
}


function displaySVGFilesVis2(svgFiles) {
    const container = document.getElementById('svgContainer');
    container.innerHTML = ''; // Clear the container
    const nbModeles = Math.sqrt(svgFiles.length);
    let currentRow;

    const svgDocument = new DOMParser().parseFromString(svgFiles[0].svgData, "image/svg+xml");
    const rows = svgDocument.querySelectorAll('.box').length;
    const cols = svgDocument.querySelectorAll('.box').length;
    const one_cell_size = 150;
    const svgWidth = one_cell_size * Math.floor(Math.sqrt(Math.sqrt(rows)));
    const svgHeight = one_cell_size * Math.floor(Math.sqrt(Math.sqrt(rows))) + 20; //a regler apres
    // console.log();
    svgFiles.forEach((svgFile, index) => {
        if (index % nbModeles === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            container.appendChild(currentRow);
        }
        const tableCell = createSVGElement(svgFile, svgWidth, svgHeight);
        currentRow.appendChild(tableCell);

    });
}


async function vis2(jsonFile) {
    try {
        let jsonData = await fetch(jsonFile).then(response => response.json());
        const [modelNames, matrix] = new lib.get_vis2_3_data_from_json(jsonData);

        const nbClasses = jsonData.nb_classes;
        const cellHeight = 50;
        const cellWidth = 50;
        const textSize = 12;
        const selectElement = document.getElementById('colormap-dropdown');
        const selectedColormap = selectElement.value;

        const svgFiles = new lib.drawMatricesForVis2(matrix, selectedColormap, cellWidth, cellHeight, textSize, nbClasses, modelNames);
        svg_files[2] = svgFiles;
        displaySVGFilesVis2(svgFiles);
        addEventListenersToSVG(svgFiles);

        console.log("=$= Image SVG chargée avec succès");
    } catch (error) {
        console.error("Erreur lors du chargement du fichier SVG :", error);
    }
}


function displaySVGFilesVis3(svgFiles) {
    const container = document.getElementById('svgContainer');
    container.innerHTML = ''; // Clear the container
    const nbModeles = Math.sqrt(svgFiles.length);
    let currentRow;

    const svgDocument = new DOMParser().parseFromString(svgFiles[0].svgData, "image/svg+xml");
    const rows = svgDocument.querySelectorAll('.box').length;
    const cols = svgDocument.querySelectorAll('.box').length;
    const one_cell_size = 300;
    const svgWidth = one_cell_size * Math.floor(Math.sqrt(Math.sqrt(rows)));
    const svgHeight = one_cell_size * Math.floor(Math.sqrt(Math.sqrt(rows))); //a regler apres

    svgFiles.forEach((svgFile, index) => {
        if (index % nbModeles === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            container.appendChild(currentRow);
        }
        const tableCell = createSVGElement(svgFile, svgWidth, svgHeight);
        currentRow.appendChild(tableCell);

    });
}


async function vis3(jsonFile) {
    try {
        let jsonData = await fetch(jsonFile).then(response => response.json());
        const [modelNames, matrix] = new lib.get_vis2_3_data_from_json(jsonData);
        const nbClasses = jsonData.nb_classes;
        const cellWidth = 50;
        const textSize = 12;
        const selectElement = document.getElementById('colormap-dropdown');
        const selectedColormap = selectElement.value;

        const svgFiles = new lib.drawMatricesForVis3(matrix, selectedColormap, cellWidth, textSize, nbClasses, modelNames);
        svg_files[3] = svgFiles;
        displaySVGFilesVis3(svgFiles);

        addEventListenersToSVG(svgFiles);
        console.log("=$= Image SVG chargée avec succès");
    } catch (error) {
        console.error("Erreur lors du chargement du fichier SVG :", error);
    }
}


function mergeSVGs(svgList) {
    var mergedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svgList.forEach(svg => {
        var svgContent = Array.from(svg.svgData.childNodes);

        svgContent.forEach(node => {
            mergedSvg.appendChild(node.cloneNode(true));
        });
    });

    return mergedSvg;
}

function mergeSVGsAndDownload(svgList, fileName) {

    var mergedSvg = mergeSVGs(svgList);

    var svgString = new XMLSerializer().serializeToString(mergedSvg);

    var blob = new Blob([svgString], { type: 'image/svg+xml' });

    var url = URL.createObjectURL(blob);

    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName + '.svg';
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
}

function downloadSVG() {
    // const selectedType = document.getElementById('visualization-type').value;
    var svgList;

    if (visualizationType === 'vis1') {
        svgList = svg_files[1];
    } else if (visualizationType === 'vis2') {
        svgList = svg_files[2];
    } else if (visualizationType === 'vis3') {
        svgList =  svg_files[3];
    } else if (visualizationType === 'vis4') {
        svgList = svg_files[4];
    }
    if (svgList) {
        downloadSVGFiles(svgList, `${visualizationType}.zip`);
    } else {
        console.error('La liste d\'éléments SVG pour la visualisation sélectionnée n\'est pas définie.');
    }
}

window.downloadSVG = downloadSVG;


function downloadSVGFiles(svgFiles, zipname) {
    const zip = new JSZip();

    svgFiles.forEach((svgFile, index) => {
        zip.file(`${svgFile.modelName}.svg`, svgFile.svgData);
    });

    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            const zipURL = URL.createObjectURL(content);

            const downloadLink = document.createElement('a');
            downloadLink.href = zipURL;
            downloadLink.download = zipname;

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(zipURL);
        });
}


async function vis4(jsonFile) {
    try {
        let jsonData = await fetch(jsonFile).then(response => response.json());
        const [modelNames, matrix] = new lib.get_vis4_data_from_json(jsonData);
        const cellHeight = 50;
        const cellWidth = 50;
        const textSize = 12;
        const selectElement = document.getElementById('colormap-dropdown');
        const selectedColormap = selectElement.value;
        const classes = Array.from({ length: modelNames.length }, (_, i) => i.toString());
        const svgFiles = new lib.drawMatricesForVis4(matrix, modelNames, selectedColormap, cellWidth, cellHeight, textSize, classes);
        svg_files[4] = svgFiles;
        displaySVGFilesVis4(svgFiles);

        addEventListenersToSVG(svgFiles);
        console.log("=$= Image SVG chargée avec succès");
    } catch (error) {
        console.error("Erreur lors du chargement du fichier SVG :", error);
    }
}


function displaySVGFilesVis4(svgFiles) {
    const container = document.getElementById('svgContainer');
    container.innerHTML = ''; // Clear the container
    const nbModeles = Math.sqrt(svgFiles.length);
    let currentRow;

    const svgDocument = new DOMParser().parseFromString(svgFiles[0].svgData, "image/svg+xml");
    const rows = svgDocument.querySelectorAll('.box').length;
    const one_cell_size = 52;
    const svgWidth = one_cell_size * Math.ceil(Math.sqrt(rows)) ;
    const svgHeight = one_cell_size * Math.ceil(Math.sqrt(rows)); //a regler apres
    svgFiles.forEach((svgFile, index) => {
        if (index % nbModeles === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            container.appendChild(currentRow);
        }
        const tableCell = createSVGElement(svgFile, svgWidth, svgHeight);
        currentRow.appendChild(tableCell);

    });


}
