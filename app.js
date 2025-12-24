const board = document.querySelector(".play-board");
const scoreEl = document.querySelector(".score");
const levelEl = document.querySelector(".level");
const highScoreEl = document.querySelector(".high-score");

const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const restartBtn = document.querySelector(".restart-btn");
const overlay = document.querySelector(".overlay");
const finalScoreEl = document.querySelector(".final-score");
const difficultySelect = document.querySelector(".difficulty");

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let level = 1;
let speed = 120;
let interval;

let highScore = localStorage.getItem("snakeHigh") || 0;
highScoreEl.textContent = `High Score: ${highScore}`;

document.addEventListener("keydown", handleKey);
startBtn.onclick = startGame;
pauseBtn.onclick = pauseGame;
restartBtn.onclick = restartGame;
difficultySelect.onchange = e => speed = +e.target.value;

/* Start */
function startGame() {
  spawnFood();
  interval = setInterval(gameLoop, speed);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
}

/* Main Loop */
function gameLoop() {
  const head = { ...snake[0] };
  head.x += direction.x;
  head.y += direction.y;

  // Wall collision
  if (head.x < 1 || head.y < 1 || head.x > 20 || head.y > 20) return endGame();

  // Self collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) return endGame();

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = `Score: ${score}`;

    if (score % 5 === 0) {
      level++;
      levelEl.textContent = `Level: ${level}`;
      clearInterval(interval);
      interval = setInterval(gameLoop, Math.max(60, speed - level * 10));
    }

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHigh", highScore);
      highScoreEl.textContent = `High Score: ${highScore}`;
    }

    spawnFood();
  } else {
    snake.pop();
  }

  render();
}

/* Render */
function render() {
  board.innerHTML = `
    <div class="food" style="grid-area:${food.y}/${food.x}"></div>
    ${snake.map((s, i) =>
      `<div class="snake ${i === 0 ? "head" : ""}" style="grid-area:${s.y}/${s.x}"></div>`
    ).join("")}
  `;
}

/* Food */
function spawnFood() {
  food = {
    x: Math.floor(Math.random() * 20) + 1,
    y: Math.floor(Math.random() * 20) + 1
  };
}

/* Controls */
function handleKey(e) {
  if (e.key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x !== -1) direction = { x: 1, y: 0 };
}

/* Pause */
function pauseGame() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    pauseBtn.textContent = "Resume";
  } else {
    interval = setInterval(gameLoop, speed);
    pauseBtn.textContent = "Pause";
  }
}

/* End */
function endGame() {
  clearInterval(interval);
  overlay.classList.remove("hidden");
  finalScoreEl.textContent = `Your Score: ${score}`;
}

/* Restart */
function restartGame() {
  overlay.classList.add("hidden");
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  level = 1;
  scoreEl.textContent = "Score: 0";
  levelEl.textContent = "Level: 1";
  startGame();
}