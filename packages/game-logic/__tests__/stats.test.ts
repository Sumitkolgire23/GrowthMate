import { describe, it, expect } from 'vitest';
import { calculateInitialStats, calculateStats } from '../src/stats';
import { AssessmentData } from '@repo/types';

describe('stats calculation', () => {
  const dummyAssessmentData: AssessmentData = {
    yearsExperience: 2,
    projectsCompleted: 5,
    liveProjects: 3,
    hoursPerWeek: 40,
    uniqueProjects: 3,
    newTechTried: 5,
    completedCourses: 2,
    startedCourses: 3,
    weeklyLearningHours: 8,
    userReach: 500,
    teamProjects: 2,
    algorithmSkill: 'intermediate',
    debugSpeed: 'average',
    streakDays: 14,
    stressHandling: 4,
    recoveryTime: 'oneday',
    skills: {
      frontend: [
        { name: 'React', level: 'intermediate' },
        { name: 'HTML/CSS', level: 'advanced' }
      ],
      backend: [
        { name: 'Node.js', level: 'basic' }
      ]
    }
  };

  it('calculateStats basic calculator works', () => {
    const stats = calculateStats(dummyAssessmentData);
    expect(stats.productivity).toBeGreaterThan(0);
    expect(stats.creativity).toBeGreaterThan(0);
    expect(stats.knowledge).toBeGreaterThan(0);
    expect(stats.experience).toBeGreaterThan(0);
    expect(stats.intelligence).toBeGreaterThan(0);
    expect(stats.resilience).toBeGreaterThan(0);
  });

  it('calculateInitialStats advanced calculator works', () => {
    const stats = calculateInitialStats(dummyAssessmentData);
    expect(stats.productivity).toBeGreaterThan(0);
    expect(stats.productivity).toBeLessThanOrEqual(100);
    expect(stats.creativity).toBeGreaterThan(0);
    expect(stats.knowledge).toBeGreaterThan(0);
    expect(stats.experience).toBeGreaterThan(0);
    expect(stats.intelligence).toBeGreaterThan(0);
    expect(stats.resilience).toBeGreaterThan(0);
  });
});
