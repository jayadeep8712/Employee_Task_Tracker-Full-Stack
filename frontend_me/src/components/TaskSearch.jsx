import React from 'react';

const TaskSearch = ({ searchQuery, onSearchChange, variant = 'card' }) => {
  const isInline = variant === 'inline';
  const wrapperClass = isInline
    ? 'flex-1 min-w-[240px]'
    : 'mb-6 bg-white/80 dark:bg-slate-900/70 rounded-2xl border border-white/60 dark:border-white/10 shadow-lg shadow-slate-900/10 backdrop-blur-xl p-4 transition-colors duration-300';
  const inputClass = isInline
    ? 'w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 shadow-inner shadow-slate-900/5 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all'
    : 'w-full pl-12 pr-12 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all bg-white/80 dark:bg-slate-900/60 shadow-inner shadow-slate-900/5';

  return (
    <div className={wrapperClass}>
      <div className="relative">
        <i className="bx bx-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl" />
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputClass}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            <i className="bx bx-x text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskSearch;

