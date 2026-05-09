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
        <h1 className="mg-font-display text-[clamp(1.75rem,5vw,2rem)] font-medium tracking-tight text-[color:var(--mg-cream)]">
          Sudoku<span className="text-[color:var(--mg-gold-bright)] font-semibold italic">.zen</span>
        </h1>
      </header>

      <div className="flex gap-4 mb-10 h-44">
        <button onClick={() => setCurrentView('daily')} className="mg-feature-card flex-1 rounded-[24px] p-5 flex flex-col items-center justify-between active:scale-[0.98] transition-transform">
          <div className="rounded-2xl p-3 bg-[color:rgba(232,197,71,0.12)] text-[color:var(--mg-gold-bright)] border border-[color:var(--mg-border)]">
            <Icons.Nav type="daily" active={true} />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-[color:var(--mg-cream)] tracking-tight">Daily Challenge</p>
          </div>
          <div className="mg-btn-primary w-full max-w-[9rem] py-2 rounded-full text-sm font-semibold text-center">Play</div>
        </button>
        <button type="button" className="mg-feature-card flex-1 rounded-[24px] p-5 flex flex-col items-center justify-between opacity-90">
          <div className="rounded-2xl p-3 bg-[color:rgba(232,197,71,0.08)] text-[color:var(--mg-gold-soft)] border border-[color:var(--mg-border)]">
            <Icons.Trophy size={28} />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-[color:var(--mg-cream)] tracking-tight">Tournament</p>
          </div>
          <div className="mg-btn-primary w-full max-w-[9rem] py-2 rounded-full text-sm font-semibold text-center opacity-80">Play</div>
        </button>
      </div>

      <div className="flex flex-col items-center mb-10">
        <p className="text-[color:var(--mg-subtle)] text-[11px] font-semibold mb-2 uppercase tracking-[0.3em]">All-Time Best Score</p>
        <div className="flex items-center gap-2">
          <Icons.Trophy fill="var(--mg-gold-bright)" stroke="var(--mg-gold-bright)" size={24} />
          <span className="mg-font-display text-[52px] font-medium tracking-tight text-[color:var(--mg-gold-bright)] italic tabular-nums leading-none">{best.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        {normalGameState && (
          <button data-game-input onClick={resumeNormalGame} className="mg-btn-primary w-full py-5 rounded-[24px] flex flex-col items-center justify-center active:border-b-0 active:translate-y-0.5 transition-all duration-150">
            <span className="text-lg font-semibold">Continue Game</span>
            <div className="flex items-center gap-2 opacity-85 text-sm font-medium mt-0.5 text-[color:var(--mg-void)]"><span>{fmtTime(normalGameState.time || 0)} — {normalGameState.diff}</span></div>
          </button>
        )}
        <button onClick={() => setPicker(true)} className={`w-full py-6 rounded-[24px] text-lg font-semibold transition-all duration-150 border-b-4 active:border-b-0 active:translate-y-0.5 ${normalGameState ? 'mg-btn-secondary border-b-0 rounded-[24px]' : 'mg-btn-primary'}`}>New Game</button>
      </div>
      </div>

      <Navigation currentView={currentView} setCurrentViewWithTransition={setCurrentView} />

      {picker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-md transition-opacity duration-300" onClick={() => setPicker(false)}>
          <div className="mg-glass-modal relative w-full max-w-md rounded-t-[2rem] p-8 pb-12 max-h-[85vh] overflow-y-auto border-b-0" onClick={e=>e.stopPropagation()}>
            <div className="w-16 h-1 bg-[color:var(--mg-border-bright)] rounded-full mx-auto mb-8 shrink-0" />
            <div className="flex flex-col">
              {LADDER.map(({ level, required, reqLevel }) => {
                const locked = required > 0 && (userStats[reqLevel] || 0) < required;
                return (
                  <button
                    key={level}
                    disabled={locked}
                    onClick={() => start(level)}
                    className={`w-full py-5 px-4 flex flex-col items-center transition border-b border-[color:var(--mg-border)] last:border-none ${locked ? 'opacity-50' : 'hover:bg-[color:rgba(255,255,255,0.04)]'} rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      {locked && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--mg-subtle)]">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      )}
                      <span className={`text-xl font-semibold uppercase tracking-wider ${locked ? 'text-[color:var(--mg-subtle)]' : 'text-[color:var(--mg-gold-bright)]'}`}>
                        {level}
                      </span>
                    </div>
                    {locked && (
                      <span className="text-xs text-[color:var(--mg-subtle)] mt-1 font-medium tracking-wide">
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
              className="w-full mt-6 py-4 text-[color:var(--mg-gold-bright)] font-semibold uppercase tracking-wider rounded-[24px] border border-[color:var(--mg-border-bright)] bg-[color:rgba(255,255,255,0.04)] active:scale-[0.98] transition"
            >
              Restart Progress
            </button>
            <button onClick={() => setPicker(false)} className="w-full mt-4 py-2 text-[color:var(--mg-subtle)] font-semibold uppercase text-[11px] tracking-[0.2em]">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
