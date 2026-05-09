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
      <header className="px-6 pt-12 pb-6 flex items-center shrink-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="mg-icon-btn w-10 h-10 rounded-full hover:scale-105 active:scale-95 transition"
        >
          <Icons.Chevron dir="left" />
        </button>
        <h2 className="mg-font-display flex-1 text-center text-xl font-medium tracking-wide text-[color:var(--mg-cream)] mr-10">
          Awards
        </h2>
      </header>

      {/* Tabs */}
      <div className="px-6 mb-6 shrink-0 z-10">
        <div className="mg-glass-panel rounded-full p-1.5 flex">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'daily'
                ? 'bg-[color:var(--mg-gold-bright)] text-[color:var(--mg-void)] shadow-md'
                : 'text-[color:var(--mg-subtle)] hover:text-[color:var(--mg-cream)]'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tournament')}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'tournament'
                ? 'bg-[color:var(--mg-gold-bright)] text-[color:var(--mg-void)] shadow-md'
                : 'text-[color:var(--mg-subtle)] hover:text-[color:var(--mg-cream)]'
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
              <div key={month.name} className={`mg-glass-panel rounded-2xl p-3 flex flex-col items-center transition-opacity duration-300 ${month.isFuture ? 'opacity-30' : 'opacity-100'}`}>
                <span className="text-[color:var(--mg-cream)] font-semibold text-xs uppercase tracking-widest mb-2">{month.short}</span>

                <div className={`relative w-16 h-16 flex items-center justify-center transition-all duration-500 ${month.isFuture ? 'opacity-40 grayscale sepia brightness-50 contrast-125 mix-blend-multiply' : month.isFinished ? 'scale-110 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)] mb-3' : 'opacity-40 grayscale sepia brightness-50 contrast-125 mix-blend-multiply mb-3'}`}>
                   <RealisticTrophy monthIdx={idx} size={64} />
                </div>

                {!month.isFuture && (
                  <>
                    <div className="w-full bg-[color:rgba(255,255,255,0.08)] rounded-full h-1.5 mb-1.5 overflow-hidden">
                      <div
                        className="bg-[#818CF8] h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(month.completed / month.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[color:var(--mg-subtle)] tabular-nums tracking-wider">{month.completed} of {month.total}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 -mt-10">
            <div className="relative mb-8 text-[color:var(--mg-subtle)] flex items-center justify-center opacity-40">
              <Icons.Trophy size={140} strokeWidth={1} />
              <Lock size={48} className="absolute text-[color:var(--mg-ink)]" strokeWidth={2.5} />
            </div>
            <h3 className="mg-font-display text-[color:var(--mg-cream)] text-2xl font-medium uppercase tracking-widest italic mb-4">
              Tournaments<br/>Coming Soon
            </h3>
            <p className="text-[color:var(--mg-subtle)] text-sm font-medium max-w-[240px] leading-relaxed">
              Take part in upcoming events to collect unique rewards!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
