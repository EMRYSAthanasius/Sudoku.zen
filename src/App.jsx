import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import Numpad from './components/Numpad';
import { generateSudoku, checkWin } from './utils/SudokuEngine';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Extreme'];
const MAX_MISTAKES = 3;

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // { r, c }
  const [notesMode, setNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [undoStack, setUndoStack] = useState([]);

  // Initialize game
  const startNewGame = useCallback((diff = difficulty) => {
    const { puzzle, solution } = generateSudoku(diff);
    setBoard(puzzle);
    setSolution(solution);
    setSelectedCell(null);
    setNotesMode(false);
    setMistakes(0);
    setGameOver(false);
    setGameWon(false);
    setDifficulty(diff);
    setUndoStack([]);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, []);

  const handleCellClick = (r, c) => {
    if (gameOver || gameWon) return;
    setSelectedCell({ r, c });
  };

  const saveToUndoStack = () => {
    // Deep copy board
    const currentBoardState = board.map(row =>
      row.map(cell => ({ ...cell, notes: new Set(cell.notes) }))
    );
    setUndoStack([...undoStack, currentBoardState]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || gameOver || gameWon) return;

    const newStack = [...undoStack];
    const prevState = newStack.pop();
    setUndoStack(newStack);
    setBoard(prevState);
  };

  const handleInput = useCallback((num) => {
    if (!selectedCell || gameOver || gameWon) return;

    const { r, c } = selectedCell;
    const cell = board[r][c];

    if (cell.isClue) return; // Can't change clues

    // Create new board
    const newBoard = board.map(row =>
      row.map(c => ({ ...c, notes: new Set(c.notes) }))
    );

    saveToUndoStack();

    if (notesMode) {
      // Toggle note
      const newNotes = newBoard[r][c].notes;
      if (newNotes.has(num)) {
        newNotes.delete(num);
      } else {
        newNotes.add(num);
      }
      newBoard[r][c].value = null; // Clear value if setting note
      newBoard[r][c].isError = false;
      setBoard(newBoard);
    } else {
      // Set value
      if (cell.value === num) {
        // Erase
        newBoard[r][c].value = null;
        newBoard[r][c].isError = false;
        setBoard(newBoard);
      } else {
        newBoard[r][c].value = num;
        newBoard[r][c].notes.clear(); // Clear notes when setting value

        // Check if correct
        if (num !== solution[r][c]) {
          newBoard[r][c].isError = true;
          setMistakes(m => {
            const newMistakes = m + 1;
            if (newMistakes >= MAX_MISTAKES) {
              setGameOver(true);
            }
            return newMistakes;
          });
        } else {
          newBoard[r][c].isError = false;
        }

        setBoard(newBoard);

        // Check win
        if (checkWin(newBoard, solution)) {
          setGameWon(true);
        }
      }
    }
  }, [selectedCell, board, solution, notesMode, gameOver, gameWon, undoStack]);

  const handleErase = () => {
    if (!selectedCell || gameOver || gameWon) return;
    const { r, c } = selectedCell;
    if (board[r][c].isClue) return;

    saveToUndoStack();
    const newBoard = board.map(row =>
      row.map(cell => ({ ...cell, notes: new Set(cell.notes) }))
    );
    newBoard[r][c].value = null;
    newBoard[r][c].notes.clear();
    newBoard[r][c].isError = false;
    setBoard(newBoard);
  };

  const handleHint = () => {
    if (!selectedCell || gameOver || gameWon) return;
    const { r, c } = selectedCell;
    if (board[r][c].isClue || board[r][c].value === solution[r][c]) return; // Already correct or clue

    saveToUndoStack();
    const newBoard = board.map(row =>
      row.map(cell => ({ ...cell, notes: new Set(cell.notes) }))
    );
    newBoard[r][c].value = solution[r][c];
    newBoard[r][c].notes.clear();
    newBoard[r][c].isError = false;

    // Clean up notes in same row/col/box
    const num = solution[r][c];
    for (let x = 0; x < 9; x++) {
      newBoard[r][x].notes.delete(num);
      newBoard[x][c].notes.delete(num);
    }
    const startRow = r - (r % 3);
    const startCol = c - (c % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newBoard[startRow + i][startCol + j].notes.delete(num);
      }
    }

    setBoard(newBoard);

    if (checkWin(newBoard, solution)) {
      setGameWon(true);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '9') {
        handleInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'n') {
        setNotesMode(!notesMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleErase, notesMode]);


  if (board.length === 0) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-yellow-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start sm:justify-center p-4 overflow-hidden touch-none select-none">

      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 text-yellow-500">
        <h1 className="text-2xl font-bold tracking-wider">SUDOKU</h1>
        <div className="flex flex-col items-end">
          <select
            value={difficulty}
            onChange={(e) => startNewGame(e.target.value)}
            className="text-sm bg-transparent outline-none cursor-pointer appearance-none text-right"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff} className="bg-zinc-900 text-yellow-500">{diff}</option>
            ))}
          </select>
          <div className="text-sm font-semibold text-red-400">Mistakes: {mistakes}/{MAX_MISTAKES}</div>
        </div>
      </div>

      {/* Game Over / Win Overlay */}
      {(gameOver || gameWon) && (
        <div className="absolute inset-0 bg-zinc-950/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-zinc-900 border border-yellow-500/50 p-8 rounded-xl text-center shadow-2xl shadow-yellow-500/20 max-w-sm w-full mx-4">
            <h2 className={`text-3xl font-bold mb-4 ${gameWon ? 'text-yellow-400' : 'text-red-500'}`}>
              {gameWon ? 'Excellent!' : 'Game Over'}
            </h2>
            <p className="text-zinc-400 mb-8">
              {gameWon ? `You solved the ${difficulty} puzzle.` : 'You made 3 mistakes.'}
            </p>
            <button
              onClick={() => startNewGame()}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Main Board */}
      <div className="w-full max-w-md aspect-square mb-6 relative">
        <Board
          board={board}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />
      </div>

      {/* Controls */}
      <div className="w-full max-w-md mb-6">
        <Controls
          onNewGame={() => startNewGame()}
          onUndo={handleUndo}
          onHint={handleHint}
          onNotesToggle={() => setNotesMode(!notesMode)}
          notesMode={notesMode}
          canUndo={undoStack.length > 0}
        />
      </div>

      {/* Numpad */}
      <div className="w-full max-w-md">
        <Numpad onInput={handleInput} onErase={handleErase} />
      </div>

    </div>
  );
}

export default App;
