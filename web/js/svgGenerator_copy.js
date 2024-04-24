import {get_vis2_3_data_from_json, getVis1DataFromJson, drawMatricesForVis1, drawMatricesForVis2, extractIndices} from './library.js';
/* const colorSchemes = {
    Greens: d3.interpolateGreens,     // Verts
    Blues: d3.interpolateBlues,     // Bleus
    Greys: d3.interpolateGreys,     // Gris
    Oranges: d3.interpolateOranges,  // Oranges
    Purples: d3.interpolatePurples,  // Violets
    Reds: d3.interpolateReds, // Rouges
    BuGn: d3.interpolateBuGn,    // Bleu-Vert
    BuPu: d3.interpolateBuPu, // Bleu-Violet
    GnBu: d3.interpolateGnBu, // Vert-Bleu
    OrRd: d3.interpolateOrRd, // Orange-Rouge
    PuBu: d3.interpolatePuBu, // Violet-Bleu
    PuBuGn: d3.interpolatePuBuGn, // Violet-Bleu-Vert
    PuRd: d3.interpolatePuRd, // Violet-Rouge
    RdPu: d3.interpolateRdPu, // Rouge-Violet
    YlGn: d3.interpolateYlGn,// Jaune-Vert
    YlGnBu: d3.interpolateYlGnBu, // Jaune-Vert-Bleu
    YlOrBr: d3.interpolateYlOrBr, // Jaune-Orange-Brun
    YlOrRd: d3.interpolateYlOrRd, // Jaune-Orange-Rouge
}; */

/* 
const svg_files = [];
// Fonction pour convertir une couleur D3 en hexadécimal
function d3_color_to_hex(color) {
    return d3.color(color).formatHex();
}

// Fonction pour obtenir une couleur à partir d'une valeur en utilisant une colormap spécifiée
function getColorFromValue(value, colorScheme) {
    const colormap = d3.scaleSequential(colorScheme); // Sélection de la colormap spécifiée
    const color = colormap(value);
    return d3_color_to_hex(color);
}

// Fonction pour effectuer une interpolation logarithmique
function logarithmicInterpolation(value) {
    return Math.log(value) / Math.log(2.0);
}

// Fonction pour effectuer une interpolation exponentielle
function exponentialInterpolation(value) {
    return Math.exp(-value);
}

// Fonction drawMatricesForVis1
function drawMatricesForVis1(matrix, nomModeles, colormapName, cellWidth, cellHeight, textSize, classes = []) {
    const svgFiles = []; // Stockage des fichiers SVG

    for (let m = 0; m < nomModeles.length; m++) {
        const modele = nomModeles[m];
        const draw = SVG().size('100%', '100%');
        let offset = 0;

        if (classes.length) {
            offset = 1;
            const headerRow = ['class', ...classes];
            for (let j = 0; j < headerRow.length; j++) {
                const headerValue = headerRow[j];
                draw.text(headerValue)
                    .move(j * cellWidth + cellWidth / 2, textSize)
                    .font({ size: textSize })
                    .attr({ 'text-anchor': 'middle' });
            }
        }
        const mat = matrix[m];
        for (let i = 0; i < mat.length; i++) {
            const row = mat[i];
            for (let j = 0; j < row.length; j++) {
                const value = row[j];
                // const rgbValue = (1 - value) * 255;
                const color = getColorFromValue(value, colorSchemes[colormapName])
                if (classes.length && j === 0) {
                    draw.text(classes[i])
                        .move(j * cellWidth + cellWidth / 2, (i + 1) * cellHeight + cellHeight / 2 + textSize)
                        .font({ size: textSize })
                        .attr({ 'text-anchor': 'middle' });
                }

                draw.rect(cellWidth, cellHeight)
                    .move((j + offset) * cellWidth, (i + 1) * cellHeight + 15)
                    .fill(color)
                    .stroke({ color: 'black' })
                    .addClass(`box i-${i} j-${j}`);

                draw.text(String(value))
                    .move((j + offset) * cellWidth + cellWidth / 2, (i + 1) * cellHeight + cellHeight / 2 + textSize)
                    .font({ size: textSize })
                    .attr({ 'text-anchor': 'middle' });
            }
        }
        // Store the SVG data in svgFiles array
        const svgData = draw.node.outerHTML;
        svgFiles.push({ modelName: modele, svgData: svgData });
    }
    return svgFiles; // Renvoyer les fichiers SVG
}




// Fonction pour extraire les données du fichier JSON et les stocker dans une matrice
function getVis1DataFromJson(jsonData) {
    const modelNames = jsonData.vis_data.data.map(item => item.model_name.split('/').pop());
    const valuesList = jsonData.vis_data.data.map(item => Object.values(item.model_data));
    return [modelNames, valuesList];
}

 */

function displaySVGFilesVis1(svgFiles) {
    const container = document.getElementById('svgContainer');
    container.innerHTML = ''; // Clear the container
    let allBoxes = []; // Tableau pour stocker toutes les boîtes de toutes les images SVG
    const nbModeles = Math.sqrt(svgFiles.length);
    let currentRow;

    const svgDocument = new DOMParser().parseFromString(svgFiles[0].svgData, "image/svg+xml");
    const rows = svgDocument.querySelectorAll('.box').length;
    const cols = svgDocument.querySelectorAll('.box').length;

    // Calculate width and height based on rows and columns
    const svgWidth = (rows < 6 * 6) ? 14 * cols : 6 * cols;
    const svgHeight = (rows < 6 * 6) ? 14 * cols : 6 * cols; //a regler apres

    svgFiles.forEach((svgFile, index) => {
        if (index % nbModeles === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            container.appendChild(currentRow);
        }

        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('type', 'svg_data');
        svgElement.setAttribute('width', `${svgWidth}`);
        svgElement.setAttribute('height', `${svgHeight}`);
        svgElement.innerHTML = svgFile.svgData; // Définir le contenu SVG directement

        const modelNameDiv = document.createElement('div');
        modelNameDiv.textContent = svgFile.modelName;
        modelNameDiv.classList.add('model-name');

        const tableCell = document.createElement('div');
        tableCell.classList.add('grid-item');
        tableCell.appendChild(svgElement);
        tableCell.appendChild(modelNameDiv);

        currentRow.appendChild(tableCell);



    });
}

/* function extractIndices(className) {
    const parts = className.split(' ');
    let i = null;
    let j = null;
    parts.forEach(part => {
        if (part.startsWith('i-')) {
            i = parseInt(part.split('-')[1]);
        }
        else if (part.startsWith('j-')) {
            j = parseInt(part.split('-')[1]);
        }
    });
    return [i, j];
}
 */
async function vis1(jsonFile) {//colomap doit etre en
    try {
        let jsonData = await fetch(jsonFile).then(response => response.json());
        const [modelNames, matrix] = getVis1DataFromJson(jsonData);
        const nbModeles = jsonData.nb_modeles;
        const cellHeight = 50;
        const cellWidth = 50;
        const textSize = 12;
        const selectElement = document.getElementById('colormap-dropdown');
        const selectedColormap = selectElement.value;
        const svgFiles = drawMatricesForVis1(matrix, modelNames, selectedColormap, cellWidth, cellHeight, textSize, Array.from({ length: nbModeles }, (_, i) => i.toString()));
        svg_files[1] = svgFiles;
        displaySVGFilesVis1(svgFiles);


        // Add event listeners to the SVG elements
        d3.selectAll("svg[type='svg_data']").each(function () {
            const svgDoc = this;
            const boxes = d3.select(svgDoc).selectAll(".box");

            if (boxes.empty()) {
                console.warn("No elements with class 'box' found in SVG:", svgDoc);
                return;
            }

            boxes.each(function () {
                const originalFill = d3.select(this).attr("fill");
                d3.select(this).attr("data-original-fill", originalFill);
            })
                .on("mouseenter", function () {
                    const className = d3.select(this).attr("class").trim();
                    console.log("Mouseenter event triggered on class:", className);
                    const [i, j] = extractIndices(className);
                    d3.selectAll("svg[type='svg_data']").selectAll(".i-" + i + ".j-" + j)
                        .attr("fill", "red");
                })
                .on("mouseleave", function () {
                    const className = d3.select(this).attr("class").trim();
                    console.log("Mouseleave event triggered on class:", className);
                    const [i, j] = extractIndices(className);
                    d3.selectAll("svg[type='svg_data']").selectAll(".i-" + i + ".j-" + j)
                        .attr("fill", function () {
                            return d3.select(this).attr("data-original-fill");
                        });
                });
        });

        console.log("=$= Image SVG chargée avec succès");
    } catch (error) {
        console.error("Erreur lors du chargement du fichier SVG :", error);
    }
}


// Variable globale pour stocker le type de visualisation sélectionné
let selectedVisualizationType = 'vis1';

// Fonction pour lire le fichier JSON sélectionné et appeler la fonction de visualisation appropriée
function readFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const jsonData = event.target.result;
        console.log("Contenu du fichier JSON :", jsonData); // Vérification
        // Appel à la fonction de visualisation appropriée en fonction du type sélectionné
        if (selectedVisualizationType === 'vis1') {
            vis1(jsonData);
        } else if (selectedVisualizationType === 'vis2') {
            vis2(jsonData);
        }
    };
    reader.onerror = function (event) {
        console.error("Erreur lors de la lecture du fichier :", event.target.error);
    };
    reader.readAsText(file);
}

// Fonction pour sélectionner un fichier JSON
function selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            readFileUsingFetch(file);
        }
    };
    input.click();
}

// Fonction pour lire le contenu du fichier JSON en utilisant fetch
function readFileUsingFetch(file) {
    const reader = new FileReader();
    reader.onload = async function (event) {
        const jsonData = event.target.result;
        // Appel à la fonction de visualisation appropriée en fonction du type sélectionné
        if (selectedVisualizationType === 'vis1') {
            vis1(jsonData);
        } else if (selectedVisualizationType === 'vis2') {
            vis2(jsonData);
        } else if (selectedVisualizationType === 'vis3') {
            // vis3(jsonData);
        } else if (selectedVisualizationType === 'vis4') {
            // vis4(jsonData);
        }
    };
    reader.onerror = function (event) {
        console.error("Erreur lors de la lecture du fichier :", event.target.error);
    };
    reader.readAsDataURL(file);
    document.getElementById('downloadContainer').style.display = 'block';
}

// Fonction pour changer le type de visualisation sélectionné
function changeVisualizationType() {
    selectedVisualizationType = document.getElementById('visualization-type').value;
}

/* function listToMatrix(values) {
    const size = Math.ceil(Math.sqrt(values.length)); // Utilisation de ceil pour arrondir à l'entier supérieur
    const matrix = [];
    let index = 0;
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            matrix[i][j] = values[index] || 0; // Remplissage avec la valeur du tableau ou 0 si la valeur est undefined
            index++;
        }
    }
    return matrix;
} */


// this function draws a list of matrixes, matrix contains all matrixes 
// extracted from the .json, this function draw the visualisation for each 
// matrix and store it in svg_dir, here every svg_i_j image created represents
// the celles (i,j) for all the extracted matrixes. 
/* function drawMatricesForVis2(matrix, colormapName, cellWidth, cellHeight, textSize, nbModeles) {
    const svgFiles = []; // Stockage des fichiers SVG
    for (let i = 0; i < nbModeles; i++) {
        for (let j = 0; j < nbModeles; j++) {
            const draw = SVG().size('100%', '100%');
            const svgFileName = `${i}_${j}.svg`;
            let offset = 0;

            const mat = listToMatrix(matrix[i][j]);
            for (let m = 0; m < mat.length; m++) {
                // const row = mat[m];
                for (let n = 0; n < mat.length; n++) {
                    const value = mat[m][n];
                    console.log(value);
                    const rgbValue = (1 - value) * 255;
                    // const color = getColorFromValue( value, colorSchemes[colormapName])

                    const color = `rgb(${Math.floor(rgbValue)}, 255, ${Math.floor(rgbValue)})`;

                    draw.rect(cellWidth, cellHeight)
                        .move((n + offset) * cellWidth, (m + 1) * cellHeight + 15)
                        .fill(color)
                        .stroke({ color: 'black' })
                        .addClass(`box i-${m} j-${n}`);


                    draw.text(String(value))
                        .move((n + offset) * cellWidth + cellWidth / 2, (m + 1) * cellHeight + cellHeight / 2 + textSize)
                        .font({ size: textSize })
                        .attr({ 'text-anchor': 'middle' });
                }
            }
            // Store the SVG data in svgFiles array
            const svgData = draw.node.outerHTML;
            svgFiles.push({ svgFileName: svgFileName, svgData: svgData });
        }
    }
    return svgFiles; // Renvoyer les fichiers SVG
}

 */

// this function extract data from the json file, the file must be opened 
// previuouly befor calling this function, it stores extracted data in a 
// giga matrix. celles[i][j] : a list of the celles i,j  for all models 
/* function get_vis2_3_data_from_json(json_data) {
    let n = Math.ceil(Math.sqrt(Object.keys(json_data['vis_data']).length));
    let celles = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let headers = [];
    for (let key in json_data['vis_data']) {
        let values = json_data['vis_data'][key];
        let parts = key.split('-');
        let row = parseInt(parts[0].slice(-1));
        let col = parseInt(parts[1]);
        celles[row][col] = values;
        headers.push(`${row}${col}`);
    }
    return [headers, celles];
}

 */

function displaySVGFilesVis2(svgFiles) {
    const container = document.getElementById('svgContainer');
    container.innerHTML = ''; // Clear the container
    let allBoxes = []; // Tableau pour stocker toutes les boîtes de toutes les images SVG
    const nbModeles = Math.sqrt(svgFiles.length);
    let currentRow;

    const svgDocument = new DOMParser().parseFromString(svgFiles[0].svgData, "image/svg+xml");
    const rows = svgDocument.querySelectorAll('.box').length;
    const cols = svgDocument.querySelectorAll('.box').length;
    const one_cell_size = 210;
    const svgWidth = one_cell_size * Math.floor(Math.sqrt(Math.sqrt(rows)));
    const svgHeight = one_cell_size * Math.floor(Math.sqrt(Math.sqrt(rows))); //a regler apres

    svgFiles.forEach((svgFile, index) => {
        if (index % nbModeles === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            container.appendChild(currentRow);
        }
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('type', 'svg_data');
        svgElement.setAttribute('width', `${svgWidth}`);
        svgElement.setAttribute('height', `${svgHeight}`);
        svgElement.innerHTML = svgFile.svgData; // Définir le contenu SVG directement

        const modelNameDiv = document.createElement('div');
        modelNameDiv.textContent = svgFile.modelName;
        modelNameDiv.classList.add('model-name');

        const tableCell = document.createElement('div');
        tableCell.classList.add('grid-item');
        tableCell.appendChild(svgElement);
        tableCell.appendChild(modelNameDiv);

        currentRow.appendChild(tableCell);

    });


}


async function vis2(jsonFile) {
    try {
        let jsonData = await fetch(jsonFile).then(response => response.json());
        const [modelNames, matrix] =  get_vis2_3_data_from_json(jsonData);
        const nbModeles = jsonData.nb_modeles;
        const cellHeight = 50;
        const cellWidth = 50;
        const textSize = 12;
        const selectElement = document.getElementById('colormap-dropdown');
        const selectedColormap = selectElement.value;

        const svgFiles =  drawMatricesForVis2(matrix, selectElement, cellWidth, cellHeight, textSize, nbModeles);
        svg_files[2] = svgFiles;
        displaySVGFilesVis2(svgFiles);

        // Add event listeners to the SVG elements
        d3.selectAll("svg[type='svg_data']").each(function () {
            const svgDoc = this;
            const boxes = d3.select(svgDoc).selectAll(".box");
            if (boxes.empty()) {
                console.warn("No elements with class 'box' found in SVG:", svgDoc);
                return;
            }

            boxes.each(function () {
                const originalFill = d3.select(this).attr("fill");
                d3.select(this).attr("data-original-fill", originalFill);
            })
                .on("mouseenter", function () {
                    const className = d3.select(this).attr("class").trim();
                    // console.log("Mouseenter event triggered on class:", className);
                    const [i, j] =  extractIndices(className);
                    d3.selectAll("svg[type='svg_data']").selectAll(".i-" + i + ".j-" + j)
                        .attr("fill", "red");
                })
                .on("mouseleave", function () {
                    const className = d3.select(this).attr("class").trim();
                    // console.log("Mouseleave event triggered on class:", className);
                    const [i, j] =  extractIndices(className);
                    d3.selectAll("svg[type='svg_data']").selectAll(".i-" + i + ".j-" + j)
                        .attr("fill", function () {
                            return d3.select(this).attr("data-original-fill");
                        });
                });
        });

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
    const selectedType = document.getElementById('visualization-type').value;
    var svgList;

    if (selectedType === 'vis1') {
        svgList = svg_files[1];
    } else if (selectedType === 'vis2') {
        svgList = svg_files[2];
    } else if (selectedType === 'vis3') {
        //
    } else if (selectedType === 'vis4') {
        //
    }

    if (svgList) {
        downloadSVGFiles(svgList, `${selectedType}.zip`);
    } else {
        console.error('La liste d\'éléments SVG pour la visualisation sélectionnée n\'est pas définie.');
    }
}

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





