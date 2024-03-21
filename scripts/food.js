import { snake } from './snake.js';

import { tileWidth, boardTileWidth } from './script.js';

export let foodX;
export let foodY;

export function generateFoodLocation() {
  do {
    foodX = (Math.floor(Math.random() * (boardTileWidth - 2)) + 1)
      * tileWidth;

    if (foodX / tileWidth === 0) {
      console.log('yup');
      foodX += 1;
    }

    foodY = (Math.floor(Math.random() * (boardTileWidth - 2)) + 1)
    * tileWidth;

  } while (foodNotInSnake());
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