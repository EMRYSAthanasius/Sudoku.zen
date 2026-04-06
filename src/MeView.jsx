import React, { useState } from 'react';
import { Trophy, BarChart2, Settings, Info, BookOpen, HelpCircle, FileText, Shield, ShieldCheck } from 'lucide-react';
import { Icons } from './Icons';
import { Navigation } from './Navigation';
import { AwardsView } from './AwardsView';
import { StatisticsView } from './StatisticsView';
import { SettingsView } from './SettingsView';

export function MeView({ currentView, setCurrentViewWithTransition, fmtTime, settings, setSettings, isActiveGame }) {
  const [showAwards, setShowAwards] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const IconWrapper = ({ children }) => (
    <div className="w-8 h-8 rounded-full bg-[#4E2C1C]/10 flex items-center justify-center text-[#4E2C1C]">
      {children}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative bg-transparent overflow-hidden z-10">

      {showAwards ? (
        <AwardsView onBack={() => setShowAwards(false)} />
      ) : showStats ? (
        <StatisticsView onBack={() => setShowStats(false)} fmtTime={fmtTime} />
      ) : showSettings ? (
        <SettingsView onBack={() => setShowSettings(false)} settings={settings} setSettings={setSettings} isActiveGame={isActiveGame} setCurrentViewWithTransition={setCurrentViewWithTransition} />
      ) : (
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 flex flex-col transition-opacity duration-300">
        <header className="pt-10 pb-8 flex items-center justify-between w-full drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
          <div className="w-16"></div> {/* Spacer for centering */}
          <h1 className="text-[28px] font-bold tracking-tight uppercase italic leading-none text-[#FFFDD0]">
            Me
          </h1>
          <div className="w-16 flex justify-end">
            {isActiveGame && (
              <button
                onClick={() => setCurrentViewWithTransition('game')}
                className="text-[#FCD34D] font-bold font-sans text-lg drop-shadow-md active:scale-95 transition"
              >
                Done
              </button>
            )}
          </div>
        </header>

        {/* Group 1 */}
        <div className="bg-[#D2B48C] rounded-2xl p-2 mb-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button onClick={() => setShowAwards(true)} className="w-full flex items-center justify-between p-4 border-b border-[#3E2723]/20 active:bg-[#C19A6B]/30 transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Trophy size={18} /></IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Awards</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button onClick={() => setShowStats(true)} className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <BarChart2 size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Statistics</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
        </div>

        {/* Group 2 */}
        <div className="bg-[#D2B48C] rounded-2xl p-2 mb-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center justify-between p-4 border-b border-[#3E2723]/20 active:bg-[#C19A6B]/30 transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Settings size={18} /></IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Settings</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[#3E2723]/20 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <Info size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">How to Play</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <BookOpen size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Rules</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
        </div>

        {/* Group 3 */}
        <div className="bg-[#D2B48C] rounded-2xl p-2 mb-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[#3E2723]/20 active:bg-[#C19A6B]/30 transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <HelpCircle size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Help</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[#3E2723]/20 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <FileText size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">About Game</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[#3E2723]/20 active:bg-[#C19A6B]/30 transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <Shield size={18} />
              </IconWrapper>
              <span className="font-bold text-[#4E2C1C] text-lg">Privacy Rights</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[#4E2C1C]/50" />
          </button>
          <button onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 active:bg-[#C19A6B]/30 transition-colors rounded-b-xl">
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
      )}

      <Navigation currentView="me" setCurrentViewWithTransition={setCurrentViewWithTransition} />
    </div>
  );
}
