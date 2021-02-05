const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const timeSleep = 100;
const tilesSize = 30;

const Directions = { UP: 'ArrowUp', RIGHT: 'ArrowRight', DOWN: 'ArrowDown', LEFT: 'ArrowLeft' };
const Palette = {
  bgColor: '#101014',
  gridColor: '#181821',
  snakeColor: '#006000',
  appleColor: '#600000',
};

const ScreenInfo = {
  height: screen.offsetHeight,
  width: screen.offsetWidth,
  horizontalTiles: Math.floor(screen.offsetWidth / tilesSize),
  verticalTiles: Math.floor(screen.offsetHeight / tilesSize)
};

const GameInfo = {
  score: 0,
  apple: [],
  snake: {
    body: [],
    lastTile: [],
    direction: Directions.UP
  }
};

function listenInput() {
  document.addEventListener('keydown', processInputs);
}

function processInputs(event) {
  const newDirection = event.code;
  const { snake } = GameInfo;

  if ((newDirection === Directions.UP && snake.direction !== Directions.DOWN) ||
    (newDirection === Directions.RIGHT && snake.direction !== Directions.LEFT) ||
    (newDirection === Directions.DOWN && snake.direction !== Directions.UP) ||
    (newDirection === Directions.LEFT && snake.direction !== Directions.RIGHT)) {
    snake.direction = newDirection;
  }
}

function loadApple() {
  const { snake } = GameInfo;
  let x, y, index;

  do {
    x = Math.floor(Math.random() * ScreenInfo.horizontalTiles);
    y = Math.floor(Math.random() * ScreenInfo.verticalTiles);

    index = snake.body.findIndex(p => x === p[0] && y === p[1]);
  } while(index > -1);

  return [x, y];
}

function initializeGame() {
  screen.height = ScreenInfo.height;
  screen.width = ScreenInfo.width;

  const center = [
    Math.round(ScreenInfo.horizontalTiles / 2),
    Math.round(ScreenInfo.verticalTiles / 2)
  ];

  GameInfo.score = 0;
  GameInfo.snake.direction = Directions.UP;
  GameInfo.snake.body = [
    [...center],
    [center[0], center[1] + 1],
    [center[0], center[1] + 2],
    [center[0], center[1] + 3]
  ];
  GameInfo.apple = loadApple();
}

function moveSnake() {
  const { snake } = GameInfo;
  let [x, y] = snake.body[0];
  
  if (snake.direction === Directions.UP) y--;
  else if (snake.direction === Directions.RIGHT) x++;
  else if (snake.direction === Directions.DOWN) y++;
  else if (snake.direction === Directions.LEFT) x--;

  snake.body.unshift([x, y]);
  snake.lastTile = snake.body.pop();
}

function validateCollisions() {
  let { snake, apple } = GameInfo;
  const head = snake.body[0];

  if (head[0] >= ScreenInfo.horizontalTiles) head[0] = 0;
  if (head[0] < 0) head[0] = ScreenInfo.horizontalTiles - 1;
  if (head[1] >= ScreenInfo.verticalTiles) head[1] = 0;
  if (head[1] < 0) head[1] = ScreenInfo.verticalTiles - 1;

  if (head[0] === apple[0] && head[1] === apple[1]) {
    GameInfo.apple = loadApple();
    return snake.body.push(snake.lastTile);
  }

  const index =snake.body.findIndex((p, i) => p[0] === head[0] && p[1] === head[1] && i > 0);
  if (index > 0) return initializeGame();
}

function updateState() {
  moveSnake();
}

function drawGrid() {
  context.fillStyle = Palette.gridColor;

  for (let x = tilesSize; x < ScreenInfo.width; x += tilesSize) {
    context.fillRect(x, 0, 1, ScreenInfo.height);
  }  
  for (let y = tilesSize; y < ScreenInfo.height; y += tilesSize) {
    context.fillRect(0, y, ScreenInfo.width, 1);
  }
}

function drawScenario() {
  context.fillStyle = Palette.bgColor;
  context.clearRect(0, 0, ScreenInfo.width, ScreenInfo.height);
  context.fillRect(0, 0, ScreenInfo.width, ScreenInfo.height);
  
  // drawGrid();
}

function drawSnake() {
  for (let tile of GameInfo.snake.body) {
    drawTile(tile);
  }
}

function drawTile(tile, color = Palette.snakeColor) {
  const x = tilesSize * tile[0];
  const y = tilesSize * tile[1];

  context.fillStyle = color;
  context.fillRect(x, y, tilesSize, tilesSize);
}

function drawApple() {
  drawTile(GameInfo.apple, Palette.appleColor);
}

function drawGame() {
  drawScenario();
  drawApple();
  drawSnake();
}

function gameLoop() {
  validateCollisions();
  drawGame();
  updateState();

  setTimeout(gameLoop, timeSleep);
}

function start() {
  listenInput();
  initializeGame()
  gameLoop();
}

start();
