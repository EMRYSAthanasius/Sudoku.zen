import React from 'react';
import { Icons } from './Icons';

export function Navigation({ currentView, setCurrentViewWithTransition }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#3E1F10] border-t border-[#2D1B10] flex justify-around p-4 pb-8 z-50 pointer-events-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      <button
        onClick={() => setCurrentViewWithTransition('home')}
        className={`flex flex-col items-center gap-1.5 ${currentView==='home'?'text-[#FCD34D]':'text-[#C19A6B]/50'}`}
      >
        <Icons.Nav type="main" active={currentView==='home'}/>
        <span className="text-[10px] font-bold uppercase tracking-widest">Main</span>
      </button>
      <button
        onClick={() => setCurrentViewWithTransition('daily')}
        className={`flex flex-col items-center gap-1.5 ${currentView==='daily'?'text-[#FCD34D]':'text-[#C19A6B]/50'}`}
      >
        <Icons.Nav type="daily" active={currentView==='daily'}/>
        <span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenges</span>
      </button>
      <button
        onClick={() => setCurrentViewWithTransition('me')}
        className={`flex flex-col items-center gap-1.5 ${currentView==='me'?'text-[#FCD34D]':'text-[#C19A6B]/50'}`}
      >
        <Icons.Nav type="me" active={currentView==='me'}/>
        <span className="text-[10px] font-bold uppercase tracking-widest">Me</span>
      </button>
    </div>
  );
}
