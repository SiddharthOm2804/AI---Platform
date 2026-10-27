import React from 'react';
import { motion } from 'framer-motion';

export const ATSRing = ({ score = 0, size = 180, strokeWidth = 14 }) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  let strokeColor = 'stroke-rose-500';
  let textColor = 'text-rose-500';
  if (safeScore >= 75) {
    strokeColor = 'stroke-emerald-500';
    textColor = 'text-emerald-500';
  } else if (safeScore >= 50) {
    strokeColor = 'stroke-amber-500';
    textColor = 'text-amber-500';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-800"
        />

        {/* Animated Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={strokeColor}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
          {safeScore}
        </span>
        <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
          ATS Score
        </span>
      </div>
    </div>
  );
};

export default ATSRing;
