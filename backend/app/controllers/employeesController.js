const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
} = require('../models/employeeModel');

function listEmployees(req, res, next) {
  try {
    const employees =
      req.user?.role === 'employee' && req.user.employeeId
        ? getAllEmployees(req.user.employeeId)
        : getAllEmployees();
    res.json({ data: employees });
  } catch (error) {
    next(error);
  }
}

function validateEmployeePayload(payload) {
  const errors = [];
  if (!payload.name) errors.push('name is required');
  if (!payload.role) errors.push('role is required');
  if (!payload.department) errors.push('department is required');
  if (!payload.email) errors.push('email is required');
  return errors;
}

function handleCreateEmployee(req, res, next) {
  try {
    const errors = validateEmployeePayload(req.body || {});
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    const employee = createEmployee(req.body);
    return res.status(201).json({ data: employee });
  } catch (error) {
    return next(error);
  }
}

function handleUpdateEmployee(req, res, next) {
  try {
    const employee = updateEmployee(Number(req.params.id), req.body || {});
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.json({ data: employee });
  } catch (error) {
    return next(error);
  }
}

function handleDeleteEmployee(req, res, next) {
  try {
    const exists = getEmployeeById(Number(req.params.id));
    if (!exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const deleted = deleteEmployee(exists.id);
    if (!deleted) {
      return res.status(500).json({ message: 'Unable to delete employee' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listEmployees,
  handleCreateEmployee,
  handleUpdateEmployee,
  handleDeleteEmployee,
};

