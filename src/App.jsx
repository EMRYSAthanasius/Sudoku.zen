import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons } from './Icons';
import { generateSudoku, MONTHS, MONTHS_SHORT } from './SudokuEngine';
import { Home } from './Home';
import { DailyChallenges } from './DailyChallenges';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, game, daily
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [best, setBest] = useState(0);
  const [wins, setWins] = useState({ Easy: 0, Medium: 0 });
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
    setErr(0); setTime(0); setSel(null); setNotesMode(false); setCurrentViewWithTransition('game'); setPicker(false);
  };

  const pushHistory = () => {
    setHistory(h => [...h, { board: [...game.board], notes: game.notes.map(n => new Set(n)) }]);
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
        setErr(prev => { if (prev + 1 >= 3) { setTimeout(() => { setGame(null); setCurrentViewWithTransition('home'); }, 500); return 3; } return prev + 1; });
      } else {
        const nN = [...game.notes]; nN[sel].clear();
        if (nextB.every((x, i) => x === game.solution[i])) {
          if (game.isDaily) setDone(p => new Set(p).add(`2026-${cMonth}-${game.day}`));
          else {
            const pts = { Easy: 500, Medium: 1500, Hard: 4000 }[game.diff] || 1000;
            setBest(p => Math.max(p, pts + Math.max(0, 1000 - time)));
            setWins(p => ({ ...p, [game.diff]: (p[game.diff] || 0) + 1 }));
          }
          setGame(null); setCurrentViewWithTransition('home');
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
        if (game.isDaily) setDone(p => new Set(p).add(`2026-${cMonth}-${game.day}`));
        else {
          const pts = { Easy: 500, Medium: 1500, Hard: 4000 }[game.diff] || 1000;
          setBest(p => Math.max(p, pts + Math.max(0, 1000 - time)));
          setWins(p => ({ ...p, [game.diff]: (p[game.diff] || 0) + 1 }));
        }
        setGame(null); setCurrentViewWithTransition('home');
        return;
      }

      setGame({ ...game, board: nextB, notes: nN });
      setSel(emptyOrIncorrect);
    }
  };

  const fmtTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

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
      ) : (
        /* GAME VIEW - REPLICA OF PHOTO HEADERS */
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-black relative overflow-y-auto pb-8">
          <header className="px-5 pt-12 pb-2 flex justify-between items-center shrink-0">
            <button onClick={()=>setCurrentViewWithTransition(game.isDaily ? 'daily' : 'home')} className="text-yellow-500"><Icons.Chevron dir="left" size={32} /></button>
            <div className="text-2xl font-bold italic text-yellow-500 leading-none">0</div>
            <button className="text-yellow-500"><Icons.Settings /></button>
          </header>
          <div className="px-5 grid grid-cols-4 gap-2 mb-6 text-center">
            <div className="flex flex-col border-r border-zinc-800">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">{game.isDaily ? "Date" : "All Time"}</span>
               <div className="flex items-center justify-center gap-1 text-yellow-500">
                  {game.isDaily ? <span className="text-xs font-bold uppercase">{game.day} {MONTHS_SHORT[game.month]}</span> : <><Icons.Trophy size={11} fill="#EAB308" /><span className="text-xs font-bold tabular-nums">{best.toLocaleString()}</span></>}
               </div>
            </div>
            <div className="flex flex-col border-r border-zinc-800">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">{game.isDaily ? "All Time" : "Difficulty"}</span>
               <div className="flex items-center justify-center gap-1 text-yellow-500">
                  {game.isDaily ? <><Icons.Trophy size={11} fill="#EAB308" /><span className="text-xs font-bold tabular-nums">{best.toLocaleString()}</span></> : <span className="text-xs font-bold uppercase">{game.diff}</span>}
               </div>
            </div>
            <div className="flex flex-col border-r border-zinc-800">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">Mistakes</span>
               <span className={`text-xs font-bold ${err > 0 ? 'text-red-500' : 'text-yellow-500'}`}>{err}/3</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">Time</span>
               <div className="flex items-center justify-center gap-1.5 text-yellow-500">
                  <span className="text-xs font-bold tabular-nums">{fmtTime(time)}</span>
                  <div className="bg-zinc-800/80 p-1 rounded-full text-zinc-200"><Icons.Pause /></div>
               </div>
            </div>
          </div>
          <div className="px-2 mb-6 flex-1 min-h-0 flex items-center justify-center">
            <div className="w-full max-w-[min(100vw-16px,50vh)] aspect-square grid grid-cols-9 bg-black border-[2px] border-yellow-500/30 rounded-sm overflow-hidden mx-auto">
              {game.board.map((val, idx) => {
                const r = Math.floor(idx/9), c = idx%9;
                const isS = sel === idx;
                const isR = sel !== null && (Math.floor(sel/9) === r || sel%9 === c || (Math.floor(Math.floor(sel/9)/3) === Math.floor(r/3) && Math.floor((sel%9)/3) === Math.floor(c/3)));
                const isM = sel !== null && val !== 0 && val === game.board[sel];
                const isI = game.initial[idx];
                const isE = !isI && val !== 0 && val !== game.solution[idx];
                let bgClass = 'bg-transparent';
                if (isS) bgClass = 'bg-yellow-500/10 shadow-[inset_0_0_12px_rgba(234,179,8,0.2)]';
                else if (isM) bgClass = 'bg-yellow-500/10';
                else if (isR) bgClass = 'bg-yellow-500/5';

                const borderClass = `${(r+1)%3===0 && r<8 ? 'border-b-[2px] border-b-yellow-500/30' : 'border-b-[1px] border-b-zinc-800'} ${(c+1)%3===0 && c<8 ? 'border-r-[2px] border-r-yellow-500/30' : 'border-r-[1px] border-r-zinc-800'}`;
                const textClass = isE ? '!text-red-500' : isI ? 'text-yellow-500 font-bold' : isS ? 'text-yellow-500 italic font-normal' : 'text-yellow-500/80 italic font-normal';

                return (
                  <div key={idx} onClick={()=>setSel(idx)} className={`relative flex items-center justify-center text-[28px] cursor-pointer transition-all duration-75 ${borderClass} ${bgClass} ${textClass}`}>
                    {val !== 0 ? val : (<div className="grid grid-cols-3 w-full h-full p-0.5 opacity-30">{[1,2,3,4,5,6,7,8,9].map(n => (<div key={n} className="text-[8px] leading-none flex items-center justify-center font-bold text-yellow-500">{game.notes[idx].has(n) ? n : ''}</div>))}</div>)}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="px-10 grid grid-cols-4 gap-4 mb-6">
            <button onClick={undo} disabled={history.length === 0} className={`flex flex-col items-center gap-1 text-yellow-500 active:scale-90 transition ${history.length === 0 ? 'opacity-40' : ''}`}><Icons.Undo /><span className="text-[10px] font-bold uppercase tracking-widest">Undo</span></button>
            <button onClick={()=>handleInput(0)} className="flex flex-col items-center gap-1 text-yellow-500 active:scale-90 transition"><Icons.Erase /><span className="text-[10px] font-bold uppercase tracking-widest">Erase</span></button>
            <button onClick={()=>setNotesMode(!notesMode)} className="flex flex-col items-center gap-1 text-yellow-500 active:scale-90 transition"><div className={`relative ${notesMode ? 'text-white' : ''}`}><Icons.Notes /><div className={`absolute -top-1 -right-4 px-1 rounded text-[8px] font-black uppercase ${notesMode ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>{notesMode ? 'On' : 'Off'}</div></div><span className={`text-[10px] font-bold uppercase tracking-widest ${notesMode ? 'text-white' : ''}`}>Notes</span></button>
            <button onClick={hint} className="flex flex-col items-center gap-1 text-yellow-500 active:scale-90 transition"><Icons.Hint /><span className="text-[10px] font-bold uppercase tracking-widest">Hint</span></button>
          </div>
          <div className="px-2 sm:px-5 grid grid-cols-9 gap-1 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={()=>handleInput(num)} className="aspect-[3/5] flex items-center justify-center text-3xl sm:text-[44px] font-light text-yellow-500 active:scale-90 transition active:bg-yellow-500 active:text-black rounded-xl italic leading-none">{num}</button>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
