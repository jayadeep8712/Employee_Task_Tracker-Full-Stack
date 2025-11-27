const { db } = require('../db');

function getUserByEmail(email) {
  return db
    .prepare(
      `
      SELECT
        u.id,
        u.email,
        u.password_hash AS passwordHash,
        u.role,
        u.employee_id AS employeeId,
        e.name AS employeeName
      FROM users u
      LEFT JOIN employees e ON e.id = u.employee_id
      WHERE u.email = ?
    `
    )
    .get(email);
}

module.exports = {
  getUserByEmail,
};

