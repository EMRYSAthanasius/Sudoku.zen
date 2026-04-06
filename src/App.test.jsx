import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App local storage test', () => {
  it('should gracefully handle invalid json in localstorage', () => {
    localStorage.setItem('sudokuUserStats', 'invalid_json');

    // Attempt to render the app. It shouldn't crash if it gracefully handles the exception
    expect(() => render(<App />)).not.toThrow();

    // Verify localStorage was updated with the default stats to reflect the fallback
    const expectedDefaultStats = { Easy: 0, Medium: 0, Hard: 0, Expert: 0, Master: 0, Extreme: 0 };
    const savedStatsStr = localStorage.getItem('sudokuUserStats');
    expect(savedStatsStr).toBe(JSON.stringify(expectedDefaultStats));
  });

  it('should gracefully handle empty or undefined json in localstorage', () => {
    localStorage.removeItem('sudokuUserStats');

    expect(() => render(<App />)).not.toThrow();

    const expectedDefaultStats = { Easy: 0, Medium: 0, Hard: 0, Expert: 0, Master: 0, Extreme: 0 };
    const savedStatsStr = localStorage.getItem('sudokuUserStats');
    expect(savedStatsStr).toBe(JSON.stringify(expectedDefaultStats));
  });

  it('should successfully parse valid json in localstorage', () => {
    const validStats = { Easy: 1, Medium: 2, Hard: 3, Expert: 4, Master: 5, Extreme: 6 };
    localStorage.setItem('sudokuUserStats', JSON.stringify(validStats));

    expect(() => render(<App />)).not.toThrow();

    const savedStatsStr = localStorage.getItem('sudokuUserStats');
    expect(savedStatsStr).toBe(JSON.stringify(validStats));
  });
});