'use server';

import { createClient } from '../../lib/supabase/server';
import { 
  getPerformanceMultiplier, 
  processXPAndLevelUp, 
  generateDailyQuests 
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

export async function completeQuest(questId: string) {
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

    // 5. Calculate reward with performance multiplier
    const performance = getPerformanceMultiplier(profile.engagement, profile.energy);
    const xpGained = Math.floor(quest.xp_reward * performance.multiplier);
    const goldGained = quest.gold_reward;

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

    // 8. Update database inside transactions (atomically update multiple tables)
    // Update Quest Completed State
    const { error: questUpdateError } = await supabase
      .from('quests')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', questId);

    if (questUpdateError) {
      return { success: false, error: 'Failed to update quest status.' };
    }

    // Update profile metrics (level, xp, gold, energy, engagement)
    const newEngagement = Math.min(100, profile.engagement + 3);
    const newEnergy = Math.max(0, profile.energy - 5);

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        level: levelUpResult.newLevel,
        xp: levelUpResult.remainingXP,
        gold: profile.gold + goldGained,
        engagement: newEngagement,
        energy: newEnergy,
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      return { success: false, error: 'Failed to update character profile.' };
    }

    // Update stats table if any stats were affected
    if (Object.keys(updatedStats).length > 0) {
      const { error: statsUpdateError } = await supabase
        .from('stats')
        .update(updatedStats)
        .eq('profile_id', user.id);

      if (statsUpdateError) {
        return { success: false, error: 'Failed to update character stats.' };
      }
    }

    return {
      success: true,
      xpGained,
      goldGained,
      leveledUp: levelUpResult.leveledUp,
      newLevel: levelUpResult.newLevel,
      statPointsGained: levelUpResult.statPointsGained,
      performanceMessage: performance.message,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
