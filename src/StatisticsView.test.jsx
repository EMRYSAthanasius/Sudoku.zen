import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { StatisticsView } from './StatisticsView.jsx';

describe('StatisticsView', () => {
  let originalLocalStorage;

  beforeEach(() => {
    // Save original localStorage
    originalLocalStorage = global.localStorage;

    // Mock localStorage
    const store = {
      sudokuDetailedStats: '{invalid json}',
    };

    global.localStorage = {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value;
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
    };
  });

  afterEach(() => {
    // Restore original localStorage
    global.localStorage = originalLocalStorage;
    cleanup();
  });

  test('renders without crashing when localStorage has invalid JSON', () => {
    // Render the component
    const { container } = render(<StatisticsView onBack={() => {}} fmtTime={(v) => v} />);

    // Assert that the component rendered successfully
    // We can check if a known text or element is present
    const heading = screen.getByRole('heading', { name: /statistics/i });
    assert.ok(heading, 'Statistics heading should be present');

    // Also check if some of the standard text rendered
    assert.ok(screen.getByText('Games Started'), 'Games Started text should be present');
  });
});
