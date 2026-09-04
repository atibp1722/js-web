// get canvas and use context to 2d context render
const canvas = document.getElementById("game")
const ctx = canvas.getContext('2d');

// indiviual snake block that is to be incremented as game progresses
class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// let snake refresh 7 times per second
let speed = 7;

// variables for positioning and size
let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;
let headX= 10;
let headY = 10;
// array for snake part
const snakeParts = [];
// initial snake length
let tailLength = 2;

// starting position of the apple
let appleX = 5;
let appleY = 5;

// control snake movement
let xVelocity = 0;
let yVelocity = 0;

// score variable
let score = 0;

// add sound every time collided with apple
const sound = new Audio("gulp.wav");

// game loop
function drawGame(){
    changeSnakePosition();

    let result = isGameOver();
    if(result){
        return;
    }

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();

    // increase game speed when certain scored reached
    if(score > 5){
        speed = 10;
    }
    if(score > 10){
        speed = 12;
    }
    
    setTimeout(drawGame, 1000/speed);
}

// function for various game over scenarios
function isGameOver(){
    let gameOver = false;

    // stop from being game over at very beginning
    if(xVelocity === 0 && yVelocity === 0){
        return false;
    }

    // check if collided with wall horizontally
    if (headX < 0){
        gameOver = true;
    }
    else if (headX === tileCount){
        gameOver = true;
    }
    // check if collided with wall vertically
    else if (headY < 0){
        gameOver = true;
    }
    else if (headY === tileCount){
        gameOver = true;
    }

    // condition for game over after touch itself
    for(let i = 0; i<snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true;
            break;
        }
    }
    
    if(gameOver){
        // game over message display
        ctx.fillStyle = 'red';
        ctx.font = "48px Arial";
        ctx.fillText("Sorry, game over!", canvas.width/6.5, canvas.height/2);
    }
    return gameOver;
}

// function to display user score on top of canvas
function drawScore(){
    ctx.fillStyle = 'white';
    ctx.font = "11px Arial";
    ctx.fillText("Score: "+score, canvas.width-50, 10);
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(){
    ctx.fillStyle = 'green';
    // loop through snake and draw additional body
    for(let i=0; i<snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillRect(part.x*tileCount, part.y*tileCount, tileSize, tileSize);
    }

    // add current position
    snakeParts.push(new SnakePart(headX, headY));
    // remove if larger than allowed length
    while(snakeParts.length > tailLength){
        snakeParts.shift();
    }

    // put the snake in the middle of the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(headX*tileCount, headY*tileCount, tileSize, tileSize);

}

function drawApple(){
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize);
}

// check if snake is same tile as apple
function checkAppleCollision(){
    if(appleX===headX && appleY===headY){
        // move apple to a random psition on the canvas
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
        tailLength++;
        // update score with every apple collided with
        score++;
        sound.play();
    }
}

function changeSnakePosition(){
    // move the snake horizontally (left/right)
    // 1: move right
    // -1: move left
    headX = headX + xVelocity;
    // move the snake vertically (up/down)
    // 1: move down
    // -1: move up
    headY = headY + yVelocity;
}

document.body.addEventListener("keydown", keyDown);

// function to listen to key pressed
function keyDown(event){
    // up arrow pressed
    if(event.keyCode == 38){
        if(yVelocity == 1)
            return;
        // move up
        yVelocity = -1;
        // stop horizontal movement
        xVelocity = 0;
    }
    // down arrow pressed
    if(event.keyCode == 40){
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    // left arrow pressed
    if(event.keyCode == 37){
        if(xVelocity == 1)
            return;
        // stop vertical movement
        yVelocity = 0;
        // move left
        xVelocity = -1;
    }
    // right arrow pressed
     if(event.keyCode == 39){
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }

}

drawGame();
