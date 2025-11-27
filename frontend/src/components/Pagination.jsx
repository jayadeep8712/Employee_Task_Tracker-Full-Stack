import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  // Always show pagination if there are items, even if only one page
  if (totalItems === 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-white/60 dark:border-white/10">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <span>Showing</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span>of {totalItems} tasks</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-slate-800 transition-colors"
          title="First page"
        >
          <i className="bx bx-chevrons-left"></i>
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-slate-800 transition-colors"
          title="Previous page"
        >
          <i className="bx bx-chevron-left"></i>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
                  : 'border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-slate-800 transition-colors"
          title="Next page"
        >
          <i className="bx bx-chevron-right"></i>
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-slate-800 transition-colors"
          title="Last page"
        >
          <i className="bx bx-chevrons-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

