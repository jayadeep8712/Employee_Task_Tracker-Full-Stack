const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../models/taskModel');

const allowedStatuses = ['pending', 'in_progress', 'completed'];
const allowedPriorities = ['low', 'medium', 'high'];

function listTasks(req, res, next) {
  try {
    const { status, employeeId } = req.query;
    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (employeeId) {
      filters.employeeId = Number(employeeId);
    }
    if (req.user?.role === 'employee') {
      filters.employeeId = req.user.employeeId;
    }
    const tasks = getTasks(filters);
    res.json({ data: tasks });
  } catch (error) {
    next(error);
  }
}

function validateTaskPayload(payload, isUpdate = false) {
  const errors = [];
  if (!isUpdate || payload.title) {
    if (!payload.title || typeof payload.title !== 'string') {
      errors.push('title is required');
    }
  }
  if (payload.status && !allowedStatuses.includes(payload.status)) {
    errors.push(`status must be one of ${allowedStatuses.join(', ')}`);
  }
  if (payload.priority && !allowedPriorities.includes(payload.priority)) {
    errors.push(`priority must be one of ${allowedPriorities.join(', ')}`);
  }
  if (payload.employeeId && Number.isNaN(Number(payload.employeeId))) {
    errors.push('employeeId must be numeric');
  }
  return errors;
}

function handleCreateTask(req, res, next) {
  try {
    const errors = validateTaskPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    const task = createTask({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      employeeId: req.body.employeeId ? Number(req.body.employeeId) : null,
    });
    return res.status(201).json({ data: task });
  } catch (error) {
    return next(error);
  }
}

function handleUpdateTask(req, res, next) {
  try {
    const updates = req.body || {};
    const errors = validateTaskPayload(updates, true);
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    const task = updateTask(Number(req.params.id), updates);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json({ data: task });
  } catch (error) {
    return next(error);
  }
}

function handleDeleteTask(req, res, next) {
  try {
    const deleted = deleteTask(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTasks,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
};

