var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");

// Display settings
var minW = 0;
var minH = 0;
var maxW = canvas1.width;   //width is 800 pixels
var maxH = canvas1.height;   //height is 800 pixels
var bgHue = "#777777";

var pixS = 8;
var pCX = Math.floor(maxW / pixS);
var pCY = Math.floor(maxH / pixS);
var pA = new Array(pCY);

var cloneA = new Array(pCY);
var que_one = new Array(pCY);
var que_two = new Array(pCY);

var elHues = {
    'air' : "#8aaac3",      //Grey for air
    'powder': "#cc7c44",    // Dark yellow for powder
    'block': "#2b313f",     // Black for block
    'water': "#0065a3",     // Blue for water
    'gas': "#fdd207",       // Yellow for gas
    'fire' : "#e23d27",      // Red for fire
    'hole' : "#2d4464",      // cyan for hole
    'clone' : "#9b9640",     // green for clone
    'que' : "#b82025",       // dark red for que
    'wood' : "#b25d35",      // Brown for wood
    'willite' : "#7c8786"    // Grey for willite
};

var penS = 1;
var penE = 'water';

var tickS = 0;

var clone_chance = 0.01  // Chance of cloning occuring from a clone block

var hole_chance = 0.01  // Chance of a hole removing a block

var fire_spread_chance_gas = 1  // Chance of fire spreading to a gas particle

var fire_spread_chance_powder = 0.5 // Chance of fire spreading to a powder particle

var fire_spread_chance_wood = 0.5 // Chance of fire spreading to a wood particle

var fire_spread_chance_que = 0.4 //  Chance of fire spreading to a que particle

var que_mov_chance = 0.3    // Chance of que moving

var que_rot_levels = [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

var que_medium = 'willite'



function normal_setup(){

    // Initialize 2D array
    for (var i = 0; i < pCY; i++) {
        pA[i] = new Array(pCX).fill('air');
        cloneA[i] = new Array(pCX).fill('air');
        que_one[i] = new Array(pCX).fill(0);
        que_two[i] = new Array(pCX).fill(1);
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

}



function manual_setup(){
    // Reset the array to all 'air'
    for (var i = 0; i < pCY; i++) {
        pA[i] = new Array(pCX).fill('air');
        cloneA[i] = new Array(pCX).fill('air');
        que_one[i] = new Array(pCX).fill(0);
        que_two[i] = new Array(pCX).fill(1);
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








normal_setup();
//manual_setup();

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
    ctx.font = '16px Arial';
    ctx.fillStyle = '#F55';
    ctx.fillText(`Element Selected: ${penE}`, 10, 30);
    ctx.fillText(`Pen Size: ${penS}`, 10, 60);
    ctx.fillText(`Que Sequence: ${que_rot_levels}`, 10, 90);

    // Game logic and physics for elements

    // falling
    for (var y = 1; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if((pA[y][x] == 'air' || pA[y][x] == 'fire' ) && (pA[y - 1][x] == 'powder' || pA[y - 1][x] == 'water')){
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
            if (r1 > 0.1) {
                continue; // Skip the current iteration with 90%
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
            var r2 = Math.random() * 0.85;
            var direction = 'none';
            if (r2 < .25 && x > 0 && pA_temp[y][x - 1] == 'air') {
                direction = 'left';
            } else if (r2 >= .25 && r2 < .5 && x < pCX - 1 && pA_temp[y][x + 1] == 'air') {
                direction = 'right';
            } else if (r2 >= .5 && r2 < .85 && y > 0 && pA_temp[y - 1][x] == 'air') {
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
            
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y][x - 1] == 'gas' && pA_temp[y][x - 1] == 'gas' && Math.random() < fire_spread_chance_gas || pA[y][x - 1] == 'powder' && pA_temp[y][x - 1] == 'powder' && Math.random() < fire_spread_chance_powder || pA[y][x - 1] == 'wood' && pA_temp[y][x - 1] == 'wood' && Math.random() < fire_spread_chance_wood|| pA[y][x - 1] == 'que' && pA_temp[y][x - 1] == 'que' && Math.random() < fire_spread_chance_que)){
                pA_temp[y][x - 1] = 'fire';
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y][x + 1] == 'gas' && pA_temp[y][x + 1] == 'gas' && Math.random() < fire_spread_chance_gas || pA[y][x + 1] == 'powder' && pA_temp[y][x + 1] == 'powder' && Math.random() < fire_spread_chance_powder || pA[y][x + 1] == 'wood' && pA_temp[y][x + 1] == 'wood' && Math.random() < fire_spread_chance_wood || pA[y][x + 1] == 'que' && pA_temp[y][x + 1] == 'que' && Math.random() < fire_spread_chance_que)){
                pA_temp[y][x + 1] = 'fire';
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y - 1][x] == 'gas' && pA_temp[y - 1][x] == 'gas' && Math.random() < fire_spread_chance_gas || pA[y - 1][x] == 'powder' && pA_temp[y - 1][x] == 'powder' && Math.random() < fire_spread_chance_powder || pA[y - 1][x] == 'wood' && pA_temp[y - 1][x] == 'wood' && Math.random() < fire_spread_chance_wood || pA[y - 1][x] == 'que' && pA_temp[y - 1][x] == 'que' && Math.random() < fire_spread_chance_que)){
                pA_temp[y - 1][x] = 'fire';
            }
            if(pA[y][x] == 'fire' && pA_temp[y][x] == 'fire' && (pA[y + 1][x] == 'gas' && pA_temp[y + 1][x] == 'gas' && Math.random() < fire_spread_chance_gas || pA[y + 1][x] == 'powder' && pA_temp[y + 1][x] == 'powder' && Math.random() < fire_spread_chance_powder || pA[y + 1][x] == 'wood' && pA_temp[y + 1][x] == 'wood' && Math.random() < fire_spread_chance_wood || pA[y + 1][x] == 'que' && pA_temp[y + 1][x] == 'que' && Math.random() < fire_spread_chance_que)){
                pA_temp[y + 1][x] = 'fire';
            }
        }
    }

    // Hole taking in elements
    for (var y = 0; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if(pA[y][x] != 'hole'){
                continue;
            }
            
            if(x > 0){
                if(pA[y][x - 1] != 'air' && pA[y][x - 1] != 'hole' && pA[y][x - 1] != 'block' && Math.random() < hole_chance){
                    pA_temp[y][x - 1] = 'air';
                }
            }
            if(x < pCX - 1){
                if(pA[y][x + 1] != 'air' && pA[y][x + 1] != 'hole' && pA[y][x + 1] != 'block' && Math.random() < hole_chance){
                    pA_temp[y][x + 1] = 'air';
                }
            }
            if(y > 0){
                if(pA[y - 1][x] != 'air' && pA[y - 1][x] != 'hole' && pA[y - 1][x] != 'block' && Math.random() < hole_chance){
                    pA_temp[y - 1][x] = 'air';
                }
            }
            if(y < pCY - 1){
                if(pA[y + 1][x] != 'air' && pA[y + 1][x] != 'hole' && pA[y + 1][x] != 'block' && Math.random() < hole_chance){
                    pA_temp[y + 1][x] = 'air';
                }
            }
        }
    }

    // Clone physics
    for (var y = 0; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if(pA[y][x] != 'clone'){
                cloneA[y][x] = 'air';
                continue;
            }

            //set clone dimension if needed
            if(cloneA[y][x] == 'air'){
                if(x > 0){
                    if(pA[y][x - 1] != 'air' && pA[y][x - 1] != 'hole' && pA[y][x - 1] != 'block' && pA[y][x - 1] != 'clone'){
                        cloneA[y][x] = pA[y][x - 1]
                    }
                }
                if(x < pCX - 1){
                    if(pA[y][x + 1] != 'air' && pA[y][x + 1] != 'hole' && pA[y][x + 1] != 'block' && pA[y][x + 1] != 'clone'){
                        cloneA[y][x] = pA[y][x + 1]
                    }
                }
                if(y > 0){
                    if(pA[y - 1][x] != 'air' && pA[y - 1][x] != 'hole' && pA[y - 1][x] != 'block' && pA[y - 1][x] != 'clone'){
                        cloneA[y][x] = pA[y - 1][x]
                    }
                }
                if(y < pCY - 1){
                    if(pA[y + 1][x] != 'air' && pA[y + 1][x] != 'hole' && pA[y + 1][x] != 'block' && pA[y + 1][x] != 'clone'){
                        cloneA[y][x] = pA[y + 1][x]
                    }
                }
            }
            else{   // clone
                if(x > 0 && Math.random() < clone_chance){
                    if(pA[y][x - 1] == 'air'){
                        pA_temp[y][x - 1] = cloneA[y][x];
                    }
                }
                if(x < pCX - 1 && Math.random() < clone_chance){
                    if(pA[y][x + 1] == 'air'){
                        pA_temp[y][x + 1] = cloneA[y][x];
                    }
                }
                if(y > 0 && Math.random() < clone_chance){
                    if(pA[y - 1][x] == 'air'){
                        pA_temp[y - 1][x] = cloneA[y][x];
                    }
                }
                if(y < pCY - 1 && Math.random() < clone_chance){
                    if(pA[y + 1][x] == 'air'){
                        pA_temp[y + 1][x] = cloneA[y][x];
                    }
                }
            }



        }
    }
    

    // Que physics
    for (var y = 0; y < pCY; y++) {
        for(var x = 0; x < pCX; x++) {
            if(pA[y][x] != 'que' || Math.random() > que_mov_chance){
                continue;
            }
            que_two[y][x] += que_rot_levels[que_one[y][x]];
            que_one[y][x] ++;
            if(que_one[y][x] > que_rot_levels.length - 1){
                que_one[y][x] = 0;
            }

            

            var direction = que_two[y][x];

            if(direction == 5){
                que_two[y][x] = 1
            }
            else if(direction == 6){
                que_two[y][x] = 2
            }
            else if(direction == 7){
                que_two[y][x] = 3
            }
            else if(direction == 0){
                que_two[y][x] = 4
            }
            else if(direction == -1){
                que_two[y][x] = 3
            }
            else if(direction == -2){
                que_two[y][x] = 2
            }


            if(direction == 1 && y > 0){
                if(pA[y - 1][x] == que_medium && pA_temp[y - 1][x] == que_medium){
                    pA_temp[y - 1][x] = 'que';
                    pA_temp[y][x] = que_medium;
                    que_two[y - 1][x] = direction;
                }
            }
            else if(direction == 2 && x > 0){
                if(pA[y][x - 1] == que_medium && pA_temp[y][x - 1] == que_medium){
                    pA_temp[y][x - 1] = 'que';
                    pA_temp[y][x] = que_medium;
                    que_two[y][x - 1] = direction;
                }
            }
            else if(direction == 3 && y < pCY - 1){
                if(pA[y + 1][x] == que_medium && pA_temp[y + 1][x] == que_medium){
                    pA_temp[y + 1][x] = 'que';
                    pA_temp[y][x] = que_medium;
                    que_two[y + 1][x] = direction;
                }
            }
            else if(direction == 4 && x < pCX - 1){
                if(pA[y][x + 1] == que_medium && pA_temp[y][x + 1] == que_medium){
                    pA_temp[y][x + 1] = 'que';
                    pA_temp[y][x] = que_medium;
                    que_two[y][x + 1] = direction;
                }
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

    
    //make_gas_and_fire();
    
    
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
        
        var bounds = penS * 0.5 - 0.5
        for (var y = -1 * Math.floor(bounds); y <= Math.round(bounds); y++){
            if(y + arrayY < 0 || y + arrayY > pCY - 1){
                continue;
            }
            for (var x = -1 * Math.floor(bounds); x <= Math.round(bounds); x++){
                if(x + arrayX < 0 || x + arrayX > pCX - 1){
                    continue;
                }
                pA[arrayY + y][arrayX + x] = penE;
            }
        }
        if(bounds == 0){
            pA[arrayY][arrayX] = penE;
        }

        // Update the canvas immediately to reflect the change
        tick();
    }
}

function set_element(element){
    penE = element;
    
}

function change_pen_size(change){
    if(penS + change >= 0){
        penS += change
    }
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

function change_que_seq(){
    for (var x = 0; x < que_rot_levels.length; x++){
        var r1 = Math.random()
        que_rot_levels[x] = Math.floor((r1 * 2 - 1) * 1 + 0.5)
    }
}



// Call this function once to set up the event listener
setupCanvasClickHandler();



setInterval(tick, tickS);
