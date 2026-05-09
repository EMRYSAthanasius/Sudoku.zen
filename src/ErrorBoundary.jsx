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
    localStorage.removeItem('SUDOKU_NORMAL_PROGRESS');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mg-app-shell min-h-screen text-[color:var(--mg-cream)] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="mg-font-display text-3xl font-medium mb-4 uppercase text-[color:var(--mg-gold-bright)]">Game Error</h2>
          <p className="text-lg text-[color:var(--mg-subtle)] mb-8 max-w-md">
            Something went wrong while loading the game data.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mg-btn-primary w-full max-w-xs py-4 rounded-[24px] font-semibold text-xl active:border-b-0 active:translate-y-0.5 transition-all duration-150"
          >
            Clear Data & Restart
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
