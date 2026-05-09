import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Icons } from './Icons';
import { MONTHS, MONTHS_SHORT } from './SudokuEngine';
import { generateSudokuAsync } from './sudokuGeneration';
import { debounce, writeAutosaveMeta, STORAGE_KEYS, saveGameState, loadGameState, AutoSaveManager } from './gamePersistence';
import { Home } from './Home';
import { DailyChallenges } from './DailyChallenges';
import { Game } from './Game';
import { VictoryView } from './VictoryView';
import { VictoryModal } from './VictoryModal';
import { MeView } from './MeView';
import { playSound, playHaptic } from './AudioHaptics';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, game, daily, victory
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [best, setBest] = useState(0);
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('sudokuUserStats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { Easy: 0, Medium: 0, Hard: 0, Expert: 0, Master: 0, Extreme: 0 };
  });
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0 });
  const [victoryData, setVictoryData] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [picker, setPicker] = useState(false);

  const [rewardAnimations, setRewardAnimations] = useState([]);
  const [scoreAnimations, setScoreAnimations] = useState([]);
  const [cMonth, setCMonth] = useState(new Date().getMonth());
  const [cDay, setCDay] = useState(new Date().getDate());
  const [game, setGame] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const gameRef = useRef(null);
  const errRef = useRef(0);
  const timeRef = useRef(0);
  const autoSaveManagerRef = useRef(null);
  
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    // Only bind if calculateWin is defined
    window.__DEBUG_WIN__ = () => {
      if (game && game.solution) {
        calculateWin(game.solution, 1000);
      }
    };
  }); // removing dep array to ensure it captures the latest calculateWin definition

  const defaultSettings = {
    sounds: true, vibration: true, autoLock: true, timer: true,
    animatedScoring: true, statisticsMessage: true, smartHints: false, numberFirstInput: false, mistakeLimit: true,
    autoCheckMistakes: true, highlightDuplicates: true, highlightAreas: true, highlightIdenticalNumbers: true, hideUsedNumbers: false, autoRemoveNotes: true, highlightCombos: true
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('SUDOKU_SETTINGS');
    if (saved) {
      try { return { ...defaultSettings, ...JSON.parse(saved) }; } catch (e) {}
    }
    return defaultSettings;
  });

  const loadFromStorage = (key, mode) => {
    return loadGameState(key, mode);
  };

  const [normalGameState, setNormalGameState] = useState(() => loadFromStorage(STORAGE_KEYS.normal, 'normal'));
  const [history, setHistory] = useState([]);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState(0);
  const [time, setTime] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const tRef = useRef(null);

  // Auto-resume from periodic save on page load
  useEffect(() => {
    const loadPeriodicSave = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.periodic);
        if (!saved || saved === 'undefined' || saved === 'null') {
          return null;
        }
        
        const data = JSON.parse(saved);
        
        // Validate the periodic save data
        if (!data || !data.board || !Array.isArray(data.board) || data.board.length !== 81) {
          localStorage.removeItem(STORAGE_KEYS.periodic);
          return null;
        }
        
        // Check if save is recent (within last 24 hours)
        const savedAt = data.savedAt || 0;
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - savedAt > maxAge) {
          localStorage.removeItem(STORAGE_KEYS.periodic);
          return null;
        }
        
        return {
          ...data,
          notes: data.notes ? data.notes.map(arr => new Set(arr)) : Array.from({ length: 81 }, () => new Set())
        };
      } catch (error) {
        console.warn('Failed to load periodic save:', error);
        localStorage.removeItem(STORAGE_KEYS.periodic);
        return null;
      }
    };

    const periodicSave = loadPeriodicSave();
    
    if (periodicSave && currentView === 'home' && !game) {
      // Auto-resume the game from periodic save
      setGame(null); // Memory flush
      setTimeout(() => {
        setGame(periodicSave);
        setErr(periodicSave.err || 0);
        setTime(periodicSave.time || 0);
        setHistory([]);
        setSel(null);
        setNotesMode(false);
        setShowGameOver(false);
        setCurrentViewWithTransition('game');
        setPicker(false);
        
        // Clear the periodic save after successful resume
        localStorage.removeItem(STORAGE_KEYS.periodic);
      }, 0);
    }
  }, [currentView, game]);

  useEffect(() => {
    errRef.current = err;
  }, [err]);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  const [pulseNumbers, setPulseNumbers] = useState(new Set());
  const prevCountsRef = useRef({});

  const numberCounts = useMemo(() => {
    const counts = {};
    for(let i=1; i<=9; i++) counts[i] = 0;
    if (game && game.board) {
      game.board.forEach((val, idx) => {
        if (val !== 0 && val === game.solution[idx]) counts[val]++;
      });
    }
    return counts;
  }, [game]);

  useEffect(() => {
    if (!game) {
      prevCountsRef.current = {};
      return;
    }
    const newPulses = new Set(pulseNumbers);
    let changed = false;
    for (let i = 1; i <= 9; i++) {
      const prev = prevCountsRef.current[i] || 0;
      const curr = numberCounts[i];
      if (curr === 9 && prev < 9) {
        newPulses.add(i);
        changed = true;
      } else if (curr < 9 && prev === 9) {
        newPulses.delete(i);
        changed = true;
      }
    }
    if (changed) {
      setPulseNumbers(newPulses);
      // Clear pulses after animation
      setTimeout(() => {
        setPulseNumbers(prev => {
          const next = new Set(prev);
          for (let i = 1; i <= 9; i++) {
            if (numberCounts[i] === 9) next.delete(i);
          }
          return next;
        });
      }, 500);
    }
    prevCountsRef.current = numberCounts;
  }, [numberCounts, game]);

  useEffect(() => {
    if (currentView === 'game' && game) tRef.current = setInterval(() => setTime(t => t + 1), 1000);
    else clearInterval(tRef.current);
    return () => clearInterval(tRef.current);
  }, [currentView, game]);

  const saveDailyProgress = useCallback((gameData, status) => {
    if (!gameData?.isDaily || gameData.day == null || gameData.month == null) return;
    const y = gameData.year ?? new Date().getFullYear();
    const paddedMonth = String(gameData.month + 1).padStart(2, '0');
    const paddedDay = String(gameData.day).padStart(2, '0');
    const key = `LOCAL_STORAGE_DAILY_V2_${y}-${paddedMonth}-${paddedDay}`;

    const saveData = {
      status,
      board: gameData.board,
      initial: gameData.initial,
      notes: gameData.notes.map(s => Array.from(s)),
      solution: gameData.solution,
      err: gameData.err ?? 0,
      time: gameData.time ?? 0,
      diff: gameData.diff,
      score: gameData.score || 0,
      isDaily: true,
      gameMode: 'daily',
      day: gameData.day,
      month: gameData.month,
      year: y,
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(key, JSON.stringify(saveData));
      writeAutosaveMeta({ mode: 'daily', updatedAt: Date.now(), dailyKey: key, status });
    } catch (e) {
      console.warn('Daily autosave failed', e);
    }
  }, []);

  const persistActiveGame = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    const e = errRef.current;
    const tm = timeRef.current;
    if (!g.isDaily) {
      const toSave = {
        ...g,
        err: e,
        time: tm,
        gameMode: 'normal',
      };
      const success = saveGameState(STORAGE_KEYS.normal, toSave);
      if (success) {
        setNormalGameState(toSave);
        writeAutosaveMeta({ mode: 'normal', updatedAt: Date.now() });
      }
    } else {
      saveDailyProgress({ ...g, err: e, time: tm }, 'in-progress');
    }
  }, [saveDailyProgress]);

  const debouncedPersist = useMemo(() => debounce(persistActiveGame, 220), [persistActiveGame]);

  // Clear periodic save when game is completed or user starts new game
  const clearPeriodicSave = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.periodic);
    } catch (error) {
      console.warn('Failed to clear periodic save:', error);
    }
  }, []);

  useEffect(() => {
    if (game) debouncedPersist();
  }, [game, debouncedPersist]);

  useEffect(() => {
    if (game && !autoSaveManagerRef.current) {
      autoSaveManagerRef.current = new AutoSaveManager(persistActiveGame, 30000); // 30 second interval
      autoSaveManagerRef.current.start();
    } else if (!game && autoSaveManagerRef.current) {
      autoSaveManagerRef.current.stop();
      autoSaveManagerRef.current = null;
    }
    
    return () => {
      if (autoSaveManagerRef.current) {
        autoSaveManagerRef.current.stop();
      }
    };
  }, [game, persistActiveGame]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (game && autoSaveManagerRef.current) {
        autoSaveManagerRef.current.forceSave();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [game]);

  // Periodic auto-save every 5 seconds
  useEffect(() => {
    if (!game) return;

    const intervalId = setInterval(() => {
      const g = gameRef.current;
      if (!g) return;
      
      const e = errRef.current;
      const tm = timeRef.current;
      
      const periodicSaveData = {
        board: g.board,
        notes: g.notes.map(s => Array.from(s)),
        solution: g.solution,
        initial: g.initial,
        diff: g.diff,
        isDaily: g.isDaily,
        day: g.day,
        month: g.month,
        year: g.year,
        score: g.score,
        err: e,
        time: tm,
        savedAt: Date.now(),
      };

      try {
        localStorage.setItem(STORAGE_KEYS.periodic, JSON.stringify(periodicSaveData));
      } catch (error) {
        console.warn('Periodic auto-save failed:', error);
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(intervalId);
  }, [game]);

  useEffect(() => {
    const flush = () => {
      debouncedPersist.flush();
      persistActiveGame();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      debouncedPersist.cancel();
    };
  }, [debouncedPersist, persistActiveGame]);

  const setCurrentViewWithTransition = (view) => {
    if (currentView === 'game' && view !== 'game' && view !== 'me' && game) {
      persistActiveGame();
      setGame(null);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 200);
  };

  const loadDailyProgress = (year, month, day) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const key = `LOCAL_STORAGE_DAILY_V2_${year}-${paddedMonth}-${paddedDay}`;
    const loaded = loadFromStorage(key, 'daily');
    return loaded && loaded.status ? loaded : null;
  };

  const start = async (diff, isDaily = false, d = null, m = null) => {
    // Clear periodic save when starting a new game
    clearPeriodicSave();
    
    const day = d || cDay;
    const monthToUse = m !== null ? m : cMonth;
    const currentYear = new Date().getFullYear();

    if (!isDaily) {
      const detailedStats = JSON.parse(localStorage.getItem('sudokuDetailedStats') || '{}');
      if (!detailedStats[diff]) detailedStats[diff] = {};
      detailedStats[diff].gamesStarted = (detailedStats[diff].gamesStarted || 0) + 1;
      localStorage.setItem('sudokuDetailedStats', JSON.stringify(detailedStats));
    }

    if (isDaily) {
      const realDate = new Date();
      const targetDate = new Date(currentYear, monthToUse, day);
      const isFuture = targetDate > realDate &&
                       !(targetDate.getFullYear() === realDate.getFullYear() &&
                         targetDate.getMonth() === realDate.getMonth() &&
                         targetDate.getDate() === realDate.getDate());
      if (isFuture) {
        return;
      }
    }

    if (isDaily) {
      const saved = loadDailyProgress(currentYear, monthToUse, day);
      if (saved && saved.status === 'in-progress') {
        setGame({
          diff: saved.diff,
          isDaily: true,
          day,
          month: monthToUse,
          year: saved.year ?? currentYear,
          board: saved.board,
          initial: saved.initial,
          solution: saved.solution,
          notes: saved.notes.map(arr => new Set(arr)),
          score: saved.score || 0,
        });
        setErr(saved.err || 0);
        setTime(saved.time || 0);
        setHistory([]);
        setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
        return;
      }
    }

    const seedStr = isDaily ? `${currentYear}-${monthToUse}-${day}` : null;
    setIsGenerating(true);
    try {
      const { board, solution } = await generateSudokuAsync(diff, seedStr);
      const newGame = {
        diff,
        isDaily,
        day,
        month: monthToUse,
        ...(isDaily ? { year: currentYear } : {}),
        board,
        initial: board.map(x => x !== 0),
        solution,
        notes: Array.from({ length: 81 }, () => new Set()),
        score: 0,
      };

      setGame(null);
      setTimeout(() => {
        setGame(newGame);
        if (!isDaily) {
          setNormalGameState(newGame);
        }
        setHistory([]);
        setErr(0); setTime(0); setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
      }, 0);
    } catch (e) {
      console.error('Puzzle generation failed', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const resumeNormalGame = () => {
    if (normalGameState) {
      // playSound('continue', settings); // Removing this manual call because the global pointerdown handler will trigger a 'click' sound, avoiding double sounds. Wait, continue might be a specific sound we want instead of click. Let's keep it but mark the button in Home with data-game-input.
      playSound('continue', settings);
      setGame(null); // Memory Flush
      setTimeout(() => {
        setGame({
          ...normalGameState,
          notes: normalGameState.notes ? normalGameState.notes.map(arr => new Set(arr)) : Array.from({ length: 81 }, () => new Set())
        });
        setErr(normalGameState.err || 0);
        setTime(normalGameState.time || 0);
        setHistory([]);
        setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game');
      }, 0);
    }
  };

  const pushHistory = () => {
    setHistory(h => [...h, { board: [...game.board], notes: game.notes.map(n => new Set(n)) }]);
  };

  const checkAndTriggerCompletions = (newBoard, selIdx) => {
    if (!game) return;
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

    const newAnims = [];
    if (isRowComplete) newAnims.push({ id: Date.now() + '-row', type: 'row', index: r });
    if (isColComplete) newAnims.push({ id: Date.now() + '-col', type: 'col', index: c });
    if (isBoxComplete) newAnims.push({ id: Date.now() + '-box', type: 'box', br, bc });

    if (newAnims.length > 0) {
      playHaptic('success', settings);
      playSound('success', settings);
      setRewardAnimations(prev => [...prev, ...newAnims]);
      setTimeout(() => {
        setRewardAnimations(prev => prev.filter(anim => !newAnims.find(na => na.id === anim.id)));
      }, 800);
    }

    return newAnims.length;
  };

  const triggerScoreAnimation = (idx, scoreAmt) => {
    const id = Date.now() + '-' + Math.random();
    setScoreAnimations(prev => [...prev, { id, idx, score: scoreAmt }]);
    setTimeout(() => {
      setScoreAnimations(prev => prev.filter(anim => anim.id !== id));
    }, 600);
  };

  useEffect(() => {
    localStorage.setItem('sudokuUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const calculateWin = (currentBoard, finalScore) => {
    // Clear periodic save on game completion
    clearPeriodicSave();
    
    const completion = finalScore;
    const speedBonus = Math.max(0, 2000 - time * 2);
    const multiplier = { Easy: 1, Medium: 1.5, Hard: 2.5, Expert: 3.5, Master: 5, Extreme: 10 }[game.diff] || 1;
    const total = Math.floor((completion + speedBonus) * multiplier);

    const newStats = {
      today: stats.today + total,
      week: stats.week + total,
      month: stats.month + total,
    };

    if (game.isDaily) {
      saveDailyProgress({ ...game, board: currentBoard, score: finalScore, err, time }, 'completed');

      const realDate = new Date();
      const currentYear = realDate.getFullYear();

      // Determine the next day to play
      let nextDay = game.day + 1;
      let nextMonth = game.month;
      const daysInMonth = new Date(currentYear, game.month + 1, 0).getDate();

      if (nextDay > daysInMonth) {
        nextDay = 1;
        nextMonth = game.month + 1;
        if (nextMonth > 11) {
            // Let's cap at current year's end for simplicity, or we could handle year rollover
            // but the current daily generation doesn't handle year rollover perfectly yet.
            nextMonth = 0;
        }
      }

      const targetNextDate = new Date(currentYear, nextMonth, nextDay);
      // Ensure we truncate the realDate to just the date, or simply compare year/month/date
      const isNextDayUnlocked = targetNextDate <= realDate ||
                                (targetNextDate.getFullYear() === realDate.getFullYear() &&
                                 targetNextDate.getMonth() === realDate.getMonth() &&
                                 targetNextDate.getDate() === realDate.getDate());

      setVictoryData({
        total,
        completion,
        speedBonus,
        multiplier,
        diff: game.diff,
        initial: game.initial,
        board: currentBoard,
        isDaily: true,
        day: game.day,
        month: game.month,
        nextDayUnlocked: isNextDayUnlocked,
        nextDayToPlay: nextDay,
        nextMonthToPlay: nextMonth,
        ...newStats
      });

      setGame(null);
      playSound('victory', settings);
      playHaptic('victory', settings);
      setShowVictoryModal(true);
    } else {
      // Dynamic scoring
      const detailedStats = JSON.parse(localStorage.getItem('sudokuDetailedStats') || '{}');
      const dStats = detailedStats[game.diff] || { gamesStarted: 1 };

      dStats.gamesWon = (dStats.gamesWon || 0) + 1;
      if (err === 0) dStats.noMistakes = (dStats.noMistakes || 0) + 1;
      dStats.totalTime = (dStats.totalTime || 0) + time;

      if (!dStats.bestTime || time < dStats.bestTime) dStats.bestTime = time;

      if (!dStats.bestScoreToday || total > dStats.bestScoreToday) dStats.bestScoreToday = total;
      if (!dStats.bestScoreWeek || total > dStats.bestScoreWeek) dStats.bestScoreWeek = total;
      if (!dStats.bestScoreMonth || total > dStats.bestScoreMonth) dStats.bestScoreMonth = total;
      if (!dStats.bestScoreAllTime || total > dStats.bestScoreAllTime) dStats.bestScoreAllTime = total;

      dStats.currentStreak = (dStats.currentStreak || 0) + 1;
      if (!dStats.bestStreak || dStats.currentStreak > dStats.bestStreak) dStats.bestStreak = dStats.currentStreak;

      detailedStats[game.diff] = dStats;
      localStorage.setItem('sudokuDetailedStats', JSON.stringify(detailedStats));

      setBest(p => Math.max(p, total));
      setUserStats(p => ({ ...p, [game.diff]: (p[game.diff] || 0) + 1 }));
      setStats(newStats);

      setVictoryData({
        total,
        completion,
        speedBonus,
        multiplier,
        diff: game.diff,
        initial: game.initial,
        board: currentBoard,
        ...newStats
      });
      setGame(null);
      playSound('victory', settings);
      playHaptic('victory', settings);
      setShowVictoryModal(true);
    }
  };

  const handleInput = (n) => {
    if (sel === null || !game || game.initial[sel]) {
      // Still provide haptic/audio feedback for dead clicks so buttons aren't totally silent
      playSound('click', settings);
      playHaptic('tap', settings);
      return;
    }

    if (notesMode && n !== 0) {
      playSound('input', settings);
      playHaptic('input', settings);
      pushHistory();
      const next = [...game.notes];
      if (next[sel].has(n)) next[sel].delete(n); else next[sel].add(n);
      setGame({ ...game, notes: next });
    } else {
      const nextB = [...game.board];
      if (n === 0) {
        if (nextB[sel] !== 0) {
          playSound('input', settings);
          playHaptic('input', settings);
          pushHistory();
          nextB[sel] = 0;
          setGame({ ...game, board: nextB });
        }
        return;
      }
      if (nextB[sel] === n) return;
      pushHistory();
      nextB[sel] = n;

      if (n !== game.solution[sel]) {
        playSound('mistake', settings);
        playHaptic('mistake', settings);
        setErr(prev => {
          const nextErr = prev + 1;
          if (settings.mistakeLimit && nextErr >= 3) {
             setShowGameOver(true);
             if (!game.isDaily) {
               const detailedStats = JSON.parse(localStorage.getItem('sudokuDetailedStats') || '{}');
               if (detailedStats[game.diff]) {
                 detailedStats[game.diff].currentStreak = 0;
                 localStorage.setItem('sudokuDetailedStats', JSON.stringify(detailedStats));
               }
             }
             return 3;
          }
          return nextErr;
        });
      } else {
        playSound('input', settings);
        playHaptic('input', settings);
        const nN = [...game.notes]; nN[sel].clear();

        if (settings.autoRemoveNotes) {
          const r = Math.floor(sel / 9);
          const c = sel % 9;
          const br = Math.floor(r / 3);
          const bc = Math.floor(c / 3);
          for (let i = 0; i < 9; i++) {
            const rIdx = r * 9 + i;
            const cIdx = i * 9 + c;
            const boxIdx = (br * 3 + Math.floor(i / 3)) * 9 + (bc * 3 + (i % 3));
            nN[rIdx].delete(n);
            nN[cIdx].delete(n);
            nN[boxIdx].delete(n);
          }
        }

        // Calculate Combo Score
        const r = Math.floor(sel / 9);
        const c = sel % 9;
        const br = Math.floor(r / 3);
        const bc = Math.floor(c / 3);
        const seenIdx = new Set();
        let preFilledCount = -1; // -1 to not count the newly placed cell
        for (let i = 0; i < 9; i++) {
          const rIdx = r * 9 + i;
          const cIdx = i * 9 + c;
          const boxIdx = (br * 3 + Math.floor(i / 3)) * 9 + (bc * 3 + (i % 3));
          if (!seenIdx.has(rIdx) && nextB[rIdx] !== 0) { seenIdx.add(rIdx); preFilledCount++; }
          if (!seenIdx.has(cIdx) && nextB[cIdx] !== 0) { seenIdx.add(cIdx); preFilledCount++; }
          if (!seenIdx.has(boxIdx) && nextB[boxIdx] !== 0) { seenIdx.add(boxIdx); preFilledCount++; }
        }

        let moveScore = 15 + Math.max(0, preFilledCount) * 5;
        const completionsCount = checkAndTriggerCompletions(nextB, sel);

        let bonus = 0;
        if (completionsCount === 1) bonus = 200;
        else if (completionsCount === 2) bonus = 400;
        else if (completionsCount === 3) bonus = 600;

        const totalMoveScore = moveScore + bonus;
        const nextScore = (game.score || 0) + totalMoveScore;

        triggerScoreAnimation(sel, totalMoveScore);

        if (nextB.every((x, i) => x === game.solution[i])) {
          calculateWin(nextB, nextScore);
          return;
        }
        setGame({ ...game, board: nextB, score: nextScore });
        return;
      }
      setGame({ ...game, board: nextB });
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    playHaptic('undo', settings);
    playSound('undo', settings);
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    const nextGame = { ...game, board: last.board, notes: last.notes };
    setGame(nextGame);
  };

  const hint = () => {
    if (!game) return;
    // Find an empty or incorrect cell
    const emptyOrIncorrect = game.board.findIndex((val, idx) => !game.initial[idx] && val !== game.solution[idx]);
    if (emptyOrIncorrect !== -1) {
      playSound('input', settings);
      playHaptic('pencil', settings);
      pushHistory();
      const nextB = [...game.board];
      nextB[emptyOrIncorrect] = game.solution[emptyOrIncorrect];

      const nN = [...game.notes];
      nN[emptyOrIncorrect].clear();

      // Calculate Combo Score for Hint
      const r = Math.floor(emptyOrIncorrect / 9);
      const c = emptyOrIncorrect % 9;
      const br = Math.floor(r / 3);
      const bc = Math.floor(c / 3);
      const seenIdx = new Set();
      let preFilledCount = -1;
      for (let i = 0; i < 9; i++) {
        const rIdx = r * 9 + i;
        const cIdx = i * 9 + c;
        const boxIdx = (br * 3 + Math.floor(i / 3)) * 9 + (bc * 3 + (i % 3));
        if (!seenIdx.has(rIdx) && nextB[rIdx] !== 0) { seenIdx.add(rIdx); preFilledCount++; }
        if (!seenIdx.has(cIdx) && nextB[cIdx] !== 0) { seenIdx.add(cIdx); preFilledCount++; }
        if (!seenIdx.has(boxIdx) && nextB[boxIdx] !== 0) { seenIdx.add(boxIdx); preFilledCount++; }
      }

      let moveScore = 15 + Math.max(0, preFilledCount) * 5;
      const completionsCount = checkAndTriggerCompletions(nextB, emptyOrIncorrect);

      let bonus = 0;
      if (completionsCount === 1) bonus = 200;
      else if (completionsCount === 2) bonus = 400;
      else if (completionsCount === 3) bonus = 600;

      const totalMoveScore = moveScore + bonus;
      const nextScore = (game.score || 0) + totalMoveScore;

      triggerScoreAnimation(emptyOrIncorrect, totalMoveScore);

      if (nextB.every((x, i) => x === game.solution[i])) {
        calculateWin(nextB, nextScore);
        return;
      }

      setGame({ ...game, board: nextB, notes: nN, score: nextScore });
      setSel(emptyOrIncorrect);
    }
  };

  const fmtTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSecondChance = () => {
    setErr(2);
    setShowGameOver(false);
  };

  const handleNewGame = () => {
    clearPeriodicSave();
    setShowGameOver(false);
    setGame(null);
    setCurrentViewWithTransition('home');
    setTimeout(() => setPicker(true), 300);
  };

  const calendarDays = useMemo(() => {
    const realDateObj = new Date();
    const currentYear = realDateObj.getFullYear();
    const currentMonth = realDateObj.getMonth();
    const currentDate = realDateObj.getDate();

    const total = new Date(currentYear, cMonth + 1, 0).getDate();
    const startIdx = new Date(currentYear, cMonth, 1).getDay();
    const arr = [];

    for (let i = 0; i < startIdx; i++) arr.push(<div key={`e-${i}`} className="h-10" />);

    for (let d = 1; d <= total; d++) {
      const progress = loadDailyProgress(currentYear, cMonth, d);
      const isCompleted = progress?.status === 'completed';
      const isInProgress = progress?.status === 'in-progress';
      const isToday = d === currentDate && cMonth === currentMonth;

      const targetDate = new Date(currentYear, cMonth, d);
      const isFuture = targetDate > realDateObj && !isToday;

      let percent = 0;
      if (isInProgress && progress.board) {
        const filled = progress.board.filter(v => v !== 0).length;
        percent = (filled / 81) * 100;
      }

      arr.push(
        <button
          key={d}
          onClick={() => {
            if (isFuture) {
              alert(`Unlocks on ${targetDate.toLocaleDateString()}`);
            } else {
              setCDay(d);
              if (progress?.status === 'in-progress') {
                start('Daily', true, d);
              }
            }
          }}
          className={`relative h-11 w-11 flex items-center justify-center rounded-full text-base transition-all
            ${isFuture ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}
            ${cDay === d && !isFuture ? 'border-[3px] border-[color:var(--mg-gold-bright)] text-[color:var(--mg-honey)] font-bold shadow-sm' : 'text-[color:var(--mg-cream)]'}
            ${isToday && cDay !== d ? 'text-[color:var(--mg-gold-bright)] font-bold' : ''}
            ${isCompleted ? 'bg-[color:rgba(201,162,39,0.22)] text-[color:var(--mg-cream)]' : ''}
            ${isInProgress && cDay !== d ? 'text-[color:var(--mg-cream)]' : ''}
          `}
        >
          {isToday && (
            <div className="absolute inset-0 rounded-full border-2 border-[color:var(--mg-gold-bright)] animate-ping opacity-30 pointer-events-none" />
          )}

          {isInProgress && !isCompleted && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" fill="none" stroke="var(--mg-ink)" strokeWidth="2" />
              <circle
                cx="22" cy="22" r="20" fill="none" stroke="var(--mg-gold-bright)" strokeWidth="2"
                strokeDasharray={`${(percent * 125.6) / 100} 125.6`}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
          )}

          <span className="z-10">{d}</span>

          {isCompleted && (
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[color:var(--mg-gold-bright)] rounded-full border-2 border-[color:var(--mg-void)] flex items-center justify-center">
              <svg viewBox="0 0 10 10" fill="none" stroke="var(--mg-ink)" strokeWidth="2" strokeLinecap="round" className="w-1.5 h-1.5">
                <polyline points="2 5 4 7 8 3" />
              </svg>
            </div>
          )}

          {isToday && !isCompleted && (
            <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[color:var(--mg-gold-bright)] rounded-full border-2 border-[color:var(--mg-void)]" />
          )}
        </button>
      );
    }
    return arr;
  }, [cMonth, cDay]);

  useEffect(() => {
    const handleGlobalInteraction = (e) => {
      const target = e.target.closest('button, .cursor-pointer');
      // If the target is the numpad or grid, we will handle sounds inline to prevent double-firing and ensure gesture compliance
      if (target && !target.hasAttribute('data-game-input')) {
        playSound('click', settings);
        playHaptic('tap', settings);
      }
    };

    document.addEventListener('pointerdown', handleGlobalInteraction);
    return () => document.removeEventListener('pointerdown', handleGlobalInteraction);
  }, [settings]);

  return (
    <div className="mg-app-shell min-h-screen flex flex-col select-none overflow-hidden relative">
      {isGenerating ? (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-[color:rgba(5,3,10,0.72)] backdrop-blur-md pointer-events-auto">
          <div className="h-9 w-9 rounded-full border-2 border-[color:var(--mg-border-bright)] border-t-[color:var(--mg-gold-bright)] animate-spin" aria-hidden />
          <p className="text-[color:var(--mg-cream)] text-sm font-medium tracking-wide">Building puzzle…</p>
        </div>
      ) : null}
      <div className="mg-grain-overlay absolute inset-0 pointer-events-none" style={{ filter: "url(#wood-grain)" }} aria-hidden />
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="wood-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.01" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" />
        </filter>
      </svg>
      <div className={`flex-1 flex flex-col transition-opacity duration-300 ease-in-out z-10 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {currentView === 'home' ? (
        <Home
          currentView={currentView}
          setCurrentView={setCurrentViewWithTransition}
          best={best}
          normalGameState={normalGameState}
          resumeNormalGame={resumeNormalGame}
          setPicker={setPicker}
          picker={picker}
          userStats={userStats}
          start={start}
          time={time}
          fmtTime={fmtTime}
        />
      ) : currentView === 'daily' ? (
        <DailyChallenges
          cMonth={cMonth}
          setCMonth={setCMonth}
          MONTHS={MONTHS}
          calendarDays={calendarDays}
          start={start}
          setCurrentViewWithTransition={setCurrentViewWithTransition}
        />
      ) : currentView === 'victory' && victoryData ? (
        <VictoryView
          scoreData={victoryData}
          setCurrentViewWithTransition={setCurrentViewWithTransition}
          onPlayAgain={() => {
            if (victoryData.isDaily) {
              setCMonth(victoryData.nextMonthToPlay);
              start('Daily', true, victoryData.nextDayToPlay, victoryData.nextMonthToPlay);
            } else {
              start(victoryData.diff);
            }
          }}
        />
      ) : currentView === 'me' ? (
        <MeView
          currentView={currentView}
          setCurrentViewWithTransition={setCurrentViewWithTransition}
          fmtTime={fmtTime}
          settings={settings}
          setSettings={setSettings}
          isActiveGame={!!game}
        />
      ) : (
        <Game
          game={game}
          best={best}
          err={err}
          time={time}
          fmtTime={fmtTime}
          sel={sel}
          setSel={setSel}
          notesMode={notesMode}
          setNotesMode={setNotesMode}
          handleInput={handleInput}
          undo={undo}
          hint={hint}
          history={history}
          numberCounts={numberCounts}
          pulseNumbers={pulseNumbers}
          rewardAnimations={rewardAnimations}
          setCurrentViewWithTransition={setCurrentViewWithTransition}
          MONTHS_SHORT={MONTHS_SHORT}
          showGameOver={showGameOver}
          onSecondChance={handleSecondChance}
          onNewGame={handleNewGame}
          settings={settings}
        />
      )}

      {/* Victory Modal Overlay */}
      {showVictoryModal && victoryData && (
        <VictoryModal
          completionTime={time}
          onNewGame={() => {
            setShowVictoryModal(false);
            if (victoryData.isDaily) {
              setCMonth(victoryData.nextMonthToPlay);
              start('Daily', true, victoryData.nextDayToPlay, victoryData.nextMonthToPlay);
            } else {
              start(victoryData.diff);
            }
          }}
          difficulty={victoryData.diff}
          score={victoryData.total}
        />
      )}
      </div>
    </div>
  );
}
