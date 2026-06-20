'use server';

import { createClient } from '../../lib/supabase/server';
import { 
  getPerformanceMultiplier, 
  processXPAndLevelUp, 
  generateDailyQuests,
  getNewlyUnlockedAchievements
} from '@repo/game-logic';
import { CharacterStats } from '@repo/types';
import { Database } from '@repo/database';
import { SupabaseClient } from '@supabase/supabase-js';

export async function generateUserQuests() {
  try {
    const supabase = (await createClient()) as unknown as SupabaseClient<Database>;

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Check if quests already exist for today (UTC)
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: existingQuests, error: fetchError } = await supabase
      .from('quests')
      .select('*')
      .eq('profile_id', user.id)
      .gte('created_at', `${todayStr}T00:00:00Z`);

    if (fetchError) {
      return { success: false, error: `Failed to fetch quests: ${fetchError.message}` };
    }

    // 3. If quests already exist, return them
    if (existingQuests && existingQuests.length > 0) {
      return { success: true, quests: existingQuests };
    }

    // 4. Otherwise, generate new daily quests
    const dailyQuests = generateDailyQuests();
    const questsToInsert = dailyQuests.map(q => ({
      profile_id: user.id,
      title: q.title,
      description: q.description,
      category: q.category,
      rank: q.rank,
      xp_reward: q.xp_reward,
      gold_reward: q.gold_reward,
      stats_affected: q.stats_affected,
      completed: false,
    }));

    const { data: insertedQuests, error: insertError } = await supabase
      .from('quests')
      .insert(questsToInsert)
      .select('*');

    if (insertError) {
      return { success: false, error: `Failed to generate quests: ${insertError.message}` };
    }

    return { success: true, quests: insertedQuests };
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
    const supabase = (await createClient()) as unknown as SupabaseClient<Database>;

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Fetch quest details
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .eq('profile_id', user.id)
      .single();

    if (questError || !quest) {
      return { success: false, error: 'Quest not found or does not belong to user.' };
    }

    if (quest.completed) {
      return { success: false, error: 'Quest is already completed.' };
    }

    // 3. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'User profile not found.' };
    }

    // 4. Fetch user stats
    const { data: stats, error: statsError } = await supabase
      .from('stats')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (statsError || !stats) {
      return { success: false, error: 'User stats not found.' };
    }

    // 5. Calculate reward with performance and effort multipliers
    const performance = getPerformanceMultiplier(profile.engagement, profile.energy);
    
    let effortMultiplier = 1.0;
    if (effortLevel === 'low') effortMultiplier = 0.5;
    else if (effortLevel === 'high') effortMultiplier = 1.5;
    else if (effortLevel === 'extreme') effortMultiplier = 2.0;

    const xpGained = Math.floor(quest.xp_reward * performance.multiplier * effortMultiplier);
    const goldGained = Math.floor(quest.gold_reward * effortMultiplier);

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

    statsKeys.forEach(key => {
      const isAffected = quest.stats_affected.includes(key);
      const currentVal = (stats as any)[key] || 10;
      if (isAffected) {
        updatedStats[key] = Math.min(100, currentVal + 2);
      }
    });

    // 8. Update database: Mark Quest Completed
    const { error: questUpdateError } = await supabase
      .from('quests')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        effort_level: effortLevel,
        completion_notes: completionNotes || null,
      })
      .eq('id', questId);

    if (questUpdateError) {
      return { success: false, error: 'Failed to update quest status.' };
    }

    // 9. Fetch completed quests to calculate streaks and projects
    const { data: completedQuests } = await supabase
      .from('quests')
      .select('*')
      .eq('profile_id', user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false });

    // Calculate current streak
    let currentStreak = 0;
    if (completedQuests && completedQuests.length > 0) {
      const dates = completedQuests
        .map(q => q.completed_at ? new Date(q.completed_at).toDateString() : '')
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
    const projectsCompleted = completedQuests?.filter(q => 
      q.title.toLowerCase().includes('project') || 
      q.description.toLowerCase().includes('project')
    ).length || 0;

    // 10. Evaluate achievements
    const { data: unlockedAchs } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('profile_id', user.id);

    const unlockedIds = unlockedAchs?.map(a => a.achievement_id) || [];

    const newlyUnlocked = getNewlyUnlockedAchievements(unlockedIds, {
      questsCompleted: completedQuests?.length || 1,
      currentStreak,
      level: levelUpResult.newLevel,
      projectsCompleted
    });

    let extraGoldGained = 0;
    let extraXPGained = 0;

    if (newlyUnlocked.length > 0) {
      const achievementsToInsert = newlyUnlocked.map(a => ({
        profile_id: user.id,
        achievement_id: a.id
      }));
      await supabase.from('user_achievements').insert(achievementsToInsert);
      
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

    // 11. Update Profile (including Gold, Stats points, Engagement)
    const newEngagement = Math.min(100, profile.engagement + 3);
    const newEnergy = Math.max(0, profile.energy - 5);
    const finalGold = profile.gold + goldGained + extraGoldGained;
    const finalStatPoints = (profile.stat_points || 0) + levelUpResult.statPointsGained;

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        level: levelUpResult.newLevel,
        xp: levelUpResult.remainingXP,
        gold: finalGold,
        engagement: newEngagement,
        energy: newEnergy,
        stat_points: finalStatPoints,
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      return { success: false, error: 'Failed to update character profile.' };
    }

    // 12. Update Stats affected
    if (Object.keys(updatedStats).length > 0) {
      const { error: statsUpdateError } = await supabase
        .from('stats')
        .update(updatedStats)
        .eq('profile_id', user.id);

      if (statsUpdateError) {
        return { success: false, error: 'Failed to update character stats.' };
      }
    }

    // 13. Award progress to a random unlocked skill
    const { data: unlockedSkills } = await supabase
      .from('unlocked_skills')
      .select('*')
      .eq('profile_id', user.id);

    let skillProgressGained = null;
    if (unlockedSkills && unlockedSkills.length > 0) {
      const randomSkill = unlockedSkills[Math.floor(Math.random() * unlockedSkills.length)]!;
      const progressToAdd = 10;
      const newProgress = Math.min(100, randomSkill.progress + progressToAdd);
      
      await supabase
        .from('unlocked_skills')
        .update({ progress: newProgress })
        .eq('id', randomSkill.id);

      skillProgressGained = {
        name: randomSkill.skill_name,
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
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
