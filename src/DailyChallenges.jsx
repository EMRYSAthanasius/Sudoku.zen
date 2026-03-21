import React from 'react';
import { Icons } from './Icons';
import { RealisticTrophy } from './RealisticTrophy';

export function DailyChallenges({ cMonth, setCMonth, MONTHS, calendarDays, start, setCurrentViewWithTransition }) {
  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-[#020617] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto flex flex-col pb-32">
        <div
          className="relative min-h-[42%] flex flex-col items-center border-b border-[#334155]/50 overflow-hidden shrink-0"
          style={{ background: 'radial-gradient(circle at center, #1E293B 0%, #020617 100%)' }}
        >
          <header className="w-full px-6 pt-12 flex justify-between items-center z-10">
            <button onClick={() => setCurrentViewWithTransition('home')} className="w-10 h-10 flex items-center justify-center bg-[#1E293B]/50 rounded-full text-[#818CF8]">
              <Icons.Chevron dir="left" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#94A3B8]">Daily Challenges</h2>
            <div className="w-10" />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center z-10 pt-4 pb-6 w-full">
            <div className="relative flex items-center justify-center w-full">
               <button
                 disabled={cMonth===0}
                 onClick={()=>setCMonth(m=>m-1)}
                 className="absolute left-4 z-20 pointer-events-auto text-[#818CF8]/30 hover:text-[#818CF8] active:text-[#818CF8] transition-colors disabled:opacity-0"
               >
                 <Icons.Chevron dir="left" size={36} strokeWidth={1} />
               </button>

               <RealisticTrophy monthIdx={cMonth} />

               <button
                 disabled={cMonth===11}
                 onClick={()=>setCMonth(m=>m+1)}
                 className="absolute right-4 z-20 pointer-events-auto text-[#818CF8]/30 hover:text-[#818CF8] active:text-[#818CF8] transition-colors disabled:opacity-0"
               >
                 <Icons.Chevron dir="right" size={36} strokeWidth={1} />
               </button>
            </div>

            <div className="mt-6 text-center">
               <h3 className="text-3xl font-black italic uppercase tracking-[0.2em] text-[#F8FAFC]">
                 {MONTHS[cMonth]} 2026
               </h3>
               <p className="text-[#818CF8] text-[10px] font-bold uppercase tracking-[0.4em] mt-2 animate-pulse">Collect Your Reward</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pt-8 no-scrollbar pb-10 relative">
          <div className="flex justify-between items-end mb-8">
            <span className="text-2xl font-black text-[#F8FAFC] italic tracking-[0.1em]">{MONTHS[cMonth]} 2026</span>
            <div className="flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-full border border-[#818CF8]/10">
              <Icons.Trophy size={14} fill="#818CF8" />
              <span className="text-sm font-bold tabular-nums text-[#F8FAFC]">0/31</span>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center mb-4 opacity-30 text-[11px] font-bold uppercase text-[#94A3B8]">
            {['S','M','T','W','T','F','S'].map(d=><div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-3 mb-24">{calendarDays}</div>
          <div className="absolute bottom-0 left-8 right-8 z-20 pb-4">
            <button onClick={()=>start('Daily',true)} className="w-full bg-[#818CF8] text-[#020617] py-5 rounded-full font-black text-xl shadow-2xl active:scale-95 transition">Play</button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#020617]/80 backdrop-blur-xl border-t border-[#334155]/50 flex justify-around p-4 pb-8 z-50 pointer-events-auto">
        <button onClick={()=>setCurrentViewWithTransition('home')} className="flex flex-col items-center gap-1.5 text-[#94A3B8]">
          <Icons.Nav type="main" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Main</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[#818CF8]">
          <Icons.Nav type="daily" active={true} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenges</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-[#94A3B8]">
          <Icons.Nav type="me" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Me</span>
        </button>
      </div>
    </div>
  );
}
