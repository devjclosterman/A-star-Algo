// Node class: Represents each cell or node in the grid, storing its position,
//  cost values (g, h, and f), and its neighbors.
// addNeighbors: Adds adjacent nodes to each node.
// heuristic: A function to estimate the distance between
//  two points (Manhattan distance in this case).
// aStar: The A* algorithm itself, which traverses nodes to find the shortest path based on the f score (f = g + h).

class Node {
    constructor(x, y, isWall = false) {
        this.x = x;
        this.y = y;
        this.isWall = isWall;
        this.g = 0; //Cost from start to current node 
        this.h = 0; //Huerustic cost from current node to end'
        this.f = 0; //Total cost: g + h
        this.neighbors = [];
        this.previous = null;
    }

    addNeighbors(grid) {
        const { x,y } = this;
        if (x < grid.length - 1) this.neighbors.push(grid[x +1][y]);
        if (x > 0) this.neighbors.push(grid[x - 1][y]);
        if (y < grid[0].length - 1) this.neighbors.push(grid[x][y+ 1]);
        if (y > 0) this.neighbors.push(grid[x][y - 1]);
     }
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); 
}

function aStar(startNode, endNode, grid) {
    let openSet = [];
    let closedSet = [];
    openSet.push(startNode);

    while (openSet.length > 0) {
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        let current = openSet[lowestIndex];

        if (current === endNode) {
            let path = [];
            let temp = current;
            while (temp.previous) {
                path.push(temp);
                temp = temp.previous;
            }
            return path.reverse();
        }

        openSet = openSet.filter((node) => node !== current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.isWall) {
                let tentative_g = current.g + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentative_g >= neighbor.g) {
                    continue;
                }

                neighbor.g = tentative_g;
                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
    }

    return []; // No path found
}

// Example usage:

// Create a grid
const rows = 5;
const cols = 5;
let grid = new Array(rows);
for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    for (let j = 0; j < cols; j++) {
        grid[i][j] = new Node(i, j, false); // Set some nodes to isWall = true to represent obstacles
    }
}

// Add neighbors to each node
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbors(grid);
    }
}

// Set start and end nodes
let startNode = grid[0][0];
let endNode = grid[rows - 1][cols - 1];

// Run the A* algorithm
let path = aStar(startNode, endNode, grid);

console.log(path); // This will output the path from start to end node, if found