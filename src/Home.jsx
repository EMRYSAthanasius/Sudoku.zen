import React from 'react';
import { Icons } from './Icons';

export function Home({ currentView, setCurrentView, best, game, setPicker, picker, wins, start, time, fmtTime }) {
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
          <div className="relative bg-slate-800 w-full max-w-md rounded-t-[50px] p-10 pb-14 shadow-2xl border-t border-[#38B2AC]/20" onClick={e=>e.stopPropagation()}>
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-10" />
            <div className="space-y-2">
              {['Easy', 'Medium', 'Hard'].map((t, i) => {
                const locked = i > 0 && wins[['Easy','Medium'][i-1]] === 0;
                return (
                  <button key={t} disabled={locked} onClick={() => start(t)} className={`w-full py-5 px-6 flex flex-col items-center transition border-b border-slate-700/50 last:border-none ${locked ? 'opacity-20' : 'opacity-100'}`}>
                    <div className="flex items-center gap-3">{locked && <span className="text-slate-500">🔒</span>}<span className="text-2xl font-bold uppercase text-[#38B2AC]">{t}</span></div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setPicker(false)} className="w-full mt-10 py-2 text-slate-400 font-bold uppercase text-[11px] tracking-widest">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
