import React from 'react';
import { Trophy, BarChart2, Settings, Info, BookOpen, HelpCircle, FileText, Shield, ShieldCheck } from 'lucide-react';
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
              <IconWrapper><Trophy size={18} /></IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Awards</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <BarChart2 size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Statistics</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Settings size={18} /></IconWrapper>
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
                <Info size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">How to Play</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <BookOpen size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Rules</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <HelpCircle size={18} />
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
                <FileText size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">About Game</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 border-b border-[#3E1F10]/10 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <Shield size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Privacy Rights</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <ShieldCheck size={18} />
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
