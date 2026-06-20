import React from 'react';

interface StatBarProps {
  name: string;
  value: number;
  colorClass?: string; // e.g. bg-cyan-500
  barBgClass?: string; // e.g. bg-cyan-950
  borderClass?: string; // e.g. border-cyan-500/20
}

export function StatBar({ 
  name, 
  value, 
  colorClass = 'bg-cyan-500', 
  barBgClass = 'bg-cyan-950', 
  borderClass = 'border-cyan-500/20' 
}: StatBarProps) {
  return (
    <div className={`p-4 bg-slate-900/50 border ${borderClass} rounded-lg flex flex-col gap-2 backdrop-blur-sm shadow-md`}>
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-100">{value}%</span>
      </div>
      <div className={`w-full ${barBgClass} h-2.5 rounded-full overflow-hidden border border-slate-950`}>
        <div 
          className={`h-full ${colorClass} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
