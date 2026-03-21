import React from 'react';

const Board = ({ board, selectedCell, onCellClick }) => {
  // Helpers to determine borders and highlights
  const isSelected = (r, c) => selectedCell?.r === r && selectedCell?.c === c;

  // Highlight same row, col, box or same number
  const isHighlighted = (r, c) => {
    if (!selectedCell) return false;
    const { r: sr, c: sc } = selectedCell;
    const isSameNum = board[r][c].value !== null && board[sr][sc].value !== null && board[r][c].value === board[sr][sc].value;
    return r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)) || isSameNum;
  };

  return (
    <div className="w-full h-full grid grid-rows-9 grid-cols-9 bg-zinc-400 border-4 border-zinc-400 gap-px p-px rounded">
      {board.map((row, r) =>
        row.map((cell, c) => {

          // Determine borders for 3x3 grids
          const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-4 border-r-zinc-400' : '';
          const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-4 border-b-zinc-400' : '';

          // Determine cell styling based on state
          let bgClass = 'bg-zinc-900';
          if (isSelected(r, c)) bgClass = 'bg-yellow-500/30';
          else if (isHighlighted(r, c)) bgClass = 'bg-zinc-800';

          let textClass = 'text-zinc-100';
          if (cell.isClue) textClass = 'text-yellow-500';
          else if (cell.isError) textClass = 'text-red-500';
          else textClass = 'text-blue-400';

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={`
                flex items-center justify-center
                text-xl sm:text-2xl font-medium
                cursor-pointer transition-colors duration-200
                ${bgClass} ${textClass} ${borderRight} ${borderBottom}
              `}
              style={{ minHeight: 0 }} // helps prevent overflow
            >
              {cell.value ? (
                <span>{cell.value}</span>
              ) : cell.notes.size > 0 ? (
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <div key={n} className="flex items-center justify-center text-[8px] sm:text-[10px] leading-none text-zinc-500">
                      {cell.notes.has(n) ? n : ''}
                    </div>
                  ))}
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;
