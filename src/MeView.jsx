import React from 'react';
import { Icons } from './Icons';

export function MeView({ currentView, setCurrentViewWithTransition }) {
  const IconWrapper = ({ children }) => (
    <div className="w-8 h-8 rounded-full bg-[#4E2C1C]/10 flex items-center justify-center text-[#4E2C1C]">
      {children}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative bg-transparent overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 flex flex-col">
        <header className="pt-10 pb-8 flex flex-col items-center">
          <h1 className="text-[28px] font-bold tracking-tight uppercase italic leading-none text-[#2D1B10]">
            Me
          </h1>
        </header>

        {/* Group 1 */}
        <div className="bg-[#D2B48C] rounded-2xl p-2 mb-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Icons.Trophy size={18} fill="currentColor" stroke="none" /></IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Awards</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Statistics</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Icons.Settings size={18} /></IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Settings</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
        </div>

        {/* Group 2 */}
        <div className="bg-[#D2B48C] rounded-2xl p-2 mb-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">How to Play</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Rules</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Help</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
        </div>

        {/* Group 3 */}
        <div className="bg-[#D2B48C] rounded-2xl p-2 mb-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">About Game</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Privacy Rights</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Privacy Preferences</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#3E1F10] border-t border-[#2D1B10] flex justify-around p-4 pb-8 z-50 pointer-events-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => setCurrentViewWithTransition('home')} className={`flex flex-col items-center gap-1.5 ${currentView==='home'?'text-[#FCD34D]':'text-[#C19A6B]/50'}`}><Icons.Nav type="main" active={currentView==='home'}/><span className="text-[10px] font-bold uppercase tracking-widest">Main</span></button>
        <button onClick={() => setCurrentViewWithTransition('daily')} className={`flex flex-col items-center gap-1.5 ${currentView==='daily'?'text-[#FCD34D]':'text-[#C19A6B]/50'}`}><Icons.Nav type="daily" active={currentView==='daily'}/><span className="text-[10px] font-bold uppercase tracking-widest">Daily Challenges</span></button>
        <button className={`flex flex-col items-center gap-1.5 ${currentView==='me'?'text-[#FCD34D]':'text-[#C19A6B]/50'}`}><Icons.Nav type="me" active={currentView==='me'}/><span className="text-[10px] font-bold uppercase tracking-widest">Me</span></button>
      </div>
    </div>
  );
}
