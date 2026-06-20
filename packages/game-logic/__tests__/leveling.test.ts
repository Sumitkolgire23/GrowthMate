import { describe, it, expect } from 'vitest';
import { getRankingInfo, getXPForLevel, processXPAndLevelUp, calculateStatPointsForLevel } from '../src/leveling';

describe('leveling logic', () => {
  it('getXPForLevel scales with level', () => {
    expect(getXPForLevel(1)).toBe(100);
    expect(getXPForLevel(2)).toBe(300);
  });

  it('getRankingInfo maps levels to stages correctly', () => {
    expect(getRankingInfo(1).rank).toBe('F');
    expect(getRankingInfo(15).rank).toBe('E');
    expect(getRankingInfo(101).rank).toBe('S');
  });

  it('calculateStatPointsForLevel awards correct points', () => {
    expect(calculateStatPointsForLevel(1)).toBe(2);
    expect(calculateStatPointsForLevel(5)).toBe(3);
    expect(calculateStatPointsForLevel(10)).toBe(4);
  });

  it('processXPAndLevelUp works for single level up', () => {
    const result = processXPAndLevelUp(1, 0, 100);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
    expect(result.remainingXP).toBe(0);
    expect(result.statPointsGained).toBe(2); // Level 2 awards 2 points
  });

  it('processXPAndLevelUp handles rollover multi-level ups', () => {
    // Level 1 needs 100 XP. Level 2 needs 300 XP. Total = 400 XP.
    // If we gain 450 XP:
    // Level 1: 450 - 100 = 350. Level up to 2.
    // Level 2: 350 - 300 = 50. Level up to 3.
    // Remaining XP = 50.
    const result = processXPAndLevelUp(1, 0, 450);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(3);
    expect(result.remainingXP).toBe(50);
    expect(result.statPointsGained).toBe(4); // Level 2 (2 pts) + Level 3 (2 pts) = 4 pts
  });
});
