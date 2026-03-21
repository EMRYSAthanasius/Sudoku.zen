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
  const [wins, setWins] = useState({ Easy: 0, Medium: 0 });
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0 });
  const [victoryData, setVictoryData] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [done, setDone] = useState(new Set());
  const [picker, setPicker] = useState(false);

  const [cMonth, setCMonth] = useState(2);
  const [cDay, setCDay] = useState(21);
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

  const start = (diff, isDaily = false, d = null) => {
    const day = d || cDay;
    const { board, solution } = generateSudoku(diff);
    setGame({ diff, isDaily, day, board, initial: board.map(x => x !== 0), solution, notes: Array.from({ length: 81 }, () => new Set()) });
    setHistory([]);
    setErr(0); setTime(0); setSel(null); setNotesMode(false); setShowGameOver(false); setCurrentViewWithTransition('game'); setPicker(false);
  };

  const pushHistory = () => {
    setHistory(h => [...h, { board: [...game.board], notes: game.notes.map(n => new Set(n)) }]);
  };

  const calculateWin = () => {
    if (game.isDaily) {
      setDone(p => new Set(p).add(`2026-${cMonth}-${game.day}`));
      setGame(null); setCurrentViewWithTransition('home');
    } else {
      // Dynamic scoring
      const completion = 2700; // 9 rows + 9 cols + 9 boxes * 100
      const speedBonus = Math.max(0, 2000 - time * 2);
      const multiplier = { Easy: 1, Medium: 1.5, Hard: 2.5 }[game.diff] || 1;
      const total = Math.floor((completion + speedBonus) * multiplier);

      const newStats = {
        today: stats.today + total,
        week: stats.week + total,
        month: stats.month + total,
      };

      setBest(p => Math.max(p, total));
      setWins(p => ({ ...p, [game.diff]: (p[game.diff] || 0) + 1 }));
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
          if (nextErr >= 3) {
             setShowGameOver(true);
             return 3;
          }
          return nextErr;
        });
      } else {
        const nN = [...game.notes]; nN[sel].clear();
        if (nextB.every((x, i) => x === game.solution[i])) {
          calculateWin();
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
    setGame({ ...game, board: last.board, notes: last.notes });
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

      if (nextB.every((x, i) => x === game.solution[i])) {
        calculateWin();
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
    const total = new Date(2026, cMonth + 1, 0).getDate();
    const startIdx = new Date(2026, cMonth, 1).getDay();
    const arr = [];
    for (let i = 0; i < startIdx; i++) arr.push(<div key={`e-${i}`} className="h-10" />);
    for (let d = 1; d <= total; d++) {
      const isDone = done.has(`2026-${cMonth}-${d}`);
      const isToday = d === 21 && cMonth === 2;
      arr.push(
        <button key={d} onClick={() => setCDay(d)} className={`h-11 w-11 flex items-center justify-center rounded-full text-base transition
            ${cDay === d ? 'border-[3px] border-yellow-500 text-white font-bold' : 'text-zinc-500'}
            ${isToday && cDay !== d ? 'text-yellow-500 font-bold' : ''}
            ${isDone ? 'bg-yellow-500/10' : ''}`}>
          {d}{isDone && <div className="absolute bottom-1 w-1 h-1 bg-yellow-500 rounded-full" />}
          {isToday && cDay !== d && <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full border-2 border-black" />}
        </button>
      );
    }
    return arr;
  }, [cMonth, cDay, done]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none overflow-hidden">
      <div className={`flex-1 flex flex-col transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {currentView === 'home' ? (
        <Home
          currentView={currentView}
          setCurrentView={setCurrentViewWithTransition}
          best={best}
          game={game}
          setPicker={setPicker}
          picker={picker}
          wins={wins}
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
