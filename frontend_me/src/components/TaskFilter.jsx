import React from 'react';

const TaskFilter = ({ selectedStatus, onStatusChange, variant = 'card' }) => {
  const statuses = [
    { label: 'All', icon: 'bx-list-ul' },
    { label: 'Pending', icon: 'bx-time-five' },
    { label: 'In Progress', icon: 'bx-loader-circle' },
    { label: 'Completed', icon: 'bx-check-circle' }
  ];

  const isInline = variant === 'inline';
  const wrapperClass = isInline
    ? 'w-full overflow-x-auto pb-1'
    : 'mb-8 bg-white/80 dark:bg-slate-900/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-xl shadow-slate-900/10 backdrop-blur-2xl p-6 transition-colors duration-300';

  return (
    <div className={wrapperClass}>
      {!isInline && (
        <div className="flex items-center mb-4">
          <i className="bx bx-filter-alt text-2xl text-sky-500 dark:text-sky-300 mr-2" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Filter tasks</h3>
        </div>
      )}
      <div className={`flex gap-2 ${isInline ? 'min-w-max pr-4' : 'flex-wrap'}`}>
        {statuses.map((status) => (
          <button
            key={status.label}
            onClick={() => onStatusChange(status.label)}
            className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedStatus === status.label
                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-slate-900/15'
                : 'bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-200 border border-slate-100/60 dark:border-white/10 hover:border-slate-200 dark:hover:border-slate-500 shadow-inner shadow-slate-900/5'
            }`}
          >
            <i className={`bx ${status.icon} text-lg`} />
            <span>{status.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilter;

