'use server';

import { prisma } from '@repo/database';
import { findSkillByName, getSkillTier } from '@repo/game-logic';
import { getCurrentUser } from './auth';

export async function unlockSkill(skillName: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // 2. Fetch skill details from local game-logic configuration
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
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return { success: false, error: 'Profile not found.' };
    }

    if (profile.gold < cost) {
      return { success: false, error: `Insufficient Gold. Required: ${cost}G, You have: ${profile.gold}G` };
    }

    // 4. Fetch already unlocked skills to check prerequisite
    const unlockedSkills = await prisma.unlockedSkill.findMany({
      where: { profileId: user.id },
    });

    // Check if already unlocked
    const isAlreadyUnlocked = unlockedSkills.some(s => s.skillName === skillName);
    if (isAlreadyUnlocked) {
      return { success: false, error: 'Skill is already unlocked.' };
    }

    // Check prerequisite
    if (skillNode.prereq) {
      const isPrereqUnlocked = unlockedSkills.some(s => s.skillName === skillNode.prereq);
      if (!isPrereqUnlocked) {
        return { success: false, error: `Prerequisite locked: Requires ${skillNode.prereq}` };
      }
    }

    // 5. Perform updates: deduct Gold and insert unlocked skill
    await prisma.$transaction(async (tx) => {
      // Deduct Gold from Profile
      await tx.profile.update({
        where: { id: user.id },
        data: {
          gold: profile.gold - cost,
        },
      });

      // Insert to unlocked_skills
      await tx.unlockedSkill.create({
        data: {
          profileId: user.id,
          skillName,
          progress: 0,
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}

export async function getUserSkills() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const unlocked = await prisma.unlockedSkill.findMany({
      where: { profileId: user.id },
      orderBy: { unlockedAt: 'asc' },
    });

    return unlocked.map(s => ({
      ...s,
      skill_name: s.skillName,
      unlocked_at: s.unlockedAt.toISOString(),
    }));
  } catch (err) {
    return [];
  }
}
