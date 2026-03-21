import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icons } from './Icons';
import { generateSudoku, MONTHS, MONTHS_SHORT } from './SudokuEngine';

export default function App() {
  const [v, setV] = useState('main'); // main, game, daily
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

  useEffect(() => {
    if (v === 'game' && game) tRef.current = setInterval(() => setTime(t => t + 1), 1000);
    else clearInterval(tRef.current);
    return () => clearInterval(tRef.current);
  }, [v, game]);

  const start = (diff, isDaily = false, d = null) => {
    const day = d || cDay;
    const { board, solution } = generateSudoku(diff);
    setGame({ diff, isDaily, day, board, initial: board.map(x => x !== 0), solution, notes: Array.from({ length: 81 }, () => new Set()) });
    setHistory([]);
    setErr(0); setTime(0); setSel(null); setNotesMode(false); setV('game'); setPicker(false);
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
        setErr(prev => { if (prev + 1 >= 3) { setTimeout(() => { setGame(null); setV('main'); }, 500); return 3; } return prev + 1; });
      } else {
        const nN = [...game.notes]; nN[sel].clear();
        if (nextB.every((x, i) => x === game.solution[i])) {
          if (game.isDaily) setDone(p => new Set(p).add(`2026-${cMonth}-${game.day}`));
          else {
            const pts = { Easy: 500, Medium: 1500, Hard: 4000 }[game.diff] || 1000;
            setBest(p => Math.max(p, pts + Math.max(0, 1000 - time)));
            setWins(p => ({ ...p, [game.diff]: (p[game.diff] || 0) + 1 }));
          }
          setGame(null); setV('main');
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
        setGame(null); setV('main');
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
      {v === 'main' ? (
        <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative">
          <header className="pt-10 pb-8 flex flex-col items-center">
            <h1 className="text-[28px] font-semibold tracking-tight uppercase italic leading-none">sudoku<span className="text-yellow-500 font-bold">.zen</span></h1>
          </header>
          <div className="flex gap-4 mb-10 h-44">
            <button onClick={() => setV('daily')} className="flex-1 bg-zinc-900 border border-yellow-500/20 rounded-[32px] p-5 flex flex-col items-center justify-between active:scale-95 transition shadow-2xl">
              <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500"><Icons.Nav type="daily" active={true} /></div>
              <div className="text-center"><p className="text-[10px] uppercase font-bold tracking-widest text-yellow-500/60 mb-0.5">Daily Quest</p><p className="text-xl font-bold">March 21</p></div>
              <div className="bg-yellow-500 text-black px-8 py-2 rounded-full text-sm font-bold">Play</div>
            </button>
            <div className="flex-1 bg-zinc-900 border border-yellow-500/10 rounded-[32px] p-5 flex flex-col items-center justify-between opacity-40 shadow-2xl">
              <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500"><Icons.Trophy size={28} /></div>
              <div className="text-center"><p className="text-[10px] uppercase font-bold tracking-widest text-yellow-500/60 mb-0.5">League</p><p className="text-xl font-bold text-white">Score: 0</p></div>
              <div className="bg-yellow-500 text-black px-8 py-2 rounded-full text-sm font-bold">Play</div>
            </div>
          </div>
          <div className="flex flex-col items-center mb-10">
            <p className="text-zinc-500 text-[11px] font-bold mb-1 uppercase tracking-widest">All-Time Best Score</p>
            <div className="flex items-center gap-2">
              <Icons.Trophy fill="#EAB308" size={24} />
              <span className="text-[52px] font-semibold tracking-tighter text-yellow-500 italic tabular-nums leading-none">{best.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-auto mb-16 flex flex-col gap-4">
            {game && (
              <button onClick={() => setV('game')} className="w-full bg-yellow-500 text-black py-5 rounded-[36px] shadow-2xl flex flex-col items-center justify-center border-2 border-yellow-500 active:scale-95 transition">
                <span className="text-lg font-bold">Continue Game</span>
                <div className="flex items-center gap-2 opacity-70 text-sm font-medium mt-0.5"><span>{fmtTime(time)} - {game.diff}</span></div>
              </button>
            )}
            <button onClick={() => setPicker(true)} className={`w-full py-6 rounded-[36px] text-xl font-bold active:scale-95 transition ${game ? 'bg-zinc-900 text-yellow-500 border-2 border-yellow-500/20' : 'bg-yellow-500 text-black'}`}>New Game</button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-4 pb-8 z-10">
            <button onClick={() => setV('main')} className={`flex flex-col items-center gap-1.5 ${v==='main'?'text-yellow-500':'text-zinc-600'}`}><Icons.Nav type="main" active={v==='main'}/><span className="text-[10px] font-bold uppercase tracking-widest">Main</span></button>
            <button onClick={() => setV('daily')} className={`flex flex-col items-center gap-1.5 ${v==='daily'?'text-yellow-500':'text-zinc-600'}`}><Icons.Nav type="daily" active={v==='daily'}/><span className="text-[10px] font-bold uppercase tracking-widest">Daily</span></button>
            <div className="flex flex-col items-center gap-1.5 text-zinc-600"><Icons.Nav type="me" /><span className="text-[10px] font-bold uppercase tracking-widest">Me</span></div>
          </div>
          {picker && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-sm" onClick={() => setPicker(false)}>
              <div className="relative bg-zinc-900 w-full max-w-md rounded-t-[50px] p-10 pb-14 shadow-2xl border-t border-yellow-500/20" onClick={e=>e.stopPropagation()}>
                <div className="w-16 h-1 bg-zinc-800 rounded-full mx-auto mb-10" />
                <div className="space-y-2">
                  {['Easy', 'Medium', 'Hard'].map((t, i) => {
                    const locked = i > 0 && wins[['Easy','Medium'][i-1]] === 0;
                    return (
                      <button key={t} disabled={locked} onClick={() => start(t)} className={`w-full py-5 px-6 flex flex-col items-center transition border-b border-white/5 last:border-none ${locked ? 'opacity-20' : 'opacity-100'}`}>
                        <div className="flex items-center gap-3">{locked && <span className="text-yellow-500">🔒</span>}<span className="text-2xl font-bold uppercase text-yellow-500">{t}</span></div>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPicker(false)} className="w-full mt-10 py-2 text-zinc-600 font-bold uppercase text-[11px] tracking-widest">Close</button>
              </div>
            </div>
          )}
        </div>
      ) : v === 'daily' ? (
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-black relative">
          <div className="relative h-[42%] bg-gradient-to-b from-[#151515] to-black flex flex-col items-center border-b border-white/5 overflow-hidden">
            <header className="w-full px-6 pt-12 flex justify-between items-center z-10">
              <button onClick={() => setV('main')} className="w-10 h-10 flex items-center justify-center bg-zinc-900/50 rounded-full text-yellow-500"><Icons.Chevron dir="left" /></button>
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-300">Daily Challenges</h2><div className="w-10" />
            </header>
            <div className="flex-1 flex flex-col items-center justify-center z-10 pt-4">
              <Icons.RichMonthTrophy monthIdx={cMonth} />
              <div className="mt-6 text-center">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{MONTHS[cMonth]} 2026</h3>
                 <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 animate-pulse">Collect Your Reward</p>
              </div>
            </div>
            <div className="absolute top-[45%] left-0 right-0 flex justify-between px-4 pointer-events-none">
               <button disabled={cMonth===0} onClick={()=>setCMonth(v=>v-1)} className="pointer-events-auto text-zinc-500 active:text-yellow-500 transition-colors"><Icons.Chevron dir="left" size={32} /></button>
               <button disabled={cMonth===2} onClick={()=>setCMonth(v=>v+1)} className="pointer-events-auto text-zinc-500 active:text-yellow-500 transition-colors"><Icons.Chevron dir="right" size={32} /></button>
            </div>
          </div>
          <div className="flex-1 px-8 pt-8 overflow-y-auto pb-40 no-scrollbar">
            <div className="flex justify-between items-end mb-8"><span className="text-2xl font-black text-white italic">{MONTHS[cMonth]} 2026</span><div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-yellow-500/10"><Icons.Trophy size={14} fill="#EAB308" /><span className="text-sm font-bold tabular-nums text-zinc-200">0/31</span></div></div>
            <div className="grid grid-cols-7 text-center mb-4 opacity-30 text-[11px] font-bold uppercase">{['S','M','T','W','T','F','S'].map(d=><div key={d}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-y-3">{calendarDays}</div>
          </div>
          <div className="absolute bottom-28 left-8 right-8 z-20"><button onClick={()=>start('Daily',true)} className="w-full bg-yellow-500 text-black py-5 rounded-full font-black text-xl shadow-2xl active:scale-95 transition">Play</button></div>
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-950 border-t border-white/5 flex justify-around p-4 pb-8"><button onClick={()=>setV('main')} className="flex flex-col items-center gap-1.5 text-zinc-600"><Icons.Nav type="main" /><span className="text-[10px] font-bold uppercase">Main</span></button><button className="flex flex-col items-center gap-1.5 text-yellow-500"><Icons.Nav type="daily" active={true} /><span className="text-[10px] font-bold uppercase">Daily</span></button><button className="flex flex-col items-center gap-1.5 text-zinc-600"><Icons.Nav type="me" /><span className="text-[10px] font-bold uppercase">Me</span></button></div>
        </div>
      ) : (
        /* GAME VIEW - REPLICA OF PHOTO HEADERS */
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-black relative">
          <header className="px-5 pt-12 pb-2 flex justify-between items-center">
            <button onClick={()=>setV(game.isDaily ? 'daily' : 'main')} className="text-yellow-500"><Icons.Chevron dir="left" size={32} /></button>
            <div className="text-2xl font-bold italic text-yellow-500 leading-none">0</div>
            <button className="text-yellow-500"><Icons.Settings /></button>
          </header>
          <div className="px-5 grid grid-cols-4 gap-2 mb-6 text-center">
            <div className="flex flex-col border-r border-zinc-800">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">{game.isDaily ? "Date" : "All Time"}</span>
               <div className="flex items-center justify-center gap-1 text-zinc-200">
                  {game.isDaily ? <span className="text-xs font-bold uppercase">{game.day} {MONTHS_SHORT[game.month]}</span> : <><Icons.Trophy size={11} fill="#EAB308" /><span className="text-xs font-bold tabular-nums">{best.toLocaleString()}</span></>}
               </div>
            </div>
            <div className="flex flex-col border-r border-zinc-800">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">{game.isDaily ? "All Time" : "Difficulty"}</span>
               <div className="flex items-center justify-center gap-1 text-zinc-200">
                  {game.isDaily ? <><Icons.Trophy size={11} fill="#EAB308" /><span className="text-xs font-bold tabular-nums">{best.toLocaleString()}</span></> : <span className="text-xs font-bold uppercase">{game.diff}</span>}
               </div>
            </div>
            <div className="flex flex-col border-r border-zinc-800">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">Mistakes</span>
               <span className={`text-xs font-bold ${err > 0 ? 'text-red-500' : 'text-zinc-200'}`}>{err}/3</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tighter">Time</span>
               <div className="flex items-center justify-center gap-1.5 text-zinc-200">
                  <span className="text-xs font-bold tabular-nums">{fmtTime(time)}</span>
                  <div className="bg-zinc-800/80 p-1 rounded-full"><Icons.Pause /></div>
               </div>
            </div>
          </div>
          <div className="px-2 mb-6 flex-1 min-h-0 flex items-center justify-center">
            <div className="w-full max-w-[min(100vw-16px,50vh)] aspect-square grid grid-cols-9 bg-black border-[2px] border-yellow-600/30 rounded-sm overflow-hidden mx-auto">
              {game.board.map((val, idx) => {
                const r = Math.floor(idx/9), c = idx%9;
                const isS = sel === idx;
                const isR = sel !== null && (Math.floor(sel/9) === r || sel%9 === c || (Math.floor(Math.floor(sel/9)/3) === Math.floor(r/3) && Math.floor((sel%9)/3) === Math.floor(c/3)));
                const isM = sel !== null && val !== 0 && val === game.board[sel];
                const isI = game.initial[idx];
                const isE = !isI && val !== 0 && val !== game.solution[idx];
                let bg = 'transparent';
                if (isS) bg = 'rgba(234, 179, 8, 0.4)'; 
                else if (isM) bg = 'rgba(234, 179, 8, 0.15)';
                else if (isR) bg = 'rgba(234, 179, 8, 0.04)'; 
                return (
                  <div key={idx} onClick={()=>setSel(idx)} style={{backgroundColor: bg}} className={`relative flex items-center justify-center text-[28px] font-semibold cursor-pointer transition-all duration-75 ${(r+1)%3===0 && r<8 ? 'border-b-[2px]' : 'border-b-[0.5px]'} ${(c+1)%3===0 && c<8 ? 'border-r-[2px]' : 'border-r-[0.5px]'} border-yellow-600/10 ${isE ? '!bg-red-950/40 !text-red-500' : isI ? 'text-zinc-100' : isS ? 'text-yellow-500' : 'text-yellow-500/90'}`}>
                    {val !== 0 ? val : (<div className="grid grid-cols-3 w-full h-full p-0.5 opacity-20">{[1,2,3,4,5,6,7,8,9].map(n => (<div key={n} className="text-[8px] leading-none flex items-center justify-center font-bold text-yellow-500">{game.notes[idx].has(n) ? n : ''}</div>))}</div>)}
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
  );
}

