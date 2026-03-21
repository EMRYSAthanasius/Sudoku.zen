import React from 'react';

// --- HI-FI CUSTOM SVG ICONS (Midnight Gold Edition) ---
export const Icons = {
  Trophy: ({ size = 20, fill = "none", stroke = "#EAB308", opacity = 1 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><circle cx="12" cy="8" r="4" />
    </svg>
  ),
  RichMonthTrophy: ({ monthIdx, size = 180 }) => {
    const gold = "#EAB308";
    const shapes = [
      "M7 6c-2 0-3 2-3 4s1 4 3 4M17 6c2 0 3 2 3 4s-1 4-3 4",
      "M7 5c-3 0-4 3-4 6s2 5 4 5M17 5c3 0 4 3 4 6s-2 5-4 5",
      "M7 7c-1-2-4-1-4 2s2 5 4 5M17 7c1-2 4-1 4 2s-2 5-4 5",
      "M7 4c-2 0-4 1-4 4s1 8 4 8M17 4c2 0 4 1 4 4s-1 8-4 8"
    ];
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_40px_rgba(234,179,8,0.3)]">
        <path d={shapes[monthIdx % 4]} stroke={gold} strokeWidth="1.2" />
        <path d="M7 4h10v2l-1 8c0 2-2 4-4 4s-4-2-4-4l-1-8V4z" fill="black" stroke={gold} strokeWidth="1.5" />
        <path d="M12 18v2M8 22h8M10 20h4" stroke={gold} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="10" r="2.5" stroke={gold} strokeWidth="1" opacity="0.6" />
      </svg>
    );
  },
  Settings: () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Nav: ({ type, active }) => {
    const color = active ? "#EAB308" : "#52525b";
    if (type === 'main') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01" /></svg>;
    if (type === 'daily') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  },
  Chevron: ({ dir = "left", size = 28, strokeWidth = 2.5, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} /></svg>
  ),
  Pause: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>,
  Undo: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><polyline points="3 3 3 8 8 8" /></svg>,
  Erase: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" /><path d="M22 21H7M5 11l9 9" /></svg>,
  Notes: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>,
  Hint: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" /></svg>
};
