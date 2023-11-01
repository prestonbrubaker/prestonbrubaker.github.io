var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");

// Display settings
var minW = 0;
var minH = 0;
var maxW = canvas1.width;
var maxH = canvas1.height;
var bgHue = "#777777";

var pixS = 5;
var pCX = Math.floor(maxW / pixS);
var pCY = Math.floor(maxH / pixS);
var pA = new Array(pCY);

var elHues = {
    'air' : "#AAAAAA", //Grey for air
    'powder': "#000000", // Black for powder
    'block': "#8B4513"   // Brown for block
};

var penS = 3;
var penE = 'powder';

var tickS = 10;

// Initialize 2D array
for (var i = 0; i < pCY; i++) {
    pA[i] = new Array(pCX).fill('air');
}

// Set border elements with blocks
for (var x = 0; x < pCX; x++) {
    pA[pCY - 1][x] = 'block';
    pA[0][x] = 'block';
}
for (var y = 0; y < pCY; y++) {
    pA[y][0] = 'block';
    pA[y][pCX - 1] = 'block';
}

// Add a single block of powder to show the game is working
pA[Math.floor(pCY / 2)][Math.floor(pCX / 2)] = 'powder';

// The tick function to draw the elements on the canvas
function tick() {
    // Create a temporary copy of the particle array for updates
    var pA_temp = JSON.parse(JSON.stringify(pA));
    // Clear and fill background
    ctx.clearRect(minW, minH, maxW, maxH);
    ctx.fillStyle = bgHue;
    ctx.fillRect(minW, minH, maxW, maxH);
    
    // Drawing elements
    for (var y = 0; y < pCY; y++) {
        for (var x = 0; x < pCX; x++) {
            var element = pA[y][x];
            if (element) {
                var color = elHues[element];
                ctx.fillStyle = color;
                ctx.fillRect(x * pixS, y * pixS, pixS, pixS);
            }
        }
    }

    // Game logic and physics for elements

    // Powder falling
    for (var y = 1; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if(pA[y][x] == 'air' && pA[y - 1][x] == 'powder'){
                pA_temp[y][x] = 'powder'
                pA_temp[y - 1][x] = 'air'
            }
        }

    }
    
    // Rest of the tick function

    
    // Assign the updated temporary array back to pA
    pA = pA_temp;
}

function setupCanvasClickHandler() {
    c.addEventListener('click', function(event) {
        // Calculate the canvas offset on the page
        var rect = c.getBoundingClientRect();

        // Get the mouse position within the canvas
        var mouseX = event.clientX - rect.left;
        var mouseY = event.clientY - rect.top;

        // Convert the mouse position to array indices
        var arrayX = Math.floor(mouseX / pixS);
        var arrayY = Math.floor(mouseY / pixS);

        // Ensure the indices are within the bounds of the pA array
        if (arrayX >= 0 && arrayX < pCX && arrayY >= 0 && arrayY < pCY) {
            handleClick(arrayX, arrayY);
        }
    });
}

function handleClick(x, y) {
    // You can add logic here to change the state of the clicked cell in pA
    console.log('Clicked on pA at:', x, y);

    // Example: Toggle between 'powder' and 'air'
    pA[y][x] = pA[y][x] === 'air' ? 'powder' : 'air';

    // Update the canvas immediately to reflect the change
    tick();
}

// Call this function once to set up the event listener
setupCanvasClickHandler();


setInterval(tick, tickS);
