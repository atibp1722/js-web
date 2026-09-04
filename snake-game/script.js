// get canvas and use context to 2d context render
const canvas = document.getElementById("game")
const ctx = canvas.getContext('2d');

// let snake refresh 7 times per second
let speed = 7;

// variables for positioning and size
let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;
let headX= 10;
let headY = 10;

// game loop
function drawGame(){
    clearScreen();
    drawSnake();
    setTimeout(drawGame, 1000/speed);
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(){
    // put the snake in the middle of the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(headX*tileCount, headY*tileCount, tileSize, tileSize);
}

drawGame();