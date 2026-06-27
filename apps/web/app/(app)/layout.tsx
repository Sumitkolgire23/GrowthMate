'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logoutUser } from '../actions/auth';
import { useQuery } from '@tanstack/react-query';
import { 
  getRankingInfo, 
  getXPForLevel 
} from '@repo/game-logic';
import { 
  Flame, 
  Zap, 
  Coins, 
  LogOut, 
  TrendingUp, 
  Compass, 
  BookOpen, 
  Settings,
  Award,
  ShoppingBag
} from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user profile from custom auth
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error('Unauthenticated');
      return user;
    }
  });

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
    router.refresh();
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">SYNCHRONIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  const rankInfo = getRankingInfo(profile.level);
  const xpRequired = getXPForLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / xpRequired) * 100));

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Compass },
    { href: '/progress', label: 'Progress & Stats', icon: TrendingUp },
    { href: '/skill-tree', label: 'Skill Tree', icon: BookOpen },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative select-none">
      {/* CHARACTER SIDEBAR (HUD) */}
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
              <span className="text-orange-500 font-extrabold text-sm">{profile.engagement > 80 ? 'Active' : 'Inactive'}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-950/20 border border-slate-800/40 rounded-lg">
              <span className="text-slate-400 flex items-center gap-1.5"><Zap className="w-4 h-4 text-green-500" /> Energy</span>
              <span className={`font-extrabold ${profile.energy < 30 ? 'text-red-400' : 'text-green-400'}`}>{profile.energy}/100</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs uppercase font-bold rounded-lg text-left transition border ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-950/20 border-cyan-500/20 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.05)]' 
                      : 'text-slate-400 border-transparent hover:text-cyan-400 hover:bg-cyan-950/10 hover:border-cyan-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </Link>
              );
            })}
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

      {/* MAIN CONTENT ZONE */}
      <main className="flex-1 p-8 md:p-12 space-y-8 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
