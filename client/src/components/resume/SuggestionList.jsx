import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const SuggestionList = ({ suggestions = [] }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Your resume looks great! No major suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 transition hover:border-amber-300 dark:hover:border-amber-800"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {suggestion}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
