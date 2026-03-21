// src/utils/SudokuEngine.js

// Board size
const SIZE = 9;
const BOX_SIZE = 3;

// Empty cell value
const EMPTY = 0;

// Helper to shuffle an array
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Check if a number can be placed in a cell
export const isValid = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < SIZE; x++) {
    if (board[row][x] === num && x !== col) return false;
  }
  // Check column
  for (let x = 0; x < SIZE; x++) {
    if (board[x][col] === num && x !== row) return false;
  }
  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[i + startRow][j + startCol] === num && (i + startRow !== row || j + startCol !== col)) {
        return false;
      }
    }
  }
  return true;
};

// Solve the board (backtracking)
const solve = (board) => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === EMPTY) {
        // Try all numbers 1-9
        for (let num = 1; num <= SIZE; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) {
              return true;
            } else {
              board[row][col] = EMPTY; // backtrack
            }
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Fill the board completely to generate a valid solution
const fillBoard = (board) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === EMPTY) {
        const shuffledNumbers = shuffle([...numbers]);
        for (const num of shuffledNumbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
              return true;
            } else {
              board[row][col] = EMPTY; // backtrack
            }
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Count solutions to ensure unique solution
const countSolutions = (board, count = 0) => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === EMPTY) {
        for (let num = 1; num <= SIZE; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            count = countSolutions(board, count);
            board[row][col] = EMPTY;
            if (count > 1) return count;
          }
        }
        return count;
      }
    }
  }
  return count + 1;
};

// Map difficulties to number of clues to remove
const DIFFICULTY_LEVELS = {
  Easy: 30, // 81 - 30 = 51 clues
  Medium: 40,
  Hard: 50,
  Expert: 55,
  Master: 60,
  Extreme: 64 // 81 - 64 = 17 clues (minimum for unique solution)
};

// Remove clues to create a puzzle
const removeClues = (board, difficulty) => {
  const cellsToRemove = DIFFICULTY_LEVELS[difficulty] || 40;
  let removed = 0;

  // Since we want to guarantee the target number of removed clues,
  // we need a robust approach. We'll try a generous number of attempts.
  let attempts = 200;

  while (removed < cellsToRemove && attempts > 0) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);

    if (board[row][col] !== EMPTY) {
      const backup = board[row][col];
      board[row][col] = EMPTY;

      // Check if still unique solution
      const boardCopy = board.map(r => [...r]);
      if (countSolutions(boardCopy) === 1) {
        removed++;
      } else {
        board[row][col] = backup; // Put it back
      }
    }
    attempts--;
  }
};

export const generateSudoku = (difficulty = 'Medium') => {
  // Create empty board
  const solutionBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));

  // Fill completely to get a solution
  fillBoard(solutionBoard);

  // Deep copy for the puzzle
  const puzzleBoard = solutionBoard.map(row => [...row]);

  // Remove clues
  removeClues(puzzleBoard, difficulty);

  // Format into our cell structure
  const puzzle = [];
  const solution = [];

  for (let r = 0; r < SIZE; r++) {
    const puzzleRow = [];
    const solutionRow = [];
    for (let c = 0; c < SIZE; c++) {
      const val = puzzleBoard[r][c];
      const solVal = solutionBoard[r][c];

      puzzleRow.push({
        value: val === EMPTY ? null : val,
        isClue: val !== EMPTY,
        notes: new Set(),
        isError: false, // We'll compute this dynamically when user inputs
      });

      solutionRow.push(solVal);
    }
    puzzle.push(puzzleRow);
    solution.push(solutionRow);
  }

  return { puzzle, solution };
};

// Check if board is complete and correct
export const checkWin = (board, solution) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].value !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
};
