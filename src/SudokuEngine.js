// --- CORE ENGINE ---

/** Fisher–Yates shuffle using the provided RNG (e.g. Mulberry32). */
const shuffleInPlace = (arr, rand) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

/**
 * Clears exactly `count` cells from a full board by walking a shuffled index order.
 * Avoids wasting work on empty cells and avoids unbounded loops from random re-picks.
 */
const removeClues = (board, count, rand) => {
  const indices = Array.from({ length: 81 }, (_, i) => i);
  shuffleInPlace(indices, rand);
  let removed = 0;
  for (let k = 0; k < indices.length && removed < count; k++) {
    const i = indices[k];
    if (board[i] !== 0) {
      board[i] = 0;
      removed++;
    }
  }
};

export const generateSudoku = (diff, seedStr) => {
  // Simple hash for string seed
  let seed = 0;
  if (seedStr) {
    for (let i = 0; i < seedStr.length; i++) {
      seed = (Math.imul(31, seed) + seedStr.charCodeAt(i)) | 0;
    }
  } else {
    seed = Math.random() * 4294967296;
  }

  // Mulberry32
  const seededRand = () => {
    var t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  const b = Array(81).fill(0);
  const check = (idx, n) => {
    const r = Math.floor(idx / 9), c = idx % 9;
    for (let i = 0; i < 9; i++) if (b[r * 9 + i] === n || b[i * 9 + c] === n) return false;
    const sr = Math.floor(r / 3) * 3, sc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[(sr + i) * 9 + (sc + j)] === n) return false;
    return true;
  };
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const fillCompleteGrid = (idx) => {
    if (idx === 81) return true;
    shuffleInPlace(digits, seededRand);
    for (let k = 0; k < 9; k++) {
      const n = digits[k];
      if (check(idx, n)) {
        b[idx] = n;
        if (fillCompleteGrid(idx + 1)) return true;
        b[idx] = 0;
      }
    }
    return false;
  };
  fillCompleteGrid(0);
  const sol = [...b];
  const clues = { 'Easy': 38, 'Medium': 32, 'Hard': 26, 'Expert': 22, 'Master': 18, 'Extreme': 16, 'Daily': 34 }[diff] || 36;
  const cellsToRemove = 81 - clues;
  removeClues(b, cellsToRemove, seededRand);
  return { board: b, solution: sol };
};

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
