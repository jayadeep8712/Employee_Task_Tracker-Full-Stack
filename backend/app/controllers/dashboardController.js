const { getTaskSummary } = require('../models/taskModel');
const { getEmployeeTaskSummary } = require('../models/employeeModel');

function getDashboard(req, res, next) {
  try {
    const employeeId = req.user?.role === 'employee' ? req.user.employeeId : null;
    const stats = getTaskSummary(employeeId);
    const employees = getEmployeeTaskSummary(employeeId);
    res.json({
      data: {
        stats,
        employees,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };

