import { snake } from './snake.js';
import { findNextMove } from './snakeai.js';
import { tileWidth, boardTileWidth } from './script.js';

export let foodX;
export let foodY;

export function generateFoodLocation() {
  let count = 0
  do {
    foodX = (Math.floor(Math.random() * (boardTileWidth - 2)) + 1)
      * tileWidth;


    foodY = (Math.floor(Math.random() * (boardTileWidth - 2)) + 1)
    * tileWidth;

    count++;

    if (count > 1000) {
      console.log(count);
      break;
    }
  } while (foodNotInSnake() || closeToSnake() || findNextMove() === null);
}

export function foodNotInSnake() {
  let result = false;

  for (let i = 0; i < snake.length && !result; i++) {
    if (foodX == snake[i].snakeX 
          && foodY === snake[i].snakeY) {
          result = true;
        }
  }

  return result;
}

export function closeToSnake() {
  let dist;

  for (let i = 0; i < snake.length; i++) {
    dist = Math.sqrt(Math.pow(foodX / tileWidth - snake[i].snakeX / tileWidth, 2) + Math.pow(foodY / tileWidth - snake[i].snakeY / tileWidth, 2));

    if (dist === 1) {
      return true;
    }
  }

  return false;
}