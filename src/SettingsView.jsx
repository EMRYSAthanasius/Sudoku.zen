import React from 'react';
import { Icons } from './Icons';

export function SettingsView({ onBack, settings, setSettings }) {
  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('SUDOKU_SETTINGS', JSON.stringify(newSettings));
  };

  const ToggleRow = ({ label, settingKey, isLast = false }) => (
    <div className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-[#3E1F10]/20' : ''}`}>
      <span className="font-bold text-[#4E2C1C] text-[15px]">{label}</span>
      <button
        onClick={() => toggleSetting(settingKey)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative shadow-inner ${settings[settingKey] ? 'bg-[#A0522D]' : 'bg-[#4E2C1C]/20'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-[#FFFDD0] shadow-md transition-transform duration-300 ${settings[settingKey] ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-transparent overflow-hidden">
      <header className="px-6 pt-12 pb-4 flex items-center shrink-0 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-[#3E1F10]/50 rounded-full text-[#FCD34D] hover:scale-105 active:scale-95 transition"
        >
          <Icons.Chevron dir="left" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold uppercase tracking-widest text-[#FFFDD0] mr-10">
          Settings
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-32 z-10 flex flex-col gap-6">

        {/* Group 1 */}
        <div className="bg-[#D2B48C] rounded-2xl px-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <ToggleRow label="Sounds" settingKey="sounds" />
          <ToggleRow label="Vibration" settingKey="vibration" />
          <ToggleRow label="Auto-Lock" settingKey="autoLock" />
          <ToggleRow label="Timer" settingKey="timer" isLast={true} />
        </div>

        {/* Group 2 */}
        <div className="bg-[#D2B48C] rounded-2xl px-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <ToggleRow label="Animated Scoring" settingKey="animatedScoring" />
          <ToggleRow label="Statistics Message" settingKey="statisticsMessage" />
          <ToggleRow label="Smart Hints" settingKey="smartHints" />
          <ToggleRow label="Number-First Input" settingKey="numberFirstInput" />
          <ToggleRow label="Mistake Limit" settingKey="mistakeLimit" isLast={true} />
        </div>

        {/* Group 3 */}
        <div className="bg-[#D2B48C] rounded-2xl px-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
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
