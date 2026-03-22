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
  rewardAnimations,
  setCurrentViewWithTransition,
  MONTHS_SHORT,
  showGameOver,
  onSecondChance,
  onNewGame
}) {
  if (!game) return null;

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative overflow-y-auto pb-8 z-10">
      {showGameOver && <GameOverModal onSecondChance={onSecondChance} onNewGame={onNewGame} />}

      <header className="px-5 pt-12 pb-2 flex justify-between items-center shrink-0">
        <button onClick={()=>setCurrentViewWithTransition(game.isDaily ? 'daily' : 'home')} className="text-[#2D1B10]"><Icons.Chevron dir="left" size={32} /></button>
        <div className="text-2xl font-bold italic text-[#2D1B10] leading-none">0</div>
        <button className="text-[#2D1B10]"><Icons.Settings /></button>
      </header>
      <div className="px-5 grid grid-cols-4 gap-2 mb-6 text-center">
        <div className="flex flex-col border-r border-[#3E1F10]/50">
           <span className="text-[10px] font-semibold text-[#2D1B10]/70 uppercase tracking-tighter">{game.isDaily ? "Date" : "All Time"}</span>
           <div className="flex items-center justify-center gap-1 text-[#2D1B10]">
              {game.isDaily ? <span className="text-xs font-bold uppercase">{game.day} {MONTHS_SHORT[game.month]}</span> : <><Icons.Trophy size={11} fill="#2D1B10" /><span className="text-xs font-bold tabular-nums">{best.toLocaleString()}</span></>}
           </div>
        </div>
        <div className="flex flex-col border-r border-[#3E1F10]/50">
           <span className="text-[10px] font-semibold text-[#2D1B10]/70 uppercase tracking-tighter">{game.isDaily ? "All Time" : "Difficulty"}</span>
           <div className="flex items-center justify-center gap-1 text-[#2D1B10]">
              {game.isDaily ? <><Icons.Trophy size={11} fill="#2D1B10" /><span className="text-xs font-bold tabular-nums">{best.toLocaleString()}</span></> : <span className="text-xs font-bold uppercase">{game.diff}</span>}
           </div>
        </div>
        <div className="flex flex-col border-r border-[#3E1F10]/50">
           <span className="text-[10px] font-semibold text-[#2D1B10]/70 uppercase tracking-tighter">Mistakes</span>
           <span className={`text-xs font-bold ${err > 0 ? 'text-[#FB7185]' : 'text-[#2D1B10]'}`}>{err}/3</span>
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] font-semibold text-[#2D1B10]/70 uppercase tracking-tighter">Time</span>
           <div className="flex items-center justify-center gap-1.5 text-[#2D1B10]">
              <span className="text-xs font-bold tabular-nums">{fmtTime(time)}</span>
              <div className="bg-[#3E1F10]/20 p-1 rounded-full text-[#2D1B10]"><Icons.Pause /></div>
           </div>
        </div>
      </div>
      <style>{`
        @keyframes sweep-row {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 0.5; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes sweep-col {
          0% { transform: scaleY(0); opacity: 0; }
          50% { transform: scaleY(1); opacity: 0.5; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        @keyframes pulse-box {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes float-up-fade {
          0% { transform: translate(-50%, -50%); opacity: 0; }
          20% { transform: translate(-50%, -100%); opacity: 1; }
          100% { transform: translate(-50%, -200%); opacity: 0; }
        }
        .anim-sweep-row { animation: sweep-row 0.6s ease-out forwards; transform-origin: left; }
        .anim-sweep-col { animation: sweep-col 0.6s ease-out forwards; transform-origin: top; }
        .anim-pulse-box { animation: pulse-box 0.6s ease-out forwards; }
        .anim-score { animation: float-up-fade 1s ease-out forwards; }
      `}</style>
      <div className="px-2 mb-6 flex-1 min-h-0 flex items-center justify-center relative">
        <div className="relative w-full max-w-[min(100vw-16px,50vh)] aspect-square grid grid-cols-9 bg-[#D2B48C] border-[4px] border-[#3E2723] rounded-sm mx-auto shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]">
          {rewardAnimations?.map(anim => {
            if (anim.type === 'row') {
              return (
                <div key={anim.id} className="absolute left-0 right-0 z-20 pointer-events-none anim-sweep-row" style={{ top: `${(anim.index / 9) * 100}%`, height: '11.11%', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }}>
                  <div className="absolute top-1/2 left-1/2 font-black italic text-[#FFD700] text-xl drop-shadow-md anim-score">+100</div>
                </div>
              );
            }
            if (anim.type === 'col') {
              return (
                <div key={anim.id} className="absolute top-0 bottom-0 z-20 pointer-events-none anim-sweep-col" style={{ left: `${(anim.index / 9) * 100}%`, width: '11.11%', background: 'linear-gradient(180deg, transparent, #FFD700, transparent)' }}>
                  <div className="absolute top-1/2 left-1/2 font-black italic text-[#FFD700] text-xl drop-shadow-md anim-score">+100</div>
                </div>
              );
            }
            if (anim.type === 'box') {
              return (
                <div key={anim.id} className="absolute z-20 pointer-events-none anim-pulse-box flex items-center justify-center bg-[#FFD700]/50" style={{ left: `${(anim.bc / 3) * 100}%`, top: `${(anim.br / 3) * 100}%`, width: '33.33%', height: '33.33%' }}>
                  <div className="absolute top-1/2 left-1/2 font-black italic text-[#FFD700] text-xl drop-shadow-md anim-score">+100</div>
                </div>
              );
            }
            return null;
          })}

          {game.board.map((val, idx) => {
            const r = Math.floor(idx/9), c = idx%9;
            const isS = sel === idx;
            const isR = sel !== null && (Math.floor(sel/9) === r || sel%9 === c || (Math.floor(Math.floor(sel/9)/3) === Math.floor(r/3) && Math.floor((sel%9)/3) === Math.floor(c/3)));
            const isM = sel !== null && val !== 0 && val === game.board[sel];
            const isI = game.initial[idx];
            const isE = !isI && val !== 0 && val !== game.solution[idx];

            let bgClass = 'bg-transparent';
            let activeBorderClass = '';

            if (isS) {
              activeBorderClass = 'ring-[3px] ring-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)] z-10';
            } else if (isM) {
              bgClass = 'bg-[#8B5A2B]/20';
            } else if (isR) {
              bgClass = 'bg-[#8B5A2B]/10';
            }

            const borderClass = `${(r+1)%3===0 && r<8 ? 'border-b-[2px] border-b-[#3E2723]' : 'border-b-[1px] border-b-[#3E2723]/50'} ${(c+1)%3===0 && c<8 ? 'border-r-[2px] border-r-[#3E2723]' : 'border-r-[1px] border-r-[#3E2723]/50'}`;
            const textClass = isE ? '!text-[#B22222] font-bold' : isI ? 'text-[#000000] font-bold' : isS ? 'text-[#7B1113] italic font-bold' : 'text-[#7B1113] italic font-bold';

            return (
              <div key={idx} onClick={()=>setSel(idx)} className={`relative flex items-center justify-center text-[28px] cursor-pointer transition-all duration-75 ${borderClass} ${bgClass} ${textClass} ${activeBorderClass}`}>
                {val !== 0 ? val : (<div className="grid grid-cols-3 w-full h-full p-0.5 opacity-60">{[1,2,3,4,5,6,7,8,9].map(n => (<div key={n} className="text-[8px] leading-none flex items-center justify-center font-bold text-[#7B1113]">{game.notes[idx].has(n) ? n : ''}</div>))}</div>)}
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-10 grid grid-cols-4 gap-4 mb-6">
        <button onClick={undo} disabled={history.length === 0} className={`flex flex-col items-center gap-1 text-[#2D1B10] active:scale-90 transition ${history.length === 0 ? 'opacity-40' : ''}`}><Icons.Undo /><span className="text-[10px] font-bold uppercase tracking-widest">Undo</span></button>
        <button onClick={()=>handleInput(0)} className="flex flex-col items-center gap-1 text-[#2D1B10] active:scale-90 transition"><Icons.Erase /><span className="text-[10px] font-bold uppercase tracking-widest">Erase</span></button>
        <button onClick={()=>setNotesMode(!notesMode)} className={`flex flex-col items-center gap-1 ${notesMode ? 'text-[#7B1113]' : 'text-[#2D1B10]'} active:scale-90 transition`}><div className={`relative ${notesMode ? 'text-[#7B1113]' : ''}`}><Icons.Notes /><div className={`absolute -top-1 -right-4 px-1 rounded text-[8px] font-black uppercase ${notesMode ? 'bg-[#7B1113] text-[#F5F5DC]' : 'bg-[#2D1B10] text-[#F5F5DC]'}`}>{notesMode ? 'On' : 'Off'}</div></div><span className={`text-[10px] font-bold uppercase tracking-widest ${notesMode ? 'text-[#7B1113]' : ''}`}>Notes</span></button>
        <button onClick={hint} className="flex flex-col items-center gap-1 text-[#2D1B10] active:scale-90 transition"><Icons.Hint /><span className="text-[10px] font-bold uppercase tracking-widest">Hint</span></button>
      </div>
      <div className="px-2 sm:px-5 grid grid-cols-9 gap-1 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const count = numberCounts[num] || 0;
          const isComplete = count >= 9;
          const isPulsing = pulseNumbers.has(num);

          let btnClass = "aspect-[3/5] flex items-center justify-center text-3xl sm:text-[44px] font-bold text-[#000000] bg-[#F5F5DC] border-b-4 border-[#D2B48C] active:border-b-0 active:translate-y-1 transition-all duration-150 rounded-lg leading-none shadow-md ";

          if (isPulsing) {
            btnClass += "scale-110 !bg-[#FFD700] !border-[#F5F5DC] shadow-[0_0_20px_rgba(255,215,0,0.8)]";
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
