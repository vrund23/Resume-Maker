import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a few minutes before trying again or try signing in.');
        }
        throw error;
      }
      if (isSignUp) alert('Check your email for the confirmation link!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-brand-outline-variant"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-black text-brand-primary mb-2">Resume Maker</h1>
          <p className="text-slate-500 text-sm">{isSignUp ? 'Create your account' : 'Welcome back'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-brand-surface-low border-b border-brand-primary focus:border-brand-accent outline-none transition-all text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-brand-surface-low border-b border-brand-primary focus:border-brand-accent outline-none transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/95 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />)}
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-brand-secondary font-bold hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
