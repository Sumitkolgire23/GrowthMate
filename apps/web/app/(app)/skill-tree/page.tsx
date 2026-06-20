'use client';

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { unlockSkill } from '../../actions/skills';
import { skillTreeData } from '@repo/game-logic';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Lock, 
  Unlock, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Terminal, 
  BrainCircuit,
  Award
} from 'lucide-react';

interface SkillNode {
  name: string;
  prereq: string | null;
  description: string;
  tier: 'beginner' | 'intermediate' | 'advanced';
}

export default function SkillTreePage() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<'web_development' | 'ai_ml'>('web_development');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Fetch profile to get gold
  const { data: profile } = useQuery<any>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthenticated');
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data;
    }
  });

  // 2. Fetch unlocked skills
  const { data: unlockedSkills = [] } = useQuery<any[]>({
    queryKey: ['unlocked_skills'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthenticated');
      const { data, error } = await supabase
        .from('unlocked_skills')
        .select('*')
        .eq('profile_id', user.id);
      if (error) throw error;
      return data || [];
    }
  });

  // Unlock skill mutation
  const unlockSkillMutation = useMutation({
    mutationFn: async (skillName: string) => {
      setError(null);
      setSuccessMsg(null);
      const result = await unlockSkill(skillName);
      if (!result.success) {
        throw new Error(result.error || 'Failed to awaken skill');
      }
      return result;
    },
    onSuccess: (_, skillName) => {
      setSuccessMsg(`System Notification: Skill [${skillName}] has been successfully awakened!`);
      queryClient.invalidateQueries({ queryKey: ['unlocked_skills'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to unlock skill.');
    }
  });

  const getTierCost = (tier: 'beginner' | 'intermediate' | 'advanced') => {
    if (tier === 'beginner') return 0;
    if (tier === 'intermediate') return 50;
    return 200;
  };

  const getSkillStatus = (name: string, prereq: string | null, tier: 'beginner' | 'intermediate' | 'advanced') => {
    const isUnlocked = unlockedSkills.some(s => s.skill_name === name);
    if (isUnlocked) {
      const details = unlockedSkills.find(s => s.skill_name === name);
      return { status: 'unlocked' as const, progress: details?.progress || 0 };
    }

    if (!prereq) {
      return { status: 'available' as const };
    }

    const isPrereqUnlocked = unlockedSkills.some(s => s.skill_name === prereq);
    if (isPrereqUnlocked) {
      return { status: 'available' as const };
    }

    return { status: 'locked' as const };
  };

  const handleUnlockClick = (skill: SkillNode) => {
    unlockSkillMutation.mutate(skill.name);
  };

  // Convert game-logic structure to linear tiers
  const getBranchTiers = (branch: 'web_development' | 'ai_ml') => {
    const data = skillTreeData[branch];
    return [
      { tier: 'beginner' as const, title: 'Beginner Class', skills: data.beginner.map(s => ({ ...s, tier: 'beginner' as const })) },
      { tier: 'intermediate' as const, title: 'Intermediate Hunter', skills: data.intermediate.map(s => ({ ...s, tier: 'intermediate' as const })) },
      { tier: 'advanced' as const, title: 'S-Rank Advanced', skills: data.advanced.map(s => ({ ...s, tier: 'advanced' as const })) }
    ];
  };

  const currentBranchTiers = getBranchTiers(activeTab);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-cyan-500/10 rounded-xl p-6 relative overflow-hidden flex justify-between items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">THE SYSTEM</span>
          <h1 className="text-2xl font-black tracking-wide text-slate-100 mt-1">SKILL TREE PATHWAY</h1>
          <p className="text-xs text-slate-400 mt-1">Spend your accumulated Gold to awaken intermediate and advanced nodes. Expand your capabilities.</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <div>
            <div className="text-[8px] text-slate-500 uppercase font-black">Available Gold</div>
            <div className="text-sm font-black text-yellow-500">{profile?.gold || 0}G</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-bold uppercase py-2.5 px-4 rounded-lg flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg p-3 text-xs">
          ⚠️ SYSTEM WARNING: {error}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-slate-900 pb-1">
        <button
          onClick={() => { setActiveTab('web_development'); setSelectedSkill(null); }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition ${
            activeTab === 'web_development'
              ? 'text-cyan-400 border-cyan-500'
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4" /> Web Development</span>
        </button>
        <button
          onClick={() => { setActiveTab('ai_ml'); setSelectedSkill(null); }}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition ${
            activeTab === 'ai_ml'
              ? 'text-purple-400 border-purple-500'
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5"><BrainCircuit className="w-4 h-4" /> AI & Machine Learning</span>
        </button>
      </div>

      {/* Main Grid: Tree + Detail Panel */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Visual Skill Trees */}
        <div className="flex-1 space-y-10 w-full">
          {currentBranchTiers.map((tierGroup, idx) => {
            const isLast = idx === currentBranchTiers.length - 1;
            return (
              <div key={tierGroup.tier} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <h2 className="text-xs uppercase tracking-widest font-black text-slate-400">{tierGroup.title}</h2>
                  <span className="text-[9px] text-slate-600 bg-slate-900/60 border border-slate-800/40 px-2 py-0.5 rounded uppercase font-bold">
                    Cost: {getTierCost(tierGroup.tier)}G
                  </span>
                </div>

                {/* Cards row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tierGroup.skills.map((skill) => {
                    const statusInfo = getSkillStatus(skill.name, skill.prereq, skill.tier);
                    const isSelected = selectedSkill?.name === skill.name;
                    
                    let cardBorder = 'border-slate-900 bg-slate-950/20';
                    let glowEffect = '';
                    let textClass = 'text-slate-500';
                    let textTitle = 'text-slate-400';

                    if (statusInfo.status === 'unlocked') {
                      cardBorder = activeTab === 'web_development' ? 'border-cyan-500/30 bg-cyan-950/5' : 'border-purple-500/30 bg-purple-950/5';
                      glowEffect = activeTab === 'web_development' ? 'shadow-[0_0_15px_rgba(6,182,212,0.03)]' : 'shadow-[0_0_15px_rgba(168,85,247,0.03)]';
                      textClass = 'text-slate-400';
                      textTitle = 'text-slate-200 group-hover:text-cyan-300';
                    } else if (statusInfo.status === 'available') {
                      cardBorder = 'border-slate-800 bg-slate-900/40 hover:border-slate-600';
                      textClass = 'text-slate-400';
                      textTitle = 'text-slate-300';
                    } else {
                      cardBorder = 'border-slate-950 bg-slate-950/40 opacity-50 cursor-not-allowed';
                    }

                    if (isSelected) {
                      cardBorder = activeTab === 'web_development' ? 'border-cyan-500 bg-cyan-950/20' : 'border-purple-500 bg-purple-950/20';
                    }

                    return (
                      <div
                        key={skill.name}
                        onClick={() => setSelectedSkill(skill)}
                        className={`p-4 rounded-xl border ${cardBorder} ${glowEffect} transition cursor-pointer flex flex-col justify-between group h-28 relative overflow-hidden`}
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-bold text-xs tracking-wide transition ${textTitle}`}>
                              {skill.name}
                            </h3>
                            {statusInfo.status === 'unlocked' ? (
                              <Unlock className={`w-3.5 h-3.5 ${activeTab === 'web_development' ? 'text-cyan-400' : 'text-purple-400'}`} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-600" />
                            )}
                          </div>
                          <p className={`text-[10px] line-clamp-2 ${textClass}`}>
                            {skill.description}
                          </p>
                        </div>

                        {/* Footer progress bar or prereq indicator */}
                        <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between items-center">
                          {statusInfo.status === 'unlocked' ? (
                            <div className="w-full space-y-1">
                              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    activeTab === 'web_development' ? 'bg-cyan-500' : 'bg-purple-500'
                                  }`}
                                  style={{ width: `${statusInfo.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-500 uppercase font-black">
                                <span>Mastery Progress</span>
                                <span>{statusInfo.progress}%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              <span>
                                {skill.prereq ? `Requires: ${skill.prereq.split(' ')[0]}...` : 'No Prerequisites'}
                              </span>
                              {statusInfo.status === 'available' && (
                                <span className="text-yellow-500">{getTierCost(skill.tier)}G</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connection line between tiers */}
                {!isLast && (
                  <div className="flex justify-center items-center py-2">
                    <ArrowRight className="w-4 h-4 text-slate-800 transform rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Skill Detail Panel */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 sticky top-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -z-10"></div>
            
            {selectedSkill ? (
              <>
                <div className="space-y-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    selectedSkill.tier === 'beginner' 
                      ? 'text-slate-400 border-slate-800 bg-slate-950/40' 
                      : selectedSkill.tier === 'intermediate'
                      ? 'text-purple-400 border-purple-950 bg-purple-950/20'
                      : 'text-yellow-400 border-yellow-950 bg-yellow-950/20'
                  }`}>
                    {selectedSkill.tier} node
                  </span>
                  <h2 className="text-base font-black tracking-wide text-slate-100">{selectedSkill.name}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedSkill.description}</p>
                </div>

                {/* Prerequisites Info */}
                <div className="bg-slate-950/50 border border-slate-850 rounded-lg p-3.5 space-y-2.5">
                  <h4 className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Node Integrity</h4>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Prerequisite Node</span>
                    <span className="text-slate-200 font-bold">
                      {selectedSkill.prereq ? selectedSkill.prereq : 'None'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Awakening Cost</span>
                    <span className="text-yellow-500 font-extrabold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> {getTierCost(selectedSkill.tier)}G
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-900">
                    <span className="text-slate-400">Current Status</span>
                    {(() => {
                      const statusInfo = getSkillStatus(selectedSkill.name, selectedSkill.prereq, selectedSkill.tier);
                      if (statusInfo.status === 'unlocked') {
                        return <span className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">AWAKENED</span>;
                      }
                      if (statusInfo.status === 'available') {
                        return <span className="text-yellow-500 font-black uppercase tracking-widest text-[10px]">AVAILABLE</span>;
                      }
                      return <span className="text-slate-600 font-black uppercase tracking-widest text-[10px]">LOCKED</span>;
                    })()}
                  </div>
                </div>

                {/* Unlock Button */}
                {(() => {
                  const statusInfo = getSkillStatus(selectedSkill.name, selectedSkill.prereq, selectedSkill.tier);
                  if (statusInfo.status === 'unlocked') {
                    return (
                      <div className="p-3 bg-cyan-950/10 border border-cyan-500/10 rounded-lg text-center">
                        <p className="text-[10px] text-cyan-400 uppercase font-black tracking-widest">Node Fully Awakened</p>
                        <p className="text-[9px] text-slate-500 lowercase mt-0.5">mastery levels will increase dynamically via quests completion</p>
                      </div>
                    );
                  }

                  if (statusInfo.status === 'available') {
                    const cost = getTierCost(selectedSkill.tier);
                    const canAfford = (profile?.gold || 0) >= cost;

                    return (
                      <button
                        onClick={() => handleUnlockClick(selectedSkill)}
                        disabled={!canAfford || unlockSkillMutation.isPending}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black py-2.5 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-yellow-950/20 disabled:opacity-50"
                      >
                        {unlockSkillMutation.isPending ? 'AWAKENING SYSTEM NODE...' : `Awaken Node (${cost}G)`}
                      </button>
                    );
                  }

                  return (
                    <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg text-center text-slate-500">
                      <p className="text-[10px] uppercase font-bold tracking-wider">Locked by System</p>
                      <p className="text-[9px] lowercase mt-0.5">unlock the prerequisite node [{selectedSkill.prereq}] to proceed</p>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Award className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Select a Skill</h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">Click any node in the pathway grid to inspect and unlock.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
