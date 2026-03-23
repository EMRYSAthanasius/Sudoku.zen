import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons } from './Icons';
import { generateSudoku, MONTHS, MONTHS_SHORT } from './SudokuEngine';
import { Home } from './Home';
import { DailyChallenges } from './DailyChallenges';
import { Game } from './Game';
import { VictoryView } from './VictoryView';
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
  const [showGameOver, setShowGameOver] = useState(false);
  const [picker, setPicker] = useState(false);

  const [rewardAnimations, setRewardAnimations] = useState([]);
  const [scoreAnimations, setScoreAnimations] = useState([]);
  const [cMonth, setCMonth] = useState(new Date().getMonth());
  const [cDay, setCDay] = useState(new Date().getDate());
  const [game, setGame] = useState(null);

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
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === 'undefined' || saved === 'null') {
        return null;
      }
      const data = JSON.parse(saved);
      if (mode === 'normal' && data.gameMode !== 'normal' && data.mode !== 'normal') {
        localStorage.removeItem(key);
        return null;
      }
      if (mode === 'daily' && data.gameMode !== 'daily' && data.mode !== 'daily') {
        localStorage.removeItem(key);
        return null;
      }
      if (data && data.board && Array.isArray(data.board) && data.board.length === 81) {
        return {
          ...data,
          notes: data.notes ? data.notes.map(arr => new Set(arr)) : Array.from({ length: 81 }, () => new Set())
        };
      } else {
        localStorage.removeItem(key);
        return null;
      }
    } catch (e) {
      localStorage.removeItem(key);
      return null;
    }
  };

  const [normalGameState, setNormalGameState] = useState(() => loadFromStorage('LOCAL_STORAGE_NORMAL_V2', 'normal'));
  const [history, setHistory] = useState([]);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState(0);
  const [time, setTime] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const tRef = useRef(null);

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

  const setCurrentViewWithTransition = (view) => {
    if (currentView === 'game' && view !== 'game' && game) {
      if (game.isDaily) {
        saveDailyProgress(game, 'in-progress');
      } else {
        const toSave = { ...game, err, time, notes: game.notes.map(s => Array.from(s)), gameMode: 'normal' };
        setNormalGameState(toSave);
        localStorage.setItem('LOCAL_STORAGE_NORMAL_V2', JSON.stringify(toSave));
      }
      setGame(null);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    if (currentView === 'game' && game) tRef.current = setInterval(() => setTime(t => t + 1), 1000);
    else clearInterval(tRef.current);
    return () => clearInterval(tRef.current);
  }, [currentView, game]);

  const saveDailyProgress = (gameData, status) => {
    if (!gameData || !gameData.isDaily) return;
    const currentYear = new Date().getFullYear();
    // Use consistent zero-padded formatting to avoid day/month collisions (e.g., 2026-3-2 vs 2026-11-23).
    // Actually the user specified: LOCAL_STORAGE_DAILY_V2_[DATE]
    const paddedMonth = String(cMonth + 1).padStart(2, '0');
    const paddedDay = String(gameData.day).padStart(2, '0');
    const key = `LOCAL_STORAGE_DAILY_V2_${currentYear}-${paddedMonth}-${paddedDay}`;

    const saveData = {
      status,
      board: gameData.board,
      initial: gameData.initial,
      notes: gameData.notes.map(s => Array.from(s)),
      solution: gameData.solution,
      err: gameData.err !== undefined ? gameData.err : err,
      time: gameData.time !== undefined ? gameData.time : time,
      diff: gameData.diff,
      score: gameData.score || 0,
      isDaily: true,
      gameMode: 'daily'
    };

    localStorage.setItem(key, JSON.stringify(saveData));
  };

  const loadDailyProgress = (year, month, day) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    const key = `LOCAL_STORAGE_DAILY_V2_${year}-${paddedMonth}-${paddedDay}`;
    const loaded = loadFromStorage(key, 'daily');
    return loaded && loaded.status ? loaded : null;
  };

  const start = (diff, isDaily = false, d = null) => {
    const day = d || cDay;
    const currentYear = new Date().getFullYear();

    if (!isDaily) {
      const detailedStats = JSON.parse(localStorage.getItem('sudokuDetailedStats') || '{}');
      if (!detailedStats[diff]) detailedStats[diff] = {};
      detailedStats[diff].gamesStarted = (detailedStats[diff].gamesStarted || 0) + 1;
      localStorage.setItem('sudokuDetailedStats', JSON.stringify(detailedStats));
    }

    // Prevent starting future daily games
    if (isDaily) {
      const realDate = new Date();
      const targetDate = new Date(currentYear, cMonth, day);
      if (targetDate > realDate) {
        return;
      }
    }

    if (isDaily) {
      const saved = loadDailyProgress(currentYear, cMonth, day);
      if (saved && saved.status === 'in-progress') {
        setGame({
          diff: saved.diff,
          isDaily: true,
          day,
          month: cMonth,
          board: saved.board,
          initial: saved.initial,
          solution: saved.solution,
          notes: saved.notes.map(arr => new Set(arr)),
          score: saved.score || 0
        });
        setErr(saved.err || 0);
        setTime(saved.time || 0);
        setHistory([]);
        setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
        return;
      }
    }

    const seedStr = isDaily ? `${currentYear}-${cMonth}-${day}` : null;
    const { board, solution } = generateSudoku(diff, seedStr);
    const newGame = { diff, isDaily, day, month: cMonth, board, initial: board.map(x => x !== 0), solution, notes: Array.from({ length: 81 }, () => new Set()), score: 0 };

    setGame(null); // Memory Flush
    setTimeout(() => {
      setGame(newGame);
      if (!isDaily) {
        setNormalGameState(newGame);
      }
      setHistory([]);
      setErr(0); setTime(0); setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
    }, 0);
  };

  const resumeNormalGame = () => {
    if (normalGameState) {
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

  useEffect(() => {
    if (game && !game.isDaily) {
      const toSave = { ...game, err, time, notes: game.notes.map(s => Array.from(s)), gameMode: 'normal' };
      setNormalGameState(toSave);
      localStorage.setItem('LOCAL_STORAGE_NORMAL_V2', JSON.stringify(toSave));
    }
  }, [game, err, time]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (game && !game.isDaily) {
        const toSave = { ...game, err, time, notes: game.notes.map(s => Array.from(s)), gameMode: 'normal' };
        localStorage.setItem('LOCAL_STORAGE_NORMAL_V2', JSON.stringify(toSave));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [game, err, time]);

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
    if (game.isDaily) {
      saveDailyProgress({ ...game, board: currentBoard, score: finalScore }, 'completed');
      setGame(null); setCurrentViewWithTransition('home');
    } else {
      // Dynamic scoring
      const completion = finalScore;
      const speedBonus = Math.max(0, 2000 - time * 2);
      const multiplier = { Easy: 1, Medium: 1.5, Hard: 2.5, Expert: 3.5, Master: 5, Extreme: 10 }[game.diff] || 1;
      const total = Math.floor((completion + speedBonus) * multiplier);

      const newStats = {
        today: stats.today + total,
        week: stats.week + total,
        month: stats.month + total,
      };

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
        ...newStats
      });
      setGame(null);
      playSound('victory', settings);
      playHaptic('victory', settings);
      setCurrentViewWithTransition('victory');
    }
  };

  const handleInput = (n) => {
    if (sel === null || !game || game.initial[sel]) return;

    if (notesMode && n !== 0) {
      pushHistory();
      const next = [...game.notes];
      if (next[sel].has(n)) next[sel].delete(n); else next[sel].add(n);
      setGame({ ...game, notes: next });
    } else {
      const nextB = [...game.board];
      if (n === 0) {
        if (nextB[sel] !== 0) {
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
        playHaptic('mistake', settings);
        setErr(prev => {
          const nextErr = prev + 1;
          if (game.isDaily) saveDailyProgress({ ...game, board: nextB, err: nextErr }, 'in-progress');
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

        if (game.isDaily) saveDailyProgress({ ...game, board: nextB, notes: nN, score: nextScore }, 'in-progress');
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
    playSound('undo', settings);
    playHaptic('undo', settings);
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    const nextGame = { ...game, board: last.board, notes: last.notes };
    setGame(nextGame);
    if (nextGame.isDaily) saveDailyProgress(nextGame, 'in-progress');
  };

  const hint = () => {
    if (!game) return;
    // Find an empty or incorrect cell
    const emptyOrIncorrect = game.board.findIndex((val, idx) => !game.initial[idx] && val !== game.solution[idx]);
    if (emptyOrIncorrect !== -1) {
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

      if (game.isDaily) saveDailyProgress({ ...game, board: nextB, notes: nN, score: nextScore }, 'in-progress');

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
            ${cDay === d && !isFuture ? 'border-[3px] border-[#C19A6B] text-[#2D1B10] font-bold shadow-sm' : 'text-[#2D1B10]'}
            ${isToday && cDay !== d ? 'text-[#C19A6B] font-bold' : ''}
            ${isCompleted ? 'bg-[#A0522D]/30 text-[#2D1B10]' : ''}
            ${isInProgress && cDay !== d ? 'text-[#2D1B10]' : ''}
          `}
        >
          {isToday && (
            <div className="absolute inset-0 rounded-full border-2 border-[#C19A6B] animate-ping opacity-30 pointer-events-none"></div>
          )}

          {isInProgress && !isCompleted && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" fill="none" stroke="#3E1F10" strokeWidth="2" />
              <circle
                cx="22" cy="22" r="20" fill="none" stroke="#C19A6B" strokeWidth="2"
                strokeDasharray={`${(percent * 125.6) / 100} 125.6`}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
          )}

          <span className="z-10">{d}</span>

          {isCompleted && (
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[#C19A6B] rounded-full border-2 border-[#5D2E17] flex items-center justify-center">
              <svg viewBox="0 0 10 10" fill="none" stroke="#3E1F10" strokeWidth="2" strokeLinecap="round" className="w-1.5 h-1.5">
                <polyline points="2 5 4 7 8 3" />
              </svg>
            </div>
          )}

          {isToday && !isCompleted && (
            <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#C19A6B] rounded-full border-2 border-[#5D2E17]" />
          )}
        </button>
      );
    }
    return arr;
  }, [cMonth, cDay]);

  useEffect(() => {
    const handleGlobalInteraction = (e) => {
      const target = e.target.closest('button, .cursor-pointer');
      if (target) {
        playSound('click', settings);
        playHaptic('tap', settings);
      }
    };

    document.addEventListener('pointerdown', handleGlobalInteraction);
    return () => document.removeEventListener('pointerdown', handleGlobalInteraction);
  }, [settings]);

  return (
    <div className="min-h-screen bg-[#5D2E17] text-[#2D1B10] flex flex-col font-sans select-none overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ filter: "url(#wood-grain)" }}></div>
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
          setPicker={setPicker}
        />
      ) : currentView === 'me' ? (
        <MeView
          currentView={currentView}
          setCurrentViewWithTransition={setCurrentViewWithTransition}
          fmtTime={fmtTime}
          settings={settings}
          setSettings={setSettings}
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
      </div>
    </div>
  );
}
