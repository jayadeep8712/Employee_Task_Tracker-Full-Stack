import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Modal panel */}
        <div
          className={`inline-block align-bottom bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-3xl text-left overflow-hidden shadow-2xl shadow-slate-900/30 transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white tracking-wide">{title}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <i className='bx bx-x text-2xl'></i>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

