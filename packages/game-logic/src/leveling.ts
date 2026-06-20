import { RankingInfo } from '@repo/types';

// ===== RANKING SYSTEM =====
export function getRankingInfo(level: number): RankingInfo {
  if (level >= 1 && level <= 5) return { rank: "F", stage: "F", title: "Novice Developer", color: "#9ca3af" };
  if (level >= 6 && level <= 10) return { rank: "F", stage: "F+", title: "Novice Developer", color: "#9ca3af" };
  if (level >= 11 && level <= 15) return { rank: "E", stage: "E", title: "Apprentice Engineer", color: "#84cc16" };
  if (level >= 16 && level <= 20) return { rank: "E", stage: "E+", title: "Apprentice Engineer", color: "#84cc16" };
  if (level >= 21 && level <= 30) return { rank: "D", stage: "D", title: "Junior Developer", color: "#06b6d4" };
  if (level >= 31 && level <= 40) return { rank: "D", stage: "D+", title: "Junior Developer", color: "#06b6d4" };
  if (level >= 41 && level <= 50) return { rank: "C", stage: "C", title: "Mid-Level Engineer", color: "#8b5cf6" };
  if (level >= 51 && level <= 60) return { rank: "C", stage: "C+", title: "Mid-Level Engineer", color: "#8b5cf6" };
  if (level >= 61 && level <= 70) return { rank: "B", stage: "B", title: "Senior Developer", color: "#f59e0b" };
  if (level >= 71 && level <= 80) return { rank: "B", stage: "B+", title: "Senior Developer", color: "#f59e0b" };
  if (level >= 81 && level <= 85) return { rank: "A", stage: "A", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 86 && level <= 90) return { rank: "A", stage: "AA", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 91 && level <= 95) return { rank: "A", stage: "AAA", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 96 && level <= 100) return { rank: "A", stage: "AAA+", title: "Staff Engineer", color: "#ec4899" };
  if (level >= 101 && level <= 105) return { rank: "S", stage: "S", title: "Principal Engineer", color: "#fbbf24" };
  if (level >= 106 && level <= 110) return { rank: "S", stage: "SS", title: "Principal Engineer", color: "#fbbf24" };
  return { rank: "S", stage: "SSS", title: "Principal Engineer", color: "#fbbf24" };
}

// ===== XP CALCULATION =====
export function getXPForLevel(level: number): number {
  return 50 * level * (level + 1);
}

// ===== ENGAGEMENT & ENERGY THRESHOLDS =====
export function getEngagementStatus(value: number) {
  if (value >= 90) return { label: "Peak", color: "#10b981", description: "Maximum focus and drive" };
  if (value >= 75) return { label: "Excellent", color: "#3b82f6", description: "High engagement" };
  if (value >= 60) return { label: "Good", color: "#8b5cf6", description: "Solid motivation" };
  if (value >= 40) return { label: "Moderate", color: "#f59e0b", description: "Average engagement" };
  if (value >= 20) return { label: "Low", color: "#f97316", description: "Struggling motivation" };
  return { label: "Critical", color: "#ef4444", description: "Disengagement risk" };
}

export function getEnergyStatus(value: number) {
  if (value >= 80) return { label: "Fresh", color: "#10b981", description: "Fully energized" };
  if (value >= 60) return { label: "Active", color: "#3b82f6", description: "Good energy levels" };
  if (value >= 40) return { label: "Tired", color: "#f59e0b", description: "Moderate fatigue" };
  if (value >= 20) return { label: "Exhausted", color: "#f97316", description: "High fatigue - rest recommended" };
  return { label: "Burnout Risk", color: "#ef4444", description: "Critical - immediate rest needed" };
}

export function getPerformanceMultiplier(engagement: number, energy: number) {
  if (engagement > 75 && energy < 40) return { multiplier: 1.5, message: "Optimal Performance! 1.5x XP bonus" };
  if (engagement < 40 && energy > 60) return { multiplier: 0.75, message: "Performance penalty -25% XP. Consider taking a break." };
  return { multiplier: 1.0, message: "" };
}

// ===== LEVEL UP PROCESSOR =====
export function calculateStatPointsForLevel(level: number): number {
  return 2 + Math.floor(level / 5);
}

export function processXPAndLevelUp(
  currentLevel: number,
  currentXP: number,
  xpGained: number
): {
  newLevel: number;
  remainingXP: number;
  statPointsGained: number;
  leveledUp: boolean;
} {
  let level = currentLevel;
  let xp = currentXP + xpGained;
  let statPointsGained = 0;
  let leveledUp = false;

  while (true) {
    const xpRequired = getXPForLevel(level);
    if (xp >= xpRequired) {
      xp -= xpRequired;
      level++;
      statPointsGained += calculateStatPointsForLevel(level);
      leveledUp = true;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    remainingXP: xp,
    statPointsGained,
    leveledUp
  };
}
