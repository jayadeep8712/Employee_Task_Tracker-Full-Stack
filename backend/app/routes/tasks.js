const express = require('express');
const {
  listTasks,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} = require('../controllers/tasksController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', listTasks);
router.post('/', requireAdmin, handleCreateTask);
router.put('/:id', requireAdmin, handleUpdateTask);
router.delete('/:id', requireAdmin, handleDeleteTask);

module.exports = router;

