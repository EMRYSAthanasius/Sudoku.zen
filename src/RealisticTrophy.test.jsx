import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { RealisticTrophy } from './RealisticTrophy.jsx';

describe('RealisticTrophy', () => {
  it('renders correctly with default size', () => {
    const { container } = render(<RealisticTrophy monthIdx={0} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '180');
    expect(svg).toHaveAttribute('height', '180');
  });

  it('renders correctly with custom size', () => {
    const { container } = render(<RealisticTrophy monthIdx={0} size={250} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '250');
    expect(svg).toHaveAttribute('height', '250');
  });

  it('handles edge case: monthIdx = 0', () => {
    // 0 % 3 === 0 (tall), 0 % 2 === 0 (swan), 0 % 4 === 0 (not wide), 0 % 5 === 0 (not bronze/champagne)
    const { container } = render(<RealisticTrophy monthIdx={0} />);
    expect(container.innerHTML).toContain('glow-0');

    // Check for tall base rect width
    expect(container.innerHTML).toContain('width="44"');

    // Check swan handle path
    expect(container.innerHTML).toContain('M 35 30 C 15 20, 10 50, 35 55');

    // Check cup path (not wide)
    expect(container.innerHTML).toContain('M 30 15 L 70 15 C 70 50, 60 65, 50 65 C 40 65, 30 50, 30 15 Z');
  });

  it('handles edge case: monthIdx = -1 (negative numbers)', () => {
    // -1 % N evaluates to -1 in JS, so it won't trigger tall base, swan handles, wider cup, bronze, or champagne
    const { container } = render(<RealisticTrophy monthIdx={-1} />);
    expect(container.innerHTML).toContain('glow--1');

    // normal base rect width
    expect(container.innerHTML).toContain('width="40"');

    // normal handle path
    expect(container.innerHTML).toContain('M 35 35 Q 20 35, 25 50 T 40 60');
  });

  it('renders isWiderCup correctly (monthIdx = 1)', () => {
    // 1 % 4 === 1
    const { container } = render(<RealisticTrophy monthIdx={1} />);

    // wider cup path
    expect(container.innerHTML).toContain('M 25 20 L 75 20 C 75 45, 60 65, 50 65 C 40 65, 25 45, 25 20 Z');

    // wider cup rim highlight rx
    expect(container.innerHTML).toContain('rx="25"');
  });

  it('renders isBronze correctly (monthIdx = 2)', () => {
    // 2 % 5 === 2 (bronze)
    const { container } = render(<RealisticTrophy monthIdx={2} />);

    // bronze highlight is #FEF08A
    expect(container.innerHTML).toContain('#FEF08A');
  });

  it('renders isChampagne correctly (monthIdx = 3)', () => {
    // 3 % 5 === 3 (champagne)
    const { container } = render(<RealisticTrophy monthIdx={3} />);

    // champagne highlight is #FAFAFA
    expect(container.innerHTML).toContain('#FAFAFA');
  });

  it('handles edge case: large monthIdx (e.g. 11 for Dec)', () => {
    // 11 % 3 = 2 (not tall)
    // 11 % 2 = 1 (not swan handles)
    // 11 % 4 = 3 (not wide cup)
    // 11 % 5 = 1 (not bronze/champagne)
    const { container } = render(<RealisticTrophy monthIdx={11} />);
    expect(container.innerHTML).toContain('glow-11');

    expect(container.innerHTML).toContain('width="40"'); // normal base
    expect(container.innerHTML).toContain('M 30 15 L 70 15 C 70 50, 60 65, 50 65 C 40 65, 30 50, 30 15 Z'); // normal cup
  });
});
