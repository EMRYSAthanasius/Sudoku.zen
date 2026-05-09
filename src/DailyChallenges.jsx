import React from 'react';
import { Icons } from './Icons';
import { RealisticTrophy } from './RealisticTrophy';
import { Navigation } from './Navigation';

export function DailyChallenges({ cMonth, setCMonth, MONTHS, calendarDays, start, setCurrentViewWithTransition }) {
  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto flex flex-col pb-32">
        <div className="mg-hero-daily relative min-h-[42%] flex flex-col items-center border-b border-[color:var(--mg-border)] overflow-hidden shrink-0">
          <header className="w-full px-6 pt-12 flex justify-between items-center z-10">
            <button type="button" onClick={() => setCurrentViewWithTransition('home')} className="mg-icon-btn w-10 h-10 rounded-full">
              <Icons.Chevron dir="left" />
            </button>
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--mg-cream)]">Daily Challenges</h2>
            <div className="w-10" />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center z-10 pt-4 pb-6 w-full">
            <div className="relative flex items-center justify-center w-full">
               <button
                 disabled={cMonth===0}
                 onClick={()=>setCMonth(m=>m-1)}
                 className="absolute left-4 z-20 pointer-events-auto text-[color:var(--mg-cream)] hover:text-[color:var(--mg-gold-bright)] transition-colors disabled:opacity-0"
               >
                 <Icons.Chevron dir="left" size={36} strokeWidth={1} />
               </button>

               <RealisticTrophy monthIdx={cMonth} />

               <button
                 disabled={cMonth >= new Date().getMonth()}
                 onClick={()=>setCMonth(m=>m+1)}
                 className="absolute right-4 z-20 pointer-events-auto text-[color:var(--mg-cream)] hover:text-[color:var(--mg-gold-bright)] transition-colors disabled:opacity-0"
               >
                 <Icons.Chevron dir="right" size={36} strokeWidth={1} />
               </button>
            </div>

            <div className="mt-6 text-center">
               <h3 className="mg-font-display text-3xl font-medium italic uppercase tracking-[0.15em] text-[color:var(--mg-gold-bright)]">
                 {MONTHS[cMonth]} 2026
               </h3>
               <p className="text-[color:var(--mg-honey)] text-[10px] font-semibold uppercase tracking-[0.35em] mt-2 animate-pulse bg-[color:rgba(0,0,0,0.25)] border border-[color:var(--mg-border)] px-3 py-1 rounded-full inline-block">Collect Your Reward</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pt-8 no-scrollbar pb-10 relative">
          <div className="flex justify-between items-end mb-8">
            <span className="mg-font-display text-2xl font-medium text-[color:var(--mg-gold-bright)] italic tracking-wide">{MONTHS[cMonth]} 2026</span>
            <div className="flex items-center gap-2 mg-glass-panel px-3 py-1.5 rounded-full">
              <Icons.Trophy size={14} fill="var(--mg-gold-bright)" stroke="var(--mg-gold-bright)" />
              <span className="text-sm font-semibold tabular-nums text-[color:var(--mg-gold-bright)]">0/31</span>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center mb-4 text-[11px] font-semibold uppercase text-[color:var(--mg-subtle)] tracking-wider">
            {['S','M','T','W','T','F','S'].map(d=><div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-3 mb-24">{calendarDays}</div>
          <div className="absolute bottom-0 left-8 right-8 z-20 pb-4">
            <button type="button" onClick={()=>start('Daily',true)} className="mg-btn-primary w-full py-5 rounded-[24px] font-semibold text-xl active:border-b-0 active:translate-y-0.5 transition-all duration-150">Play</button>
          </div>
        </div>
      </div>

      <Navigation currentView="daily" setCurrentViewWithTransition={setCurrentViewWithTransition} />
    </div>
  );
}
