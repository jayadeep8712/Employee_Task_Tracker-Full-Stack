import { useEffect, useRef, useState } from 'react';

const defaultForm = {
  name: '',
  role: '',
  department: '',
  email: '',
};

function EmployeeManager({ employees, onCreate, onUpdate, onDelete, loading }) {
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const formSectionRef = useRef(null);
  const nameInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await onUpdate(editingId, form);
    } else {
      await onCreate(form);
    }
    resetForm();
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      email: employee.email,
    });
  };

  useEffect(() => {
    if (editingId && formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      requestAnimationFrame(() => {
        nameInputRef.current?.focus({ preventScroll: true });
      });
    }
  }, [editingId]);

  return (
    <div className="space-y-10">
      <div className="bg-white/90 dark:bg-slate-900/70 rounded-3xl border border-white/70 dark:border-white/10 p-6 shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500 mb-1">Directory</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">People overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">High-level snapshot of every teammate and their role.</p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/50 border border-white/60 dark:border-white/10 text-sm text-slate-600 dark:text-slate-200">
            {employees.length} teammates
          </span>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/60 dark:bg-slate-900/40 text-slate-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{employee.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{employee.role}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{employee.department}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{employee.email}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        title="Edit employee"
                        onClick={() => handleEdit(employee)}
                        className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-100 hover:-translate-y-0.5 transition shadow-inner shadow-slate-900/5"
                      >
                        <i className="bx bx-edit" />
                      </button>
                      <button
                        type="button"
                        title="Delete employee"
                        onClick={() => onDelete(employee.id)}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white hover:-translate-y-0.5 transition shadow-lg shadow-rose-500/30"
                      >
                        <i className="bx bx-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!employees.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-300">
                    No employees yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        ref={formSectionRef}
        className="bg-white/90 dark:bg-slate-900/60 rounded-3xl border border-white/70 dark:border-white/10 backdrop-blur-xl shadow-2xl shadow-slate-900/10 p-6"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500 mb-2">
          {editingId ? 'Update teammate' : 'Add teammate'}
        </p>
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          {editingId ? 'Edit employee profile' : 'Create a new employee'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
            Name
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              ref={nameInputRef}
              className="mt-1 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-900/60"
              placeholder="Jane Doe"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
            Role
            <input
              required
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-900/60"
              placeholder="Product Manager"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
            Department
            <input
              required
              name="department"
              value={form.department}
              onChange={handleChange}
              className="mt-1 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-900/60"
              placeholder="Product"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-300">
            Email
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-900/60"
              placeholder="user@example.com"
            />
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white py-3 rounded-2xl font-semibold disabled:opacity-60 shadow-lg shadow-slate-900/10"
            >
              {editingId ? 'Save changes' : 'Add employee'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeManager;

