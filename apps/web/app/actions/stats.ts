'use server';

import { createClient } from '../../lib/supabase/server';
import { Database } from '@repo/database';
import { SupabaseClient } from '@supabase/supabase-js';
import { CharacterStats } from '@repo/types';

export async function allocateStatPoints(allocation: Partial<CharacterStats>) {
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

    // 2. Fetch current profile to check available stat points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found.' };
    }

    // Calculate total points requested to allocate
    const totalAllocated = Object.values(allocation).reduce((sum: number, val) => sum + (val || 0), 0);

    if (totalAllocated <= 0) {
      return { success: false, error: 'No points allocated.' };
    }

    if (totalAllocated > profile.stat_points) {
      return { success: false, error: 'Not enough available stat points.' };
    }

    // 3. Fetch current stats
    const { data: stats, error: statsError } = await supabase
      .from('stats')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (statsError || !stats) {
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

    // 5. Update stats table
    const { error: statsUpdateError } = await supabase
      .from('stats')
      .update(updatedStats)
      .eq('profile_id', user.id);

    if (statsUpdateError) {
      return { success: false, error: 'Failed to update stats.' };
    }

    // 6. Update profile to deduct spent points
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        stat_points: profile.stat_points - totalAllocated,
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      return { success: false, error: 'Failed to update profile points.' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function resetCharacter() {
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

    // 2. Delete all related tables
    await supabase.from('stats').delete().eq('profile_id', user.id);
    await supabase.from('quests').delete().eq('profile_id', user.id);
    await supabase.from('unlocked_skills').delete().eq('profile_id', user.id);
    await supabase.from('user_achievements').delete().eq('profile_id', user.id);
    await supabase.from('assessment_responses').delete().eq('profile_id', user.id);

    // 3. Reset profile fields
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        level: 1,
        xp: 0,
        gold: 100,
        engagement: 50,
        energy: 70,
        stat_points: 0,
        name: user.email?.split('@')[0] || 'Unknown Hunter',
      })
      .eq('id', user.id);

    if (profileError) {
      return { success: false, error: `Failed to reset profile: ${profileError.message}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
