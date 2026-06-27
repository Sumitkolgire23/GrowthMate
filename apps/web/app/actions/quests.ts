'use server';

import { prisma } from '@repo/database';
import { 
  getPerformanceMultiplier, 
  processXPAndLevelUp, 
  generateDailyQuests,
  getNewlyUnlockedAchievements
} from '@repo/game-logic';
import { CharacterStats } from '@repo/types';
import { getCurrentUser } from './auth';

export async function generateUserQuests() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Check if quests already exist for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingQuests = await prisma.quest.findMany({
      where: {
        profileId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    // 3. If quests already exist, return them
    if (existingQuests && existingQuests.length > 0) {
      return { 
        success: true, 
        quests: existingQuests.map(q => ({
          ...q,
          stats_affected: q.statsAffected.split(','),
        })) 
      };
    }

    // 4. Otherwise, generate new daily quests
    const dailyQuests = generateDailyQuests();
    const questsToInsert = dailyQuests.map(q => ({
      profileId: user.id,
      title: q.title,
      description: q.description,
      category: q.category,
      rank: q.rank,
      xpReward: q.xp_reward,
      goldReward: q.gold_reward,
      statsAffected: q.stats_affected.join(','),
      completed: false,
    }));

    await prisma.quest.createMany({
      data: questsToInsert,
    });

    const insertedQuests = await prisma.quest.findMany({
      where: {
        profileId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    return { 
      success: true, 
      quests: insertedQuests.map(q => ({
        ...q,
        stats_affected: q.statsAffected.split(','),
      })) 
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function completeQuest(
  questId: string,
  effortLevel: 'low' | 'medium' | 'high' | 'extreme' = 'medium',
  completionNotes?: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Fetch quest details
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest || quest.profileId !== user.id) {
      return { success: false, error: 'Quest not found or does not belong to user.' };
    }

    if (quest.completed) {
      return { success: false, error: 'Quest is already completed.' };
    }

    // 3. Fetch user profile
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return { success: false, error: 'User profile not found.' };
    }

    // 4. Fetch user stats
    const stats = await prisma.stats.findUnique({
      where: { profileId: user.id },
    });

    if (!stats) {
      return { success: false, error: 'User stats not found.' };
    }

    // 5. Calculate reward with multipliers
    const performance = getPerformanceMultiplier(profile.engagement, profile.energy);
    
    let effortMultiplier = 1.0;
    if (effortLevel === 'low') effortMultiplier = 0.5;
    else if (effortLevel === 'high') effortMultiplier = 1.5;
    else if (effortLevel === 'extreme') effortMultiplier = 2.0;

    const xpGained = Math.floor(quest.xpReward * performance.multiplier * effortMultiplier);
    const goldGained = Math.floor(quest.goldReward * effortMultiplier);

    // 6. Process level up
    const levelUpResult = processXPAndLevelUp(profile.level, profile.xp, xpGained);

    // 7. Update stats affected
    const updatedStats: Partial<CharacterStats> = {};
    const statsKeys: (keyof CharacterStats)[] = [
      'productivity',
      'creativity',
      'knowledge',
      'experience',
      'intelligence',
      'resilience',
    ];

    const statsAffectedList = quest.statsAffected.split(',');
    statsKeys.forEach(key => {
      const isAffected = statsAffectedList.includes(key);
      const currentVal = (stats as any)[key] || 10;
      if (isAffected) {
        updatedStats[key] = Math.min(100, currentVal + 2);
      }
    });

    // 9. Fetch completed quests to calculate streaks and projects
    const completedQuests = await prisma.quest.findMany({
      where: {
        profileId: user.id,
        completed: true,
      },
      orderBy: { completedAt: 'desc' },
    });

    // Add current quest to list for streak calculation
    const currentCompletedQuest = {
      ...quest,
      completed: true,
      completedAt: new Date(),
    };
    const allCompletedQuests = [currentCompletedQuest, ...completedQuests];

    // Calculate current streak
    let currentStreak = 0;
    if (allCompletedQuests.length > 0) {
      const dates = allCompletedQuests
        .map(q => q.completedAt ? q.completedAt.toDateString() : '')
        .filter((v, i, a) => v !== '' && a.indexOf(v) === i);

      const todayStr = new Date().toDateString();
      const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

      if (dates[0] === todayStr || dates[0] === yesterdayStr) {
        currentStreak = 1;
        let checkDate = new Date(dates[0]!);
        for (let i = 1; i < dates.length; i++) {
          const diffTime = checkDate.getTime() - new Date(dates[i]!).getTime();
          const diffDays = Math.round(diffTime / 86400000);
          if (diffDays === 1) {
            currentStreak++;
            checkDate = new Date(dates[i]!);
          } else if (diffDays > 1) {
            break;
          }
        }
      }
    }

    // Calculate project-based completed count
    const projectsCompleted = allCompletedQuests.filter(q => 
      q.title.toLowerCase().includes('project') || 
      q.description.toLowerCase().includes('project')
    ).length;

    // 10. Evaluate achievements
    const unlockedAchs = await prisma.userAchievement.findMany({
      where: { profileId: user.id },
      select: { achievementId: true },
    });

    const unlockedIds = unlockedAchs.map(a => a.achievementId);

    const newlyUnlocked = getNewlyUnlockedAchievements(unlockedIds, {
      questsCompleted: allCompletedQuests.length,
      currentStreak,
      level: levelUpResult.newLevel,
      projectsCompleted
    });

    let extraGoldGained = 0;
    let extraXPGained = 0;

    // Execute database updates inside transaction
    const finalResult = await prisma.$transaction(async (tx) => {
      // Complete quest
      await tx.quest.update({
        where: { id: questId },
        data: {
          completed: true,
          completedAt: new Date(),
          effortLevel,
          completionNotes: completionNotes || null,
        },
      });

      // Insert achievements
      if (newlyUnlocked.length > 0) {
        for (const a of newlyUnlocked) {
          await tx.userAchievement.create({
            data: {
              profileId: user.id,
              achievementId: a.id,
            },
          });
        }

        newlyUnlocked.forEach(a => {
          extraGoldGained += a.gold_reward;
          extraXPGained += a.xp_reward;
        });

        if (extraXPGained > 0) {
          const finalLevelUpResult = processXPAndLevelUp(levelUpResult.newLevel, levelUpResult.remainingXP, extraXPGained);
          levelUpResult.newLevel = finalLevelUpResult.newLevel;
          levelUpResult.remainingXP = finalLevelUpResult.remainingXP;
          levelUpResult.statPointsGained += finalLevelUpResult.statPointsGained;
          levelUpResult.leveledUp = levelUpResult.leveledUp || finalLevelUpResult.leveledUp;
        }
      }

      // Update Profile values
      const newEngagement = Math.min(100, profile.engagement + 3);
      const newEnergy = Math.max(0, profile.energy - 5);
      const finalGold = profile.gold + goldGained + extraGoldGained;
      const finalStatPoints = (profile.statPoints || 0) + levelUpResult.statPointsGained;

      await tx.profile.update({
        where: { id: user.id },
        data: {
          level: levelUpResult.newLevel,
          xp: levelUpResult.remainingXP,
          gold: finalGold,
          engagement: newEngagement,
          energy: newEnergy,
          statPoints: finalStatPoints,
        },
      });

      // Update Stats
      if (Object.keys(updatedStats).length > 0) {
        await tx.stats.update({
          where: { profileId: user.id },
          data: updatedStats,
        });
      }

      // Award progress to random unlocked skill
      const unlockedSkills = await tx.unlockedSkill.findMany({
        where: { profileId: user.id },
      });

      let skillProgressGained = null;
      if (unlockedSkills && unlockedSkills.length > 0) {
        const randomSkill = unlockedSkills[Math.floor(Math.random() * unlockedSkills.length)]!;
        const progressToAdd = 10;
        const newProgress = Math.min(100, randomSkill.progress + progressToAdd);
        
        await tx.unlockedSkill.update({
          where: { id: randomSkill.id },
          data: { progress: newProgress },
        });

        skillProgressGained = {
          name: randomSkill.skillName,
          progressAdded: progressToAdd,
          newProgress
        };
      }

      return {
        success: true,
        xpGained,
        goldGained,
        leveledUp: levelUpResult.leveledUp,
        newLevel: levelUpResult.newLevel,
        statPointsGained: levelUpResult.statPointsGained,
        performanceMessage: performance.message,
        newAchievements: newlyUnlocked,
        skillProgressGained
      };
    });

    return finalResult;
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
