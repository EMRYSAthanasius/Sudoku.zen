import React from 'react';
import { Icons } from './Icons';

export function SettingsView({ onBack, settings, setSettings, isActiveGame, setCurrentViewWithTransition }) {
  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('SUDOKU_SETTINGS', JSON.stringify(newSettings));
  };

  const ToggleRow = ({ label, settingKey, isLast = false }) => (
    <div className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-[color:var(--mg-border)]' : ''}`}>
      <span className="font-medium text-[color:var(--mg-cream)] text-[15px]">{label}</span>
      <button
        type="button"
        onClick={() => toggleSetting(settingKey)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${settings[settingKey] ? 'bg-[color:rgba(201,162,39,0.35)] border border-[color:var(--mg-gold-bright)]' : 'bg-[color:rgba(255,255,255,0.06)] border border-[color:var(--mg-border)]'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-[color:var(--mg-cream)] shadow-md transition-transform duration-300 ${settings[settingKey] ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-transparent overflow-hidden">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between shrink-0 z-10">
        <div className="w-16">
          <button
            type="button"
            onClick={onBack}
            className="mg-icon-btn w-10 h-10 rounded-full hover:scale-105 active:scale-95 transition"
          >
            <Icons.Chevron dir="left" />
          </button>
        </div>
        <h2 className="mg-font-display flex-1 text-center text-xl font-medium tracking-wide text-[color:var(--mg-cream)]">
          Settings
        </h2>
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

      <div className="flex-1 overflow-y-auto px-6 pb-32 z-10 flex flex-col gap-6">

        {/* Group 1 */}
        <div className="mg-glass-panel rounded-2xl px-4">
          <ToggleRow label="Sounds" settingKey="sounds" />
          <ToggleRow label="Vibration" settingKey="vibration" />
          <ToggleRow label="Auto-Lock" settingKey="autoLock" />
          <ToggleRow label="Timer" settingKey="timer" isLast={true} />
        </div>

        {/* Group 2 */}
        <div className="mg-glass-panel rounded-2xl px-4">
          <ToggleRow label="Animated Scoring" settingKey="animatedScoring" />
          <ToggleRow label="Statistics Message" settingKey="statisticsMessage" />
          <ToggleRow label="Smart Hints" settingKey="smartHints" />
          <ToggleRow label="Number-First Input" settingKey="numberFirstInput" />
          <ToggleRow label="Mistake Limit" settingKey="mistakeLimit" isLast={true} />
        </div>

        {/* Group 3 */}
        <div className="mg-glass-panel rounded-2xl px-4">
          <ToggleRow label="Auto-Check for Mistakes" settingKey="autoCheckMistakes" />
          <ToggleRow label="Highlight Duplicates" settingKey="highlightDuplicates" />
          <ToggleRow label="Highlight Areas" settingKey="highlightAreas" />
          <ToggleRow label="Highlight Identical Numbers" settingKey="highlightIdenticalNumbers" />
          <ToggleRow label="Hide Used Numbers" settingKey="hideUsedNumbers" />
          <ToggleRow label="Auto-Remove Notes" settingKey="autoRemoveNotes" />
          <ToggleRow label="Highlight Combos" settingKey="highlightCombos" isLast={true} />
        </div>

      </div>
    </div>
  );
}
