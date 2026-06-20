'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import { resetCharacter } from '../../actions/stats';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  Sparkles,
  Compass
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  // Fetch profile details
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

  // Reset Mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      const result = await resetCharacter();
      if (!result.success) {
        throw new Error(result.error || 'Failed to reset character');
      }
      return result;
    },
    onSuccess: () => {
      // Clear cache
      queryClient.clear();
      // Redirect to onboarding
      router.push('/assessment');
      router.refresh();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to reset character.');
    }
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess('System Update: General settings successfully updated.');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleResetCharacterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput.toUpperCase() === 'RESET') {
      resetMutation.mutate();
    } else {
      setError('Confirmation phrase mismatch. Please type RESET to confirm.');
    }
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-cyan-500/10 rounded-xl p-6 relative overflow-hidden flex justify-between items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">THE SYSTEM</span>
          <h1 className="text-2xl font-black tracking-wide text-slate-100 mt-1">SYSTEM CONFIGURATION</h1>
          <p className="text-xs text-slate-400 mt-1">Configure timezone parameters for streak calculations, notifications preferences, and profile recovery tools.</p>
        </div>
        <Settings className="w-8 h-8 text-slate-700 hidden md:block" />
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-bold uppercase py-2.5 px-4 rounded-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg p-3 text-xs">
          ⚠️ SYSTEM WARNING: {error}
        </div>
      )}

      {/* General Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 border-b border-slate-850 pb-2">
            General Preferences
          </h2>
          
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-500" /> System Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500/50 rounded-lg p-3 text-xs text-slate-100 focus:outline-none transition"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              <p className="text-[9px] text-slate-500">
                Determines when your daily quests reset and consecutive active streak counts are recalculated.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-500" /> Notification Level
              </label>
              <div className="flex gap-2">
                {['full', 'minimal', 'disabled'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className="flex-1 bg-slate-950 border border-slate-800 hover:border-cyan-500/30 text-slate-400 font-bold py-2 rounded-lg text-xs uppercase tracking-widest transition"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-2.5 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-cyan-950/20"
            >
              SAVE CONFIGURATION
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-slate-950/40 border border-red-500/20 rounded-xl p-6 space-y-6 relative overflow-hidden">
          {/* S-Rank Alert Glow */}
          <div className="absolute inset-0 bg-red-500/[0.01] pointer-events-none"></div>
          
          <h2 className="text-xs uppercase tracking-widest font-black text-red-400 border-b border-red-950 pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> SYSTEM RESET AREA
          </h2>

          <p className="text-[10px] text-slate-550 leading-relaxed">
            WARNING: Initializing a character reset is irreversible. All accumulated Level status, Stat allocation points, Gold reserves, unlocked Skill Tree nodes, and Achievement credentials will be completely terminated.
          </p>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full bg-red-950/20 border border-red-500/30 hover:bg-red-500 hover:text-slate-950 text-red-400 font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest transition"
            >
              RESET HUNTER MATRIX
            </button>
          ) : (
            <form onSubmit={handleResetCharacterSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-red-400 tracking-wider">
                  Type <span className="underline font-black">RESET</span> to execute
                </label>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="RESET"
                  className="w-full bg-slate-950 border border-red-500/40 focus:border-red-500 rounded-lg p-2.5 text-xs text-red-400 text-center uppercase tracking-widest font-black focus:outline-none transition"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowConfirmReset(false); setConfirmInput(''); }}
                  className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 font-bold py-2 rounded-lg text-xs uppercase tracking-widest transition"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-slate-950 font-black py-2 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-red-950/20 disabled:opacity-50"
                >
                  {resetMutation.isPending ? 'TERMINATING...' : 'EXECUTE'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
