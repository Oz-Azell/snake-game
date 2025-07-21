const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let aiActive = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'limegreen' : 'lightgreen';
    ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
    ctx.strokeStyle = '#003300';
    ctx.strokeRect(segment.x * 20, segment.y * 20, 18, 18);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    snake.unshift(head);
    placeFood();
  } else {
    snake.unshift(head);
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= canvas.width / 20 ||
    head.y < 0 || head.y >= canvas.height / 20 ||
    collisionWithSelf(head)
  ) {
    // Removed alert line
    document.getElementById('playAgainBtn').style.display = 'block';
    clearInterval(gameInterval);
  }
}

function collisionWithSelf(head) {
  return snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
}

function placeFood() {
  food.x = Math.floor(Math.random() * (canvas.width / 20));
  food.y = Math.floor(Math.random() * (canvas.height / 20));
}

function changeDirection(event) {
  if (!aiActive) {
    switch (event.key) {
      case 'ArrowUp': if (direction.y === 0) setDir(0, -1); break;
      case 'ArrowDown': if (direction.y === 0) setDir(0, 1); break;
      case 'ArrowLeft': if (direction.x === 0) setDir(-1, 0); break;
      case 'ArrowRight': if (direction.x === 0) setDir(1, 0); break;
    }
  }
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  document.getElementById('score').innerText = 'Score: 0';
  document.getElementById('playAgainBtn').style.display = 'none';
  placeFood();
  gameInterval = setInterval(gameLoop, 100);
}

function aiMove() {
  const head = snake[0];
  const target = food;
  let bestMove = { x: 0, y: 0 };

  let moves = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  moves = moves.filter(move => {
    const newHead = { x: head.x + move.x, y: head.y + move.y };
    return !collisionWithSelf(newHead);
  });

  let bestDistance = Infinity;
  moves.forEach(move => {
    const newHead = { x: head.x + move.x, y: head.y + move.y };
    const distance = Math.abs(newHead.x - target.x) + Math.abs(newHead.y - target.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMove = move;
    }
  });

  direction = bestMove;
}

function setDir(x, y) {
  if (!aiActive && (direction.x !== x || direction.y !== y)) {
    direction = { x, y };
  }
}

function toggleAutoPlay() {
  aiActive = !aiActive;
  const btn = document.getElementById('autoToggleBtn');
  btn.innerText = aiActive ? 'AUTOPLAY: ON' : 'AUTOPLAY: OFF';
}

let gameInterval = setInterval(gameLoop, 100);

function gameLoop() {
  if (aiActive) aiMove();
  update();
  draw();
}

document.addEventListener('keydown', changeDirection);
placeFood();
console.log("azell");
