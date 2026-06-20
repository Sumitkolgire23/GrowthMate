'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Shield, Lock, Mail, User, ChevronRight, Activity } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
        // Wait a bit, then redirect
        setTimeout(() => {
          router.push('/assessment');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background Neon Grid / Vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
      
      {/* Radiant Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/80 border border-cyan-500/20 rounded-xl p-8 backdrop-blur-md shadow-2xl relative z-10">
        {/* Glowing border effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-xl opacity-20 blur-sm -z-10 group-hover:opacity-30 transition"></div>

        {/* RPG Title Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 mb-4 animate-pulse">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-yellow-400">
            AWAKEN CHARACTER
          </h1>
          <p className="text-xs uppercase tracking-widest text-cyan-500/60 mt-1">
            Create Your GrowthMate Account
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-300 rounded-lg p-3 text-sm mb-6 flex items-start gap-2">
            <span className="font-semibold">⚠️ SYSTEM ERROR:</span>
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 rounded-lg p-4 text-center space-y-2">
            <h3 className="font-bold text-lg">✨ REGISTRATION COMPLETE</h3>
            <p className="text-xs text-slate-400">Preparing system interface... Loading onboarding assessment.</p>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-4 border border-cyan-500/20">
              <div className="bg-cyan-500 h-full w-1/2 animate-[pulse_1s_infinite]"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-500" /> Character Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sung Jinwoo"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 pl-3 pr-10 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-500" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hunter@system.com"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 pl-3 pr-10 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-500" /> Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-cyan-500 rounded-lg py-2.5 pl-3 pr-10 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 tracking-widest text-xs uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-950/50"
            >
              {loading ? (
                <span className="animate-pulse">AWAKENING...</span>
              ) : (
                <>
                  <span>AWAKEN CHARACTER</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center mt-6 text-xs text-slate-500">
            <span>ALREADY AWAKENED? </span>
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition uppercase tracking-wider">
              ENTER SYSTEM
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest relative z-10">
        Secured by Supabase Cryptography • v1.0.0
      </div>
    </div>
  );
}
