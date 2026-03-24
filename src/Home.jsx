import React from 'react';
import { Icons } from './Icons';
import { Navigation } from './Navigation';

export function Home({ currentView, setCurrentView, best, normalGameState, resumeNormalGame, setPicker, picker, userStats, start, time, fmtTime }) {
  const LADDER = [
    { level: 'Easy', required: 0, reqLevel: null },
    { level: 'Medium', required: 3, reqLevel: 'Easy' },
    { level: 'Hard', required: 3, reqLevel: 'Medium' },
    { level: 'Expert', required: 10, reqLevel: 'Hard' },
    { level: 'Master', required: 15, reqLevel: 'Expert' },
    { level: 'Extreme', required: 20, reqLevel: 'Master' },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative bg-transparent overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 flex flex-col">
      <header className="pt-10 pb-8 flex flex-col items-center">
        <h1 className="text-[28px] font-semibold tracking-tight uppercase italic leading-none text-[#2D1B10]">
          Sudoku<span className="text-[#C19A6B] font-bold">.zen</span>
        </h1>
      </header>

      <div className="flex gap-4 mb-10 h-44">
        <button onClick={() => setCurrentView('daily')} className="flex-1 bg-[#A0522D]/40 border-[2px] border-[#3E1F10] rounded-[24px] p-5 flex flex-col items-center justify-between active:scale-95 transition shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]">
          <div className="bg-[#C19A6B]/20 p-3 rounded-2xl text-[#C19A6B]">
            <Icons.Nav type="daily" active={true} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#2D1B10]">Daily Challenge</p>
          </div>
          <div className="bg-[#C19A6B] text-[#2D1B10] px-8 py-2 rounded-full text-sm font-bold shadow-md">Play</div>
        </button>
        <button className="flex-1 bg-[#A0522D]/40 border-[2px] border-[#3E1F10] rounded-[24px] p-5 flex flex-col items-center justify-between shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]">
          <div className="bg-[#C19A6B]/20 p-3 rounded-2xl text-[#C19A6B]">
            <Icons.Trophy size={28} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#2D1B10]">Tournament</p>
          </div>
          <div className="bg-[#C19A6B] text-[#2D1B10] px-8 py-2 rounded-full text-sm font-bold shadow-md">Play</div>
        </button>
      </div>

      <div className="flex flex-col items-center mb-10 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
        <p className="text-[#FFFDD0] text-[11px] font-bold mb-1 uppercase tracking-widest">All-Time Best Score</p>
        <div className="flex items-center gap-2">
          <Icons.Trophy fill="#FCD34D" stroke="#FCD34D" size={24} />
          <span className="text-[52px] font-semibold tracking-tighter text-[#FCD34D] italic tabular-nums leading-none">{best.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        {normalGameState && (
          <button data-game-input onClick={resumeNormalGame} className="w-full bg-[#C19A6B] text-[#2D1B10] py-5 rounded-[24px] shadow-2xl flex flex-col items-center justify-center border-b-4 border-[#A0522D] active:border-b-0 active:translate-y-1 transition-all duration-150">
            <span className="text-lg font-bold">Continue Game</span>
            <div className="flex items-center gap-2 opacity-70 text-sm font-medium mt-0.5"><span>{fmtTime(normalGameState.time || 0)} - {normalGameState.diff}</span></div>
          </button>
        )}
        <button onClick={() => setPicker(true)} className={`w-full py-6 rounded-[24px] text-xl font-bold active:border-b-0 active:translate-y-1 transition-all duration-150 border-b-4 ${normalGameState ? 'bg-[#3E1F10] text-[#C19A6B] border-[#2D1B10]' : 'bg-[#C19A6B] text-[#2D1B10] border-[#A0522D]'}`}>New Game</button>
      </div>
      </div>

      <Navigation currentView={currentView} setCurrentViewWithTransition={setCurrentView} />

      {picker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={() => setPicker(false)}>
          <div className="relative bg-[#5D2E17] w-full max-w-md rounded-t-[50px] p-8 pb-12 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] border-t border-[#3E1F10] max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="w-16 h-1 bg-[#3E1F10] rounded-full mx-auto mb-8 shrink-0" />
            <div className="flex flex-col">
              {LADDER.map(({ level, required, reqLevel }) => {
                const locked = required > 0 && (userStats[reqLevel] || 0) < required;
                return (
                  <button
                    key={level}
                    disabled={locked}
                    onClick={() => start(level)}
                    className={`w-full py-5 px-4 flex flex-col items-center transition border-b border-[#3E1F10] last:border-none ${locked ? 'opacity-60' : 'opacity-100 hover:bg-[#3E1F10]/30'} rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      {locked && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3E1F10]">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                      <span className={`text-2xl font-bold uppercase tracking-wider ${locked ? 'text-[#3E1F10]' : 'text-[#C19A6B]'}`}>
                        {level}
                      </span>
                    </div>
                    {locked && (
                      <span className="text-xs text-[#3E1F10] mt-1 font-bold tracking-wide">
                        Complete {required} {reqLevel} levels to unlock
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('sudokuUserStats');
                window.location.reload();
              }}
              className="w-full mt-6 py-4 bg-[#C19A6B]/20 text-[#C19A6B] font-bold uppercase tracking-wider rounded-[24px] border border-[#C19A6B]/30 active:scale-95 transition"
            >
              Restart Progress
            </button>
            <button onClick={() => setPicker(false)} className="w-full mt-4 py-2 text-[#3E1F10] font-bold uppercase text-[11px] tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
