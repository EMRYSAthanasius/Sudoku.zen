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
    <div className="mg-icon-wrap w-8 h-8 rounded-full flex items-center justify-center">
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
        <header className="pt-10 pb-8 flex items-center justify-between w-full">
          <div className="w-16"></div> {/* Spacer for centering */}
          <h1 className="mg-font-display text-[28px] font-medium tracking-tight italic leading-none text-[color:var(--mg-cream)]">
            Me
          </h1>
          <div className="w-16 flex justify-end">
            {isActiveGame && (
              <button
                type="button"
                onClick={() => setCurrentViewWithTransition('game')}
                className="text-[color:var(--mg-gold-bright)] font-semibold text-lg active:scale-95 transition"
              >
                Done
              </button>
            )}
          </div>
        </header>

        {/* Group 1 */}
        <div className="mg-glass-panel rounded-2xl p-2 mb-6">
          <button type="button" onClick={() => setShowAwards(true)} className="w-full flex items-center justify-between p-4 border-b border-[color:var(--mg-border)] active:bg-[color:rgba(255,255,255,0.04)] transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Trophy size={18} /></IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Awards</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
          <button type="button" onClick={() => setShowStats(true)} className="w-full flex items-center justify-between p-4 active:bg-[color:rgba(255,255,255,0.04)] transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <BarChart2 size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Statistics</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
        </div>

        {/* Group 2 */}
        <div className="mg-glass-panel rounded-2xl p-2 mb-6">
          <button type="button" onClick={() => setShowSettings(true)} className="w-full flex items-center justify-between p-4 border-b border-[color:var(--mg-border)] active:bg-[color:rgba(255,255,255,0.04)] transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper><Settings size={18} /></IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Settings</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
          <button type="button" onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[color:var(--mg-border)] active:bg-[color:rgba(255,255,255,0.04)] transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <Info size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">How to Play</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
          <button type="button" onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 active:bg-[color:rgba(255,255,255,0.04)] transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <BookOpen size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Rules</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
        </div>

        {/* Group 3 */}
        <div className="mg-glass-panel rounded-2xl p-2 mb-6">
          <button type="button" onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[color:var(--mg-border)] active:bg-[color:rgba(255,255,255,0.04)] transition-colors rounded-t-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <HelpCircle size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Help</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
          <button type="button" onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[color:var(--mg-border)] active:bg-[color:rgba(255,255,255,0.04)] transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <FileText size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">About Game</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
          <button type="button" onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 border-b border-[color:var(--mg-border)] active:bg-[color:rgba(255,255,255,0.04)] transition-colors">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <Shield size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Privacy Rights</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
          <button type="button" onClick={() => alert('Coming Soon!')} className="w-full flex items-center justify-between p-4 active:bg-[color:rgba(255,255,255,0.04)] transition-colors rounded-b-xl">
            <div className="flex items-center gap-4">
              <IconWrapper>
                <ShieldCheck size={18} />
              </IconWrapper>
              <span className="font-semibold text-[color:var(--mg-cream)] text-lg">Privacy Preferences</span>
            </div>
            <Icons.Chevron dir="right" size={20} className="text-[color:var(--mg-subtle)]" />
          </button>
        </div>

      </div>
      )}

      <Navigation currentView="me" setCurrentViewWithTransition={setCurrentViewWithTransition} />
    </div>
  );
}
