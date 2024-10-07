const firePixel = []
let fireWidth = 40
let fireHeight = 40
let firePalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
let debug = false
let cellSize = 8;
let decayFactor = 3;
let windFactor = 3;
let windDirectionType = 'left'; // Direção inicial do vento (esquerda)
let fireSpeed = 50; // Velocidade inicial das chamas (em milissegundos)
let fireInterval; // Armazena o intervalo para que possamos reiniciá-lo

// Função para iniciar o fogo
function start() {
    fireDataStructure();
    renderFire();
    fireInterval = setInterval(firePropagation, fireSpeed);
}

// Função para estruturar os dados do fogo
function fireDataStructure() {
    const arrayLenght = fireWidth * fireHeight;
    for (let i = 0; i < arrayLenght; i++){
        if (!firePixel[i]) firePixel[i] = 0;
    }
    fireSource();
}

// Função de propagação do fogo
function firePropagation() {
    for (let column = 0; column < fireWidth; column++) {
        let index = column;
        for (let row = 1; row < fireHeight; row++) {
            let decay = Math.floor(Math.random() * decayFactor);
            let windDirection = Math.floor(Math.random() * windFactor);
            let newIntensity = firePixel[index + fireWidth] - decay;

            if (windDirectionType === 'left') {
                // Vento para a esquerda (padrão)
                if (newIntensity >= 0) firePixel[index - windDirection] = newIntensity;
                else firePixel[index - windDirection] = 0;
            } else {
                // Vento para a direita
                if (newIntensity >= 0) firePixel[index + windDirection] = newIntensity;
                else firePixel[index + windDirection] = 0;
            }

            index += fireWidth;
        }
    }
    renderFire();
}

// Função para renderizar o fogo
function renderFire() {
    let html = '<table cellpadding=0 cellspacing=0>';
    for (let row = 0; row < fireHeight; row++) {
        html += '<tr>';
        for (let column = 0; column < fireWidth; column++) {
            const pixelIndex = column + (fireWidth * row);
            const color = firePalette[firePixel[pixelIndex]];
            const colorString = `${color.r},${color.g},${color.b}`;
            if (debug) {
                html += '<td>';
                // Indice da célula no canto superior direito
                html += `<div class="pixel-index">${pixelIndex}</div>`;
                // Intensidade de fogo no centro da célula
                html += `<div style="color: rgb(${colorString});">${firePixel[pixelIndex]}</div>`;
            } else {
                // Atualizando o tamanho da célula com base no slider
                html += `<td class="pixel" style="background-color: rgb(${colorString}); width: ${cellSize}px; height: ${cellSize}px;">`;
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    document.querySelector('#fireCanvas').innerHTML = html;
}

// Função para definir a fonte de fogo
function fireSource() {
    const overflowPixel = fireWidth * fireHeight;
    for (let pixel = overflowPixel - fireWidth; pixel < overflowPixel; pixel++) {
        firePixel[pixel] = 36;
    }
}

// Função para alternar o modo de debug
function debugMode() {
    debug = !debug;
    fireDataStructure();
    renderFire();
}

// Funções para atualizar dinamicamente
function updateWidth(newWidth) {
    fireWidth = parseInt(newWidth, 10);
    document.getElementById('widthValue').innerText = newWidth;
    fireDataStructure();
}

function updateHeight(newHeight) {
    fireHeight = parseInt(newHeight, 10);
    document.getElementById('heightValue').innerText = newHeight;
    fireDataStructure();
}

function updateCellSize(newSize) {
    cellSize = parseInt(newSize, 10);
    document.getElementById('cellSizeValue').innerText = newSize;
    renderFire();
}

function updateDecayFactor(newDecayFactor) {
    decayFactor = parseInt(newDecayFactor, 10);
    document.getElementById('decayFactorValue').innerText = newDecayFactor;
}

function updateWindFactor(newWindFactor) {
    windFactor = parseInt(newWindFactor, 10);
    document.getElementById('windFactorValue').innerText = newWindFactor;
}

function updateWindDirection(direction) {
    windDirectionType = direction;
}

// Função para atualizar a velocidade do fogo dinamicamente
function updateFireSpeed(newSpeed) {
    fireSpeed = parseInt(newSpeed, 10);
    document.getElementById('speedValue').innerText = `${newSpeed} ms`;
    clearInterval(fireInterval);
    fireInterval = setInterval(firePropagation, fireSpeed);
}

// Função de interpolação linear
function lerp(start, end, t) {
    return start + t * (end - start);
}

// Função para atualizar as cores principais e recalcular a paleta
function updateMainColor(index, hexColor) {
    const rgb = hexToRgb(hexColor);
    firePalette[index] = {"r": rgb.r, "g": rgb.g, "b": rgb.b};
    calculateInterpolatedColors();
    renderFire();
}

// Função para calcular as cores interpoladas
function calculateInterpolatedColors() {
    interpolateColors(0, 12);
    interpolateColors(12, 24);
    interpolateColors(24, 36);
}

// Função para interpolar cores entre dois índices
function interpolateColors(startIndex, endIndex) {
    const startColor = firePalette[startIndex];
    const endColor = firePalette[endIndex];
    const steps = endIndex - startIndex;
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        firePalette[startIndex + i] = {
            "r": Math.round(lerp(startColor.r, endColor.r, t)),
            "g": Math.round(lerp(startColor.g, endColor.g, t)),
            "b": Math.round(lerp(startColor.b, endColor.b, t))
        };
    }
}

// Função para converter hexadecimal para RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Inicializa a interpolação de cores com as cores padrões
calculateInterpolatedColors();

start();