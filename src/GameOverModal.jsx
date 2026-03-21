import React from 'react';
import { Icons } from './Icons';

export function GameOverModal({ onSecondChance, onNewGame }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm px-6">
      <div className="bg-slate-800 border-[0.5px] border-[#38B2AC]/50 rounded-[36px] w-full max-w-sm p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-400">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-50 uppercase italic tracking-wider mb-3">Game Over</h2>
        <p className="text-slate-400 text-sm font-medium mb-8">You have made 3 mistakes and lost this game.</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onSecondChance}
            className="w-full bg-[#38B2AC] text-slate-900 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition shadow-[0_0_20px_rgba(56,178,172,0.3)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Second Chance
          </button>
          <button
            onClick={onNewGame}
            className="w-full bg-transparent border-2 border-slate-600 text-slate-300 py-4 rounded-full font-bold text-lg active:scale-95 transition"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
