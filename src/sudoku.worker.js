import { generateSudoku } from './SudokuEngine.js';

self.onmessage = (e) => {
  const { diff, seedStr } = e.data || {};
  
  // Validate inputs
  if (!diff || typeof diff !== 'string') {
    self.postMessage({ ok: false, error: 'Invalid difficulty parameter' });
    return;
  }
  
  try {
    // Send progress update
    self.postMessage({ progress: 'starting' });
    
    const result = generateSudoku(diff, seedStr);
    
    // Validate result
    if (!result || !result.board || !result.solution || result.board.length !== 81 || result.solution.length !== 81) {
      throw new Error('Invalid puzzle generated');
    }
    
    self.postMessage({ ok: true, result });
  } catch (err) {
    console.error('Worker generation error:', err);
    self.postMessage({ ok: false, error: err?.message || 'Puzzle generation failed' });
  }
};
