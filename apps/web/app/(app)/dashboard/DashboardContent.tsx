'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import { completeQuest } from '../../actions/quests';
import { 
  getXPForLevel, 
  getRankingInfo, 
  getEnergyStatus, 
  getEngagementStatus,
  getPerformanceMultiplier,
  processXPAndLevelUp
} from '@repo/game-logic';
import { StatBar } from '@repo/ui/StatBar';
import { QuestCard } from '@repo/ui/QuestCard';
import { Quest, CharacterStats } from '@repo/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Flame, 
  Zap, 
  Coins, 
  LogOut, 
  ShieldAlert, 
  CheckCircle,
  TrendingUp, 
  Compass, 
  BookOpen, 
  Settings,
  Sparkles,
  Award
} from 'lucide-react';

interface DashboardContentProps {
  initialProfile: any;
  initialStats: any;
  initialQuests: any[];
}

export default function DashboardContent({
  initialProfile,
  initialStats,
  initialQuests
}: DashboardContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; level: number; points: number } | null>(null);
  const [questCompleteMsg, setQuestCompleteMsg] = useState<string | null>(null);

  const supabase = createClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', initialProfile.id).single();
      if (error) throw error;
      return data;
    },
    initialData: initialProfile
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stats').select('*').eq('profile_id', initialProfile.id).single();
      if (error) throw error;
      return data;
    },
    initialData: initialStats
  });

  const { data: quests } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('profile_id', initialProfile.id)
        .gte('created_at', `${todayStr}T00:00:00Z`);
      if (error) throw error;
      return data || [];
    },
    initialData: initialQuests
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const result = await completeQuest(questId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete quest');
      }
      return result;
    },
    onMutate: async (questId) => {
      await queryClient.cancelQueries({ queryKey: ['quests'] });
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      await queryClient.cancelQueries({ queryKey: ['stats'] });

      const previousQuests = queryClient.getQueryData<Quest[]>(['quests']);
      const previousProfile = queryClient.getQueryData<any>(['profile']);
      const previousStats = queryClient.getQueryData<any>(['stats']);

      if (previousQuests) {
        queryClient.setQueryData<Quest[]>(
          ['quests'],
          previousQuests.map((q) => (q.id === questId ? { ...q, completed: true } : q))
        );
      }

      if (previousProfile && previousQuests) {
        const quest = previousQuests.find((q) => q.id === questId);
        if (quest) {
          const performance = getPerformanceMultiplier(previousProfile.engagement, previousProfile.energy);
          const xpGained = Math.floor(quest.xp_reward * performance.multiplier);
          const goldGained = quest.gold_reward;

          const levelUpResult = processXPAndLevelUp(previousProfile.level, previousProfile.xp, xpGained);
          const newEngagement = Math.min(100, previousProfile.engagement + 3);
          const newEnergy = Math.max(0, previousProfile.energy - 5);

          queryClient.setQueryData<any>(['profile'], {
            ...previousProfile,
            level: levelUpResult.newLevel,
            xp: levelUpResult.remainingXP,
            gold: previousProfile.gold + goldGained,
            engagement: newEngagement,
            energy: newEnergy,
          });

          if (previousStats) {
            const updatedStats = { ...previousStats };
            const statsKeys: (keyof CharacterStats)[] = [
              'productivity',
              'creativity',
              'knowledge',
              'experience',
              'intelligence',
              'resilience',
            ];
            statsKeys.forEach((key) => {
              const isAffected = quest.stats_affected.includes(key);
              const currentVal = (previousStats as any)[key] || 10;
              if (isAffected) {
                updatedStats[key] = Math.min(100, currentVal + 2);
              }
            });
            queryClient.setQueryData<any>(['stats'], updatedStats);
          }
        }
      }

      return { previousQuests, previousProfile, previousStats };
    },
    onError: (err, questId, context) => {
      if (context) {
        queryClient.setQueryData(['quests'], context.previousQuests);
        queryClient.setQueryData(['profile'], context.previousProfile);
        queryClient.setQueryData(['stats'], context.previousStats);
      }
      setError(err.message || 'Failed to complete quest.');
    },
    onSuccess: (data, questId) => {
      if (data.leveledUp) {
        setLevelUpInfo({
          show: true,
          level: data.newLevel,
          points: data.statPointsGained
        });
      } else {
        setQuestCompleteMsg(`+${data.xpGained} XP | +${data.goldGained} Gold`);
        setTimeout(() => setQuestCompleteMsg(null), 3000);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const rankInfo = getRankingInfo(profile.level);
  const xpRequired = getXPForLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / xpRequired) * 100));

  const energyStatus = getEnergyStatus(profile.energy);
  const engagementStatus = getEngagementStatus(profile.engagement);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleQuestCompleteToggle = async (questId: string) => {
    setError(null);
    completeQuestMutation.mutate(questId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative select-none">
      
      {/* 1. CHARACTER SIDEBAR (HUD) */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 relative z-25">
        <div className="space-y-8">
          
          {/* Character Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-2xl border border-cyan-400/30">
              🧙‍♂️
            </div>
            <div>
              <h2 className="font-extrabold tracking-wider text-slate-200">{profile.name}</h2>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{rankInfo.title}</p>
            </div>
          </div>

          {/* Level & Rank */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase">
              <span className="text-slate-400">Level {profile.level}</span>
              <span className="text-yellow-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Rank {rankInfo.stage}
              </span>
            </div>
            {/* XP progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-950">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 uppercase font-semibold">
                <span>{profile.xp} / {xpRequired} XP</span>
                <span>{xpPercent}%</span>
              </div>
            </div>
          </div>

          {/* Resources & Statuses */}
          <div className="space-y-3 text-xs font-semibold uppercase tracking-wider">
            <div className="flex justify-between items-center p-2.5 bg-slate-950/20 border border-slate-800/40 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5"><Coins className="w-4 h-4 text-yellow-500" /> Gold</span>
              <span className="text-yellow-500 font-extrabold text-sm">{profile.gold}G</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-950/20 border border-slate-800/40 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Streak</span>
              <span className="text-orange-500 font-extrabold text-sm">{profile.engagement > 0 ? '1 Day' : '0 Days'}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-950/20 border border-slate-800/40 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5"><Zap className="w-4 h-4 text-green-500" /> Energy</span>
              <span className={`font-extrabold ${profile.energy < 30 ? 'text-red-400' : 'text-green-400'}`}>{profile.energy}/100</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs uppercase font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 rounded-lg text-left">
              <Compass className="w-4 h-4" /> Dashboard
            </button>
            <button disabled className="w-full flex items-center gap-2.5 px-3 py-2 text-xs uppercase font-bold text-slate-500 rounded-lg text-left cursor-not-allowed opacity-50">
              <BookOpen className="w-4 h-4" /> Skill Tree (v2)
            </button>
            <button disabled className="w-full flex items-center gap-2.5 px-3 py-2 text-xs uppercase font-bold text-slate-500 rounded-lg text-left cursor-not-allowed opacity-50">
              <Settings className="w-4 h-4" /> Settings (v2)
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs uppercase font-bold text-red-400 hover:text-red-300 bg-red-950/20 border border-red-500/20 rounded-lg transition mt-8"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* 2. MAIN CONTENT ZONE */}
      <main className="flex-1 p-8 md:p-12 space-y-8 max-h-screen overflow-y-auto">
        
        {/* Welcome Banner */}
        <div className="bg-slate-900 border border-cyan-500/10 rounded-xl p-6 relative overflow-hidden flex justify-between items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
          <div>
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">SYSTEM MESSAGE</span>
            <h1 className="text-2xl font-black tracking-wide text-slate-100 mt-1">THE SYSTEM RECOGNIZES YOUR POTENTIAL</h1>
            <p className="text-xs text-slate-400 mt-1">Complete your daily objectives to earn XP, gold, and increase your core stats.</p>
          </div>
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse hidden md:block" />
        </div>

        {/* Quest Complete Notification pop */}
        {questCompleteMsg && (
          <div className="bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-bold uppercase py-2 px-4 rounded-lg flex items-center gap-2 animate-bounce max-w-fit">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>QUEST COMPLETE: {questCompleteMsg}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg p-3 text-xs">
            ⚠️ SYSTEM ERROR: {error}
          </div>
        )}

        {/* Status Indicators Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              ⚡
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Energy Condition</div>
              <div className="text-sm font-bold text-slate-200">{energyStatus.label}</div>
              <div className="text-[10px] text-slate-400 lowercase">{energyStatus.description}</div>
            </div>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
              🔥
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Engagement Status</div>
              <div className="text-sm font-bold text-slate-200">{engagementStatus.label}</div>
              <div className="text-[10px] text-slate-400 lowercase">{engagementStatus.description}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-850 pb-2">Core Attribute Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatBar name="Productivity" value={stats.productivity} colorClass="bg-cyan-500" borderClass="border-cyan-500/20" />
            <StatBar name="Creativity" value={stats.creativity} colorClass="bg-pink-500" borderClass="border-pink-500/20" />
            <StatBar name="Knowledge" value={stats.knowledge} colorClass="bg-purple-500" borderClass="border-purple-500/20" />
            <StatBar name="Experience" value={stats.experience} colorClass="bg-amber-500" borderClass="border-amber-500/20" />
            <StatBar name="Intelligence" value={stats.intelligence} colorClass="bg-blue-500" borderClass="border-blue-500/20" />
            <StatBar name="Resilience" value={stats.resilience} colorClass="bg-green-500" borderClass="border-green-500/20" />
          </div>
        </section>

        {/* Quests Section */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-850 pb-2">Active Objectives</h2>
          <div className="space-y-3">
            {quests.length === 0 ? (
              <p className="text-xs text-slate-500 uppercase tracking-wider">No active quests for today.</p>
            ) : (
              quests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  disabled={(completeQuestMutation.isPending && completeQuestMutation.variables === quest.id) || quest.completed}
                  onCompleteToggle={handleQuestCompleteToggle}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* 3. LEVEL UP CONGRATS MODAL POP */}
      {levelUpInfo?.show && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="w-full max-w-md bg-slate-900 border-2 border-yellow-500/40 rounded-xl p-8 text-center space-y-6 shadow-2xl relative">
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-cyan-500/5 blur-xl -z-10"></div>
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-950 border border-yellow-500 text-yellow-400 text-3xl animate-bounce">
              👑
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
                LEVEL UP!
              </h2>
              <p className="text-slate-400 text-xs uppercase tracking-widest">
                You have reached a new height
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="text-lg font-black text-slate-200">Level {levelUpInfo.level}</div>
              <div className="text-xs text-yellow-500 uppercase tracking-wider font-bold">
                +{levelUpInfo.points} Attribute Stat Points Gained!
              </div>
              <p className="text-[10px] text-slate-500 lowercase mt-1">Stat allocation is now active. Spend them to customize your character path.</p>
            </div>

            <button
              onClick={() => setLevelUpInfo(null)}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-3 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-yellow-950/20"
            >
              Confirm Level Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
