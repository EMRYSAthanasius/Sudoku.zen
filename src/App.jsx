import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons } from './Icons';
import { generateSudoku, MONTHS, MONTHS_SHORT } from './SudokuEngine';
import { Home } from './Home';
import { DailyChallenges } from './DailyChallenges';
import { Game } from './Game';
import { VictoryView } from './VictoryView';

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

  const [dailyProgress, setDailyProgress] = useState(() => {
    const saved = localStorage.getItem('sudokuDailyProgress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const [rewardAnimations, setRewardAnimations] = useState([]);
  const [cMonth, setCMonth] = useState(new Date().getMonth());
  const [cDay, setCDay] = useState(new Date().getDate());
  const [game, setGame] = useState(null);
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
    const currentYear = new Date().getFullYear(); // Assume 2026 or dynamic
    const key = `${currentYear}-${cMonth}-${gameData.day}`;
    setDailyProgress(prev => {
      const next = {
        ...prev,
        [key]: {
          status,
          board: gameData.board,
          initial: gameData.initial,
          notes: gameData.notes.map(s => Array.from(s)),
          solution: gameData.solution,
          err: err,
          time: time,
          diff: gameData.diff
        }
      };
      localStorage.setItem('sudokuDailyProgress', JSON.stringify(next));
      return next;
    });
  };

  const start = (diff, isDaily = false, d = null) => {
    const day = d || cDay;
    const currentYear = new Date().getFullYear();
    const key = `${currentYear}-${cMonth}-${day}`;

    // Prevent starting future daily games
    if (isDaily) {
      const realDate = new Date();
      const targetDate = new Date(currentYear, cMonth, day);
      if (targetDate > realDate) {
        return;
      }
    }

    if (isDaily && dailyProgress[key] && dailyProgress[key].status === 'in-progress') {
      const saved = dailyProgress[key];
      setGame({
        diff: saved.diff,
        isDaily: true,
        day,
        month: cMonth,
        board: saved.board,
        initial: saved.initial,
        solution: saved.solution,
        notes: saved.notes.map(arr => new Set(arr))
      });
      setErr(saved.err);
      setTime(saved.time);
      setHistory([]);
      setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
      return;
    }

    const { board, solution } = generateSudoku(diff);
    setGame({ diff, isDaily, day, month: cMonth, board, initial: board.map(x => x !== 0), solution, notes: Array.from({ length: 81 }, () => new Set()) });
    setHistory([]);
    setErr(0); setTime(0); setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
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
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
      setRewardAnimations(prev => [...prev, ...newAnims]);
      setTimeout(() => {
        setRewardAnimations(prev => prev.filter(anim => !newAnims.find(na => na.id === anim.id)));
      }, 1000);
    }
  };

  useEffect(() => {
    localStorage.setItem('sudokuUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const calculateWin = (currentBoard) => {
    if (game.isDaily) {
      saveDailyProgress({ ...game, board: currentBoard }, 'completed');
      setGame(null); setCurrentViewWithTransition('home');
    } else {
      // Dynamic scoring
      const completion = 2700; // 9 rows + 9 cols + 9 boxes * 100
      const speedBonus = Math.max(0, 2000 - time * 2);
      const multiplier = { Easy: 1, Medium: 1.5, Hard: 2.5, Expert: 3.5, Master: 5, Extreme: 10 }[game.diff] || 1;
      const total = Math.floor((completion + speedBonus) * multiplier);

      const newStats = {
        today: stats.today + total,
        week: stats.week + total,
        month: stats.month + total,
      };

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
        setErr(prev => {
          const nextErr = prev + 1;
          if (game.isDaily) saveDailyProgress({ ...game, board: nextB, err: nextErr }, 'in-progress');
          if (nextErr >= 3) {
             setShowGameOver(true);
             return 3;
          }
          return nextErr;
        });
      } else {
        const nN = [...game.notes]; nN[sel].clear();
        checkAndTriggerCompletions(nextB, sel);
        if (game.isDaily) saveDailyProgress({ ...game, board: nextB, notes: nN }, 'in-progress');
        if (nextB.every((x, i) => x === game.solution[i])) {
          calculateWin(nextB);
          return;
        }
      }
      setGame({ ...game, board: nextB });
    }
  };

  const undo = () => {
    if (history.length === 0) return;
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

      checkAndTriggerCompletions(nextB, emptyOrIncorrect);
      if (game.isDaily) saveDailyProgress({ ...game, board: nextB, notes: nN }, 'in-progress');

      if (nextB.every((x, i) => x === game.solution[i])) {
        calculateWin(nextB);
        return;
      }

      setGame({ ...game, board: nextB, notes: nN });
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
      const key = `${currentYear}-${cMonth}-${d}`;
      const progress = dailyProgress[key];
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
            ${cDay === d && !isFuture ? 'border-[3px] border-[#818CF8] text-[#F8FAFC] font-bold' : 'text-[#F8FAFC]'}
            ${isToday && cDay !== d ? 'text-[#818CF8] font-bold' : ''}
            ${isCompleted ? 'bg-[#818CF8]/10 text-[#818CF8]' : ''}
            ${isInProgress && cDay !== d ? 'text-[#F8FAFC]' : ''}
          `}
        >
          {isToday && (
            <div className="absolute inset-0 rounded-full border-2 border-[#818CF8] animate-ping opacity-20 pointer-events-none"></div>
          )}

          {isInProgress && !isCompleted && (
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" fill="none" stroke="#1E293B" strokeWidth="2" />
              <circle
                cx="22" cy="22" r="20" fill="none" stroke="#818CF8" strokeWidth="2"
                strokeDasharray={`${(percent * 125.6) / 100} 125.6`}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
          )}

          <span className="z-10">{d}</span>

          {isCompleted && (
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[#818CF8] rounded-full border-2 border-[#020617] flex items-center justify-center">
              <svg viewBox="0 0 10 10" fill="none" stroke="#020617" strokeWidth="2" strokeLinecap="round" className="w-1.5 h-1.5">
                <polyline points="2 5 4 7 8 3" />
              </svg>
            </div>
          )}

          {isToday && !isCompleted && (
            <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-[#818CF8] rounded-full border-2 border-[#020617]" />
          )}
        </button>
      );
    }
    return arr;
  }, [cMonth, cDay, dailyProgress]);

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col font-sans select-none overflow-hidden">
      <div className={`flex-1 flex flex-col transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {currentView === 'home' ? (
        <Home
          currentView={currentView}
          setCurrentView={setCurrentViewWithTransition}
          best={best}
          game={game}
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
        />
      )}
      </div>
    </div>
  );
}
