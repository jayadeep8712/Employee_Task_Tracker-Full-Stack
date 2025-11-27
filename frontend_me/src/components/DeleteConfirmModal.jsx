import React from 'react';
import Modal from './Modal';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task" size="sm">
      <div className="py-4">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-rose-100/80 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center">
            <i className='bx bx-trash text-rose-500 dark:text-rose-300 text-2xl'></i>
          </div>
          <div>
            <p className="text-slate-800 dark:text-slate-50 font-semibold">
              Are you sure you want to delete this task?
            </p>
            <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">
              "{taskTitle}"
            </p>
            <p className="text-rose-500 dark:text-rose-300 text-sm mt-2 font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl hover:from-rose-400 hover:to-orange-500 transition-colors shadow-lg shadow-rose-300/30"
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;

