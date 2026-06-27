'use server';

import { prisma } from '@repo/database';
import { CharacterStats } from '@repo/types';
import { getCurrentUser } from './auth';

export async function allocateStatPoints(allocation: Partial<CharacterStats>) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Fetch current profile to check available stat points
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return { success: false, error: 'Profile not found.' };
    }

    // Calculate total points requested to allocate
    const totalAllocated = Object.values(allocation).reduce((sum: number, val) => sum + (val || 0), 0);

    if (totalAllocated <= 0) {
      return { success: false, error: 'No points allocated.' };
    }

    if (totalAllocated > profile.statPoints) {
      return { success: false, error: 'Not enough available stat points.' };
    }

    // 3. Fetch current stats
    const stats = await prisma.stats.findUnique({
      where: { profileId: user.id },
    });

    if (!stats) {
      return { success: false, error: 'Stats not found.' };
    }

    // 4. Calculate new stats
    const updatedStats: Partial<CharacterStats> = {
      productivity: Math.min(100, stats.productivity + (allocation.productivity || 0)),
      creativity: Math.min(100, stats.creativity + (allocation.creativity || 0)),
      knowledge: Math.min(100, stats.knowledge + (allocation.knowledge || 0)),
      experience: Math.min(100, stats.experience + (allocation.experience || 0)),
      intelligence: Math.min(100, stats.intelligence + (allocation.intelligence || 0)),
      resilience: Math.min(100, stats.resilience + (allocation.resilience || 0)),
    };

    // 5. Update database inside transaction
    await prisma.$transaction(async (tx) => {
      // Update stats table
      await tx.stats.update({
        where: { profileId: user.id },
        data: updatedStats,
      });

      // Update profile to deduct spent points
      await tx.profile.update({
        where: { id: user.id },
        data: {
          statPoints: profile.statPoints - totalAllocated,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function resetCharacter() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Delete all related tables
    await prisma.$transaction(async (tx) => {
      await tx.stats.deleteMany({ where: { profileId: user.id } });
      await tx.quest.deleteMany({ where: { profileId: user.id } });
      await tx.unlockedSkill.deleteMany({ where: { profileId: user.id } });
      await tx.userAchievement.deleteMany({ where: { profileId: user.id } });
      await tx.assessmentResponse.deleteMany({ where: { profileId: user.id } });
      await tx.purchasedReward.deleteMany({ where: { profileId: user.id } });

      // 3. Reset profile fields
      await tx.profile.update({
        where: { id: user.id },
        data: {
          level: 1,
          xp: 0,
          gold: 100,
          engagement: 50,
          energy: 70,
          statPoints: 0,
          name: user.email?.split('@')[0] || 'Unknown Hunter',
        },
      });

      // 4. Create base stats record
      await tx.stats.create({
        data: {
          profileId: user.id,
          productivity: 10,
          creativity: 10,
          knowledge: 10,
          experience: 10,
          intelligence: 10,
          resilience: 10,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function getProgressData() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: { stats: true },
    });

    const completedQuests = await prisma.quest.findMany({
      where: {
        profileId: user.id,
        completed: true,
      },
      orderBy: { completedAt: 'asc' },
    });

    const achievements = await prisma.userAchievement.findMany({
      where: { profileId: user.id },
    });

    return {
      profile,
      stats: profile?.stats || null,
      completedQuests: completedQuests.map(q => ({
        ...q,
        stats_affected: q.statsAffected.split(','),
        completed_at: q.completedAt ? q.completedAt.toISOString() : null,
        xp_reward: q.xpReward,
        gold_reward: q.goldReward,
      })),
      achievements,
    };
  } catch (err) {
    return null;
  }
}
