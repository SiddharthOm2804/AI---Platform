import React from 'react';

export const SkillChips = ({ skills = [] }) => {
  if (!skills || skills.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400 text-sm italic">
        No skills detected
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300 border border-indigo-500/20 capitalize transition hover:bg-indigo-500/20"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillChips;
