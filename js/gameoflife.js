function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((c) => same(c, cell));
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  if (state.length === 0) return { topRight: [0, 0], bottomLeft: [0, 0] };

  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  state.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;

    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  return {
    topRight: [maxX, maxY],
    bottomLeft: [minX, minY],
  };
};

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);
  const [maxX, maxY] = topRight;
  const [minX, minY] = bottomLeft;

  let str = '';
  for (let y = maxY; y >= minY; y--) {
    for (let x = minX; x <= maxX; x++) {
      str = `${str}${printCell([x, y], state)} `;
    }
    str = `${str}\n`;
  }

  return str;
};

const getNeighborsOf = ([x, y]) => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const getLivingNeighbors = (cell, state) => {
  const neighbors = getNeighborsOf(cell);
  return neighbors.filter((n) => contains.call(state, n));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);
  if (livingNeighbors.length === 3) return true;

  const isAlive = contains.call(state, cell);
  if (isAlive && livingNeighbors.length === 2) return true;

  return false;
};

const calculateNext = (state) => {
  const { topRight, bottomLeft } = corners(state);

  let result = [];
  for (let y = topRight[1] + 1; y > bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x < topRight[0] + 1; x++) {
      result = result.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }

  return result;
};

const iterate = (state, iterations) => {
  const states = [state];
  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length - 1]));
  }
  return states;
};

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach((r) => console.log(printCells(r)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log('Usage: node js/gameoflife.js rpentomino 50');
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
