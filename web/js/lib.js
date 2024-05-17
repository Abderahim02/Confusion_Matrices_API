

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

        const mat = matrix[m];
        for (let i = 0; i < mat.length; i++) {
            const row = mat[i];
            for (let j = 0; j < row.length; j++) {
                const value = row[j];
                const color = getColorFromValue(value, colorSchemes[colormapName])
                draw.rect(cellWidth, cellHeight)
                    .move((j ) * cellWidth, (i) * cellHeight + 15)

                    .fill(color)
                    .stroke({ color: 'black' })
                    .addClass(`box i-${i} j-${j}`)
                    .attr({ 'model_name' : `${modele}`})
                    .attr({ 'original_coordinates' : `box i-${i} j-${j}`});



                draw.text(String(value))
                    .move((j ) * cellWidth + cellWidth / 2, (i ) * cellHeight + cellHeight / 2 + textSize)
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
    const modelNames = jsonData.vis_data.map(item => item.model_name);
    const valuesList = jsonData.vis_data.map(item => item.model_data);
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


export function CustomisedlistToMatrixForVis2(values, modelNames) {
    const size = Math.ceil(Math.sqrt(values.length)); // Utilisation de ceil pour arrondir à l'entier supérieur
    const matrix = [];
    let index = 0;
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            const value = values[index] || 0;
            const model_name = modelNames[index] || "NONE";
            matrix[i][j] = {'value' : value, 'model_name' : model_name}; // Remplissage avec la valeur du tableau ou 0 si la valeur est undefined
            index++;
        }
    }
    return matrix;
}


// this function draws a list of matrixes, matrix contains all matrixes 
// extracted from the .json, this function draw the visualisation for each 
// matrix and store it in svg_dir, here every svg_i_j image created represents
// the celles (i,j) for all the extracted matrixes. 
export function drawMatricesForVis2(matrix, colormapName, cellWidth, cellHeight, textSize, nbClasses, modelNames) {
    const svgFiles = []; // Stockage des fichiers SVG
    for (let i = 0; i < nbClasses; i++) {
        for (let j = 0; j < nbClasses; j++) {
            const draw = SVG().size('100%', '100%');
            const svgFileName = `${i}_${j}.svg`;
            // const mat = listToMatrix(matrix[i][j]);
            const mat = CustomisedlistToMatrixForVis2(matrix[i][j], modelNames);

            for (let m = 0; m < mat.length; m++) {
                for (let n = 0; n < mat.length; n++) {
                    const value = mat[m][n].value;
                    const color = getColorFromValue(value, colorSchemes[colormapName]);
                    draw.rect(cellWidth, cellHeight)
                        .move((n ) * cellWidth, (m ) * cellHeight + 15)
                        .fill(color)
                        .stroke({ color: 'black' })
                        .addClass(`box i-${m} j-${n}`)
                        .attr({ 'model_name' : `${mat[m][n].model_name}`})
                        .attr({ 'original_coordinates' : `box i-${i} j-${j}`});



                    draw.text(String(value))
                        .move((n ) * cellWidth + cellWidth / 2, (m ) * cellHeight + cellHeight / 2 + textSize)
                        .font({ size: textSize })
                        .attr({ 'text-anchor': 'middle' });
                }
            }
            // Store the SVG data in svgFiles array
            const svgData = draw.node.outerHTML;
            svgFiles.push({ modelName: svgFileName.split(".")[0], svgData: svgData });
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
    let headers = json_data.model_names;

    for (let key in json_data['vis_data']) {
        let values = json_data['vis_data'][key];
        let parts = key.split('-');
        let row = parseInt(parts[1]); 
        let col = parseInt(parts[2]);
        celles[row][col] = values;
    }

    return [headers, celles];
}


export function drawMatricesForVis3(matrix, colormapName, cellWidth, textSize, nbClasses, modelNames) {
    const svgFiles = []; // Stockage des fichiers SVG
    const maxHeight = 300;
    for (let i = 0; i < nbClasses; i++) {
        for (let j = 0; j < nbClasses; j++) {
            const draw = SVG().size('100%', '100%');
            const svgFileName = `${i}_${j}.svg`;
            let offset = 0;

            // const mat = listToMatrix(matrix[i][j]);
            const mat = CustomisedlistToMatrixForVis2(matrix[i][j], modelNames);

            for (let m = 0; m < mat.length; m++) {
                // const row = mat[m];
                for (let n = 0; n < mat.length; n++) {
                    const value = mat[m][n].value;
                    const color = getColorFromValue(value, colorSchemes[colormapName]);

                    draw.rect(cellWidth, value * maxHeight + 0.001)
                        .move(offset * cellWidth, maxHeight - (value * maxHeight) )
                        .fill(color)
                        .stroke({ color: 'black' })
                        .addClass(`box i-${m} j-${n}`)
                        .attr({ 'model_name' : `${mat[m][n].model_name}`})
                        .attr({ 'original_coordinates' : `box i-${i} j-${j}`});



                    draw.text(String(value))
                        .move(offset * cellWidth + cellWidth / 2, maxHeight - textSize * 2)
                        .font({ size: textSize })
                        .attr({ 'text-anchor': 'middle' });
                    offset++;
                }
            }
            // Store the SVG data in svgFiles array
            const svgData = draw.node.outerHTML;
            svgFiles.push({ modelName: svgFileName.split(".")[0], svgData: svgData });
        }
    }
    return svgFiles; // Renvoyer les fichiers SVG
}


// Fonction pour extraire les données du fichier JSON et les stocker dans une matrice par modèle
export function get_vis4_data_from_json(jsonData) {
    const visData = jsonData.vis_data;
    const modelNames = Object.keys(visData);
    const modelMatrix = [];

    // Parcours des données et stockage dans la matrice avec les noms des modèles
    for (let i = 0; i < modelNames.length; i++) {
        const modelName = modelNames[i];
        const data = visData[modelName];
        const modelData = []; // Initialiser avec le nom du modèle
        for (let j = 0; j < data.length; j++) {
            modelData.push({ value: data[j].value, sign: data[j].sign }); // Ajouter les données associées au modèle
        }
        modelMatrix.push(modelData); // Ajouter la ligne à la matrice
    }

    return [modelNames, modelMatrix]; // Retourner le couple [modelNames, modelMatrix]
}


// Fonction drawMatricesForVis1
export function drawMatricesForVis4(matrix, nomModeles, colormapName, cellWidth, cellHeight, textSize, classes = []) {
    const svgFiles = []; // Stockage des fichiers SVG

    for (let m = 0; m < nomModeles.length; m++) {
        const modele = nomModeles[m];
        const draw = SVG().size('100%', '100%');


        const mat = listToMatrix(matrix[m]);
        for (let i = 0; i < mat.length; i++) {
            const row = mat[i];
            for (let j = 0; j < row.length; j++) {
                const value = row[j].value;
                const color = getColorFromValue(value, colorSchemes[colormapName])


                draw.rect(cellWidth, cellHeight)
                    .move((j ) * cellWidth, (i ) * cellHeight + 15)
                    .fill(color)
                    .stroke({ color: 'black' })
                    .addClass(`box i-${i} j-${j}`)
                    .attr({ 'model_name' : `${modele}`})
                    .attr({ 'original_coordinates' : `box i-${i} j-${j}`});


                const sign_ = row[j].sign;
                var sign = " ";
                switch (sign_) {
                    case 'PLUS':
                        sign = '+' ;
                        break;
                    case 'MINUS':
                        sign = '-';
                        break;
                    default:
                        break;
                }
                // console.log(sign);
                draw.text(sign)
                    .move((j ) * cellWidth + cellWidth / 2, (i ) * cellHeight + cellHeight / 2 + textSize)
                    .font({ size: textSize * 2 })
                    .attr({ 'text-anchor': 'middle' });
            }
        }
        // Store the SVG data in svgFiles array
        const svgData = draw.node.outerHTML;
        svgFiles.push({ modelName: modele, svgData: svgData });
    }
    return svgFiles; // Renvoyer les fichiers SVG
}

