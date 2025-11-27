import React from 'react';

const SortOptions = ({ sortBy, sortOrder, onSortChange, variant = 'card' }) => {
  const sortOptions = [
    { value: 'title', label: 'Title', icon: 'bx-sort-a-z' },
    { value: 'status', label: 'Status', icon: 'bx-filter' },
    { value: 'priority', label: 'Priority', icon: 'bx-star' },
    { value: 'dueDate', label: 'Due Date', icon: 'bx-calendar' },
    { value: 'employee', label: 'Assignee', icon: 'bx-user' },
  ];

  const isInline = variant === 'inline';
  const wrapperClass = isInline
    ? 'flex-1 min-w-[240px]'
    : 'mb-6 bg-white/80 dark:bg-slate-900/70 rounded-2xl border border-white/50 dark:border-white/10 shadow-lg shadow-slate-900/10 backdrop-blur-xl p-4 transition-colors duration-300';

  const buttonBase =
    'px-3 py-1.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-1 border';

  return (
    <div className={wrapperClass}>
      <div className={`flex ${isInline ? 'flex-col gap-3' : 'items-center justify-between flex-wrap gap-4'}`}>
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-200 text-sm font-semibold tracking-wide">
          <i className="bx bx-sort text-xl text-sky-500 dark:text-sky-300" />
          <span>Sort tasks</span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {sortOptions.map((option) => {
            const active = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`${buttonBase} ${
                  active
                    ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white border-transparent shadow-lg shadow-slate-900/15'
                    : 'bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-200 border-slate-100/60 dark:border-white/10 hover:border-slate-200 dark:hover:border-slate-500'
                }`}
              >
                <i className={`bx ${option.icon}`} />
                <span>{option.label}</span>
                {active && (
                  <i className={`bx ${sortOrder === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'} text-base`} />
                )}
              </button>
            );
          })}
          <button
            onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`${buttonBase} bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-200 border-slate-100/60 dark:border-white/10 hover:border-slate-200 dark:hover:border-slate-500`}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <i className={`bx ${sortOrder === 'asc' ? 'bx-sort-up' : 'bx-sort-down'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;

