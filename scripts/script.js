import  { snake, snakeBiteItself, drawSnakeBody, updateSnake,
  xSpeed, ySpeed, modifySpeed, initializeSnakePos } from './snake.js';
import { foodX, foodY, generateFoodLocation,
  foodNotInSnake, closeToSnake} from './food.js';
import { saveHighScore } from './helpers.js';
import { findNextMove } from './snakeai.js';

export const tileWidth = 15;
export const boardTileWidth = 20;
export const boardWidth = tileWidth * boardTileWidth;



let gameOver;

let score = 0;

let highScore = JSON.parse(localStorage.getItem('high-score'))
  || 0;
  document.querySelector('.high-score')
  .innerHTML += ` ${highScore}`;

let key;
let prevKey;

let intervalKey;

//addMoveListeners();
startGame();

const test = findNextMove();

function endOfGame() {
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore);
  }

  document.querySelector('.restart-btn')
    .classList.remove('restart-btn-hidden');

    clearInterval(intervalKey);
    startGame();
}

function startGame() {
  key = undefined;
  prevKey = undefined;

  initializeSnakePos();
  score = 0;
  gameOver = false;
  document.querySelector('.restart-btn')
    .classList.add('restart-btn-hidden');
  generateFoodLocation();
  intervalKey = setInterval(update, 100);
}

function eat() {
  generateFoodLocation();

  snake.push({
    snakeX: snake[0].snakeX,
    snakeY: snake[0].snakeY
  })

  updateSnake();

  score++;
}

function ateFood() {
  return (foodX === snake[0].snakeX)
    && (foodY === snake[0].snakeY);
}

function renderGame() {
  const html = `
    style="width:${boardWidth}px;
    height: ${boardWidth}px;">
    <div class="snake-head"
      style="
        left: ${snake[0].snakeX}px;
        top: ${snake[0].snakeY}px;
      ">
    </div>
    ${drawSnakeBody()}
    <div class="food"
      style="
        top: ${foodY}px;
        left: ${foodX}px;
    "</div>
  `;

  document.querySelector('.game')
    .innerHTML = html;
}

function update() {
  if (snakeBiteItself() || outOfBounds()) {
    gameOver = true;
    clearInterval(intervalKey);
    endOfGame();

  }
  if (ateFood()) {
    eat();
  } 
  renderGame();
  aiMove();
  updateSnake();
  document.querySelector('.score')
    .innerHTML = `${score}`;
  

  // if (snakeBiteItself() || outOfBounds()) {
  //   gameOver = true;
  //   clearInterval(intervalKey);
  //   endOfGame();

  // } else {
  //   if (ateFood()) {
  //     eat();
  //   } 
  //   renderGame();
  //   aiMove();
  //   updateSnake();
  //   document.querySelector('.score')
  //     .innerHTML = `${score}`;
  // }
}

function outOfBounds() {
  let result = false;

  if (snake[0].snakeX >= boardWidth) {
    snake[0].snakeX = boardWidth - tileWidth;
    result = true;
  } else if (snake[0].snakeX < 0) {
    snake[0].snakeX = 0;
    result = true;
  }
  
  if (snake[0].snakeY >= boardWidth) {
    snake[0].snakeY = boardWidth - tileWidth;
    result = true;
  } else if (snake[0].snakeY < 0) {
    snake[0].snakeY = 0;
    result = true;
  }

  return result;
}

function aiMove() {
  const coordinate = findNextMove();
  if (!coordinate) {
    endOfGame();
    return;
  }
  const x = snake[0].snakeX / tileWidth;
  const y = snake[0].snakeY / tileWidth;
  if (x == coordinate.x) {
    if (coordinate.y < y) {
      //move = 'up';
      modifySpeed('up');
    } else {
      //move = 'down';
      modifySpeed('down');
    }
  } else if (y == coordinate.y) {
    if (coordinate.x < x) {
      //move = 'left';
      modifySpeed('left');
    } else {
      //move = 'right';
      modifySpeed('right');
    }
  }
}

function addMoveListeners() {
  document.querySelector('body')
    .addEventListener('keydown', event => {
      prevKey = key;
      key = event.key;

      //This check stops the user from spamming the same 
      //direction and moving faster
      if (prevKey !== key && !gameOver) { 
        if (key === 'ArrowRight' && prevKey !== 'ArrowLeft') {
          modifySpeed('right');
          update();
        } else if (key === 'ArrowUp' && prevKey !== 'ArrowDown') {
          modifySpeed('up');
          update();
        } else if (key === 'ArrowLeft' && prevKey !== 'ArrowRight') {
          modifySpeed('left');
          update();
        } else if (key === 'ArrowDown' && prevKey !== 'ArrowUp') {
          modifySpeed('down');
          update();
        }
      }
    })
}

document.querySelector('.restart-btn')
  .addEventListener('click', () => {
    startGame();
  })

document.body.addEventListener('keydown', e => {
  if (gameOver && e.key === 'Enter') {
    startGame();
  }
})