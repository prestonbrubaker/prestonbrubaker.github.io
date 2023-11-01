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
    'air' : "#AAAAAA",      //Grey for air
    'powder': "#8B4513",    // Brown for powder
    'block': "#000000",     // Black for block
    'water': "#0000FF",     // Blue for water
    'gas': "#FFFF00",       // Yellow for gas
    'fire' : "#FF0000"      // Red for fire
};

var penS = 3;
var penE = 'water';

var tickS = 10;

// Initialize 2D array
for (var i = 0; i < pCY; i++) {
    pA[i] = new Array(pCX).fill('air');
}
pA_temp = pA

// Set border elements with blocks
for (var x = 0; x < pCX; x++) {
    pA[pCY - 1][x] = 'block';
    pA[0][x] = 'block';
}
for (var y = 0; y < pCY; y++) {
    pA[y][0] = 'block';
    pA[y][pCX - 1] = 'block';
}

// Test by adding elements
pA[Math.floor(pCY / 2)][Math.floor(pCX / 2)] = 'powder';
pA[Math.floor(pCY / 2) + 3][Math.floor(pCX / 2)] = 'water';
pA[Math.floor(pCY / 2) + 3][Math.floor(pCX / 2) - 1] = 'water';
pA[Math.floor(pCY / 2) + 6][Math.floor(pCX / 2)] = 'gas';

// The tick function to draw the elements on the canvas
function tick() {
    // Create a temporary copy of the particle array for updates
    pA_temp = JSON.parse(JSON.stringify(pA));
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

    // falling
    for (var y = 1; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if(pA[y][x] == 'air' && (pA[y - 1][x] == 'powder' || pA[y - 1][x] == 'water')){
                pA_temp[y][x] = pA_temp[y - 1][x]
                pA_temp[y - 1][x] = 'air'
            }
        }

    }

    // water settling
    for (var y = 0; y < pCY; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(pA[y][x] == 'water' && pA_temp[y][x] == 'water' && pA[y][x - 1] == 'air' && pA_temp[y][x - 1] == 'air' && Math.random() < .1){
                pA_temp[y][x] = 'air'
                pA_temp[y][x - 1] = 'water'
            }
            if(pA[y][x] == 'water' && pA_temp[y][x] == 'water' && pA[y][x + 1] == 'air' && pA_temp[y][x + 1] == 'air' && Math.random() < .1){
                pA_temp[y][x] = 'air'
                pA_temp[y][x + 1] = 'water'
            }
        }
    }

    // gas moving
    for (var y = 0; y < pCY; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(pA[y][x] == 'gas' && pA_temp[y][x] == 'gas' && pA[y][x - 1] == 'air' && pA_temp[y][x - 1] == 'air' && Math.random() < .1){
                pA_temp[y][x] = 'air'
                pA_temp[y][x - 1] = 'gas'
            }
            if(pA[y][x] == 'gas' && pA_temp[y][x] == 'gas' && pA[y][x + 1] == 'air' && pA_temp[y][x + 1] == 'air' && Math.random() < .1){
                pA_temp[y][x] = 'air'
                pA_temp[y][x + 1] = 'gas'
            }
            if(pA[y][x] == 'gas' && pA_temp[y][x] == 'gas' && pA[y - 1][x] == 'air' && pA_temp[y - 1][x] == 'air' && Math.random() < .1){
                pA_temp[y][x] = 'air'
                pA_temp[y - 1][x] = 'gas'
            }
            if(pA[y][x] == 'gas' && pA_temp[y][x] == 'gas' && pA[y + 1][x] == 'air' && pA_temp[y + 1][x] == 'air' && Math.random() < .1){
                pA_temp[y][x] = 'air'
                pA_temp[y + 1][x] = 'gas'
            }
        }
    }

    // fire moving
    for (var y = 0; y < pCY; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && pA[y][x - 1] == 'air' && pA_temp[y][x - 1] == 'air' && Math.random() < .05){
                pA_temp[y][x] = 'air'
                pA_temp[y][x - 1] = 'fire'
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && pA[y][x + 1] == 'air' && pA_temp[y][x + 1] == 'air' && Math.random() < .05){
                pA_temp[y][x] = 'air'
                pA_temp[y][x + 1] = 'fire'
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && pA[y - 1][x] == 'air' && pA_temp[y - 1][x] == 'air' && Math.random() < .02){
                pA_temp[y][x] = 'air'
                pA_temp[y - 1][x] = 'fire'
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && Math.random() < 0.003){
                pA_temp[y][x] = 'air'
            }
        }
    }

    // fire overtaking gas or powder
    for (var y = 0; y < pCY; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y][x - 1] == 'gas' && pA_temp[y][x - 1] == 'gas' && Math.random() < .9 || pA[y][x - 1] == 'powder' && pA_temp[y][x - 1] == 'powder' && Math.random() < .03)){
                pA_temp[y][x - 1] = 'fire'
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y][x + 1] == 'gas' && pA_temp[y][x + 1] == 'gas' && Math.random() < .9 || pA[y][x + 1] == 'powder' && pA_temp[y][x + 1] == 'powder' && Math.random() < .03)){
                pA_temp[y][x + 1] = 'fire'
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y - 1][x] == 'gas' && pA_temp[y - 1][x] == 'gas' && Math.random() < .9 || pA[y - 1][x] == 'powder' && pA_temp[y - 1][x] == 'powder' && Math.random() < .03)){
                pA_temp[y - 1][x] = 'fire'
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y + 1][x] == 'gas' && pA_temp[y + 1][x] == 'gas' && Math.random() < .9 || pA[y + 1][x] == 'powder' && pA_temp[y + 1][x] == 'powder' && Math.random() < .03)){
                pA_temp[y + 1][x] = 'fire'
            }
        }
    }
    

    // allow elements to move through the bottom to the top
    for(var x = 0; x < pCX; x++) {
        if((pA[pCY - 1][x] == 'water' || pA[pCY - 1][x] == 'powder' ) && pA[0][x] == 'air'){
            pA_temp[0][x] = pA[pCY - 1][x]
            pA_temp[pCY - 1][x] = 'air'
        }

    }

    // Rest of the tick function

    
    make_gas_and_fire()
    
    
    // Assign the updated temporary array back to pA
    pA = pA_temp;
}

var mouseIsDown = false;

function setupCanvasClickHandler() {
    c.addEventListener('mousedown', function(event) {
        mouseIsDown = true;
        drawElementAtMouse(event);
    });

    c.addEventListener('mousemove', function(event) {
        if (mouseIsDown) {
            drawElementAtMouse(event);
        }
    });

    c.addEventListener('mouseup', function(event) {
        mouseIsDown = false;
    });

    c.addEventListener('mouseleave', function(event) {
        mouseIsDown = false;
    });
}

function drawElementAtMouse(event) {
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
        // Set to pen element
        pA[arrayY][arrayX] = penE;
        // Update the canvas immediately to reflect the change
        tick();
    }
}

function set_element(element){
    penE = element
}

function make_gas_and_fire(){
    for (var y = 1; y < pCY - 1; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(Math.random() < 0.00001){
                pA_temp[y][x] = 'gas'
            }
            if(Math.random() < 0.00000001){
                pA_temp[y][x] = 'fire'
            }
        }
    }
}

// Call this function once to set up the event listener
setupCanvasClickHandler();



setInterval(tick, tickS);
