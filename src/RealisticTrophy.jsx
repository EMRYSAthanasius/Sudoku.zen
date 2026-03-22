import React from 'react';

export function RealisticTrophy({ monthIdx, size = 180 }) {
  // Variations based on month
  const isTallBase = monthIdx % 3 === 0;
  const hasSwanHandles = monthIdx % 2 === 0;
  const isWiderCup = monthIdx % 4 === 1;
  const isBronze = monthIdx % 5 === 2;
  const isChampagne = monthIdx % 5 === 3;

  // Colors
  const darkEdge = isBronze ? '#452B09' : isChampagne ? '#716246' : '#854D0E';
  const midTone = isBronze ? '#A16207' : isChampagne ? '#D4D4D8' : '#C19A6B';
  const highlight = isBronze ? '#FEF08A' : isChampagne ? '#FAFAFA' : '#F5F5DC';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(193,154,107,0.2)]">
      <defs>
        <radialGradient id={`glow-${monthIdx}`} cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
          <stop offset="0%" stopColor={midTone} stopOpacity="0.4" />
          <stop offset="100%" stopColor={midTone} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`metallic-${monthIdx}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darkEdge} />
          <stop offset="25%" stopColor={midTone} />
          <stop offset="50%" stopColor={highlight} />
          <stop offset="75%" stopColor={midTone} />
          <stop offset="100%" stopColor={darkEdge} />
        </linearGradient>

        <linearGradient id={`base-${monthIdx}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="50%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>

        <filter id={`shadow-${monthIdx}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={midTone} floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Aura Glow */}
      <circle cx="50" cy="40" r="45" fill={`url(#glow-${monthIdx})`} filter={`url(#shadow-${monthIdx})`} />

      {/* Handles */}
      {hasSwanHandles ? (
        <>
          <path d="M 35 30 C 15 20, 10 50, 35 55" fill="none" stroke={`url(#metallic-${monthIdx})`} strokeWidth="4" strokeLinecap="round" />
          <path d="M 65 30 C 85 20, 90 50, 65 55" fill="none" stroke={`url(#metallic-${monthIdx})`} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 35 35 Q 20 35, 25 50 T 40 60" fill="none" stroke={`url(#metallic-${monthIdx})`} strokeWidth="5" strokeLinecap="round" />
          <path d="M 65 35 Q 80 35, 75 50 T 60 60" fill="none" stroke={`url(#metallic-${monthIdx})`} strokeWidth="5" strokeLinecap="round" />
        </>
      )}

      {/* Stem */}
      <path d="M 46 65 L 46 80 L 54 80 L 54 65 Z" fill={`url(#metallic-${monthIdx})`} />
      <path d="M 42 63 L 58 63 L 56 67 L 44 67 Z" fill={`url(#metallic-${monthIdx})`} />

      {/* Base */}
      {isTallBase ? (
        <path d="M 35 80 L 65 80 L 70 95 L 30 95 Z" fill={`url(#base-${monthIdx})`} stroke={`url(#metallic-${monthIdx})`} strokeWidth="1" />
      ) : (
        <path d="M 38 80 L 62 80 L 68 90 L 32 90 Z" fill={`url(#base-${monthIdx})`} stroke={`url(#metallic-${monthIdx})`} strokeWidth="1" />
      )}
      <rect x={isTallBase ? 28 : 30} y={isTallBase ? 95 : 90} width={isTallBase ? 44 : 40} height="4" fill={`url(#metallic-${monthIdx})`} />

      {/* Cup */}
      {isWiderCup ? (
        <path d="M 25 20 L 75 20 C 75 45, 60 65, 50 65 C 40 65, 25 45, 25 20 Z" fill={`url(#metallic-${monthIdx})`} filter={`url(#shadow-${monthIdx})`} />
      ) : (
        <path d="M 30 15 L 70 15 C 70 50, 60 65, 50 65 C 40 65, 30 50, 30 15 Z" fill={`url(#metallic-${monthIdx})`} filter={`url(#shadow-${monthIdx})`} />
      )}

      {/* Cup Rim Highlight */}
      <ellipse cx="50" cy={isWiderCup ? 20 : 15} rx={isWiderCup ? 25 : 20} ry="4" fill={highlight} opacity="0.8" />
      <ellipse cx="50" cy={isWiderCup ? 20 : 15} rx={isWiderCup ? 22 : 17} ry="2" fill={`url(#metallic-${monthIdx})`} />
    </svg>
  );
}
