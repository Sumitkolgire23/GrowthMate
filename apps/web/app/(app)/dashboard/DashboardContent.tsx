'use client';

import React, { useState } from 'react';
import { getCurrentUser } from '../../actions/auth';
import { generateUserQuests, completeQuest } from '../../actions/quests';
import { allocateStatPoints } from '../../actions/stats';
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
  CheckCircle,
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
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  // Modals / Dialogs states
  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; level: number; points: number } | null>(null);
  const [completionQuest, setCompletionQuest] = useState<Quest | null>(null);
  const [effortLevel, setEffortLevel] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium');
  const [completionNotes, setCompletionNotes] = useState('');
  
  const [questCompleteMsg, setQuestCompleteMsg] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [allocation, setAllocation] = useState<Record<keyof CharacterStats, number>>({
    productivity: 0,
    creativity: 0,
    knowledge: 0,
    experience: 0,
    intelligence: 0,
    resilience: 0
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error('Unauthenticated');
      return user;
    },
    initialData: initialProfile
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user || !user.stats) throw new Error('Stats not found');
      return user.stats;
    },
    initialData: initialStats
  });

  const { data: quests } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const res = await generateUserQuests();
      if (!res.success) throw new Error(res.error || 'Failed to fetch quests');
      return res.quests || [];
    },
    initialData: initialQuests
  });

  const completeQuestMutation = useMutation({
    mutationFn: async ({ 
      questId, 
      effortLevel, 
      completionNotes 
    }: { 
      questId: string; 
      effortLevel: 'low' | 'medium' | 'high' | 'extreme'; 
      completionNotes?: string; 
    }) => {
      const result = (await completeQuest(questId, effortLevel, completionNotes)) as any;
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete quest');
      }
      return result;
    },
    onMutate: async ({ questId, effortLevel }) => {
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
          
          let effortMultiplier = 1.0;
          if (effortLevel === 'low') effortMultiplier = 0.5;
          else if (effortLevel === 'high') effortMultiplier = 1.5;
          else if (effortLevel === 'extreme') effortMultiplier = 2.0;

          const xpGained = Math.floor(quest.xp_reward * performance.multiplier * effortMultiplier);
          const goldGained = Math.floor(quest.gold_reward * effortMultiplier);

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
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(['quests'], context.previousQuests);
        queryClient.setQueryData(['profile'], context.previousProfile);
        queryClient.setQueryData(['stats'], context.previousStats);
      }
      setError(err.message || 'Failed to complete quest.');
    },
    onSuccess: (data: any) => {
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

  const handleAddPoint = (stat: keyof CharacterStats) => {
    const allocatedTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    const available = profile.stat_points || 0;
    if (allocatedTotal < available) {
      setAllocation(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
    }
  };

  const handleSubPoint = (stat: keyof CharacterStats) => {
    if (allocation[stat] > 0) {
      setAllocation(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
    }
  };

  const handleConfirmAllocation = async () => {
    setAllocating(true);
    setError(null);
    const result = await allocateStatPoints(allocation);
    if (result.success) {
      setLevelUpInfo(null);
      setAllocation({
        productivity: 0,
        creativity: 0,
        knowledge: 0,
        experience: 0,
        intelligence: 0,
        resilience: 0
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } else {
      setError(result.error || 'Failed to allocate stat points.');
    }
    setAllocating(false);
  };

  const energyStatus = getEnergyStatus(profile.energy);
  const engagementStatus = getEngagementStatus(profile.engagement);

  const handleQuestCompleteToggle = async (questId: string) => {
    setError(null);
    const selectedQuest = quests.find((q: Quest) => q.id === questId);
    if (selectedQuest) {
      setCompletionQuest(selectedQuest);
      setEffortLevel('medium');
      setCompletionNotes('');
    }
  };

  return (
    <>
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
            quests.map((quest: Quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                disabled={(completeQuestMutation.isPending && completeQuestMutation.variables?.questId === quest.id) || quest.completed}
                onCompleteToggle={handleQuestCompleteToggle}
              />
            ))
          )}
        </div>
      </section>

      {/* QUEST COMPLETION DIALOG */}
      {completionQuest && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="w-full max-w-md bg-slate-900 border-2 border-cyan-500/40 rounded-xl p-6 space-y-6 shadow-2xl relative">
            
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 blur-xl -z-10"></div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">SYSTEM QUEST COMPLETE</span>
              <h2 className="text-xl font-black tracking-wide text-slate-100">
                {completionQuest.title}
              </h2>
              <p className="text-xs text-slate-400">{completionQuest.description}</p>
            </div>

            {/* Effort Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Real-Life Effort Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'extreme'] as const).map((level) => {
                  const label = { low: 'Low (0.5x)', medium: 'Normal (1.0x)', high: 'High (1.5x)', extreme: 'Extreme (2.0x)' }[level];
                  const activeColor = {
                    low: 'border-slate-500 bg-slate-950/40 text-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.1)]',
                    medium: 'border-cyan-500 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
                    high: 'border-purple-500 bg-purple-950/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
                    extreme: 'border-yellow-500 bg-yellow-950/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                  }[level];
                  const inactiveColor = 'border-slate-800 bg-slate-950/20 text-slate-500 hover:text-slate-300 hover:border-slate-700';
                  
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setEffortLevel(level)}
                      className={`py-2 text-[10px] font-black uppercase rounded-lg border transition-all flex flex-col items-center justify-center ${
                        effortLevel === level ? activeColor : inactiveColor
                      }`}
                    >
                      <span>{level}</span>
                      <span className="text-[8px] opacity-80 mt-0.5">
                        {level === 'low' ? '0.5x' : level === 'medium' ? '1.0x' : level === 'high' ? '1.5x' : '2.0x'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion Notes */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Accomplishment Log (Optional)
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Log details of what you actually completed in real life..."
                className="w-full h-24 bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-650 focus:outline-none transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCompletionQuest(null)}
                className="flex-1 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 font-bold py-2 rounded-lg text-xs uppercase tracking-widest transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (completionQuest) {
                    completeQuestMutation.mutate({
                      questId: completionQuest.id,
                      effortLevel,
                      completionNotes
                    });
                    setCompletionQuest(null);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-black py-2 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-cyan-950/30"
              >
                CLAIM REWARDS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL UP CONGRATS & STAT ALLOCATION MODAL POP */}
      {levelUpInfo?.show && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="w-full max-w-md bg-slate-900 border-2 border-yellow-500/50 rounded-xl p-6 text-center space-y-6 shadow-2xl relative">
            
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-cyan-500/5 blur-xl -z-10"></div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-950 border border-yellow-500 text-yellow-400 text-2xl animate-bounce">
              👑
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
                LEVEL UP!
              </h2>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest">
                You have reached Level {levelUpInfo.level}
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 text-left">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-3">
                <span className="text-slate-400">Available Points</span>
                <span className="text-yellow-500 text-sm">
                  {profile.stat_points - Object.values(allocation).reduce((a, b) => a + b, 0)} Pts
                </span>
              </div>

              <div className="space-y-2">
                {(['productivity', 'creativity', 'knowledge', 'experience', 'intelligence', 'resilience'] as (keyof CharacterStats)[]).map((stat) => {
                  const icons = { productivity: "⚡", creativity: "💡", knowledge: "📚", experience: "🎯", intelligence: "🧠", resilience: "💪" };
                  const currentVal = stats[stat] || 10;
                  const added = allocation[stat];
                  return (
                    <div key={stat} className="flex items-center justify-between p-2 bg-slate-900/40 border border-slate-800/60 rounded-lg">
                      <span className="text-xs font-bold text-slate-300 capitalize flex items-center gap-1.5">
                        <span className="text-sm">{icons[stat]}</span> {stat}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-100">
                          {currentVal + added} <span className="text-[10px] text-yellow-500 font-semibold">{added > 0 ? `(+${added})` : ''}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSubPoint(stat)}
                            className="w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 hover:text-slate-100 flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddPoint(stat)}
                            className="w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 hover:text-slate-100 flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleConfirmAllocation}
              disabled={allocating || Object.values(allocation).reduce((a, b) => a + b, 0) === 0}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-yellow-950/20 disabled:opacity-50"
            >
              {allocating ? 'CONFIRMING SYSTEM PATH...' : 'Confirm Allocation'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
