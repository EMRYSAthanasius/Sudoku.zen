import React from 'react';
import { Icons } from './Icons';

export function Home({ currentView, setCurrentView, best, game, setPicker, picker, userStats, start, time, fmtTime }) {
  const LADDER = [
    { level: 'Easy', required: 0, reqLevel: null },
    { level: 'Medium', required: 3, reqLevel: 'Easy' },
    { level: 'Hard', required: 3, reqLevel: 'Medium' },
    { level: 'Expert', required: 10, reqLevel: 'Hard' },
    { level: 'Master', required: 15, reqLevel: 'Expert' },
    { level: 'Extreme', required: 20, reqLevel: 'Master' },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative bg-slate-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 flex flex-col">
      <header className="pt-10 pb-8 flex flex-col items-center">
        <h1 className="text-[28px] font-semibold tracking-tight uppercase italic leading-none text-slate-50">
          Sudoku<span className="text-[#38B2AC] font-bold">.zen</span>
        </h1>
      </header>

      <div className="flex gap-4 mb-10 h-44">
        <button onClick={() => setCurrentView('daily')} className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 border-[0.5px] border-slate-600 rounded-[32px] p-5 flex flex-col items-center justify-between active:scale-95 transition shadow-2xl">
          <div className="bg-[#38B2AC]/10 p-3 rounded-2xl text-[#38B2AC]">
            <Icons.Nav type="daily" active={true} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-50">Daily Challenge</p>
          </div>
          <div className="bg-[#38B2AC] text-slate-900 px-8 py-2 rounded-full text-sm font-bold">Play</div>
        </button>
        <div className="flex-1 bg-gradient-to-b from-slate-800 to-slate-900 border-[0.5px] border-slate-600 rounded-[32px] p-5 flex flex-col items-center justify-between shadow-2xl">
          <div className="bg-[#38B2AC]/10 p-3 rounded-2xl text-[#38B2AC]">
            <Icons.Trophy size={28} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-50">Tournament</p>
          </div>
          <div className="bg-[#38B2AC] text-slate-900 px-8 py-2 rounded-full text-sm font-bold">Play</div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-10">
        <p className="text-slate-400 text-[11px] font-bold mb-1 uppercase tracking-widest">All-Time Best Score</p>
        <div className="flex items-center gap-2">
          <Icons.Trophy fill="#38B2AC" size={24} />
          <span className="text-[52px] font-semibold tracking-tighter text-[#38B2AC] italic tabular-nums leading-none">{best.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        {game && (
          <button onClick={() => setCurrentView('game')} className="w-full bg-[#38B2AC] text-slate-900 py-5 rounded-[36px] shadow-2xl flex flex-col items-center justify-center border-2 border-[#38B2AC] active:scale-95 transition">
            <span className="text-lg font-bold">Continue Game</span>
            <div className="flex items-center gap-2 opacity-70 text-sm font-medium mt-0.5"><span>{fmtTime(time)} - {game.diff}</span></div>
          </button>
        )}
        <button onClick={() => setPicker(true)} className={`w-full py-6 rounded-[36px] text-xl font-bold active:scale-95 transition ${game ? 'bg-slate-800 text-[#38B2AC] border-2 border-slate-600' : 'bg-[#38B2AC] text-slate-900'}`}>New Game</button>
      </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 flex justify-around p-4 pb-8 z-50 pointer-events-auto">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1.5 ${currentView==='home'?'text-[#38B2AC]':'text-slate-500'}`}><Icons.Nav type="main" active={currentView==='home'}/><span className="text-[10px] font-bold uppercase tracking-widest">Main</span></button>
        <button onClick={() => setCurrentView('daily')} className={`flex flex-col items-center gap-1.5 ${currentView==='daily'?'text-[#38B2AC]':'text-slate-500'}`}><Icons.Nav type="daily" active={currentView==='daily'}/><span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenges</span></button>
        <div className="flex flex-col items-center gap-1.5 text-slate-500"><Icons.Nav type="me" /><span className="text-[10px] font-bold uppercase tracking-widest">Me</span></div>
      </div>

      {picker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/90 backdrop-blur-sm transition-opacity duration-300" onClick={() => setPicker(false)}>
          <div className="relative bg-slate-800 w-full max-w-md rounded-t-[50px] p-8 pb-12 shadow-2xl border-t border-[#38B2AC]/20 max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-8 shrink-0" />
            <div className="flex flex-col">
              {LADDER.map(({ level, required, reqLevel }) => {
                const locked = required > 0 && (userStats[reqLevel] || 0) < required;
                return (
                  <button
                    key={level}
                    disabled={locked}
                    onClick={() => start(level)}
                    className={`w-full py-5 px-4 flex flex-col items-center transition border-b border-slate-700 last:border-none ${locked ? 'opacity-60' : 'opacity-100 hover:bg-slate-700/30'} rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      {locked && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                      <span className={`text-2xl font-bold uppercase tracking-wider ${locked ? 'text-slate-500' : 'text-[#6366F1]'}`}>
                        {level}
                      </span>
                    </div>
                    {locked && (
                      <span className="text-xs text-slate-500 mt-1 font-medium tracking-wide">
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
              className="w-full mt-6 py-4 bg-[#6366F1]/10 text-[#6366F1] font-bold uppercase tracking-wider rounded-[24px] border border-[#6366F1]/20 active:scale-95 transition"
            >
              Restart Progress
            </button>
            <button onClick={() => setPicker(false)} className="w-full mt-4 py-2 text-slate-400 font-bold uppercase text-[11px] tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
