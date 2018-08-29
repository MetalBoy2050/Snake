const cvs = document.getElementById("Snake Game");
const ctx = cvs.getContext("2d");

const ROWS = 20;
const COLS = 20;
const SQ = 20;
const eatSound = new Audio("eatSound.ogg");
const dieSound = new Audio("dieSound.ogg");

let score = 0;
let gameOver = false;
let direction = null;
let board = [];
let snake = [];
let food = {x: Math.floor(Math.random() * (ROWS - 1)),
            y: Math.floor(Math.random() * (COLS - 3) + 2)}

snake[0] = {x: 10, y: 10};

for(r = 0; r < 2; r++){
    board[r] = [];
    for(c = 0; c < COLS; c++){
        board[r][c] = "darkgreen";
    }
}

for(r = 2; r < ROWS; r++){
    board[r] = [];
    for(c = 0; c < COLS; c++){
        board[r][c] = ((r + c) % 2 == 0) ? "green" : "white";
    }
}

function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
}

function strokeSquare(x, y, color){
    ctx.strokeStyle = color;
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawBoard(){
    for(r = 0; r < ROWS; r++){
        for(c = 0; c < COLS; c++){
            drawSquare(c, r, board[r][c]);
            strokeSquare(c, r, (r < 2) ? "darkgreen" : "black");
        }
    }
}

function displayScore(){
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText("Score : " + score, 0, 20);
}

function drawSnake(){
    for(i = 0; i < snake.length; i++){
        drawSquare(snake[i].x, snake[i].y, "red");
        strokeSquare(snake[i].x, snake[i].y, "yellow");
    }
}

function drawFood(){
    drawSquare(food.x, food.y, "blue");
}

function draw(){
    drawBoard();
    drawSnake();
    drawFood();
    displayScore();
}

document.addEventListener("keydown", control);

function control(event){
    if(event.keyCode == 37 && direction != "RIGHT"){
        direction = "LEFT";
    }else if(event.keyCode == 38 && direction != "DOWN"){
        direction = "UP";
    }else if(event.keyCode == 39 && direction != "LEFT"){
        direction = "RIGHT";
    }else if(event.keyCode == 40 && direction != "UP"){
        direction = "DOWN";
    }
}

function ifEaten(x, y){
    if(x == food.x && y == food.y){
        food = {
            x: Math.floor(Math.random() * (ROWS - 1)),
            y: Math.floor(Math.random() * (COLS - 3) + 2)
        }
        eatSound.play();
        return true;
    }
    else{
        return false;
    }
}

function verifyCollision(){
    for(i = 0; i < snake.length - 1; i++)
        if(snake[snake.length - 1].x == snake[i].x && snake[snake.length - 1].y == snake[i].y){
            return true;
        }
    return false;
}

function motion(){
    headX = snake[0].x;
    headY = snake[0].y;
    
    if(direction == "LEFT"){
        headX--;
    }else if(direction == "RIGHT"){
        headX++;
    }else if(direction == "UP"){
        headY--;
    }else if(direction == "DOWN"){
        headY++;
    }
    
    if(headX < 0){
        headX = ROWS - 1;
    }else if(headX >= COLS){
        headX = 0;
    }
    
    if(headY < 2 || headY >= ROWS){
        clearInterval(game);
        gameOver = true;
        dieSound.play();
    }
        
    newHead = {x: headX, y: headY};
    
    if(ifEaten(headX, headY)){
        score++;
        snake.unshift(newHead);
    }else{
        snake.pop();
        snake.unshift(newHead);   
    }
    
    if(verifyCollision()){
        clearInterval(game);
        gameOver = true;
        dieSound.play();
    }
}

function update(){
    motion();
    if(gameOver == false){
        draw();
    }
}

const game = setInterval(update, 100);