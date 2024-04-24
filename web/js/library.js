export const colorSchemes = {
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
};


// const svg_files = [];
// Fonction pour convertir une couleur D3 en hexadécimal
export function d3_color_to_hex(color) {
    return d3.color(color).formatHex();
}

// Fonction pour obtenir une couleur à partir d'une valeur en utilisant une colormap spécifiée
export function getColorFromValue(value, colorScheme) {
    const colormap = d3.scaleSequential(colorScheme); // Sélection de la colormap spécifiée
    const color = colormap(value);
    return d3_color_to_hex(color);
}

// Fonction pour effectuer une interpolation logarithmique
export function logarithmicInterpolation(value) {
    return Math.log(value) / Math.log(2.0);
}

// Fonction pour effectuer une interpolation exponentielle
export function exponentialInterpolation(value) {
    return Math.exp(-value);
}

// Fonction drawMatricesForVis1
export function drawMatricesForVis1(matrix, nomModeles, colormapName, cellWidth, cellHeight, textSize, classes = []) {
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
export function getVis1DataFromJson(jsonData) {
    const modelNames = jsonData.vis_data.data.map(item => item.model_name.split('/').pop());
    const valuesList = jsonData.vis_data.data.map(item => Object.values(item.model_data));
    return [modelNames, valuesList];
}



export function extractIndices(className) {
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

export function listToMatrix(values) {
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
}



// this function draws a list of matrixes, matrix contains all matrixes 
// extracted from the .json, this function draw the visualisation for each 
// matrix and store it in svg_dir, here every svg_i_j image created represents
// the celles (i,j) for all the extracted matrixes. 
export function drawMatricesForVis2(matrix, colormapName, cellWidth, cellHeight, textSize, nbModeles) {
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



// this function extract data from the json file, the file must be opened 
// previuouly befor calling this function, it stores extracted data in a 
// giga matrix. celles[i][j] : a list of the celles i,j  for all models 
export function get_vis2_3_data_from_json(json_data) {
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



// module.exports = {
//     drawMatricesForVis1,
//     drawMatricesForVis2,
//     colorSchemes,
//     getColorFromValue,
//     getVis1DataFromJson,
//     get_vis2_3_data_from_json,
//     extractIndices,
//     d3_color_to_hex,
//     listToMatrix

// };