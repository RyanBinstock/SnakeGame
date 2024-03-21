//snakeai.js 
import { boardTileWidth, tileWidth } from './script.js';
import { snake } from './snake.js';
import { foodX, foodY } from './food.js';

//Define the constant for the tile types
const EMPTY = 1;
const FOOD = 2;
const SNAKE_HEAD = 3;
const SNAKE_BODY = 0; // snake body is 1 ?? not sure

//Define a class for a node in the A* alg
class Node {
  constructor(x, y, parent = null) {
    //uses f= g+h which is the logic behind a heuristic later
    //where f is the total cost of the node, g is the distance and h is the heuristic
    this.x = x;
    this.y = y;
    this.parent = null;
    //need to set this too null to note that its the start
    //parent gets updated and helps to find the shortest path later
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }
}

//used to calculate the heuristic between two points being the
//this function needs to run O(1) as it needs to be done multiple times
//don't know if this h is an underestimation will need to try and check this
export function heuristic(node, goal) {
  return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
}

export function isValidMove(x, y, grid) {
  return x >= 0 && x < boardTileWidth && y >= 0 && y < boardTileWidth && grid[y][x] !== SNAKE_BODY;
}



export function generateGrid() {
  let grid = [];

  //initialize grid with all values as 1
  for (let i = 0; i < boardTileWidth; i++) {
    grid.push([]);
    for (let j = 0; j < boardTileWidth; j++) {
      grid[i].push(1);
    }
  }

  //insert food location into grid
  grid[foodY / tileWidth][foodX / tileWidth] = 2;

  //insert head of the snake into grid
  grid[snake[0].snakeY / tileWidth][snake[0].snakeX / tileWidth] = 3;

  //insert body of snake into the grid
  for (let i = 1; i < snake.length; i++) {
    grid[snake[i].snakeY / tileWidth][snake[i].snakeX / tileWidth] = 0;
  }

  return grid;
}


export function findNextMove() {
  // generate grid 
  const grid = generateGrid();
  const start = new Node(snake[0].snakeX / tileWidth, snake[0].snakeY / tileWidth);
  const end = new Node(foodX / tileWidth, foodY / tileWidth);

  let openList = [];
  let closedList = [];

  //push the start node to the open list
  openList.push(start);

  while (openList.length > 0) {
    let currentNode = openList[0];
    let currentIndex = 0;

    // going through the list at a specfic node , and index at f 
    // find the lowest f value
    openList.forEach((node, index) => {
      if (node.f < currentNode.f) {
        // let current node equal to node with the lowest f value
        //have to update index too 
        currentNode = node;
        currentIndex = index;
      }
    });

    //remove current node from the open list add it to close list
    openList.splice(currentIndex, 1);
    closedList.push(currentNode);

    //found goal when current node = end.
    if (currentNode.x === end.x && currentNode.y === end.y) {
      let path = []; //make an array called path to backtrack.
      let current = currentNode;

      while (current !== null) {
        //back track until null
        path.push(current);
        current = current.parent;
      }
      //next move based on the second node in path
      return { x: path[path.length - 2].x, y: path[path.length - 2].y };
    }
    
    //generate children
    let children = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];//right, left, down, up

    directions.forEach(dir => {
      const newX = currentNode.x + dir[0];
      const newY = currentNode.y + dir[1];
      if (isValidMove(newX, newY, grid)) {
        const newNode = new Node(newX, newY, currentNode);
        newNode.parent = currentNode;
        children.push(newNode);
      }
    });

    children.forEach(child => {
      // Child is on the closed list
      if (closedList.find(node => node.x === child.x && node.y === child.y)) {
        return;
      }

      // Create the f, g, and h values
      child.g = currentNode.g + 1;
      child.h = heuristic(child, end);
      child.f = child.g + child.h;

      // Child is already in the open list
      const openNode = openList.find(node => node.x === child.x && node.y === child.y);
      if (openNode && child.g >= openNode.g) {
        return;
      }

      // Add the child to the open list
      openList.push(child);
    });
  }
  
  return null;
}