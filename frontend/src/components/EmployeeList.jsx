import React, { useState, useEffect, useMemo } from 'react';
import Pagination from './Pagination';

const EmployeeList = ({
  employees,
  statusFilter,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  searchQuery,
  sortBy,
  sortOrder,
  canManage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter tasks based on selected status
  const filterTasks = (tasks) => {
    if (statusFilter === 'All') return tasks;
    return tasks.filter(task => task.status === statusFilter);
  };

  // Get status badge styling - matching app theme
  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 dark:border-orange-500/20',
      'In Progress': 'bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 dark:border-sky-500/20',
      'Completed': 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/20'
    };
    return styles[status] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'bx-time-five',
      'In Progress': 'bx-loader-circle',
      'Completed': 'bx-check-circle'
    };
    return icons[status] || 'bx-task';
  };

  // Get priority badge styling - matching app theme
  const getPriorityBadge = (priority) => {
    const styles = {
      'High': 'bg-gradient-to-r from-rose-500/15 to-orange-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 dark:border-rose-500/20',
      'Medium': 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 dark:border-amber-500/20',
      'Low': 'bg-gradient-to-r from-sky-500/15 to-indigo-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 dark:border-sky-500/20'
    };
    return styles[priority] || 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20';
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Filter and search tasks
  const filterAndSearchTasks = (tasks) => {
    let filtered = filterTasks(tasks);
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filtered;
  };

  // Sort tasks
  const sortTasks = (tasks) => {
    if (!sortBy || sortBy === 'employee' || !tasks.length) {
      return tasks;
    }
    
    const sorted = [...tasks];
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'title':
          aValue = (a.title || '').toLowerCase().trim();
          bValue = (b.title || '').toLowerCase().trim();
          break;
        case 'status':
          const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Completed': 3 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  let filteredEmployees = employees.map(emp => ({
    ...emp,
    tasks: sortTasks(filterAndSearchTasks(emp.tasks))
  })).filter(emp => emp.tasks.length > 0);

  if (sortBy === 'employee') {
    filteredEmployees = filteredEmployees.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) return sortOrder === 'asc' ? -1 : 1;
      if (aName > bName) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic
  const totalItems = filteredEmployees.reduce((sum, emp) => sum + emp.tasks.length, 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Flatten all tasks for pagination
  const allTasks = useMemo(() => {
    return filteredEmployees.flatMap(emp => 
      emp.tasks.map(task => ({ ...task, employeeId: emp.id, employeeName: emp.name, employeeRole: emp.role }))
    );
  }, [filteredEmployees]);

  const paginatedTasks = useMemo(() => {
    return allTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [allTasks, startIndex, itemsPerPage]);

  // Group paginated tasks by employee
  const paginatedEmployees = useMemo(() => {
    const grouped = {};
    paginatedTasks.forEach(task => {
      if (!grouped[task.employeeId]) {
        grouped[task.employeeId] = {
          id: task.employeeId,
          name: task.employeeName,
          role: task.employeeRole,
          tasks: []
        };
      }
      grouped[task.employeeId].tasks.push(task);
    });
    return Object.values(grouped);
  }, [paginatedTasks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, sortBy, sortOrder]);

  // Adjust current page when itemsPerPage changes
  useEffect(() => {
    const newTotalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [itemsPerPage, totalItems, currentPage]);

  if (filteredEmployees.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-white/60 dark:border-white/10 shadow-xl backdrop-blur-xl p-12 text-center">
        <i className='bx bx-search-alt-2 text-5xl text-slate-300 dark:text-slate-600 mb-4'></i>
        <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">No tasks found</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {paginatedEmployees.map(employee => (
          <div
            key={employee.id}
            className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-white/60 dark:border-white/10 shadow-lg backdrop-blur-xl p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* Employee Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/60 dark:border-white/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-500/20">
                    {employee.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {employee.name}
                  </h3>
                  <div className="flex items-center mt-1 space-x-1.5">
                    <i className='bx bx-briefcase text-xs text-sky-500 dark:text-sky-400'></i>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{employee.role}</p>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 dark:from-sky-500/20 dark:to-indigo-500/20 text-sky-700 dark:text-sky-300 rounded-xl text-sm font-semibold border border-sky-500/20 dark:border-sky-500/20">
                <i className='bx bx-task mr-1.5'></i>
                {employee.tasks.length} {employee.tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {employee.tasks.map(task => (
                <div
                  key={task.id}
                  className="group p-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/60 dark:border-white/10 hover:border-sky-500/30 dark:hover:border-sky-500/20 hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-white/60 dark:bg-slate-500/20 flex items-center justify-center shadow-xl/30 ${
                          task.status === 'Pending' ? 'text-orange-500' :
                          task.status === 'In Progress' ? 'text-blue-500' :
                          'text-green-500'
                        }`}>
                          <i className={`bx ${getStatusIcon(task.status)} text-lg`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                              {task.title}
                            </h4>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(task.status)} flex items-center whitespace-nowrap`}>
                              <i className={`bx ${getStatusIcon(task.status)} mr-1 text-xs`}></i>
                              {task.status}
                            </span>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {task.priority && (
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                                <i className={`bx ${
                                  task.priority === 'High' ? 'bx-error-circle' :
                                  task.priority === 'Medium' ? 'bx-minus-circle' :
                                  'bx-check-circle'
                                } mr-1`}></i>
                                {task.priority}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center ${
                                isOverdue(task.dueDate) 
                                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}>
                                <i className='bx bx-calendar mr-1'></i>
                                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {isOverdue(task.dueDate) && <i className='bx bx-error-circle ml-1'></i>}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {canManage && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTask(task, employee.id)}
                          className="p-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                          title="Edit task"
                        >
                          <i className='bx bx-edit text-lg'></i>
                        </button>
                        <button
                          onClick={() => onStatusChange(task.id)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Change status"
                        >
                          <i className='bx bx-refresh text-lg'></i>
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id, employee.id, task.title)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <i className='bx bx-trash text-lg'></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </>
  );
};

export default EmployeeList;
