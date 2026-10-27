import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { getResume } from '../services/resumeService.js';
import { 
  FileText, 
  Briefcase, 
  Code, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const res = await getResume();
        if (res.data?.resume) {
          setResumeData(res.data.resume);
        }
      } catch (err) {
        console.error('Failed to load resume on dashboard:', err);
      }
    };
    loadResume();
  }, []);

  const otherCards = [
    {
      title: 'Job Matches',
      desc: 'Company skill benchmark and candidate match indexing.',
      icon: Briefcase,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      title: 'DSA Progress',
      desc: 'Topic-wise coding progress, patterns, and tracking.',
      icon: Code,
      gradient: 'from-fuchsia-500 to-pink-600',
    },
    {
      title: 'Mock Interviews',
      desc: 'Real-time offline AI interview sessions and performance scores.',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Placement Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'} 👋
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Track your preparation milestones, assess technical readiness, and prepare for placement rounds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Role: {user?.role || 'student'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Modules Overview
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 italic">
            Full stats coming in Phase 9
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Resume Analysis (Active Real Link) */}
          <Link
            to="/resume"
            className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/50 shadow hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                {resumeData ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                    ATS: {resumeData.atsScore}/100
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                    Pending
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Resume Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {resumeData
                  ? `${resumeData.skills?.length || 0} skills detected. Click to view suggestions and full breakdown.`
                  : 'ATS resume scoring and keyword extraction via offline models.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>{resumeData ? 'View Full Analysis' : 'Upload your resume →'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Cards 2, 3, 4: Upcoming modules */}
          {otherCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white mb-4 shadow-sm`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-500 font-medium">
                  <span>Explore Module</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Phase 3+
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
