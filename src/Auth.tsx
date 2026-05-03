import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { motion } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Globe,
  FileCheck
} from 'lucide-react';

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

  const features = [
    {
      icon: Zap,
      title: "Real-time Preview",
      description: "See your changes instantly as you type with our high-fidelity live editor."
    },
    {
      icon: FileCheck,
      title: "ATS-Friendly",
      description: "Our templates are designed to pass through ATS systems with 100% accuracy."
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your data is encrypted and saved safely in your private cloud account."
    },
    {
      icon: Globe,
      title: "Export Globally",
      description: "Download high-quality A4 PDFs compatible with global recruitment standards."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Side: Branding and Features */}
      <div className="lg:w-1/2 bg-slate-900 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-12"
          >
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <span className="font-black text-xl">R</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight font-serif">Resume Maker</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Create a resume that <span className="text-brand-primary">gets you hired.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              Professional, designer-approved templates engineered to highlight your strengths and secure your dream role.
            </p>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex gap-4"
                >
                  <div className="mt-1 w-10 h-10 shrink-0 bg-slate-800 rounded-lg flex items-center justify-center text-brand-primary border border-slate-700">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 pt-12 border-t border-slate-800 mt-12 flex items-center justify-between text-slate-500 text-xs font-medium">
          <p>© 2024 Resume Maker. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="lg:w-1/2 bg-slate-50 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 lg:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100"
        >
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h3>
            <p className="text-slate-500 text-sm">
              {isSignUp ? 'Start building your professional future today.' : 'Sign in to access your saved resume drafts.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                {!isSignUp && (
                  <button type="button" className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-wider">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 text-red-500 text-xs bg-red-50 p-4 rounded-xl border border-red-100"
              >
                <AlertCircle className="shrink-0" size={16} />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/95 transition-all shadow-xl shadow-brand-primary/30 active:scale-[0.98] flex items-center justify-center gap-3 text-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />
              )}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative z-10 px-4 bg-white text-slate-300 text-[10px] font-bold uppercase tracking-widest">Or</span>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-slate-600 font-medium hover:text-brand-primary transition-colors"
            >
              {isSignUp ? (
                <>Already have an account? <span className="font-bold text-brand-primary">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="font-bold text-brand-primary">Sign Up Free</span></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
