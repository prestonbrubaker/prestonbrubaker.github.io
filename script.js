const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Define the starting position and size of the rectangle
let rectX = 200;
let rectY = 200;
const rectWidth = 50;
const rectHeight = 50;

// Define the range of motion for the Brownian motion (e.g., 5 pixels)
const stepSize = 5;

// Function to draw the rectangle at its current position
function drawRectangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    ctx.fillStyle = '#00FF00';  // Set the fill color to green
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
}

// Function to update the rectangle's position based on Brownian motion
function updatePosition() {
    // Randomly decide the direction in which the rectangle will move
    const dx = (Math.random() - 0.5) * stepSize;
    const dy = (Math.random() - 0.5) * stepSize;

    // Update the rectangle's position
    rectX += dx;
    rectY += dy;

    // Ensure the rectangle stays within the canvas boundaries
    rectX = Math.min(Math.max(0, rectX), canvas.width - rectWidth);
    rectY = Math.min(Math.max(0, rectY), canvas.height - rectHeight);

    // Draw the rectangle at its new position
    drawRectangle();

    // Continue the animation
    requestAnimationFrame(updatePosition);
}

// Start the Brownian motion when the page loads
window.onload = () => {
    drawRectangle();
    updatePosition();
};
