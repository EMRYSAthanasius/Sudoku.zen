import React from 'react';
import { Icons } from './Icons';

export function Navigation({ currentView, setCurrentViewWithTransition }) {
  return (
    <div className="mg-nav-dock absolute bottom-0 left-0 right-0 flex justify-around p-4 pb-8 z-50 pointer-events-auto">
      <button
        onClick={() => setCurrentViewWithTransition('home')}
        className={`flex flex-col items-center gap-1.5 transition-colors ${currentView==='home'?'text-[color:var(--mg-gold-bright)]':'text-[color:var(--mg-subtle)]'}`}
      >
        <Icons.Nav type="main" active={currentView==='home'}/>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Main</span>
      </button>
      <button
        onClick={() => setCurrentViewWithTransition('daily')}
        className={`flex flex-col items-center gap-1.5 transition-colors ${currentView==='daily'?'text-[color:var(--mg-gold-bright)]':'text-[color:var(--mg-subtle)]'}`}
      >
        <Icons.Nav type="daily" active={currentView==='daily'}/>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-center leading-tight max-w-[5.5rem]">Daily Challenges</span>
      </button>
      <button
        onClick={() => setCurrentViewWithTransition('me')}
        className={`flex flex-col items-center gap-1.5 transition-colors ${currentView==='me'?'text-[color:var(--mg-gold-bright)]':'text-[color:var(--mg-subtle)]'}`}
      >
        <Icons.Nav type="me" active={currentView==='me'}/>
        <span className="text-[10px] font-bold uppercase tracking-widest">Me</span>
      </button>
    </div>
  );
}
