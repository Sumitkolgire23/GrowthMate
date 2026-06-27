'use server';

import { prisma } from '@repo/database';
import { calculateInitialStats } from '@repo/game-logic';
import { AssessmentData } from '@repo/types';
import { getCurrentUser } from './auth';

export async function initializeCharacter(assessmentData: AssessmentData) {
  try {
    // 1. Get authenticated user from custom session
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Calculate initial stats using game-logic package
    const computedStats = calculateInitialStats(assessmentData);

    // 3. Perform database operations in a transaction
    await prisma.$transaction(async (tx) => {
      // Update profile details
      await tx.profile.update({
        where: { id: user.id },
        data: {
          name: assessmentData.name || user.email?.split('@')[0] || 'Unknown Hunter',
          level: 1,
          xp: 0,
          gold: 100,
          engagement: 50,
          energy: 70,
        },
      });

      // Save raw assessment response
      await tx.assessmentResponse.create({
        data: {
          profileId: user.id,
          rawAnswers: JSON.stringify(assessmentData),
          computedStats: JSON.stringify(computedStats),
        },
      });

      // Upsert character stats
      await tx.stats.upsert({
        where: { profileId: user.id },
        update: {
          productivity: computedStats.productivity,
          creativity: computedStats.creativity,
          knowledge: computedStats.knowledge,
          experience: computedStats.experience,
          intelligence: computedStats.intelligence,
          resilience: computedStats.resilience,
          updatedAt: new Date(),
        },
        create: {
          profileId: user.id,
          productivity: computedStats.productivity,
          creativity: computedStats.creativity,
          knowledge: computedStats.knowledge,
          experience: computedStats.experience,
          intelligence: computedStats.intelligence,
          resilience: computedStats.resilience,
        },
      });

      // Insert default Beginner skills into unlocked_skills
      const defaultBeginnerSkills = [
        "HTML Fundamentals",
        "CSS Basics",
        "JavaScript Essentials",
        "Git Version Control",
        "Python Programming",
        "Math Foundations",
        "Statistics Basics",
        "Data Visualization"
      ];

      for (const name of defaultBeginnerSkills) {
        await tx.unlockedSkill.upsert({
          where: {
            profileId_skillName: {
              profileId: user.id,
              skillName: name,
            },
          },
          update: {},
          create: {
            profileId: user.id,
            skillName: name,
            progress: 0,
          },
        });
      }
    });

    return { success: true, stats: computedStats };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
