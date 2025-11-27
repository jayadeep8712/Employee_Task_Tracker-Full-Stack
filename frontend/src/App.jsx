import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import TaskFilter from './components/TaskFilter';
import AddTask from './components/AddTask';
import EmployeeList from './components/EmployeeList';
import TaskSearch from './components/TaskSearch';
import SortOptions from './components/SortOptions';
import ToastContainer from './components/ToastContainer';
import TaskEditModal from './components/TaskEditModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DarkModeToggle from './components/DarkModeToggle';
import EmployeeManager from './components/EmployeeManager';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';
import { api, handleApiError } from './services/api';

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const toUiStatus = (value) => STATUS_LABELS[value] || 'Pending';
const toApiStatus = (label) =>
  Object.entries(STATUS_LABELS).find(([, friendly]) => friendly === label)?.[0] || 'pending';

const toUiPriority = (value) => PRIORITY_LABELS[value] || 'Low';
const toApiPriority = (label) =>
  Object.entries(PRIORITY_LABELS).find(([, friendly]) => friendly === label)?.[0] || 'low';

const normalizeTask = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: toUiStatus(task.status),
  priority: toUiPriority(task.priority),
  dueDate: task.dueDate || null,
  employeeId: task.employeeId,
  employeeName: task.employeeName,
});

const denormalizeTask = (task) => ({
  title: task.title,
  description: task.description || '',
  status: toApiStatus(task.status),
  priority: toApiPriority(task.priority),
  dueDate: task.dueDate || null,
  employeeId: task.employeeId ? Number(task.employeeId) : null,
});

function App() {
  const { user, authLoading, login, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDark, setIsDark] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [authError, setAuthError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadEmployees = async () => {
    const data = await api.getEmployees();
    setEmployees(data);
  };

  const loadTasks = async () => {
    const data = await api.getTasks();
    setTasks(data.map(normalizeTask));
  };

  const loadDashboard = async () => {
    const data = await api.getDashboard();
    setDashboard(data);
  };

  const fetchCollections = async () => {
    setErrorBanner('');
    await Promise.all([loadEmployees(), loadTasks(), loadDashboard()]);
  };

  useEffect(() => {
    if (!user) {
      setEmployees([]);
      setTasks([]);
      setDashboard(null);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        await fetchCollections();
      } catch (error) {
        const message = handleApiError(error);
        setErrorBanner(message);
        showToast(message, 'error', 5000);
      } finally {
        setLoading(false);
    }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const refreshTasksAndStats = async () => {
    await Promise.all([loadTasks(), loadDashboard()]);
  };

  const handleAddTask = async (formData) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      await api.createTask(denormalizeTask(formData));
      await refreshTasksAndStats();
    showToast('Task added successfully!', 'success');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task, employeeId) => {
    setEditingTask({ task, employeeId });
  };

  const handleSaveTask = async (employeeId, taskId, updatedData) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      await api.updateTask(taskId, {
        ...denormalizeTask({ ...updatedData, employeeId }),
      });
      await refreshTasksAndStats();
    setEditingTask(null);
    showToast('Task updated successfully!', 'success');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId, employeeId, taskTitle) => {
    setDeletingTask({ taskId, employeeId, taskTitle });
  };

  const confirmDeleteTask = async () => {
    if (!deletingTask) return;
    if (!isAdmin) {
      setDeletingTask(null);
      return;
    }
    try {
      setLoading(true);
      await api.deleteTask(deletingTask.taskId);
      await refreshTasksAndStats();
      showToast('Task deleted successfully!', 'success');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
    } finally {
      setDeletingTask(null);
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleTaskStatusChange = async (taskId) => {
    if (!isAdmin) return;
    const statusOrder = ['Pending', 'In Progress', 'Completed'];
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const nextStatus =
      statusOrder[(statusOrder.indexOf(task.status) + 1) % statusOrder.length] || 'Pending';

    try {
      setLoading(true);
      await api.updateTask(taskId, { status: toApiStatus(nextStatus) });
      await refreshTasksAndStats();
      showToast('Task status updated!', 'info');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (nextSortBy, explicitOrder) => {
    const targetSortBy = nextSortBy || sortBy;
    let nextOrder = sortOrder;
    if (explicitOrder) {
      nextOrder = explicitOrder;
    } else if (targetSortBy !== sortBy) {
      nextOrder = 'asc';
    } else {
      nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    setSortBy(targetSortBy);
    setSortOrder(nextOrder);
  };

  const employeeViews = useMemo(() => {
    const enriched = employees.map((emp) => ({
              ...emp,
      tasks: tasks.filter((task) => task.employeeId === emp.id),
    }));

    const unassigned = tasks.filter((task) => !task.employeeId);
    if (isAdmin && unassigned.length) {
      enriched.push({
        id: 'unassigned',
        name: 'Unassigned',
        role: 'Available for assignment',
        department: '',
        email: '',
        tasks: unassigned,
      });
    }
    return enriched;
  }, [employees, tasks, isAdmin]);

  const allTasks = useMemo(
    () => employeeViews.flatMap((employee) => employee.tasks),
    [employeeViews]
  );

  const heroStats = dashboard?.stats || {
    total: allTasks.length,
    completed: allTasks.filter((task) => task.status === 'Completed').length,
    completionRate: allTasks.length
      ? Math.round((allTasks.filter((task) => task.status === 'Completed').length / allTasks.length) * 100)
      : 0,
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleLogin = async (credentials) => {
    setAuthError('');
    try {
      await login(credentials);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleCreateEmployee = async (payload) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      await api.createEmployee(payload);
      await loadEmployees();
      showToast('Employee created', 'success');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (id, payload) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      await api.updateEmployee(id, payload);
      await loadEmployees();
      showToast('Employee updated', 'success');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this employee? Tasks will remain but become unassigned.')) return;
    try {
      setLoading(true);
      await api.deleteEmployee(id);
      await loadEmployees();
      showToast('Employee deleted', 'success');
    } catch (error) {
      const message = handleApiError(error);
      setErrorBanner(message);
      showToast(message, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Login onSubmit={handleLogin} loading={authLoading} error={authError} />;
  }

  const statCards = [
    {
      label: 'Active tasks',
      value: heroStats.total || 0,
      icon: 'bx-target-lock',
      gradient: 'from-sky-500 to-cyan-400',
    },
    {
      label: 'Completion',
      value: `${heroStats.completionRate || 0}%`,
      icon: 'bx-check-shield',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      label: isAdmin ? 'Admin mode' : 'My focus',
      value: isAdmin ? 'Full access' : 'Assigned tasks',
      icon: isAdmin ? 'bx-crown' : 'bx-user',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />

      <header className="relative pt-12 pb-4">
        <div className="container mx-auto px-4">
          <div className="bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl shadow-slate-900/10 backdrop-blur-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-64 h-64 bg-sky-500/10 blur-3xl -top-12 -right-16" />
              <div className="absolute w-72 h-72 bg-indigo-500/10 blur-3xl bottom-0 left-0" />
            </div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-slate-900/20">
                      <i className="bx bx-compass" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Workspace</p>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Employee Task Tracker</h1>
                </div>
              </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-3xl text-lg">
                    Fluid, modern workspace for managing team workloads, priorities, and delivery timelines in one secure place.
              </p>
            </div>
                <div className="flex items-center gap-4 flex-wrap">
              <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{user.role}</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {user.employeeName || user.email}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-4 py-2 rounded-2xl bg-white/15 border border-white/30 backdrop-blur text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-lg shadow-slate-900/10 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 transition-opacity"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-slate-900/10`}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wide opacity-70">{card.label}</p>
                      <p className="text-3xl font-bold mt-1">{card.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                      <i className={`bx ${card.icon}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {errorBanner && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
              {errorBanner}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-8">
        <Dashboard summary={dashboard} loading={loading} />
        
        {isAdmin && (
          <section id="task-form">
            <AddTask
              employees={employees}
              onAddTask={handleAddTask}
              loading={loading}
              disabled={!isAdmin}
            />
          </section>
        )}

        <section className="panel">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500 pl-2">Board tools</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-1 pl-2">Focus the task list</h3>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-white/10 text-slate-600 dark:text-slate-200">
                {allTasks.length} tasks in view
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <TaskSearch variant="inline" searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <SortOptions variant="inline" sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
              </div>
              <TaskFilter variant="inline" selectedStatus={statusFilter} onStatusChange={handleStatusFilterChange} />
            </div>
          </div>
        </section>
        
        <EmployeeList
          employees={employeeViews}
          statusFilter={statusFilter}
          onStatusChange={handleTaskStatusChange}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          canManage={isAdmin}
        />

        {isAdmin && (
          <section className="panel">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white pb-6 p-3">Manage employees</h2>
            <EmployeeManager
              employees={employees}
              onCreate={handleCreateEmployee}
              onUpdate={handleUpdateEmployee}
              onDelete={handleDeleteEmployee}
              loading={loading}
            />
          </section>
        )}
      </main>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-2xl shadow-slate-900/30 border border-white/20 flex items-center justify-center hover:scale-105 transition"
          aria-label="Back to top"
        >
          <i className="bx bx-chevron-up text-2xl" />
        </button>
      )}

      <footer className="mt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white/85 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-lg shadow-slate-900/10 p-6 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
              <i className="bx bx-code-alt" />
              <span>Employee Task Tracker © {new Date().getFullYear()}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Designed for modern teams by{' '}
              <a href="https://www.linkedin.com/in/jayadeep-pendela-100278225/" target="_blank" rel="noreferrer" className="text-indigo-500 dark:text-indigo-400 font-semibold hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                Jayadeep Pendela
              </a>
              .
            </p>
          </div>
        </div>
      </footer>

      {editingTask && (
        <TaskEditModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask.task}
          employeeId={editingTask.employeeId}
          onSave={handleSaveTask}
        />
      )}

      {deletingTask && (
        <DeleteConfirmModal
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={confirmDeleteTask}
          taskTitle={deletingTask.taskTitle}
        />
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
          <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 px-6 py-4 shadow-xl text-slate-700 dark:text-slate-100 flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
            </span>
            <span>Syncing data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

