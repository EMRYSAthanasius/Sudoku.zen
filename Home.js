import React from 'react';
import { Icons } from './Icons';

export function Home({ currentView, setCurrentView, best, game, setPicker, picker, wins, start, time, fmtTime }) {
  return (
    <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative bg-black">
      <header className="pt-10 pb-8 flex flex-col items-center">
        <h1 className="text-[28px] font-semibold tracking-tight uppercase italic leading-none text-white">
          Sudoku<span className="text-yellow-500 font-bold">.zen</span>
        </h1>
      </header>

      <div className="flex gap-4 mb-10 h-44">
        <button onClick={() => setCurrentView('daily')} className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-950 border-[0.5px] border-[#EAB308] rounded-[32px] p-5 flex flex-col items-center justify-between active:scale-95 transition shadow-2xl">
          <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500">
            <Icons.Nav type="daily" active={true} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">Daily Challenge</p>
          </div>
          <div className="bg-yellow-500 text-black px-8 py-2 rounded-full text-sm font-bold">Play</div>
        </button>
        <div className="flex-1 bg-gradient-to-b from-zinc-800 to-zinc-950 border-[0.5px] border-[#EAB308] rounded-[32px] p-5 flex flex-col items-center justify-between shadow-2xl">
          <div className="bg-yellow-500/10 p-3 rounded-2xl text-yellow-500">
            <Icons.Trophy size={28} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">Tournament</p>
          </div>
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
          <button onClick={() => setCurrentView('game')} className="w-full bg-yellow-500 text-black py-5 rounded-[36px] shadow-2xl flex flex-col items-center justify-center border-2 border-yellow-500 active:scale-95 transition">
            <span className="text-lg font-bold">Continue Game</span>
            <div className="flex items-center gap-2 opacity-70 text-sm font-medium mt-0.5"><span>{fmtTime(time)} - {game.diff}</span></div>
          </button>
        )}
        <button onClick={() => setPicker(true)} className={`w-full py-6 rounded-[36px] text-xl font-bold active:scale-95 transition ${game ? 'bg-zinc-900 text-yellow-500 border-2 border-yellow-500/20' : 'bg-yellow-500 text-black'}`}>New Game</button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-4 pb-8 z-10">
        <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center gap-1.5 ${currentView==='home'?'text-yellow-500':'text-zinc-600'}`}><Icons.Nav type="main" active={currentView==='home'}/><span className="text-[10px] font-bold uppercase tracking-widest">Main</span></button>
        <button onClick={() => setCurrentView('daily')} className={`flex flex-col items-center gap-1.5 ${currentView==='daily'?'text-yellow-500':'text-zinc-600'}`}><Icons.Nav type="daily" active={currentView==='daily'}/><span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenges</span></button>
        <div className="flex flex-col items-center gap-1.5 text-zinc-600"><Icons.Nav type="me" /><span className="text-[10px] font-bold uppercase tracking-widest">Me</span></div>
      </div>

      {picker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300" onClick={() => setPicker(false)}>
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
  );
}
