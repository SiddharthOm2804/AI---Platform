import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

export const Landing = () => {
  const { token } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center flex-1 flex flex-col justify-center items-center">
        
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium mb-8 shadow-sm backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Own AI Placement Engine • Zero External APIs</span>
        </div>

        {/* Hero title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-tight">
          Land Your Dream Job with{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            AI Precision
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive placement preparation platform with offline ONNX intelligence, local transformers, and mock interview evaluation.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl px-6 py-3.5 hover:shadow-lg hover:shadow-indigo-500/30 hover:opacity-95 transition flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl px-6 py-3.5 hover:shadow-lg hover:shadow-indigo-500/30 hover:opacity-95 transition flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Key Features Quick Strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full text-left">
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <Zap className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Resume ATS Scoring</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instant feedback on format and technical keywords.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <Sparkles className="w-5 h-5 text-violet-500 mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">AI Mock Interviewer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Interactive technical and HR question simulations.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-fuchsia-500 mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Offline AI Guarantee</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero external API dependencies or hidden charges.</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} PrepAI. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
