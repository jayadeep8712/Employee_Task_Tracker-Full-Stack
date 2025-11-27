import React from 'react';

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-gradient-to-br from-white/70 to-slate-100 dark:from-slate-900/80 dark:to-slate-900 border border-white/60 dark:border-white/10 text-sky-500 dark:text-amber-200 rounded-3xl shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/30 transform hover:scale-105 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle dark mode"
    >
      <i className={`bx ${isDark ? 'bx-sun' : 'bx-moon'} text-2xl`}></i>
    </button>
  );
};

export default DarkModeToggle;

