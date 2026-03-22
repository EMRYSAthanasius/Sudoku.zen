import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';
import { RealisticTrophy } from './RealisticTrophy';

export function VictoryView({ scoreData, setCurrentViewWithTransition, setPicker }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate simple SVG confetti pieces using wood theme accents
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 2,
      color: ['#C19A6B', '#F8FAFC', '#914110'][Math.floor(Math.random() * 3)],
      width: Math.random() * 6 + 4,
      height: Math.random() * 10 + 6,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative overflow-hidden h-full pb-32">
      {/* Confetti Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="absolute top-[-20px] rounded-sm animate-[fall_linear_infinite]"
            style={{
              left: `${p.left}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              backgroundColor: p.color,
              animationDuration: `${p.animationDuration}s`,
              animationDelay: `${p.animationDelay}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-12 flex flex-col items-center z-10 relative drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FFFDD0] mb-2">Month's New Best Score</h2>
        <div className="mb-6 relative">
          <RealisticTrophy monthIdx={new Date().getMonth()} size={140} />
          <div className="absolute -inset-4 bg-[#FCD34D]/20 blur-2xl -z-10 rounded-full"></div>
        </div>

        <div className="text-center mb-10">
          <span className="text-[64px] font-black italic text-[#FCD34D] leading-none tracking-tighter drop-shadow-[0_0_25px_rgba(252,211,77,0.5)]">
            {scoreData.total.toLocaleString()}
          </span>
          <p className="text-[#FCD34D] text-xs font-bold uppercase tracking-widest mt-2 opacity-100">Total Points</p>
        </div>

        {/* Score Breakdown */}
        <div className="w-full bg-[#A0522D]/40 border border-[#3E1F10] rounded-[32px] p-6 mb-8 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-4 border-b border-[#3E1F10] pb-3">
            <span className="text-[#2D1B10] text-sm font-bold">Completion Base</span>
            <span className="text-[#F5F5DC] font-bold">{scoreData.completion.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4 border-b border-[#3E1F10] pb-3">
            <span className="text-[#2D1B10] text-sm font-bold">Speed Bonus</span>
            <span className="text-[#F5F5DC] font-bold">+{scoreData.speedBonus.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#2D1B10] text-sm font-bold">Multiplier ({scoreData.diff})</span>
            <span className="text-[#F5F5DC] font-bold">x{scoreData.multiplier}</span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="w-full flex flex-col gap-5 mb-8">
          <div className="w-full">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-[#2D1B10]">Today</span>
              <span className="text-[#F5F5DC]">{scoreData.today.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-[#3E1F10] rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#914110] to-[#C19A6B] rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-[#2D1B10]">This Week</span>
              <span className="text-[#F5F5DC]">{scoreData.week.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-[#3E1F10] rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#914110] to-[#C19A6B] rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-[#2D1B10]">This Month</span>
              <span className="text-[#F5F5DC]">{scoreData.month.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-[#3E1F10] rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#914110] to-[#C19A6B] rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#3E1F10] p-6 pt-4 z-50 pointer-events-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)] pb-12">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setPicker(true)}
            className="w-full bg-[#C19A6B] text-[#2D1B10] py-4 rounded-[24px] font-black text-xl shadow-2xl border-b-4 border-[#A0522D] active:border-b-0 active:translate-y-1 transition-all duration-150"
          >
            New Game
          </button>
          <button
            onClick={() => setCurrentViewWithTransition('home')}
            className="w-full bg-transparent border-2 border-[#C19A6B] text-[#C19A6B] py-3 rounded-[24px] font-bold active:scale-95 transition"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
