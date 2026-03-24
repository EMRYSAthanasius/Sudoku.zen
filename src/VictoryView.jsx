import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';
import { RealisticTrophy } from './RealisticTrophy';

export function VictoryView({ scoreData, setCurrentViewWithTransition, onPlayAgain }) {
  const [confetti, setConfetti] = useState([]);

  // Generate the 9x9 board preview
  const BoardThumbnail = () => {
    if (!scoreData?.board || !Array.isArray(scoreData.board) || scoreData.board.length !== 81) {
      return (
        <div className="mb-6 relative">
          <RealisticTrophy monthIdx={new Date().getMonth()} size={140} />
          <div className="absolute -inset-4 bg-[#FCD34D]/20 blur-2xl -z-10 rounded-full"></div>
        </div>
      );
    }

    return (
      <div className="w-[120px] h-[120px] bg-white p-1 rounded-sm shadow-xl mx-auto mb-6 grid grid-cols-9 gap-0 border-2 border-[#3E1F10]">
        {scoreData.board.map((val, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-[7px] font-bold text-[#2D1B10]"
            style={{
              borderRight: (i + 1) % 3 === 0 && (i + 1) % 9 !== 0 ? '1px solid #3E1F10' : '1px solid #e2e8f0',
              borderBottom: Math.floor(i / 9) % 3 === 2 && Math.floor(i / 9) !== 8 ? '1px solid #3E1F10' : '1px solid #e2e8f0',
              borderRightWidth: (i + 1) % 9 === 0 ? '0' : undefined,
              borderBottomWidth: Math.floor(i / 9) === 8 ? '0' : undefined,
            }}
          >
            {val}
          </div>
        ))}
      </div>
    );
  };

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

      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-[160px] flex flex-col items-center z-10 relative">
        <h2 className="text-[28px] font-black italic uppercase tracking-wider text-[#FCD34D] drop-shadow-md mb-6">
          Victory!
        </h2>

        <BoardThumbnail />

        {/* Scrollable Cards Area */}
        <div className="w-full flex flex-col gap-4 mt-2">

          {/* Total Score Card */}
          <div className="w-full bg-[#D2B48C] rounded-2xl p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20 flex flex-col items-center text-center">
            <p className="text-[#4E2C1C] text-xs font-bold uppercase tracking-widest mb-1">Total Points</p>
            <span className="text-[48px] font-black italic text-[#4E2C1C] leading-none tracking-tighter drop-shadow-sm mb-4">
              {scoreData.total.toLocaleString()}
            </span>
            <div className="w-full flex flex-col gap-2 mt-2 border-t border-[#3E1F10]/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[#3E1F10] text-sm font-bold">Completion Base</span>
                <span className="text-[#4E2C1C] font-black">{scoreData.completion.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#3E1F10] text-sm font-bold">Speed Bonus</span>
                <span className="text-[#4E2C1C] font-black">+{scoreData.speedBonus.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#3E1F10] text-sm font-bold">Multiplier ({scoreData.diff})</span>
                <span className="text-[#4E2C1C] font-black">x{scoreData.multiplier}</span>
              </div>
            </div>
          </div>

          {/* Tournament / Event Card */}
          <div className="w-full bg-[#D2B48C] rounded-2xl p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-[#4E2C1C] font-black text-lg uppercase italic leading-none">Weekly<br/>Tournament</span>
              </div>
              <button className="bg-[#818CF8] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition">
                Go to Tournament
              </button>
            </div>
            <div className="w-full">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className="text-[#3E1F10]">Levels Completed</span>
                <span className="text-[#4E2C1C] font-black">0 of 22</span>
              </div>
              <div className="h-2.5 w-full bg-[#4E2C1C]/20 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#818CF8] rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          {/* Journey / Milestone Card */}
          <div className="w-full bg-[#D2B48C] rounded-2xl p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#4E2C1C]/10 p-2 rounded-xl text-[#4E2C1C]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[#3E1F10] text-xs font-bold uppercase tracking-widest">Journey</span>
                <span className="text-[#4E2C1C] font-black text-lg italic leading-none">Milestones</span>
              </div>
            </div>

            <div className="relative w-full h-12 flex items-center justify-between px-2">
               <div className="absolute left-4 right-4 h-1.5 bg-[#4E2C1C]/20 rounded-full -z-10 top-1/2 -translate-y-1/2"></div>
               {[1, 4, 8, 12, 20].map((level, idx) => (
                 <div key={level} className="flex flex-col items-center gap-1">
                   <div className={`w-4 h-4 rounded-full border-2 border-[#D2B48C] ${idx === 0 ? 'bg-[#818CF8]' : 'bg-[#4E2C1C]/40'}`}></div>
                   <span className="text-[10px] font-bold text-[#3E1F10]">{level}</span>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#3E1F10] p-6 pt-4 z-50 pointer-events-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)] pb-12">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={onPlayAgain}
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
