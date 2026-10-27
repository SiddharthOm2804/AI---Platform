import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Sparkles, 
  Lightbulb, 
  CheckCircle, 
  Calendar, 
  Type, 
  Cpu, 
  Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadResume, getResume, deleteResume } from '../services/resumeService.js';
import ATSRing from '../components/resume/ATSRing.jsx';
import SkillChips from '../components/resume/SkillChips.jsx';
import SuggestionList from '../components/resume/SuggestionList.jsx';
import UploadZone from '../components/resume/UploadZone.jsx';

export const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await getResume();
      setResume(res.data.resume);
    } catch (error) {
      console.error('Failed to load resume:', error);
      toast.error('Could not fetch resume profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      await uploadResume(file);
      toast.success('Resume analyzed successfully!');
      setShowUploader(false);
      await fetchResume();
    } catch (error) {
      console.error('Upload failed:', error);
      const msg = error.response?.data?.error || 'Failed to analyze resume. Please try again.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;

    try {
      await deleteResume();
      setResume(null);
      setShowUploader(true);
      toast.success('Resume removed.');
    } catch (error) {
      toast.error('Failed to delete resume.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ATS Evaluator</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Resume Analysis
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Optimize your resume for applicant tracking systems using offline NLP &amp; vector embeddings.
          </p>
        </div>

        {resume && !showUploader && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploader(true)}
              className="border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload New Resume
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete resume"
              className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-6">
          <div className="rounded-2xl p-8 bg-slate-200 dark:bg-slate-800 animate-pulse h-64" />
          <div className="rounded-2xl p-8 bg-slate-200 dark:bg-slate-800 animate-pulse h-48" />
          <div className="rounded-2xl p-8 bg-slate-200 dark:bg-slate-800 animate-pulse h-48" />
        </div>
      ) : !resume || showUploader ? (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10">
            {showUploader && resume && (
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Replacing current resume
                </span>
                <button
                  onClick={() => setShowUploader(false)}
                  className="text-xs text-indigo-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
            <UploadZone onUpload={handleUpload} uploading={uploading} />
          </div>

          {/* Quick Tip Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-200/60 dark:border-indigo-800/50 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Tip:</span> Upload your resume to unlock automated job matching and placement benchmarking.
            </p>
          </div>
        </div>
      ) : (
        /* Resume Result View */
        <div className="space-y-8 relative">
          {/* Uploading Overlay */}
          {uploading && (
            <div className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Re-analyzing your resume...
              </p>
            </div>
          )}

          {/* Top Card: ATS Score Ring + Summary */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Column: ATSRing */}
              <div className="col-span-1 flex justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                <ATSRing score={resume.atsScore} size={190} strokeWidth={14} />
              </div>

              {/* Right Column: Summary & Stats */}
              <div className="col-span-2 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Resume Summary
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Analyzed with local NLP parsers and MiniLM vector embeddings.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <Type className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Word Count</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {resume.analysis?.textLength || 0}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <Cpu className="w-3.5 h-3.5 text-violet-500" />
                      <span>Skills Found</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {resume.skills?.length || 0}
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5 text-fuchsia-500" />
                      <span>Uploaded</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {formatDate(resume.uploadedAt)}
                    </p>
                  </div>
                </div>

                {resume.embedding && resume.embedding.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Vectorized ({resume.embedding.length}-dimensional local semantic embedding ready)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                Detected Skills
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                {resume.skills?.length || 0} extracted
              </span>
            </div>
            <SkillChips skills={resume.skills} />
          </div>

          {/* Suggestions Section Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                AI Suggestions
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Actionable tips for ATS ranking
              </span>
            </div>
            <SuggestionList suggestions={resume.analysis?.suggestions} />
          </div>

          {/* Bottom Tip */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              💡 Tip: Upload your resume to unlock job matching.
            </span>
            <Link to="/jobs" className="text-indigo-500 font-semibold hover:underline">
              View Jobs →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;
