import React, { useEffect, useState } from 'react';

const AddTask = ({ employees, onAddTask, loading, disabled }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!formData.employeeId && employees.length > 0) {
      setFormData((prev) => ({ ...prev, employeeId: employees[0].id }));
    }
  }, [employees, formData.employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.employeeId) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await onAddTask({
        ...formData,
        employeeId: formData.employeeId,
      });
    setFormData({
      employeeId: employees.length > 0 ? employees[0].id : '',
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
        dueDate: '',
      });
    } catch (error) {
      // parent already surfaces error; no-op
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl p-8 mb-8 transition-colors duration-300">
      <div className="flex items-center mb-6">
        <i className='bx bx-plus-circle text-3xl text-sky-500 dark:text-sky-300 mr-3'></i>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Add new task</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2 flex items-center">
            <i className='bx bx-user mr-2 text-sky-500 dark:text-sky-300'></i>
            Assign to Employee
          </label>
          <div className="relative">
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all bg-white/80 dark:bg-slate-900/70 appearance-none shadow-inner shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-600"
              required
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.role}
                </option>
              ))}
            </select>
            <i className='bx bx-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'></i>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <i className='bx bx-edit mr-2 text-sky-500 dark:text-sky-300'></i>
            Task Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className="w-full px-4 py-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all shadow-inner shadow-slate-900/5 bg-white/90 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600"
              required
            />
            <i className='bx bx-task absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 dark:text-slate-500'></i>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2 flex items-center">
            <i className='bx bx-file-blank mr-2 text-sky-500 dark:text-sky-300'></i>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Add task description (optional)..."
            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all shadow-inner shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-600 bg-white/90 dark:bg-slate-900/60 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2 flex items-center">
              <i className='bx bx-flag mr-2 text-sky-500 dark:text-sky-300'></i>
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all bg-white/80 dark:bg-slate-900/60 appearance-none shadow-inner shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <i className='bx bx-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'></i>
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2 flex items-center">
              <i className='bx bx-star mr-2 text-sky-500 dark:text-sky-300'></i>
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all bg-white/80 dark:bg-slate-900/60 appearance-none shadow-inner shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <i className='bx bx-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none'></i>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-600 dark:text-slate-200 mb-2 flex items-center">
              <i className='bx bx-calendar mr-2 text-sky-500 dark:text-sky-300'></i>
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-10 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all shadow-inner shadow-slate-900/5 bg-white/90 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || loading || disabled}
          className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white py-3.5 rounded-2xl font-semibold hover:from-sky-400 hover:via-blue-500 hover:to-indigo-600 transform transition-all duration-300 hover:scale-[1.015] shadow-xl shadow-slate-900/10 flex items-center justify-center space-x-2 mt-6 disabled:opacity-60"
        >
          <i className='bx bx-plus text-xl'></i>
          <span>{submitting ? 'Saving...' : 'Add Task'}</span>
        </button>
      </form>
    </div>
  );
};

export default AddTask;

