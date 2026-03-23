import React from 'react';
import { Icons } from './Icons';
import { GameOverModal } from './GameOverModal';
import { playSound, playHaptic } from './AudioHaptics';

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
  scoreAnimations,
  setCurrentViewWithTransition,
  MONTHS_SHORT,
  showGameOver,
  onSecondChance,
  onNewGame,
  settings
}) {
  if (!game) return null;

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative overflow-y-auto pb-16 z-10">
      {showGameOver && <GameOverModal onSecondChance={onSecondChance} onNewGame={onNewGame} />}

      <header className="px-5 pt-12 pb-2 flex justify-between items-center shrink-0 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
        <button onClick={()=>setCurrentViewWithTransition(game.isDaily ? 'daily' : 'home')} className="text-[#FCD34D] opacity-100"><Icons.Chevron dir="left" size={32} /></button>
        <div className="text-2xl font-bold italic text-[#FCD34D] leading-none">0</div>
        <button className="text-[#FCD34D] opacity-100"><Icons.Settings /></button>
      </header>
      <div className="px-5 grid grid-cols-4 gap-2 mb-6 text-center drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col border-r border-[#3E1F10]/50">
           <span className="text-[10px] font-bold uppercase tracking-tighter text-[#FFFDD0]">Score</span>
           <div className="flex items-center justify-center gap-1 text-[#FCD34D] opacity-100">
              <span className="text-xs font-bold tabular-nums">{(game.score || 0).toLocaleString()}</span>
           </div>
        </div>
        <div className="flex flex-col border-r border-[#3E1F10]/50">
           <span className="text-[10px] font-bold uppercase tracking-tighter text-[#FFFDD0]">{game.isDaily ? "Date" : "Difficulty"}</span>
           <div className="flex items-center justify-center gap-1 text-[#FCD34D] opacity-100">
              {game.isDaily ? <span className="text-xs font-bold uppercase">{game.day} {MONTHS_SHORT[game.month]}</span> : <span className="text-xs font-bold uppercase">{game.diff}</span>}
           </div>
        </div>
        <div className="flex flex-col border-r border-[#3E1F10]/50">
           <span className="text-[10px] font-semibold text-[#FFFDD0] uppercase tracking-tighter">Mistakes</span>
           <span className={`text-xs font-bold ${err > 0 ? 'text-[#FB7185]' : 'text-[#FCD34D]'} opacity-100`}>{err}/3</span>
        </div>
        {settings?.timer && (
          <div className="flex flex-col">
             <span className="text-[10px] font-semibold text-[#FFFDD0] uppercase tracking-tighter">Time</span>
             <div className="flex items-center justify-center gap-1.5 text-[#FCD34D] opacity-100">
                <span className="text-xs font-bold tabular-nums">{fmtTime(time)}</span>
                <div className="bg-[#3E1F10] p-1 rounded-full text-[#FCD34D]"><Icons.Pause /></div>
             </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes sweep-row {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 0.8; }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes sweep-col {
          0% { transform: scaleY(0); opacity: 0; }
          50% { transform: scaleY(1); opacity: 0.8; }
          100% { transform: scaleY(1); opacity: 0; }
        }
        @keyframes pulse-box {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes float-up-fade {
          0% { transform: translate(-50%, -50%); opacity: 0; }
          20% { transform: translate(-50%, -100%); opacity: 1; }
          100% { transform: translate(-50%, -200%); opacity: 0; }
        }
        @keyframes number-scale {
          0% { transform: scale(1); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes swipe-down-fade {
          0% { transform: translate(-50%, -200%); opacity: 0; }
          20% { transform: translate(-50%, -50%); opacity: 1; }
          80% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-50%, 0%); opacity: 0; }
        }
        .anim-sweep-row { animation: sweep-row 0.8s ease-out forwards; transform-origin: left; }
        .anim-sweep-col { animation: sweep-col 0.8s ease-out forwards; transform-origin: top; }
        .anim-pulse-box { animation: pulse-box 0.8s ease-out forwards; }
        .anim-score { animation: float-up-fade 1s ease-out forwards; }
        .anim-number-scale { animation: number-scale 0.8s ease-out forwards; }
        .anim-swipe-down { animation: swipe-down-fade 0.6s ease-out forwards; }
      `}</style>
      <div className="px-2 mb-6 flex-1 min-h-0 flex items-center justify-center relative">
        <div className="relative w-full max-w-[min(100vw-16px,50vh)] aspect-square grid grid-cols-9 bg-[#D2B48C] border-[4px] border-[#3E2723] rounded-sm mx-auto shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]">
          {rewardAnimations?.map(anim => {
            if (anim.type === 'row') {
              return (
                <div key={anim.id} className="absolute left-0 right-0 z-20 pointer-events-none anim-sweep-row" style={{ top: `${(anim.index / 9) * 100}%`, height: '11.11%', background: 'linear-gradient(90deg, transparent, #FFFDD0, #FFD700, transparent)' }}>
                  <div className="absolute top-1/2 left-1/2 font-bold italic text-[#FFFDD0] text-xl drop-shadow-md anim-score">+100</div>
                </div>
              );
            }
            if (anim.type === 'col') {
              return (
                <div key={anim.id} className="absolute top-0 bottom-0 z-20 pointer-events-none anim-sweep-col" style={{ left: `${(anim.index / 9) * 100}%`, width: '11.11%', background: 'linear-gradient(180deg, transparent, #FFFDD0, #FFD700, transparent)' }}>
                  <div className="absolute top-1/2 left-1/2 font-bold italic text-[#FFFDD0] text-xl drop-shadow-md anim-score">+100</div>
                </div>
              );
            }
            if (anim.type === 'box') {
              return (
                <div key={anim.id} className="absolute z-20 pointer-events-none anim-pulse-box flex items-center justify-center bg-gradient-to-br from-[#FFFDD0] to-[#FFD700] opacity-80" style={{ left: `${(anim.bc / 3) * 100}%`, top: `${(anim.br / 3) * 100}%`, width: '33.33%', height: '33.33%' }}>
                  <div className="absolute top-1/2 left-1/2 font-bold italic text-[#000000] text-xl drop-shadow-md anim-score">+100</div>
                </div>
              );
            }
            return null;
          })}

          {game.board.map((val, idx) => {
            const r = Math.floor(idx/9), c = idx%9;
            const isS = sel === idx;
            const isR = sel !== null && settings?.highlightAreas && (Math.floor(sel/9) === r || sel%9 === c || (Math.floor(Math.floor(sel/9)/3) === Math.floor(r/3) && Math.floor((sel%9)/3) === Math.floor(c/3)));
            const isM = sel !== null && val !== 0 && val === game.board[sel] && settings?.highlightIdenticalNumbers;
            const isI = game.initial[idx];
            const isE = !isI && val !== 0 && val !== game.solution[idx];

            let bgClass = 'bg-transparent';
            let activeBorderClass = '';

            if (isS) {
              activeBorderClass = 'ring-[3px] ring-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)] z-10';
            } else if (isM) {
              bgClass = 'bg-[#8B5A2B]/40 ring-1 ring-[#3E2723] z-0';
            } else if (isR) {
              bgClass = 'bg-[#F5F5DC]/25';
            }

            const borderClass = `${(r+1)%3===0 && r<8 ? 'border-b-[2px] border-b-[#3E2723]' : 'border-b-[1px] border-b-[#3E2723]'} ${(c+1)%3===0 && c<8 ? 'border-r-[2px] border-r-[#3E2723]' : 'border-r-[1px] border-r-[#3E2723]'}`;
            const textClass = (isE && settings?.autoCheckMistakes) ? '!text-[#FB7185] font-semibold opacity-100' : isI ? '!text-[#000000] font-semibold opacity-100' : isS ? '!text-[#4E2C1C] italic font-semibold opacity-100' : '!text-[#4E2C1C] italic font-semibold opacity-100';

            const isPulsing = rewardAnimations?.some(anim => (anim.type === 'row' && anim.index === r) || (anim.type === 'col' && anim.index === c) || (anim.type === 'box' && anim.br === Math.floor(r/3) && anim.bc === Math.floor(c/3)));

            const cellScoreAnims = settings?.animatedScoring ? (scoreAnimations?.filter(a => a.idx === idx) || []) : [];

            return (
              <div key={idx} data-game-input onPointerDown={(e)=>{ e.preventDefault(); playHaptic('tap', settings); playSound('click', settings); setSel(idx); }} className={`relative flex items-center justify-center text-[28px] cursor-pointer transition-all duration-75 ${borderClass} ${bgClass} ${textClass} ${activeBorderClass}`}>
                {cellScoreAnims.map(anim => (
                  <div key={anim.id} className="absolute left-1/2 top-1/2 z-30 pointer-events-none anim-swipe-down">
                    <div className="bg-[#F5F5DC] text-[#FCD34D] font-bold text-sm px-2 py-1 rounded shadow-md border border-[#3E2723]">
                      +{anim.score}
                    </div>
                  </div>
                ))}
                {val !== 0 ? <div className={`transition-transform duration-75 ${isPulsing ? 'anim-number-scale' : ''}`}>{val}</div> : (
                  <div className="grid grid-cols-3 w-full h-full p-0.5 opacity-100 items-center justify-items-center">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <div key={n} className="text-[10px] leading-none flex items-center justify-center font-bold text-[#2D1B10] opacity-100">
                        {game.notes[idx].has(n) ? n : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-10 grid grid-cols-4 gap-4 mb-6">
        <button data-game-input onPointerDown={(e)=>{ e.preventDefault(); undo(); }} disabled={history.length === 0} className={`flex flex-col items-center gap-1 text-[#FFFDD0] active:scale-90 transition ${history.length === 0 ? 'opacity-40' : ''} drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]`}><Icons.Undo /><span className="text-[10px] font-bold uppercase tracking-widest">Undo</span></button>
        <button data-game-input onPointerDown={(e)=>{ e.preventDefault(); handleInput(0); }} className="flex flex-col items-center gap-1 text-[#FFFDD0] active:scale-90 transition drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]"><Icons.Erase /><span className="text-[10px] font-bold uppercase tracking-widest">Erase</span></button>
        <button
          data-game-input
          onPointerDown={(e) => {
            e.preventDefault();
            playHaptic('tap', settings);
            if (!notesMode) {
              playSound('pencil', settings);
            } else {
              playSound('click', settings);
            }
            setNotesMode(!notesMode);
          }}
          className={`flex flex-col items-center gap-1 ${notesMode ? 'text-[#FCD34D]' : 'text-[#FFFDD0]'} active:scale-90 transition drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]`}
        >
          <div className={`relative ${notesMode ? 'text-[#FCD34D]' : ''}`}><Icons.Notes /><div className={`absolute -top-1 -right-4 px-1 rounded text-[8px] font-bold uppercase ${notesMode ? 'bg-[#FCD34D] text-[#020617]' : 'bg-[#FFFDD0] text-[#020617]'}`}>{notesMode ? 'On' : 'Off'}</div></div><span className={`text-[10px] font-bold uppercase tracking-widest ${notesMode ? 'text-[#FCD34D]' : ''}`}>Notes</span>
        </button>
        <button data-game-input onPointerDown={(e)=>{ e.preventDefault(); playHaptic('tap', settings); playSound('click', settings); hint(); }} className="flex flex-col items-center gap-1 text-[#FFFDD0] active:scale-90 transition drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]"><Icons.Hint /><span className="text-[10px] font-bold uppercase tracking-widest">Hint</span></button>
      </div>
      <div className="px-2 sm:px-5 grid grid-cols-9 gap-1 mb-6 touch-none">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const count = numberCounts[num] || 0;
          const isComplete = count >= 9;
          const isPulsing = pulseNumbers.has(num);
          const isHidden = settings?.hideUsedNumbers && isComplete && !isPulsing;

          let btnClass = "aspect-[3/5] flex items-center justify-center text-3xl sm:text-[44px] font-bold text-[#000000] bg-[#F5F5DC] border-b-4 border-[#D2B48C] active:border-b-0 active:translate-y-1 transition-all duration-150 rounded-lg leading-none shadow-md ";

          if (isPulsing) {
            btnClass += "scale-110 !bg-[#FFD700] !border-[#F5F5DC] shadow-[0_0_20px_rgba(255,215,0,0.8)]";
          } else if (isHidden) {
            btnClass += "opacity-0 pointer-events-none";
          } else if (isComplete) {
            btnClass += "opacity-40 cursor-not-allowed";
          } else {
            btnClass += "opacity-100";
          }

          return (
            <button
              key={num}
              data-game-input
              onPointerDown={(e)=>{ e.preventDefault(); handleInput(num); }}
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
