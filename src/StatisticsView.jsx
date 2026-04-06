import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

export function StatisticsView({ onBack, fmtTime }) {
  const [activeTab, setActiveTab] = useState('Easy');
  const [stats, setStats] = useState({});

  const LEVELS = ['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Extreme'];

  useEffect(() => {
    const savedStats = localStorage.getItem('sudokuDetailedStats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {}
    }
  }, []);

  const handleReset = () => {
    if (window.confirm(`Are you sure you want to reset all statistics for ${activeTab}?`)) {
      const newStats = { ...stats };
      delete newStats[activeTab];
      setStats(newStats);
      localStorage.setItem('sudokuDetailedStats', JSON.stringify(newStats));
    }
  };

  const levelStats = stats[activeTab] || {};
  const gamesStarted = levelStats.gamesStarted || 0;

  const displayVal = (val, isTime = false) => {
    if (gamesStarted === 0) return '-';
    if (val === undefined || val === null) return '-';
    if (isTime) return fmtTime(val);
    return val;
  };

  const winRate = gamesStarted > 0 ? Math.round(((levelStats.gamesWon || 0) / gamesStarted) * 100) : 0;
  const avgTime = gamesStarted > 0 && levelStats.gamesWon > 0 ? Math.round((levelStats.totalTime || 0) / levelStats.gamesWon) : null;

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
          Statistics
        </h2>
      </header>

      {/* Horizontal Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar px-6 mb-6 shrink-0 z-10">
        <div className="flex gap-4 min-w-max pb-2">
          {LEVELS.map(level => (
            <button
              key={level}
              onClick={() => setActiveTab(level)}
              className={`text-lg font-bold uppercase tracking-wider transition-colors duration-300 pb-1 border-b-2 ${
                activeTab === level
                  ? 'text-[#FCD34D] border-[#FCD34D]'
                  : 'text-[#D2B48C]/60 border-transparent hover:text-[#D2B48C]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 z-10 flex flex-col gap-4">

        {/* Games Section */}
        <div className="bg-[#D2B48C] rounded-2xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20 flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Games Started</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(gamesStarted)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Games Won</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.gamesWon)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Win Rate</span>
             <span className="text-[#4E2C1C] font-black text-lg">{gamesStarted === 0 ? '-' : `${winRate}%`}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Wins with No Mistakes</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.noMistakes)}</span>
          </div>
        </div>

        {/* Best Score Section */}
        <div className="bg-[#D2B48C] rounded-2xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20 flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Best Score Today</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.bestScoreToday)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Best Score This Week</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.bestScoreWeek)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Best Score This Month</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.bestScoreMonth)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Best Score All Time</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.bestScoreAllTime)}</span>
          </div>
        </div>

        {/* Time Section */}
        <div className="bg-[#D2B48C] rounded-2xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20 flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Best Time</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.bestTime, true)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Average Time</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(avgTime, true)}</span>
          </div>
        </div>

        {/* Streaks Section */}
        <div className="bg-[#D2B48C] rounded-2xl p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20 flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Current Win Streak</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.currentStreak)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-[#3E1F10] font-bold text-sm">Best Win Streak</span>
             <span className="text-[#4E2C1C] font-black text-lg">{displayVal(levelStats.bestStreak)}</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-4 text-[#D2B48C] font-bold text-sm uppercase tracking-widest text-center py-4 active:scale-95 transition-transform"
        >
          Reset Statistics
        </button>
      </div>
    </div>
  );
}
