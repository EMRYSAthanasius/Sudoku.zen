import React from 'react';
import { Icons } from './Icons';
import { GameOverModal } from './GameOverModal';

export function Game({
  game,
  best,
  err,
  time,
  fmtTime,
  sel,
  setSel,
  notesMode,
  setNotesMode,
  handleInput,
  undo,
  hint,
  history,
  numberCounts,
  pulseNumbers,
  setCurrentViewWithTransition,
  MONTHS_SHORT,
  showGameOver,
  onSecondChance,
  onNewGame
}) {
  if (!game) return null;

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-black relative overflow-y-auto pb-8">
      {showGameOver && <GameOverModal onSecondChance={onSecondChance} onNewGame={onNewGame} />}

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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const count = numberCounts[num] || 0;
          const isComplete = count >= 9;
          const isPulsing = pulseNumbers.has(num);

          let btnClass = "aspect-[3/5] flex items-center justify-center text-3xl sm:text-[44px] font-light text-yellow-500 active:scale-90 transition-all duration-300 active:bg-yellow-500 active:text-black rounded-xl italic leading-none ";

          if (isPulsing) {
            btnClass += "scale-110 bg-yellow-500 !text-black shadow-[0_0_20px_rgba(234,179,8,0.8)]";
          } else if (isComplete) {
            btnClass += "opacity-0 pointer-events-none";
          } else {
            btnClass += "opacity-100";
          }

          return (
            <button
              key={num}
              onClick={()=>handleInput(num)}
              className={btnClass}
              disabled={isComplete && !isPulsing}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
