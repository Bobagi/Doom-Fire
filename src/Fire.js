const firePixel = []
let fireWidth = 100
let fireHeight = 40
let firePalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
let debugMode = false // Debug mode flag to visualize fire intensity values and pixel indices
let cellSize = 8; // Initial size of each pixel cell
let decayFactor = 3; // Factor to control the decay of fire intensity
let windFactor = 3; // Factor to control how much the wind affects the fire
let windDirectionType = 'left'; // Initial wind direction (left or right)
let fireSpeed = 50; // Initial speed of fire propagation (in milliseconds)
let fireInterval; // Interval for controlling the propagation speed

// Function to start the fire animation
function start() {
    fireDataStructure();  // Set up the fire data structure (grid of pixels)
    renderFire();         // Render the fire for the first time
    fireInterval = setInterval(firePropagation, fireSpeed); // Start the propagation loop
}

// Function to restart the fire
function restart() {
	clearInterval(fireInterval); // Stop the current propagation loop

	// Clear all fire pixels by resetting the entire array
    for (let i = 0; i < firePixel.length; i++) {
        firePixel[i] = 0; // Set each pixel's intensity to 0 (no fire)
	}
	
    fireDataStructure(); // Reinitialize the fire data structure (grid)
    renderFire(); // Re-render the fire in its initial state
    fireInterval = setInterval(firePropagation, fireSpeed); // Restart the propagation loop with the current settings
}

// Set up the initial fire pixel data structure (fire grid)
function fireDataStructure() {
    const arrayLength = fireWidth * fireHeight; // Total number of pixels in the fire grid
    for (let i = 0; i < arrayLength; i++){
        if (!firePixel[i]) firePixel[i] = 0; // Initialize fire pixels to intensity 0
    }
    fireSource(); // Define the fire source at the bottom of the grid
}

// Fire propagation logic - how fire spreads upward
function firePropagation() {
    for (let column = 0; column < fireWidth; column++) {
        let index = column;
        for (let row = 1; row < fireHeight; row++) {
            let decay = Math.floor(Math.random() * decayFactor);  // Apply random decay to intensity
            let windDirection = Math.floor(Math.random() * windFactor); // Random wind effect
            let newIntensity = firePixel[index + fireWidth] - decay; // Calculate new intensity based on decay

            // Apply wind direction logic (left or right)
            if (windDirectionType === 'left') {
                if (newIntensity >= 0) firePixel[index - windDirection] = newIntensity; // Spread to the left
                else firePixel[index - windDirection] = 0; // Ensure no negative intensity
            } else {
                if (newIntensity >= 0) firePixel[index + windDirection] = newIntensity; // Spread to the right
                else firePixel[index + windDirection] = 0;
            }

            index += fireWidth; // Move to the next row
        }
    }
    renderFire(); // Re-render the fire after propagation
}

// Render the fire grid as an HTML table with colored cells
function renderFire() {
    let html = '<table cellpadding=0 cellspacing=0>'; // Start creating the table
    for (let row = 0; row < fireHeight; row++) {
        html += '<tr>'; // Start a new row
        for (let column = 0; column < fireWidth; column++) {
            const pixelIndex = column + (fireWidth * row); // Calculate the index of the current pixel
            const color = firePalette[firePixel[pixelIndex]]; // Get the color based on the fire intensity
            const colorString = `${color.r},${color.g},${color.b}`; // Format color as RGB string

            // Check if debug mode is enabled to display extra information
            if (debugMode) {
                html += '<td>';
                // Display pixel index in the top-right corner (for debugging)
                html += `<div class="pixel-index">${pixelIndex}</div>`;
                // Display fire intensity value in the center (for debugging)
                html += `<div style="color: rgb(${colorString});">${firePixel[pixelIndex]}</div>`;
            } else {
                // Render the pixel cell with the appropriate background color and size
                html += `<td class="pixel" style="background-color: rgb(${colorString}); width: ${cellSize}px; height: ${cellSize}px;">`;
            }
            html += '</td>'; // End the current cell
        }
        html += '</tr>'; // End the current row
    }
    html += '</table>'; // End the table
    document.querySelector('#fireCanvas').innerHTML = html; // Insert the table into the DOM
}

// Function to define the fire source at the bottom of the grid
function fireSource() {
    const overflowPixel = fireWidth * fireHeight;
    for (let pixel = overflowPixel - fireWidth; pixel < overflowPixel; pixel++) {
        firePixel[pixel] = 36; // Set maximum intensity at the bottom row
    }
}

// Toggle debug mode to show extra information about fire pixels
function pixelDebugMode() {
    debugMode = !debugMode; // Toggle the debug flag
    fireDataStructure(); // Reinitialize the fire data structure
    renderFire(); // Re-render the fire with debug mode on/off
}

// Dynamic update functions for user controls (sliders, buttons, etc.)

// Update the width of the fire grid
function updateWidth(newWidth) {
    fireWidth = parseInt(newWidth, 10); // Convert the input to an integer
    document.getElementById('widthValue').innerText = newWidth; // Update the displayed value
    fireDataStructure(); // Rebuild the fire grid with the new width
}

// Update the height of the fire grid
function updateHeight(newHeight) {
    fireHeight = parseInt(newHeight, 10); // Convert the input to an integer
    document.getElementById('heightValue').innerText = newHeight; // Update the displayed value
    fireDataStructure(); // Rebuild the fire grid with the new height
}

// Update the size of each pixel cell in the fire grid
function updateCellSize(newSize) {
    cellSize = parseInt(newSize, 10); // Convert the input to an integer
    document.getElementById('cellSizeValue').innerText = newSize; // Update the displayed value
    renderFire(); // Re-render the fire with the new cell size
}

// Update the decay factor controlling fire intensity reduction
function updateDecayFactor(newDecayFactor) {
    decayFactor = parseInt(newDecayFactor, 10); // Convert the input to an integer
    document.getElementById('decayFactorValue').innerText = newDecayFactor; // Update the displayed value
}

// Update the wind factor controlling the horizontal spread of the fire
function updateWindFactor(newWindFactor) {
    windFactor = parseInt(newWindFactor, 10); // Convert the input to an integer
    document.getElementById('windFactorValue').innerText = newWindFactor; // Update the displayed value
}

// Update the wind direction (left or right)
function updateWindDirection(direction) {
    windDirectionType = direction; // Update the wind direction based on user selection
}

// Update the speed of the fire propagation
function updateFireSpeed(newSpeed) {
    fireSpeed = parseInt(newSpeed, 10); // Convert the input to an integer
    document.getElementById('speedValue').innerText = `${newSpeed} ms`; // Update the displayed speed
    clearInterval(fireInterval); // Clear the previous interval
    fireInterval = setInterval(firePropagation, fireSpeed); // Restart the propagation with the new speed
}

// Linear interpolation function to calculate intermediate colors
function lerp(start, end, t) {
    return start + t * (end - start);
}

// Function to update the main colors and recalculate the palette
function updateMainColor(index, hexColor) {
    const rgb = hexToRgb(hexColor);
    firePalette[index] = {"r": rgb.r, "g": rgb.g, "b": rgb.b};
    calculateInterpolatedColors();
    renderFire();
}

// Function to calculate the interpolated colors
function calculateInterpolatedColors() {
    interpolateColors(0, 12);
    interpolateColors(12, 24);
    interpolateColors(24, 36);
}

// Function to interpolate colors between two indices
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

// Function to convert hexadecimal color to RGB format
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Initialize color interpolation with the default colors
calculateInterpolatedColors();

start();
