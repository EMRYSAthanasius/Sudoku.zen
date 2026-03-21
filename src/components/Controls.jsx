import React from 'react';
import { RefreshCw, RotateCcw, Lightbulb, Edit3 } from 'lucide-react';

const Controls = ({ onNewGame, onUndo, onHint, onNotesToggle, notesMode, canUndo }) => {
  return (
    <div className="flex justify-between items-center w-full bg-zinc-900 rounded-xl p-3 shadow-lg border border-zinc-800">

      {/* New Game */}
      <button
        onClick={onNewGame}
        className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
      >
        <RefreshCw size={24} className="mb-1" />
        <span className="text-[10px] uppercase font-bold tracking-wider">New</span>
      </button>

      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex flex-col items-center justify-center p-2 transition-colors ${
          canUndo ? 'text-zinc-400 hover:text-yellow-500' : 'text-zinc-700 cursor-not-allowed'
        }`}
      >
        <RotateCcw size={24} className="mb-1" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Undo</span>
      </button>

      {/* Hint */}
      <button
        onClick={onHint}
        className="flex flex-col items-center justify-center p-2 text-zinc-400 hover:text-yellow-500 transition-colors"
      >
        <Lightbulb size={24} className="mb-1" />
        <span className="text-[10px] uppercase font-bold tracking-wider">Hint</span>
      </button>

      {/* Notes */}
      <button
        onClick={onNotesToggle}
        className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ${
          notesMode
            ? 'text-yellow-400 bg-yellow-500/10 rounded-lg scale-105'
            : 'text-zinc-400 hover:text-yellow-500'
        }`}
      >
        <div className="relative">
          <Edit3 size={24} className="mb-1" />
          <span className={`absolute -top-1 -right-1 flex h-3 w-3 ${notesMode ? 'block' : 'hidden'}`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider">Notes</span>
      </button>

    </div>
  );
};

export default Controls;
