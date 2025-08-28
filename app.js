const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const overlay = document.querySelector(".overlay");
const restartBtn = document.querySelector(".restart-btn");

let snakeX = 10, snakeY = 10;
let foodX, foodY;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let speed = 200;
let score = 0, highScore = 0;
let setIntervalId;

document.addEventListener("keydown", changeDirection);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);
startBtn.addEventListener("click", startGame);

function startGame() {
  updateFoodPosition();
  renderInitial();
  setIntervalId = setInterval(initGame, speed);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
}

function renderInitial() {
  playBoard.innerHTML = `<div class="snake" style="grid-area:${snakeY}/${snakeX}"></div>
                         <div class="food" style="grid-area:${foodY}/${foodX}"></div>`;
}

function initGame() {
  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 20 || snakeCollision()) {
    gameOver();
    return;
  }

  if (snakeX === foodX && snakeY === foodY) {
    score++;
    scoreElement.innerText = `Score: ${score}`;
    if (score > highScore) highScore = score;
    highScoreElement.innerText = `High Score: ${highScore}`;
    snakeBody.push([foodX, foodY]);
    updateFoodPosition();
    speed = speed > 50 ? speed - 5 : speed;
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, speed);
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) snakeBody[0] = [snakeX, snakeY];

  let html = `<div class="snake" style="grid-area:${snakeY}/${snakeX}"></div>`;
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="snake" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
  }
  html += `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;
  playBoard.innerHTML = html;
}

function updateFoodPosition() {
  foodX = Math.floor(Math.random() * 20) + 1;
  foodY = Math.floor(Math.random() * 20) + 1;
}

function changeDirection(e) {
  if (e.key === "ArrowUp" && velocityY !== 1) { velocityX = 0; velocityY = -1; }
  else if (e.key === "ArrowDown" && velocityY !== -1) { velocityX = 0; velocityY = 1; }
  else if (e.key === "ArrowLeft" && velocityX !== 1) { velocityX = -1; velocityY = 0; }
  else if (e.key === "ArrowRight" && velocityX !== -1) { velocityX = 1; velocityY = 0; }
}

function snakeCollision() {
  return snakeBody.some(segment => segment[0] === snakeX && segment[1] === snakeY);
}

function pauseGame() {
  if (setIntervalId) {
    clearInterval(setIntervalId);
    setIntervalId = null;
    pauseBtn.innerText = "Resume";
  } else {
    setIntervalId = setInterval(initGame, speed);
    pauseBtn.innerText = "Pause";
  }
}

function gameOver() {
  clearInterval(setIntervalId);
  overlay.classList.remove("hidden");
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  velocityX = velocityY = 0;
}

function restartGame() {
  snakeX = 10; snakeY = 10;
  snakeBody = [];
  score = 0;
  speed = 200;
  scoreElement.innerText = `Score: ${score}`;
  overlay.classList.add("hidden");
  startGame();
}

// Mobile Swipe Controls
let touchStartX, touchStartY;
playBoard.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});
playBoard.addEventListener("touchend", e => {
  let touchEndX = e.changedTouches[0].screenX;
  let touchEndY = e.changedTouches[0].screenY;
  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && velocityX !== -1) { velocityX = 1; velocityY = 0; }
    else if (diffX < 0 && velocityX !== 1) { velocityX = -1; velocityY = 0; }
  } else {
    if (diffY > 0 && velocityY !== -1) { velocityX = 0; velocityY = 1; }
    else if (diffY < 0 && velocityY !== 1) { velocityX = 0; velocityY = -1; }
  }
});