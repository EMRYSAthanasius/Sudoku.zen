import React from 'react';
import { Icons } from './Icons';

export function GameOverModal({ onSecondChance, onNewGame }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-6">
      <div className="mg-glass-modal rounded-[36px] w-full max-w-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-6 text-[color:var(--mg-danger)] border border-red-500/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2 className="mg-font-display text-3xl font-medium text-[color:var(--mg-cream)] uppercase italic tracking-wider mb-3">Game Over</h2>
        <p className="text-[color:var(--mg-subtle)] text-sm font-medium mb-8">You have made 3 mistakes and lost this game.</p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onSecondChance}
            className="mg-btn-primary w-full py-4 rounded-[24px] font-semibold text-lg flex items-center justify-center gap-2 active:border-b-0 active:translate-y-0.5 transition-all duration-150"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Second Chance
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className="mg-btn-ghost w-full py-3 rounded-[24px] font-semibold text-lg active:scale-95 transition"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
