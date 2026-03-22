import React from 'react';
import { Icons } from './Icons';
import { RealisticTrophy } from './RealisticTrophy';

export function DailyChallenges({ cMonth, setCMonth, MONTHS, calendarDays, start, setCurrentViewWithTransition }) {
  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto flex flex-col pb-32">
        <div
          className="relative min-h-[42%] flex flex-col items-center border-b border-[#3E1F10] overflow-hidden shrink-0 shadow-lg"
          style={{ background: 'radial-gradient(circle at center, #A0522D 0%, #5D2E17 100%)' }}
        >
          <header className="w-full px-6 pt-12 flex justify-between items-center z-10 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            <button onClick={() => setCurrentViewWithTransition('home')} className="w-10 h-10 flex items-center justify-center bg-[#3E1F10]/50 rounded-full text-[#FCD34D] opacity-100">
              <Icons.Chevron dir="left" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#FFFDD0]">Daily Challenges</h2>
            <div className="w-10" />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center z-10 pt-4 pb-6 w-full">
            <div className="relative flex items-center justify-center w-full">
               <button
                 disabled={cMonth===0}
                 onClick={()=>setCMonth(m=>m-1)}
                 className="absolute left-4 z-20 pointer-events-auto text-[#F5F5DC] hover:text-[#C19A6B] active:text-[#C19A6B] transition-colors disabled:opacity-0"
               >
                 <Icons.Chevron dir="left" size={36} strokeWidth={1} />
               </button>

               <RealisticTrophy monthIdx={cMonth} />

               <button
                 disabled={cMonth >= new Date().getMonth()}
                 onClick={()=>setCMonth(m=>m+1)}
                 className="absolute right-4 z-20 pointer-events-auto text-[#F5F5DC] hover:text-[#C19A6B] active:text-[#C19A6B] transition-colors disabled:opacity-0"
               >
                 <Icons.Chevron dir="right" size={36} strokeWidth={1} />
               </button>
            </div>

            <div className="mt-6 text-center">
               <h3 className="text-3xl font-black italic uppercase tracking-[0.2em] text-[#2D1B10]">
                 {MONTHS[cMonth]} 2026
               </h3>
               <p className="text-[#C19A6B] text-[10px] font-bold uppercase tracking-[0.4em] mt-2 animate-pulse bg-[#3E1F10]/30 px-3 py-1 rounded-full inline-block">Collect Your Reward</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pt-8 no-scrollbar pb-10 relative">
          <div className="flex justify-between items-end mb-8 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            <span className="text-2xl font-black text-[#FCD34D] italic tracking-[0.1em]">{MONTHS[cMonth]} 2026</span>
            <div className="flex items-center gap-2 bg-[#3E1F10] px-3 py-1.5 rounded-full border border-[#2D1B10]">
              <Icons.Trophy size={14} fill="#FCD34D" stroke="#FCD34D" />
              <span className="text-sm font-bold tabular-nums text-[#FCD34D]">0/31</span>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center mb-4 text-[11px] font-bold uppercase text-[#FFFDD0] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
            {['S','M','T','W','T','F','S'].map(d=><div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-3 mb-24">{calendarDays}</div>
          <div className="absolute bottom-0 left-8 right-8 z-20 pb-4">
            <button onClick={()=>start('Daily',true)} className="w-full bg-[#C19A6B] text-[#2D1B10] py-5 rounded-[24px] font-black text-xl shadow-2xl border-b-4 border-[#A0522D] active:border-b-0 active:translate-y-1 transition-all duration-150">Play</button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#3E1F10] border-t border-[#2D1B10] flex justify-around p-4 pb-8 z-50 pointer-events-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => setCurrentViewWithTransition('home')} className="flex flex-col items-center gap-1.5 text-[#F5F5DC]">
          <Icons.Nav type="main" active={false} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Main</span>
        </button>
        <button onClick={() => setCurrentViewWithTransition('daily')} className="flex flex-col items-center gap-1.5 text-[#FCD34D]">
          <Icons.Nav type="daily" active={true} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenges</span>
        </button>
        <button onClick={() => setCurrentViewWithTransition('me')} className="flex flex-col items-center gap-1.5 text-[#F5F5DC]">
          <Icons.Nav type="me" active={false} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Me</span>
        </button>
      </div>
    </div>
  );
}
