import { generateSudoku } from './SudokuEngine.js';

self.onmessage = (e) => {
  const { diff, seedStr } = e.data || {};
  try {
    const result = generateSudoku(diff, seedStr);
    self.postMessage({ ok: true, result });
  } catch (err) {
    self.postMessage({ ok: false, error: err?.message || String(err) });
  }
};
