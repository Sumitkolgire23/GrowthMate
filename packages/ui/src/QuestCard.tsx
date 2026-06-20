import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Quest } from '@repo/types';

interface QuestCardProps {
  quest: Quest;
  onCompleteToggle?: (questId: string) => void;
  disabled?: boolean;
}

const rankColors: Record<'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S', { border: string; bg: string; text: string; glow: string }> = {
  F: { border: 'border-slate-800', bg: 'bg-slate-950/40', text: 'text-slate-400', glow: '' },
  E: { border: 'border-green-500/30', bg: 'bg-green-950/20', text: 'text-green-400', glow: 'shadow-green-950/20' },
  D: { border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', text: 'text-cyan-400', glow: 'shadow-cyan-950/20' },
  C: { border: 'border-purple-500/30', bg: 'bg-purple-950/20', text: 'text-purple-400', glow: 'shadow-purple-950/20' },
  B: { border: 'border-amber-500/30', bg: 'bg-amber-950/20', text: 'text-amber-400', glow: 'shadow-amber-950/20' },
  A: { border: 'border-pink-500/30', bg: 'bg-pink-950/20', text: 'text-pink-400', glow: 'shadow-pink-950/20' },
  S: { border: 'border-yellow-500/40', bg: 'bg-yellow-950/30', text: 'text-yellow-400', glow: 'shadow-yellow-950/40 shadow-md' }
};

export function QuestCard({ quest, onCompleteToggle, disabled = false }: QuestCardProps) {
  const colors = rankColors[quest.rank];

  return (
    <div className={`p-5 bg-slate-900/60 border ${colors.border} rounded-xl backdrop-blur-sm shadow-lg ${colors.glow} flex justify-between items-center transition duration-300 hover:border-cyan-500/40 hover:-translate-y-0.5 group`}>
      <div className="flex items-start gap-4">
        {/* Rank Circle Badge */}
        <div className={`w-10 h-10 rounded-lg border ${colors.border} ${colors.bg} ${colors.text} font-black flex items-center justify-center text-lg tracking-tight shrink-0 shadow-inner`}>
          {quest.rank}
        </div>

        <div className="space-y-1">
          <h3 className={`font-bold tracking-wide text-sm transition ${quest.completed ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-cyan-300'}`}>
            {quest.title}
          </h3>
          <p className={`text-xs ${quest.completed ? 'text-slate-600 line-through' : 'text-slate-400'}`}>
            {quest.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] uppercase font-bold text-cyan-500 tracking-widest bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/10">
              +{quest.xp_reward} XP
            </span>
            <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-widest bg-yellow-950/30 px-2 py-0.5 rounded border border-yellow-500/10">
              +{quest.gold_reward}G
            </span>
            {quest.stats_affected.map(stat => (
              <span key={stat} className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800">
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Checkbox */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onCompleteToggle && onCompleteToggle(quest.id)}
        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
          quest.completed
            ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
            : 'border-slate-800 bg-slate-950/30 hover:border-cyan-500/40 text-slate-700 hover:text-cyan-500/50'
        } disabled:opacity-50`}
      >
        <CheckCircle2 className="w-5 h-5" />
      </button>
    </div>
  );
}
