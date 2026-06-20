import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { generateUserQuests } from '../../actions/quests';
import DashboardContent from './DashboardContent';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/login');
  }

  // 3. Fetch user stats
  const { data: stats, error: statsError } = await supabase
    .from('stats')
    .select('*')
    .eq('profile_id', user.id)
    .single();

  // If no stats exist, the user must undergo the assessment onboarding
  if (statsError || !stats) {
    redirect('/assessment');
  }

  // 4. Generate/Fetch today's quests
  const questResult = await generateUserQuests();
  const initialQuests = questResult.success && questResult.quests ? questResult.quests : [];

  return (
    <DashboardContent
      initialProfile={profile}
      initialStats={stats}
      initialQuests={initialQuests}
    />
  );
}
