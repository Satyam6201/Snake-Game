const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const restartBtn = document.querySelector(".restart-btn");
const overlay = document.querySelector(".overlay");
const finalScore = document.querySelector(".final-score");
const difficultySelect = document.querySelector(".difficulty");

const eatSound = document.getElementById("eat-sound");
const moveSound = document.getElementById("move-sound");
const gameoverSound = document.getElementById("gameover-sound");

let snakeX = 10, snakeY = 10;
let snakeBody = [];
let foodX, foodY;
let velocityX = 0, velocityY = 0;
let speed = 120;
let score = 0, highScore = localStorage.getItem("highScore") || 0;
let setIntervalId;

highScoreElement.innerText = `High Score: ${highScore}`;

document.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);
difficultySelect.addEventListener("change", e => speed = parseInt(e.target.value));

function startGame() {
  updateFoodPosition();
  renderGame();
  setIntervalId = setInterval(initGame, speed);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
}

function updateFoodPosition() {
  foodX = Math.floor(Math.random() * 20) + 1;
  foodY = Math.floor(Math.random() * 20) + 1;
}

function initGame() {
  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeY <= 0 || snakeX > 20 || snakeY > 20 || collision()) {
    gameoverSound.play();
    gameOver();
    return;
  }

  if (snakeX === foodX && snakeY === foodY) {
    eatSound.play();
    score++;
    scoreElement.innerText = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    highScoreElement.innerText = `High Score: ${highScore}`;
    snakeBody.push([foodX, foodY]);
    updateFoodPosition();
    showScorePopup();
  }

  for (let i = snakeBody.length - 1; i > 0; i--) snakeBody[i] = snakeBody[i - 1];
  snakeBody[0] = [snakeX, snakeY];

  renderGame();
}

function renderGame() {
  let html = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;
  for (let [x, y] of snakeBody)
    html += `<div class="snake" style="grid-area:${y}/${x}"></div>`;
  playBoard.innerHTML = html;
}

function changeDirection(e) {
  moveSound.play();
  if (e.key === "ArrowUp" && velocityY !== 1) { velocityX = 0; velocityY = -1; }
  else if (e.key === "ArrowDown" && velocityY !== -1) { velocityX = 0; velocityY = 1; }
  else if (e.key === "ArrowLeft" && velocityX !== 1) { velocityX = -1; velocityY = 0; }
  else if (e.key === "ArrowRight" && velocityX !== -1) { velocityX = 1; velocityY = 0; }
}

function collision() {
  return snakeBody.slice(1).some(seg => seg[0] === snakeX && seg[1] === snakeY);
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
  finalScore.innerText = `Your Score: ${score}`;
  pauseBtn.disabled = true;
  startBtn.disabled = false;
  velocityX = velocityY = 0;
}

function restartGame() {
  overlay.classList.add("hidden");
  snakeX = 10; snakeY = 10;
  snakeBody = [];
  velocityX = velocityY = 0;
  score = 0;
  scoreElement.innerText = "Score: 0";
  startGame();
}

function showScorePopup() {
  const popup = document.createElement("div");
  popup.classList.add("score-popup");
  popup.textContent = "+1";
  popup.style.gridArea = `${foodY}/${foodX}`;
  playBoard.appendChild(popup);
  setTimeout(() => popup.remove(), 800);
}