import React from 'react';
import { Eraser } from 'lucide-react';

const Numpad = ({ onInput, onErase }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-sm mx-auto p-2 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800">
      {/* 1-5 Top Row */}
      {numbers.slice(0, 5).map(num => (
        <button
          key={num}
          onClick={() => onInput(num)}
          className="aspect-square flex items-center justify-center text-2xl font-semibold bg-zinc-800 text-yellow-500 rounded-xl hover:bg-zinc-700 active:bg-yellow-500 active:text-zinc-950 transition-all duration-150 transform hover:scale-105 shadow-inner"
        >
          {num}
        </button>
      ))}

      {/* 6-9 and Erase Bottom Row */}
      {numbers.slice(5).map(num => (
        <button
          key={num}
          onClick={() => onInput(num)}
          className="aspect-square flex items-center justify-center text-2xl font-semibold bg-zinc-800 text-yellow-500 rounded-xl hover:bg-zinc-700 active:bg-yellow-500 active:text-zinc-950 transition-all duration-150 transform hover:scale-105 shadow-inner"
        >
          {num}
        </button>
      ))}

      {/* Eraser Button */}
      <button
        onClick={onErase}
        className="aspect-square flex items-center justify-center text-zinc-400 bg-zinc-800 rounded-xl hover:bg-zinc-700 hover:text-red-400 active:bg-red-500 active:text-white transition-all duration-150 transform hover:scale-105 shadow-inner"
        aria-label="Erase"
      >
        <Eraser size={28} />
      </button>
    </div>
  );
};

export default Numpad;
