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
};

export function writeAutosaveMeta(payload) {
  try {
    localStorage.setItem(STORAGE_KEYS.autosaveMeta, JSON.stringify({ version: 1, ...payload }));
  } catch {
    /* quota / private mode */
  }
}
