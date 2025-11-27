const express = require('express');
const {
  listEmployees,
  handleCreateEmployee,
  handleUpdateEmployee,
  handleDeleteEmployee,
} = require('../controllers/employeesController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', listEmployees);
router.post('/', requireAdmin, handleCreateEmployee);
router.put('/:id', requireAdmin, handleUpdateEmployee);
router.delete('/:id', requireAdmin, handleDeleteEmployee);

module.exports = router;

