import { generateSudoku } from './SudokuEngine.js';

/**
 * Runs puzzle generation off the main thread when Web Workers are available.
 * Falls back to synchronous generation (e.g. tests, very old environments).
 */
export function generateSudokuAsync(diff, seedStr) {
  if (typeof Worker === 'undefined') {
    return Promise.resolve(generateSudoku(diff, seedStr));
  }

  return new Promise((resolve, reject) => {
    let worker;
    let timeoutId;
    try {
      worker = new Worker(new URL('./sudoku.worker.js', import.meta.url), { type: 'module' });
    } catch {
      resolve(generateSudoku(diff, seedStr));
      return;
    }

    const done = (fn) => {
      try {
        worker?.terminate();
      } catch {
        /* ignore */
      }
      if (timeoutId) clearTimeout(timeoutId);
      fn();
    };

    worker.onmessage = (ev) => {
      const { ok, result, error, progress } = ev.data || {};
      if (progress) {
        // Optional: handle progress updates if needed in the future
        return;
      }
      done(() => {
        if (ok) resolve(result);
        else reject(new Error(error || 'Sudoku worker failed'));
      });
    };
    worker.onerror = (e) => {
      done(() => {
        console.warn('Sudoku worker error, falling back to main thread', e);
        resolve(generateSudoku(diff, seedStr));
      });
    };

    // Set a timeout to prevent hanging
    timeoutId = setTimeout(() => {
      done(() => {
        console.warn('Sudoku generation timeout, falling back to main thread');
        resolve(generateSudoku(diff, seedStr));
      });
    }, 5000); // 5 second timeout

    worker.postMessage({ diff, seedStr });
  });
}
