'use server';

import { createClient } from '../../lib/supabase/server';
import { Database } from '@repo/database';
import { SupabaseClient } from '@supabase/supabase-js';
import { findSkillByName, getSkillTier } from '@repo/game-logic';

export async function unlockSkill(skillName: string) {
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

    // 2. Fetch skill details
    const skillNode = findSkillByName(skillName);
    const tier = getSkillTier(skillName);

    if (!skillNode || !tier) {
      return { success: false, error: 'Skill not found in the System.' };
    }

    // Determine gold cost based on tier
    let cost = 0;
    if (tier === 'intermediate') cost = 50;
    if (tier === 'advanced') cost = 200;

    // 3. Fetch profile to check Gold balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found.' };
    }

    if (profile.gold < cost) {
      return { success: false, error: `Insufficient Gold. Required: ${cost}G, You have: ${profile.gold}G` };
    }

    // 4. Fetch already unlocked skills to check prerequisite
    const { data: unlockedSkills, error: fetchSkillsError } = await supabase
      .from('unlocked_skills')
      .select('*')
      .eq('profile_id', user.id);

    if (fetchSkillsError) {
      return { success: false, error: 'Failed to fetch unlocked skills.' };
    }

    // Check if already unlocked
    const isAlreadyUnlocked = unlockedSkills?.some(s => s.skill_name === skillName);
    if (isAlreadyUnlocked) {
      return { success: false, error: 'Skill is already unlocked.' };
    }

    // Check prerequisite
    if (skillNode.prereq) {
      const isPrereqUnlocked = unlockedSkills?.some(s => s.skill_name === skillNode.prereq);
      if (!isPrereqUnlocked) {
        return { success: false, error: `Prerequisite locked: Requires ${skillNode.prereq}` };
      }
    }

    // 5. Perform updates: deduct Gold and insert unlocked skill
    // Deduct Gold from Profile
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        gold: profile.gold - cost
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      return { success: false, error: 'Failed to deduct Gold.' };
    }

    // Insert to unlocked_skills
    const { error: insertSkillError } = await supabase
      .from('unlocked_skills')
      .insert({
        profile_id: user.id,
        skill_name: skillName,
        progress: 0
      });

    if (insertSkillError) {
      return { success: false, error: 'Failed to unlock skill in the database.' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
