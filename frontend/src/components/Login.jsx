import { useState } from 'react';

const demoAccounts = [
  { label: 'Admin', email: 'admin@example.com', password: 'admin123' },
  { label: 'Employee', email: 'brian.patel@example.com', password: 'password123' },
];

function Login({ onSubmit, loading, error }) {
  const [form, setForm] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const applyDemo = (account) => {
    setForm({ email: account.email, password: account.password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-24 top-10 w-72 h-72 bg-sky-500/30 blur-3xl" />
        <div className="absolute -left-16 bottom-10 w-80 h-80 bg-fuchsia-500/20 blur-3xl" />
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-xs uppercase tracking-[0.35em] text-slate-200">
              Workspace
            </span>
            <h1 className="text-4xl font-bold mt-6 leading-tight">
              Employee Task Tracker with <span className="text-sky-300">role-based access</span>
            </h1>
            <p className="text-slate-200/80 mt-4 text-lg">
              Visualize workloads, update statuses, and keep every department in sync with a single secure dashboard.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200/80">
              <li className="flex items-center gap-2">
                <i className="bx bx-lock-open text-sky-300 text-lg" />
                JWT auth with admin vs. employee permissions
              </li>
              <li className="flex items-center gap-2">
                <i className="bx bx-grid-alt text-sky-300 text-lg" />
                Live dashboards, filters, and animated micro-interactions
              </li>
              <li className="flex items-center gap-2">
                <i className="bx bx-cloud text-sky-300 text-lg" />
                Powered by Express + SQLite REST APIs
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300 mb-3">Quick accounts</p>
            <div className="flex flex-wrap gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.label}
                  type="button"
                  onClick={() => applyDemo(account)}
                  className="px-4 py-2 rounded-2xl border border-white/20 bg-white/5 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-80" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-slate-500 text-sm font-medium uppercase tracking-[0.3em]">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center text-xl shadow-lg">
                <i className="bx bx-group" />
              </span>
              Access workspace
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mt-6">Sign in to continue</h2>
            <p className="mt-2 text-slate-500">
              Use one of the demo accounts above or your own credentials from the backend seeds.
            </p>
            {error && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 mt-6">
              <label className="block text-sm font-semibold text-slate-600">
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-slate-600">
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white py-3.5 rounded-2xl font-semibold hover:from-sky-400 hover:via-blue-500 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-slate-900/15 disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Enter workspace'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

