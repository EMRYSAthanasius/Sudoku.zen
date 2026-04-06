import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { MONTHS, MONTHS_SHORT } from './SudokuEngine';
import { RealisticTrophy } from './RealisticTrophy';
import { Lock } from 'lucide-react';

export function AwardsView({ onBack }) {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'tournament'

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const monthlyProgress = useMemo(() => {
    const year = 2026;
    const currentMonthIndex = new Date().getMonth();
    return MONTHS.map((monthName, mIndex) => {
      const totalDays = getDaysInMonth(year, mIndex);
      let completedDays = 0;

      for (let d = 1; d <= totalDays; d++) {
        const paddedMonth = String(mIndex + 1).padStart(2, '0');
        const paddedDay = String(d).padStart(2, '0');
        const key = `LOCAL_STORAGE_DAILY_V2_${year}-${paddedMonth}-${paddedDay}`;

        try {
          const saved = localStorage.getItem(key);
          if (saved) {
            const data = JSON.parse(saved);
            if (data && data.status === 'completed') {
              completedDays++;
            }
          }
        } catch (e) {}
      }

      return {
        name: monthName,
        short: MONTHS_SHORT[mIndex],
        total: totalDays,
        completed: completedDays,
        isFinished: completedDays === totalDays,
        isFuture: mIndex > currentMonthIndex
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-transparent overflow-hidden">
      <header className="px-6 pt-12 pb-6 flex items-center shrink-0 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-[#3E1F10]/50 rounded-full text-[#FCD34D] hover:scale-105 active:scale-95 transition"
        >
          <Icons.Chevron dir="left" />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold uppercase tracking-widest text-[#FFFDD0] mr-10">
          Awards
        </h2>
      </header>

      {/* Tabs */}
      <div className="px-6 mb-6 shrink-0 z-10">
        <div className="bg-[#D2B48C] rounded-full p-1.5 flex shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] border border-[#3E1F10]/20">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'daily'
                ? 'bg-[#FCD34D] text-[#2D1B10] shadow-md'
                : 'text-[#4E2C1C]/60 hover:text-[#4E2C1C]'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab('tournament')}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'tournament'
                ? 'bg-[#FCD34D] text-[#2D1B10] shadow-md'
                : 'text-[#4E2C1C]/60 hover:text-[#4E2C1C]'
            }`}
          >
            Tournament
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 z-10">
        {activeTab === 'daily' ? (
          <div className="grid grid-cols-3 gap-4 pb-8">
            {monthlyProgress.map((month, idx) => (
              <div key={month.name} className={`bg-[#D2B48C] rounded-2xl p-3 flex flex-col items-center shadow-lg border border-[#3E1F10]/20 transition-opacity duration-300 ${month.isFuture ? 'opacity-30' : 'opacity-100'}`}>
                <span className="text-[#4E2C1C] font-bold text-xs uppercase tracking-widest mb-2">{month.short}</span>

                <div className={`relative w-16 h-16 flex items-center justify-center transition-all duration-500 ${month.isFuture ? 'opacity-40 grayscale sepia brightness-50 contrast-125 mix-blend-multiply' : month.isFinished ? 'scale-110 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)] mb-3' : 'opacity-40 grayscale sepia brightness-50 contrast-125 mix-blend-multiply mb-3'}`}>
                   <RealisticTrophy monthIdx={idx} size={64} />
                </div>

                {!month.isFuture && (
                  <>
                    <div className="w-full bg-[#4E2C1C]/20 rounded-full h-1.5 mb-1.5 overflow-hidden">
                      <div
                        className="bg-[#818CF8] h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(month.completed / month.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#4E2C1C] tabular-nums tracking-wider">{month.completed} of {month.total}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 -mt-10">
            <div className="relative mb-8 text-[#D2B48C]/30 flex items-center justify-center">
              <Icons.Trophy size={140} strokeWidth={1} />
              <Lock size={48} className="absolute text-[#3E1F10]" strokeWidth={2.5} />
            </div>
            <h3 className="text-[#FFFDD0] text-2xl font-black uppercase tracking-widest italic mb-4 drop-shadow-md">
              Tournaments<br/>Coming Soon
            </h3>
            <p className="text-[#D2B48C] text-sm font-bold max-w-[240px] leading-relaxed drop-shadow-sm">
              Take part in upcoming events to collect unique rewards!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
