'use server';

import { createClient } from '../../lib/supabase/server';
import { calculateInitialStats } from '@repo/game-logic';
import { AssessmentData } from '@repo/types';
import { Database } from '@repo/database';
import { SupabaseClient } from '@supabase/supabase-js';

export async function initializeCharacter(assessmentData: AssessmentData) {
  try {
    const supabase = (await createClient()) as unknown as SupabaseClient<Database>;

    // 1. Get current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Calculate initial stats using game-logic package
    const computedStats = calculateInitialStats(assessmentData);

    // 3. Update profile details
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: assessmentData.name || user.email?.split('@')[0] || 'Unknown Hunter',
        level: 1,
        xp: 0,
        gold: 100,
        engagement: 50,
        energy: 70,
      })
      .eq('id', user.id);

    if (profileError) {
      return { success: false, error: `Failed to update profile: ${profileError.message}` };
    }

    // 4. Save raw assessment response
    const { error: responseError } = await supabase
      .from('assessment_responses')
      .insert({
        profile_id: user.id,
        raw_answers: assessmentData as any,
        computed_stats: computedStats as any,
      });

    if (responseError) {
      return { success: false, error: `Failed to save assessment response: ${responseError.message}` };
    }

    // 5. Insert character stats
    const { error: statsError } = await supabase
      .from('stats')
      .upsert({
        profile_id: user.id,
        productivity: computedStats.productivity,
        creativity: computedStats.creativity,
        knowledge: computedStats.knowledge,
        experience: computedStats.experience,
        intelligence: computedStats.intelligence,
        resilience: computedStats.resilience,
        updated_at: new Date().toISOString(),
      });

    if (statsError) {
      return { success: false, error: `Failed to save stats: ${statsError.message}` };
    }

    // 6. Insert default Beginner skills into unlocked_skills
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

    const skillsToInsert = defaultBeginnerSkills.map(name => ({
      profile_id: user.id,
      skill_name: name,
      progress: 0
    }));

    const { error: defaultSkillsError } = await supabase
      .from('unlocked_skills')
      .insert(skillsToInsert);

    if (defaultSkillsError) {
      return { success: false, error: `Failed to save default skills: ${defaultSkillsError.message}` };
    }

    return { success: true, stats: computedStats };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}
