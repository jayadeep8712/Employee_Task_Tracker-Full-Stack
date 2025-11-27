const { db } = require('../db');

function getAllEmployees(employeeId = null) {
  const stmt = db.prepare(`
    SELECT id, name, role, department, email
    FROM employees
    ${employeeId ? 'WHERE id = ?' : ''}
    ORDER BY name
  `);
  return employeeId ? stmt.all(employeeId) : stmt.all();
}

function getEmployeeTaskSummary(employeeId = null) {
  const whereClause = employeeId ? 'WHERE e.id = ?' : '';
  const stmt = db.prepare(`
    SELECT
      e.id,
      e.name,
      COUNT(t.id) AS totalTasks,
      SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completedTasks
    FROM employees e
    LEFT JOIN tasks t ON t.employee_id = e.id
    ${whereClause}
    GROUP BY e.id
    ORDER BY e.name
  `);
  return employeeId ? stmt.all(employeeId) : stmt.all();
}

function createEmployee(employee) {
  const stmt = db.prepare(`
    INSERT INTO employees (name, role, department, email)
    VALUES (@name, @role, @department, @email)
  `);
  const result = stmt.run(employee);
  return getEmployeeById(result.lastInsertRowid);
}

function updateEmployee(id, updates) {
  const fields = ['name', 'role', 'department', 'email'];
  const setFragments = [];
  const params = { id };

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      setFragments.push(`${field} = @${field}`);
      params[field] = updates[field];
    }
  });

  if (!setFragments.length) {
    return getEmployeeById(id);
  }

  const stmt = db.prepare(`
    UPDATE employees SET ${setFragments.join(', ')} WHERE id = @id
  `);
  const result = stmt.run(params);
  if (!result.changes) {
    return null;
  }
  return getEmployeeById(id);
}

function deleteEmployee(id) {
  const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

function getEmployeeById(id) {
  return db.prepare('SELECT id, name, role, department, email FROM employees WHERE id = ?').get(id);
}

module.exports = {
  getAllEmployees,
  getEmployeeTaskSummary,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
};

