var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");

// Display settings
var minW = 0;
var minH = 0;
var maxW = canvas1.width;
var maxH = canvas1.height;
var bgHue = "#777777";

var pixS = 2.5;
var pCX = Math.floor(maxW / pixS);
var pCY = Math.floor(maxH / pixS);
var pA = new Array(pCY);

var elHues = {
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
                pA[y][x] = 'powder'
                pA[y - 1][x] = 'air'
            }
        }

    }
    // Rest of the tick function would go here
}

setInterval(tick, tickS);
