'use client';

import React from 'react';
import { getProgressData } from '../../actions/stats';
import { useQuery } from '@tanstack/react-query';
import { achievementDefinitions } from '@repo/game-logic';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Flame, 
  CheckCircle,
  Calendar,
  Sparkles,
  Trophy
} from 'lucide-react';

export default function ProgressPage() {
  const { data: progressData, isLoading } = useQuery<any>({
    queryKey: ['progress_data'],
    queryFn: async () => {
      const data = await getProgressData();
      if (!data) throw new Error('Failed to load progress data');
      return data;
    }
  });

  if (isLoading || !progressData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">ANALYZING SYSTEM METRICS...</p>
        </div>
      </div>
    );
  }

  const { profile, stats, completedQuests = [], achievements: userAchievements = [] } = progressData;

  // Format Radar Data
  const radarData = stats ? [
    { subject: 'Productivity', value: stats.productivity, fullMark: 100 },
    { subject: 'Creativity', value: stats.creativity, fullMark: 100 },
    { subject: 'Knowledge', value: stats.knowledge, fullMark: 100 },
    { subject: 'Experience', value: stats.experience, fullMark: 100 },
    { subject: 'Intelligence', value: stats.intelligence, fullMark: 100 },
    { subject: 'Resilience', value: stats.resilience, fullMark: 100 },
  ] : [];

  // Format XP Line Data (group by date)
  const getLineData = () => {
    if (completedQuests.length === 0) return [];
    
    const xpByDate: Record<string, number> = {};
    completedQuests.forEach((q: any) => {
      if (!q.completed_at) return;
      const dateStr = new Date(q.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      xpByDate[dateStr] = (xpByDate[dateStr] || 0) + (q.xp_reward || 0);
    });

    return Object.entries(xpByDate).map(([date, value]) => ({
      date,
      xp: value
    }));
  };

  const lineData = getLineData();

  // Combine definitions with user unlock status
  const achievements = achievementDefinitions.map(def => {
    const isUnlocked = userAchievements.some((ua: any) => ua.achievementId === def.id);
    const unlockDetail = userAchievements.find((ua: any) => ua.achievementId === def.id);
    return {
      ...def,
      isUnlocked,
      unlockedAt: unlockDetail ? new Date(unlockDetail.unlockedAt).toLocaleDateString() : null
    };
  });

  const totalUnlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-cyan-500/10 rounded-xl p-6 relative overflow-hidden flex justify-between items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">SYSTEM STATUS</span>
          <h1 className="text-2xl font-black tracking-wide text-slate-100 mt-1">HUNTER PROGRESS & ANALYTICS</h1>
          <p className="text-xs text-slate-400 mt-1">Review your core attribute balance, task consistency charts, and unlocked achievement credentials.</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-4 text-center">
          <div>
            <div className="text-[8px] text-slate-500 uppercase font-black">Completed Objectives</div>
            <div className="text-sm font-black text-cyan-400">{completedQuests.length} Quests</div>
          </div>
          <div className="w-[1px] bg-slate-800 h-8"></div>
          <div>
            <div className="text-[8px] text-slate-500 uppercase font-black">Unlocked Badges</div>
            <div className="text-sm font-black text-purple-400">{totalUnlockedAchievements} / {achievements.length}</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart (Attributes) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-96 relative">
          <div className="space-y-1 z-10">
            <h2 className="text-xs uppercase tracking-widest font-black text-slate-400">Attribute Balance</h2>
            <p className="text-[10px] text-slate-500">Visual mapping of your core stats from level ups and assessment onboarding.</p>
          </div>
          {stats ? (
            <div className="w-full h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={8} />
                  <Radar
                    name="Hunter Stats"
                    dataKey="value"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest">
              Awaiting stat matrix sync...
            </div>
          )}
        </div>

        {/* Line Chart (XP Gains) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-96 relative">
          <div className="space-y-1 z-10">
            <h2 className="text-xs uppercase tracking-widest font-black text-slate-400">Consistency Tracker</h2>
            <p className="text-[10px] text-slate-500">Daily XP gained over time from completing real-world development tasks.</p>
          </div>
          {lineData.length > 0 ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="105%">
                <LineChart data={lineData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#06b6d4', fontSize: '10px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ fill: '#8b5cf6', strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest text-center px-6">
              No completed objectives recorded yet. Take on a daily quest to begin plotting progress!
            </div>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-900 pb-2 flex-1">
            System Badges & Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            let cardStyle = 'border-slate-900 bg-slate-950/20 opacity-60';
            let iconBg = 'bg-slate-900 border-slate-800 text-slate-650';
            let textTitle = 'text-slate-450';
            let glow = '';

            if (ach.isUnlocked) {
              cardStyle = 'border-purple-500/20 bg-slate-900/60 hover:border-purple-500/40';
              iconBg = 'bg-purple-950/40 border-purple-500/20 text-purple-400';
              textTitle = 'text-slate-200';
              glow = 'shadow-[0_0_10px_rgba(168,85,247,0.02)]';
            }

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex gap-3.5 items-center transition duration-300 ${cardStyle} ${glow} relative overflow-hidden group`}
              >
                {/* Badge Icon */}
                <div className={`w-11 h-11 rounded-lg border flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
                  {ach.isUnlocked ? ach.icon : '🔒'}
                </div>

                <div className="space-y-0.5">
                  <h3 className={`font-bold text-xs tracking-wide transition ${textTitle}`}>
                    {ach.title}
                  </h3>
                  <p className="text-[9px] text-slate-500 leading-tight">
                    {ach.description}
                  </p>
                  
                  {ach.isUnlocked ? (
                    <span className="text-[8px] text-purple-400 font-bold uppercase tracking-wider block mt-1">
                      Unlocked on {ach.unlockedAt}
                    </span>
                  ) : (
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-wider block mt-1">
                      Requirement: {ach.requirement} {ach.type}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
