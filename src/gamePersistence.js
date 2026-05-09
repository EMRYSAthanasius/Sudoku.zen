/** Debounce helper for LocalStorage writes (reduces main-thread jank). */
export function debounce(fn, ms) {
  let t;
  const debounced = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  debounced.flush = (...args) => {
    clearTimeout(t);
    fn(...args);
  };
  debounced.cancel = () => clearTimeout(t);
  return debounced;
}

export const STORAGE_KEYS = {
  normal: 'LOCAL_STORAGE_NORMAL_V2',
  autosaveMeta: 'SUDOKU_AUTOSAVE_META',
  periodic: 'SUDOKU_PERIODIC_SAVE_V1',
};

export function writeAutosaveMeta(payload) {
  try {
    localStorage.setItem(STORAGE_KEYS.autosaveMeta, JSON.stringify({ version: 1, ...payload }));
  } catch {
    /* quota / private mode */
  }
}

/** Enhanced auto-save with compression and better error handling */
export function saveGameState(key, gameState) {
  try {
    const saveData = {
      ...gameState,
      notes: gameState.notes ? gameState.notes.map(s => Array.from(s)) : [],
      savedAt: Date.now(),
      version: 2
    };
    
    // Try to compress large data by removing unnecessary fields
    if (saveData.solution && saveData.initial) {
      // Only store solution if it differs from initial board
      const hasSolution = saveData.solution.some((val, idx) => val !== saveData.initial[idx]);
      if (!hasSolution) {
        delete saveData.solution;
      }
    }
    
    localStorage.setItem(key, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.warn('Failed to save game state:', error);
    // Try to free up space by removing old saves
    try {
      const keys = Object.keys(localStorage);
      const oldKeys = keys.filter(k => k.includes('LOCAL_STORAGE_') && k !== key);
      if (oldKeys.length > 0) {
        localStorage.removeItem(oldKeys[0]); // Remove oldest save
        return saveGameState(key, gameState); // Retry
      }
    } catch {
      // If cleanup fails, we're out of options
    }
    return false;
  }
}

/** Load game state with validation and migration */
export function loadGameState(key, expectedMode = null) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') {
      return null;
    }
    
    const data = JSON.parse(saved);
    
    // Validate mode if specified
    if (expectedMode && data.gameMode !== expectedMode && data.mode !== expectedMode) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Validate board structure
    if (!data.board || !Array.isArray(data.board) || data.board.length !== 81) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Migrate old save formats
    if (data.version !== 2) {
      // Handle migration from older versions if needed
    }
    
    return {
      ...data,
      notes: data.notes ? data.notes.map(arr => new Set(arr)) : Array.from({ length: 81 }, () => new Set())
    };
  } catch (error) {
    console.warn('Failed to load game state:', error);
    localStorage.removeItem(key);
    return null;
  }
}

/** Auto-save manager for handling periodic saves */
export class AutoSaveManager {
  constructor(saveCallback, interval = 30000) { // Default 30 seconds
    this.saveCallback = saveCallback;
    this.interval = interval;
    this.timer = null;
    this.lastSave = 0;
  }
  
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const now = Date.now();
      if (now - this.lastSave >= this.interval) {
        this.saveCallback();
        this.lastSave = now;
      }
    }, this.interval);
  }
  
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  forceSave() {
    this.saveCallback();
    this.lastSave = Date.now();
  }
}
