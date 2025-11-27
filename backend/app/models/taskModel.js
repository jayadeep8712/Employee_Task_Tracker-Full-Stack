const { db } = require('../db');

const baseTaskSelect = `
  SELECT
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.due_date AS dueDate,
    t.employee_id AS employeeId,
    e.name AS employeeName
  FROM tasks t
  LEFT JOIN employees e ON e.id = t.employee_id
`;

function getTasks(filters = {}) {
  const conditions = [];
  const params = {};

  if (filters.status) {
    conditions.push('t.status = @status');
    params.status = filters.status;
  }
  if (filters.employeeId) {
    conditions.push('t.employee_id = @employeeId');
    params.employeeId = filters.employeeId;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `${baseTaskSelect} ${whereClause} ORDER BY t.due_date IS NULL, t.due_date, t.id`;
  return db.prepare(query).all(params);
}

function createTask(task) {
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, due_date, employee_id)
    VALUES (@title, @description, @status, @priority, @dueDate, @employeeId)
  `);
  const result = stmt.run({
    title: task.title,
    description: task.description || '',
    status: task.status || 'pending',
    priority: task.priority || 'medium',
    dueDate: task.dueDate || null,
    employeeId: task.employeeId || null,
  });
  return getTaskById(result.lastInsertRowid);
}

function updateTask(id, updates) {
  const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'employeeId'];
  const setFragments = [];
  const params = { id };

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      let column = field;
      if (field === 'dueDate') {
        column = 'due_date';
      } else if (field === 'employeeId') {
        column = 'employee_id';
      }
      setFragments.push(`${column} = @${field}`);
      params[field] = updates[field];
    }
  });

  if (!setFragments.length) {
    return getTaskById(id);
  }

  const stmt = db.prepare(`
    UPDATE tasks
    SET ${setFragments.join(', ')}
    WHERE id = @id
  `);
  const result = stmt.run(params);
  if (!result.changes) {
    return null;
  }
  return getTaskById(id);
}

function getTaskById(id) {
  return db.prepare(`${baseTaskSelect} WHERE t.id = ?`).get(id);
}

function deleteTask(id) {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

function getTaskSummary(employeeId = null) {
  const whereClause = employeeId ? 'WHERE employee_id = @employeeId' : '';
  const summary = db
    .prepare(
      `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgress,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
      FROM tasks
      ${whereClause}
    `
    )
    .get(employeeId ? { employeeId } : {});

  summary.completionRate = summary.total
    ? Math.round((summary.completed / summary.total) * 100)
    : 0;
  return summary;
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskSummary,
};

