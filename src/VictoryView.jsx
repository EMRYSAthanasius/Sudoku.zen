import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';
import { RealisticTrophy } from './RealisticTrophy';

export function VictoryView({ scoreData, setCurrentViewWithTransition, setPicker }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate simple SVG confetti pieces
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 2,
      color: ['#EAB308', '#fefce8', '#854d0e'][Math.floor(Math.random() * 3)],
      width: Math.random() * 6 + 4,
      height: Math.random() * 10 + 6,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-black relative overflow-hidden h-full pb-32">
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

      <div className="flex-1 overflow-y-auto px-6 pt-12 flex flex-col items-center z-10 relative">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2">Month's New Best Score</h2>
        <div className="mb-6 relative">
          <RealisticTrophy monthIdx={new Date().getMonth()} size={140} />
          <div className="absolute -inset-4 bg-yellow-500/10 blur-2xl -z-10 rounded-full"></div>
        </div>

        <div className="text-center mb-10">
          <span className="text-[64px] font-black italic text-yellow-500 leading-none tracking-tighter drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]">
            {scoreData.total.toLocaleString()}
          </span>
          <p className="text-yellow-500/60 text-xs font-bold uppercase tracking-widest mt-2">Total Points</p>
        </div>

        {/* Score Breakdown */}
        <div className="w-full bg-zinc-900 border border-yellow-500/20 rounded-[32px] p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
            <span className="text-zinc-400 text-sm font-medium">Completion Base</span>
            <span className="text-white font-bold">{scoreData.completion.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
            <span className="text-zinc-400 text-sm font-medium">Speed Bonus</span>
            <span className="text-yellow-500 font-bold">+{scoreData.speedBonus.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 text-sm font-medium">Multiplier ({scoreData.diff})</span>
            <span className="text-white font-bold">x{scoreData.multiplier}</span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="w-full flex flex-col gap-5 mb-8">
          <div className="w-full">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-zinc-500">Today</span>
              <span className="text-yellow-500">{scoreData.today.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '40%' }}></div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-zinc-500">This Week</span>
              <span className="text-yellow-500">{scoreData.week.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="text-zinc-500">This Month</span>
              <span className="text-yellow-500">{scoreData.month.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-yellow-500/10 p-6 pt-4 z-50 pointer-events-auto shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-12">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setPicker(true)}
            className="w-full bg-yellow-500 text-black py-4 rounded-full font-black text-xl active:scale-95 transition shadow-[0_0_30px_rgba(234,179,8,0.2)]"
          >
            New Game
          </button>
          <button
            onClick={() => setCurrentViewWithTransition('home')}
            className="w-full bg-transparent border-2 border-zinc-800 text-zinc-400 py-3 rounded-full font-bold active:scale-95 transition"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
