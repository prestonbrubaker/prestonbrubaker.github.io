// Function to draw a circle on the canvas
function drawCircle() {
    // Get the canvas element by its ID
    const canvas = document.getElementById('myCanvas');

    // Check if canvas is supported in the browser
    if (canvas.getContext) {
        // Get the 2D drawing context
        const ctx = canvas.getContext('2d');

        // Draw the circle
        ctx.beginPath();
        ctx.arc(200, 200, 50, 0, 2 * Math.PI); // Circle with a center at (200, 200) and a radius of 50
        ctx.fillrect(200, 200, 50, 50);
        ctx.fillStyle = '#FF0000'; // Set the fill color to red
        ctx.fill();
        ctx.stroke();
    }
}

// Call the function to draw the circle when the page loads
window.onload = drawCircle;
