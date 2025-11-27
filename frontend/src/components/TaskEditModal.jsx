import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const TaskEditModal = ({ isOpen, onClose, task, employeeId, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(employeeId, task.id, formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none bg-white/90 dark:bg-slate-900/60 shadow-inner shadow-slate-900/5"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none resize-none bg-white/90 dark:bg-slate-900/60 shadow-inner shadow-slate-900/5"
            placeholder="Add task description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none bg-white/90 dark:bg-slate-900/60"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none bg-white/90 dark:bg-slate-900/60"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none bg-white/90 dark:bg-slate-900/60"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white rounded-2xl hover:from-sky-400 hover:via-blue-500 hover:to-indigo-600 transition-colors shadow-lg shadow-slate-900/10"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskEditModal;

