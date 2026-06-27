import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../actions/auth';
import { generateUserQuests } from '../../actions/quests';
import DashboardContent from './DashboardContent';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Get authenticated user and profile
  const profile = await getCurrentUser();

  if (!profile) {
    redirect('/login');
  }

  // 2. If no stats exist, the user must undergo the assessment onboarding
  if (!profile.stats) {
    redirect('/assessment');
  }

  // 3. Generate/Fetch today's quests
  const questResult = await generateUserQuests();
  const initialQuests = questResult.success && questResult.quests ? questResult.quests : [];

  return (
    <DashboardContent
      initialProfile={profile}
      initialStats={profile.stats}
      initialQuests={initialQuests}
    />
  );
}
