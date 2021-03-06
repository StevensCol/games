const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const screenHeight = screen.offsetHeight;
const screenWidth = screen.offsetWidth;

const timeSleep = 10;
const Palette = {
  bgColor: '#101014'
};

screen.height = screenHeight;
screen.width = screenWidth;

function listenInput() {
  document.addEventListener('keydown', processInputs);
}

function processInputs(event) {
  console.log(event.code);
}

function drawScenario() {
  context.fillStyle = Palette.bgColor;
  context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameLoop() {
  drawScenario();
  // more draws

  setTimeout(gameLoop, timeSleep);
}

function start() {
  listenInput();
  gameLoop();
}

start();
