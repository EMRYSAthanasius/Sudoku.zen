import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('SUDOKU_APP_NORMAL');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#5D2E17] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-black text-[#FFFDD0] mb-4 uppercase">Game Error</h2>
          <p className="text-lg text-[#F5F5DC] mb-8 max-w-md">
            Something went wrong while loading the game data.
          </p>
          <button
            onClick={this.handleReset}
            className="w-full max-w-xs bg-[#C19A6B] text-[#2D1B10] py-4 rounded-[24px] font-bold text-xl shadow-2xl border-b-4 border-[#A0522D] active:border-b-0 active:translate-y-1 transition-all duration-150"
          >
            Clear Data & Restart
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
