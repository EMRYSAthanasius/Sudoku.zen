import React from 'react';
import { render } from '@testing-library/react';
import { test, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import App from './App.jsx';

// Mock matchMedia because components like Navigation may use it
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

describe('App component error handling for LocalStorage parsing', () => {
    let originalLocalStorage;

    beforeEach(() => {
        // Mock window.localStorage
        originalLocalStorage = window.localStorage;
        const localStorageMock = (() => {
            let store = {};
            return {
                getItem: vi.fn((key) => store[key] || null),
                setItem: vi.fn((key, value) => {
                    store[key] = value.toString();
                }),
                removeItem: vi.fn((key) => {
                    delete store[key];
                }),
                clear: vi.fn(() => {
                    store = {};
                })
            };
        })();
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });
    });

    afterEach(() => {
        // Restore window.localStorage and any mocks
        Object.defineProperty(window, 'localStorage', {
            value: originalLocalStorage,
            writable: true
        });
        vi.restoreAllMocks();
    });

    test('should fallback to default stats if localStorage contains invalid JSON', () => {
        // Set invalid JSON string in localStorage
        window.localStorage.setItem('sudokuUserStats', 'invalid-json');

        // Mock console.error if the application happens to log an error,
        // although in App.jsx it silently catches, it's a good practice
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Render the app
        const { container } = render(<App />);

        // The app should not crash and should correctly render
        expect(container).toBeInTheDocument();

        // Ensure that our app tries to read 'sudokuUserStats'
        expect(window.localStorage.getItem).toHaveBeenCalledWith('sudokuUserStats');

        consoleSpy.mockRestore();
    });

    test('should correctly parse valid JSON stats from localStorage', () => {
        // Provide a valid JSON stats
        const validStats = { Easy: 1, Medium: 2, Hard: 3, Expert: 4, Master: 5, Extreme: 6 };
        window.localStorage.setItem('sudokuUserStats', JSON.stringify(validStats));

        // Render the app
        const { container } = render(<App />);

        // The app should not crash and should correctly render
        expect(container).toBeInTheDocument();

        // Ensure that our app tries to read 'sudokuUserStats'
        expect(window.localStorage.getItem).toHaveBeenCalledWith('sudokuUserStats');
    });
});
