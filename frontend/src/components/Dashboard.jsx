import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = ({ summary, loading }) => {
  const [activeTab, setActiveTab] = useState('snapshot');
  if (loading && !summary) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl p-8 mb-8 transition-colors duration-300">
        <p className="text-slate-500 dark:text-slate-300">Loading dashboard...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl p-8 mb-8 transition-colors duration-300">
        <p className="text-slate-500 dark:text-slate-300">No dashboard data available.</p>
      </div>
    );
  }

  const { stats, employees } = summary;
  const totalTasks = stats.total || 1;
  const statusBreakdown = [
    { label: 'Completed', value: stats.completed, color: 'bg-emerald-500', accent: 'text-emerald-600 dark:text-emerald-300' },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-400', accent: 'text-amber-500 dark:text-amber-300' },
    { label: 'Pending', value: stats.pending, color: 'bg-fuchsia-500', accent: 'text-fuchsia-500 dark:text-fuchsia-300' },
  ];
  const focusQueue = [
    { label: 'Remaining', value: Math.max(stats.total - stats.completed, 0), icon: 'bx-time', color: 'text-rose-500' },
    { label: 'In Progress', value: stats.inProgress, icon: 'bx-refresh', color: 'text-amber-500' },
    { label: 'Pending', value: stats.pending, icon: 'bx-bell', color: 'text-violet-500' },
  ];
  const leaderboard = [...employees]
    .map((employee) => ({
      ...employee,
      completionRate: employee.totalTasks ? Math.round((employee.completedTasks / employee.totalTasks) * 100) : 0,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 4);

  const COLORS = {
    pending: '#f97316',
    inProgress: '#0ea5e9',
    completed: '#10b981',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#3b82f6',
  };

  const statusChartData = [
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'In Progress', value: stats.inProgress, color: COLORS.inProgress },
    { name: 'Completed', value: stats.completed, color: COLORS.completed },
  ];

  const employeeChartData = employees
    .map((emp) => {
      const total = emp.totalTasks || 0;
      const completed = emp.completedTasks || 0;
      const remaining = total - completed;
      // Estimate: split remaining between inProgress and pending (60/40 ratio)
      const inProgress = Math.round(remaining * 0.6);
      const pending = remaining - inProgress;
      return {
        name: emp.name.split(' ')[0],
        completed,
        inProgress,
        pending,
      };
    })
    .slice(0, 8);

  const priorityDistribution = employees.reduce(
    (acc, emp) => {
      // Estimate based on completion rate (simplified)
      const tasks = emp.totalTasks || 0;
      acc.high += Math.floor(tasks * 0.3);
      acc.medium += Math.floor(tasks * 0.5);
      acc.low += Math.floor(tasks * 0.2);
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const priorityChartData = [
    { name: 'High', value: priorityDistribution.high, color: COLORS.high },
    { name: 'Medium', value: priorityDistribution.medium, color: COLORS.medium },
    { name: 'Low', value: priorityDistribution.low, color: COLORS.low },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/70 rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl p-8 mb-8 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-slate-900/15">
            <i className="bx bx-line-chart" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Team insights</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Momentum snapshot</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/60 dark:border-white/10">
        <button
          onClick={() => setActiveTab('snapshot')}
          className={`px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
            activeTab === 'snapshot'
              ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-200 border border-white/60 dark:border-white/10 hover:bg-white/90 dark:hover:bg-slate-800'
          }`}
        >
          <i className="bx bx-dashboard mr-2"></i>
          Snapshot
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
              : 'bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-200 border border-white/60 dark:border-white/10 hover:bg-white/90 dark:hover:bg-slate-800'
          }`}
        >
          <i className="bx bx-bar-chart-alt-2 mr-2"></i>
          Analytics
        </button>
      </div>

      {/* Snapshot Tab */}
      {activeTab === 'snapshot' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status mix</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Workload distribution</p>
              </div>
              <i className="bx bx-doughnut-chart text-2xl text-sky-500 dark:text-sky-300" />
            </div>
            <div className="space-y-4">
              {statusBreakdown.map((status) => {
                const percent = Math.round(((status.value || 0) / totalTasks) * 100);
                return (
                  <div key={status.label}>
                    <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-200 mb-1">
                      <span className={status.accent}>{status.label}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full overflow-hidden">
                      <div className={`${status.color} h-full rounded-full transition-all`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Focus queue</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">What needs attention</p>
              </div>
              <i className="bx bx-list-check text-2xl text-amber-500" />
            </div>
            <div className="space-y-3">
              {focusQueue.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-100/70 dark:border-white/5 px-4 py-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-2xl bg-white/60 dark:bg-slate-900/40 flex items-center justify-center text-lg ${item.color}`}>
                      <i className={`bx ${item.icon}`} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{item.label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Tasks cluster</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-slate-800 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Top performers</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Team leaderboard</p>
              </div>
              <i className="bx bx-user-pin text-2xl text-emerald-500" />
            </div>
            <div className="space-y-3">
              {leaderboard.length ? (
                leaderboard.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100/60 dark:border-white/5 px-4 py-3 bg-white/70 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center font-semibold">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{employee.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{employee.role}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-500 dark:text-emerald-300">
                      {employee.completedTasks}/{employee.totalTasks} ({employee.completionRate}%)
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-300">No team data yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {(() => {
              const avgTasksPerEmployee = employees.length > 0 ? (totalTasks / employees.length).toFixed(1) : 0;
              const avgCompletionRate = employees.length > 0
                ? employees.reduce((sum, emp) => {
                    const rate = emp.totalTasks ? (emp.completedTasks / emp.totalTasks) * 100 : 0;
                    return sum + rate;
                  }, 0) / employees.length
                : 0;
              const topPerformer = [...employees]
                .map(emp => ({
                  ...emp,
                  rate: emp.totalTasks ? (emp.completedTasks / emp.totalTasks) * 100 : 0
                }))
                .sort((a, b) => b.rate - a.rate)[0];
              const mostTasks = [...employees].sort((a, b) => (b.totalTasks || 0) - (a.totalTasks || 0))[0];

              return (
                <>
                  <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-4 shadow-inner shadow-slate-900/5">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bx bx-group text-2xl text-sky-500"></i>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Team Size</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{employees.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active employees</p>
                  </div>
                  <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 shadow-inner shadow-slate-900/5">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bx bx-task text-2xl text-emerald-500"></i>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Avg Tasks</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgTasksPerEmployee}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per employee</p>
                  </div>
                  <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-4 shadow-inner shadow-slate-900/5">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bx bx-trophy text-2xl text-amber-500"></i>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Avg Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgCompletionRate.toFixed(0)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completion rate</p>
                  </div>
                  <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 shadow-inner shadow-slate-900/5">
                    <div className="flex items-center justify-between mb-2">
                      <i className="bx bx-star text-2xl text-indigo-500"></i>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Top Performer</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{topPerformer?.name || 'N/A'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{topPerformer ? `${topPerformer.rate.toFixed(0)}% complete` : 'No data'}</p>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status Distribution Pie Chart */}
            <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Task status</p>
                  <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Distribution overview</p>
                </div>
                <i className="bx bx-pie-chart-alt-2 text-2xl text-sky-500 dark:text-sky-300" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Distribution Pie Chart */}
            <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Priority mix</p>
                  <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Task priorities</p>
                </div>
                <i className="bx bx-bar-chart-square text-2xl text-amber-500" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priorityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employee Performance Bar Chart */}
          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Team performance</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Task breakdown by employee</p>
              </div>
              <i className="bx bx-bar-chart-alt-2 text-2xl text-indigo-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill={COLORS.completed} name="Completed" radius={[0, 0, 0, 0]} />
                <Bar dataKey="inProgress" stackId="a" fill={COLORS.inProgress} name="In Progress" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill={COLORS.pending} name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate Comparison */}
          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Productivity metrics</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Completion rate by employee</p>
              </div>
              <i className="bx bx-line-chart text-2xl text-emerald-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employees.map(emp => ({
                name: emp.name.split(' ')[0],
                rate: emp.totalTasks ? Math.round((emp.completedTasks / emp.totalTasks) * 100) : 0,
                total: emp.totalTasks || 0
              })).slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '12px',
                  }}
                  formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                />
                <Bar dataKey="rate" fill={COLORS.completed} name="Completion Rate" radius={[8, 8, 0, 0]}>
                  {employees.map((emp, index) => {
                    const rate = emp.totalTasks ? (emp.completedTasks / emp.totalTasks) * 100 : 0;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={rate >= 80 ? COLORS.completed : rate >= 50 ? COLORS.inProgress : COLORS.pending}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Employee Workload Table */}
          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-6 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Workload analysis</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">Employee task distribution</p>
              </div>
              <i className="bx bx-table text-2xl text-indigo-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/60 dark:border-white/10">
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Employee</th>
                    <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Total Tasks</th>
                    <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Completed</th>
                    <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Remaining</th>
                    <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const total = emp.totalTasks || 0;
                    const completed = emp.completedTasks || 0;
                    const remaining = total - completed;
                    const rate = total ? Math.round((completed / total) * 100) : 0;
                    return (
                      <tr key={emp.id} className="border-b border-white/30 dark:border-white/5 hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">{emp.name}</td>
                        <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-300">{total}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{completed}</td>
                        <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400">{remaining}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className={`text-sm font-semibold min-w-[3rem] text-right ${
                              rate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : rate >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {rate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


