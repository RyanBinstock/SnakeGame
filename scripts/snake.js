import { tileWidth, boardWidth } from './script.js';

export let xSpeed = 1;
export let ySpeed = 0;

export let snake = [{
  snakeX: 0,
  snakeY: 0
}]

export function snakeBiteItself() {
  let result = false;

  for (let i = 1; i < snake.length && !false; i++) {
    if (snake[0].snakeX === snake[i].snakeX
      && snake[0].snakeY === snake[i].snakeY) {
        result = true;
      }
  }

  return result;
}

export function drawSnakeBody() {
  let snakeHTML = '';

  for (let i = 1; i < snake.length; i++) {
    snakeHTML += `
      <div class="snake-body"
        style="top: ${snake[i].snakeY}px;
        left: ${snake[i].snakeX}px;">
      </div>
    `;
  }

  return snakeHTML;
}

export function updateSnake() {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].snakeX = snake[i-1].snakeX;
    snake[i].snakeY = snake[i-1].snakeY;
  }

  snake[0].snakeX += xSpeed * tileWidth;
  snake[0].snakeY += ySpeed * tileWidth;
}

export function modifySpeed(direction) {
  if (direction === 'up') {
    xSpeed = 0;
    ySpeed = -1;
  } else if (direction === 'right') {
    xSpeed = 1;
    ySpeed = 0;
  } else if (direction === 'left') {
    xSpeed = -1;
    ySpeed = 0;
  } else if (direction === 'down') {
    xSpeed = 0;
    ySpeed = 1;
  }
}

export function initializeSnakePos() {
  const x = boardWidth / 2;
  const y = boardWidth / 2;
  snake = [{
    snakeX: x,
    snakeY: y
  }];
}
