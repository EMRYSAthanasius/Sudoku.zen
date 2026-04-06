const fs = require('fs');

// Mock data
const game = {
  solution: Array(81).fill(1)
};
const newBoard = Array(81).fill(0); // empty board

function checkAndTriggerCompletionsOriginal(newBoard, selIdx) {
  const r = Math.floor(selIdx / 9);
  const c = selIdx % 9;
  const br = Math.floor(r / 3);
  const bc = Math.floor(c / 3);

  let isRowComplete = true;
  for (let i = 0; i < 9; i++) {
    if (newBoard[r * 9 + i] === 0 || newBoard[r * 9 + i] !== game.solution[r * 9 + i]) {
      isRowComplete = false; break;
    }
  }
  let isColComplete = true;
  for (let i = 0; i < 9; i++) {
    if (newBoard[i * 9 + c] === 0 || newBoard[i * 9 + c] !== game.solution[i * 9 + c]) {
      isColComplete = false; break;
    }
  }
  let isBoxComplete = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const idx = (br * 3 + i) * 9 + (bc * 3 + j);
      if (newBoard[idx] === 0 || newBoard[idx] !== game.solution[idx]) {
        isBoxComplete = false; break;
      }
    }
  }
  return { isRowComplete, isColComplete, isBoxComplete };
}

function checkAndTriggerCompletionsOptimized(newBoard, selIdx) {
  const r = Math.floor(selIdx / 9);
  const c = selIdx % 9;
  const br = Math.floor(r / 3);
  const bc = Math.floor(c / 3);

  let isRowComplete = true;
  let isColComplete = true;
  let isBoxComplete = true;

  for (let i = 0; i < 9; i++) {
    if (isRowComplete) {
      const rIdx = r * 9 + i;
      if (newBoard[rIdx] === 0 || newBoard[rIdx] !== game.solution[rIdx]) isRowComplete = false;
    }
    if (isColComplete) {
      const cIdx = i * 9 + c;
      if (newBoard[cIdx] === 0 || newBoard[cIdx] !== game.solution[cIdx]) isColComplete = false;
    }
    if (isBoxComplete) {
      const bIdx = (br * 3 + Math.floor(i / 3)) * 9 + (bc * 3 + (i % 3));
      if (newBoard[bIdx] === 0 || newBoard[bIdx] !== game.solution[bIdx]) isBoxComplete = false;
    }
    if (!isRowComplete && !isColComplete && !isBoxComplete) break;
  }
  return { isRowComplete, isColComplete, isBoxComplete };
}

function runBenchmark() {
  const ITERATIONS = 5000000;

  // Warmup
  for (let i = 0; i < 10000; i++) {
    checkAndTriggerCompletionsOriginal(newBoard, 40);
    checkAndTriggerCompletionsOptimized(newBoard, 40);
  }

  const startOriginal = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) {
    checkAndTriggerCompletionsOriginal(newBoard, 40);
  }
  const endOriginal = process.hrtime.bigint();
  console.log(`Original: ${Number(endOriginal - startOriginal) / 1e6}ms`);

  const startOptimized = process.hrtime.bigint();
  for (let i = 0; i < ITERATIONS; i++) {
    checkAndTriggerCompletionsOptimized(newBoard, 40);
  }
  const endOptimized = process.hrtime.bigint();
  console.log(`Optimized: ${Number(endOptimized - startOptimized) / 1e6}ms`);
}

runBenchmark();
