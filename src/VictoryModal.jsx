import React from 'react';
import { Icons } from './Icons';

export function VictoryModal({ 
  completionTime, 
  onNewGame, 
  difficulty,
  score,
  isVisible = true 
}) {
  if (!isVisible) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff) => {
    const colors = {
      'Easy': 'text-[#10b981]',
      'Medium': 'text-[#f59e0b]', 
      'Hard': 'text-[#ef4444]',
      'Expert': 'text-[#8b5cf6]',
      'Master': 'text-[#dc2626]',
      'Extreme': 'text-[#991b1b]'
    };
    return colors[diff] || 'text-[#6b7280]';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-6">
      <div className="mg-glass-modal rounded-[36px] w-full max-w-md p-8 text-center relative overflow-hidden">
        {/* Victory Icon */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[color:var(--mg-gold-bright)] to-[color:var(--mg-gold)] rounded-full flex items-center justify-center shadow-lg">
            <Icons.Trophy className="w-12 h-12 text-[color:var(--mg-void)]" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[color:var(--mg-gold)]/20 blur-2xl rounded-full scale-150"></div>
        </div>

        {/* Victory Message */}
        <h2 className="mg-font-display text-3xl font-bold text-[color:var(--mg-cream)] mb-2">
          Victory!
        </h2>
        
        <p className="text-[color:var(--mg-subtle)] text-sm mb-6">
          Puzzle completed successfully
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-[color:var(--mg-subtle)] text-xs font-bold uppercase tracking-wider mb-1">Time</div>
            <div className="text-[color:var(--mg-cream)] text-2xl font-bold">
              {formatTime(completionTime)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-[color:var(--mg-subtle)] text-xs font-bold uppercase tracking-wider mb-1">Difficulty</div>
            <div className={`text-xl font-bold ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-[color:var(--mg-subtle)] text-xs font-bold uppercase tracking-wider mb-1">Score</div>
            <div className="text-[color:var(--mg-gold-bright)] text-2xl font-bold">
              {score?.toLocaleString() || '0'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onNewGame}
            className="mg-btn-primary w-full py-4 rounded-[24px] font-semibold text-lg active:border-b-0 active:translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Game
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="mg-btn-ghost w-full py-3 rounded-[24px] font-semibold transition-all duration-150 flex items-center justify-center gap-2"
          >
            <Icons.Chevron dir="left" size={20} />
            Back to Menu
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-[color:var(--mg-gold)]/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-[color:var(--mg-gold-bright)] rounded-full"></div>
        </div>
        
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-[color:var(--mg-gold)]/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-[color:var(--mg-gold-bright)] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
