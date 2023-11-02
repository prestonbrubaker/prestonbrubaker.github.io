var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");

// Display settings
var minW = 0;
var minH = 0;
var maxW = canvas1.width;   //width is 800 pixels
var maxH = canvas1.height;   //height is 800 pixels
var bgHue = "#777777";

var pixS = 10;
var pCX = Math.floor(maxW / pixS);  //80
var pCY = Math.floor(maxH / pixS);  //80
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


function normal_setup(){

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

}



function manual_setup(){
    // Reset the array to all 'air'
    for (var i = 0; i < pCY; i++) {
        pA[i] = new Array(pCX).fill('air');
    }

    // Set border elements with blocks, except for a small opening
    for (var x = 0; x < pCX; x++) {
        if (x < 38 || x > 42) { // Opening between x=38 and x=42
            pA[0][x] = 'block'; // Top border
            pA[pCY - 1][x] = 'block'; // Bottom border
        }
    }
    for (var y = 1; y < pCY - 1; y++) {
        pA[y][0] = 'block'; // Left border
        pA[y][pCX - 1] = 'block'; // Right border
    }

    // Draw a smiley face using blocks with eyes closer together
    // Eyes
    pA[10][40] = 'block';
    pA[25][41] = 'block';
    pA[25][39] = 'block';
    // Smile
    for (var x = 30; x <= 50; x++) {
        pA[50][x] = 'block';
    }
    pA[49][29] = 'block';
    pA[48][28] = 'block';
    pA[49][51] = 'block';
    pA[48][52] = 'block';

    // Add a few fire elements above the smiley face which will fall and potentially interact with other elements
    pA[20][25] = 'fire';
    pA[20][55] = 'fire';

    // A cloud of powder at the top center
    for (var y = 1; y < 5; y++) {
        for (var x = 28; x <= 32; x++) {
            pA[y][x] = 'powder';
        }
    }

    // A pool of water at the bottom, which will loop to the top through the opening
    for (var y = 57; y < 80; y++) {
        for (var x = 37; x <= 43; x++) {
            pA[y][x] = 'water';
        }
    }

    // Add some gas elements at the top that can be ignited by the fire
    for (var x = 10; x <= 70; x++) {
        pA[5][x] = 'gas';
        pA[6][x] = 'gas';
    }
}











//normal_setup();
manual_setup();

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
                pA_temp[y][x] = pA_temp[y - 1][x];
                pA_temp[y - 1][x] = 'air';
            }
        }

    }

    // water settling
    for (var y = 0; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if(pA[y][x] != 'water'){
                continue;   // Skip if the tile is not water
            }
            
            // Randomly select a direction
            var r2 = Math.random();
            var direction = 'none';
            if (r2 < .1 && x > 0 && pA_temp[y][x - 1] == 'air') {
                direction = 'left';
            } else if (r2 >= .1 && r2 < .2 && x < pCX - 1 && pA_temp[y][x + 1] == 'air') {
                direction = 'right';
            }


            if(pA[y][x] == 'water' && pA_temp[y][x] == 'water' && pA[y][x - 1] == 'air' && pA_temp[y][x - 1] == 'air' && direction == 'left'){
                pA_temp[y][x] = 'air';
                pA_temp[y][x - 1] = 'water';
            }
            if(pA[y][x] == 'water' && pA_temp[y][x] == 'water' && pA[y][x + 1] == 'air' && pA_temp[y][x + 1] == 'air' && direction == 'right'){
                pA_temp[y][x] = 'air';
                pA_temp[y][x + 1] = 'water';
            }
        }
    }

    // Gas moving
    for (var y = 0; y < pCY; y++) {
        for (var x = 0; x < pCX; x++) {
            if(pA[y][x] != 'gas'){
                continue;   // Skip if the tile is not gas
            }
            
            var r1 = Math.random();
            if (r1 > 0.5) {
                continue; // Skip the current iteration with 50%
            }

            // Randomly select a direction
            var r2 = Math.random();
            var direction = 'none';
            if (r2 < .25 && x > 0 && pA_temp[y][x - 1] == 'air') {
                direction = 'left';
            } else if (r2 >= .25 && r2 < .5 && x < pCX - 1 && pA_temp[y][x + 1] == 'air') {
                direction = 'right';
            } else if (r2 >= .5 && r2 < .75 && y > 0 && pA_temp[y - 1][x] == 'air') {
                direction = 'up';
            } else if (r2 >= .75 && y < pCY - 1 && pA_temp[y + 1][x] == 'air') {
                direction = 'down';
            }

            // Move gas based on the selected direction
            if (pA[y][x] == 'gas' && pA_temp[y][x] == 'gas') {
                switch (direction) {
                    case 'left':
                        pA_temp[y][x] = 'air';
                        pA_temp[y][x - 1] = 'gas';
                        break;
                    case 'right':
                        pA_temp[y][x] = 'air';
                        pA_temp[y][x + 1] = 'gas';
                        break;
                    case 'up':
                        pA_temp[y][x] = 'air';
                        pA_temp[y - 1][x] = 'gas';
                        break;
                    case 'down':
                        pA_temp[y][x] = 'air';
                        pA_temp[y + 1][x] = 'gas';
                        break;
                }
            }
        }
    }



    // fire moving
    for (var y = 0; y < pCY; y++) {
        for (var x = 0; x < pCX; x++) {
            
            if(pA[y][x] != 'fire'){
                continue;   // Skip the current iteration if the tile is not fire
            }

            var r1 = Math.random();
            if (r1 > 0.2) {
                continue; // Skip the current iteration with 80% chance
            }
            if(r1 < 0.007) {
                pA_temp[y][x] = 'air'; // Chance of flame dying out
            }

            // Randomly select a direction
            var r2 = Math.random() * 0.9;
            var direction = 'none';
            if (r2 < .25 && x > 0 && pA_temp[y][x - 1] == 'air') {
                direction = 'left';
            } else if (r2 >= .25 && r2 < .5 && x < pCX - 1 && pA_temp[y][x + 1] == 'air') {
                direction = 'right';
            } else if (r2 >= .5 && r2 < .9 && y > 0 && pA_temp[y - 1][x] == 'air') {
                direction = 'up';
            }

            // Move gas based on the selected direction
            if (pA[y][x] == 'fire' && pA_temp[y][x] == 'fire') {
                switch (direction) {
                    case 'left':
                        pA_temp[y][x] = 'air';
                        pA_temp[y][x - 1] = 'fire';
                        break;
                    case 'right':
                        pA_temp[y][x] = 'air';
                        pA_temp[y][x + 1] = 'fire';
                        break;
                    case 'up':
                        pA_temp[y][x] = 'air';
                        pA_temp[y - 1][x] = 'fire';
                        break;
                    case 'down':
                        pA_temp[y][x] = 'air';
                        pA_temp[y + 1][x] = 'fire';
                        break;
                }
            }
        }
    }

    // fire overtaking gas or powder
    for (var y = 1; y < pCY - 1; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(pA[y][x] != 'fire'){
                continue;   // Skip if the tile is not fire
            }
            
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y][x - 1] == 'gas' && pA_temp[y][x - 1] == 'gas' && Math.random() < .9 || pA[y][x - 1] == 'powder' && pA_temp[y][x - 1] == 'powder' && Math.random() < .03)){
                pA_temp[y][x - 1] = 'fire';
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y][x + 1] == 'gas' && pA_temp[y][x + 1] == 'gas' && Math.random() < .9 || pA[y][x + 1] == 'powder' && pA_temp[y][x + 1] == 'powder' && Math.random() < .03)){
                pA_temp[y][x + 1] = 'fire';
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y - 1][x] == 'gas' && pA_temp[y - 1][x] == 'gas' && Math.random() < .9 || pA[y - 1][x] == 'powder' && pA_temp[y - 1][x] == 'powder' && Math.random() < .03)){
                pA_temp[y - 1][x] = 'fire';
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y + 1][x] == 'gas' && pA_temp[y + 1][x] == 'gas' && Math.random() < .9 || pA[y + 1][x] == 'powder' && pA_temp[y + 1][x] == 'powder' && Math.random() < .03)){
                pA_temp[y + 1][x] = 'fire';
            }
        }
    }
    

    // allow elements to move through the bottom to the top
    for(var x = 0; x < pCX; x++) {
        if((pA[pCY - 1][x] == 'water' || pA[pCY - 1][x] == 'powder' ) && pA[0][x] == 'air' && (pA_temp[pCY - 1][x] == 'water' || pA_temp[pCY - 1][x] == 'powder' ) && pA_temp[0][x] == 'air'){
            pA_temp[0][x] = pA[pCY - 1][x];
            pA_temp[pCY - 1][x] = 'air';
        }

    }

    // Rest of the tick function

    
    make_gas_and_fire();
    
    
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
    penE = element;
}

function make_gas_and_fire(){
    for (var y = 1; y < pCY - 1; y++) {
        for(var x = 1; x < pCX - 1; x++) {
            if(pA[y][x] == 'air'){
                if(Math.random() < 0.00001){
                    pA_temp[y][x] = 'gas';
                }
                if(Math.random() < 0.0000001){
                    pA_temp[y][x] = 'fire';
                }
            }
            
        }
    }
}



// Call this function once to set up the event listener
setupCanvasClickHandler();



setInterval(tick, tickS);
