const express = require('express');
const router = express.Router();

const {
  createTask,
  getClientTasks,
  updateTask,
  getAppliedTasks,
  getCompletedTasks,
  getClientCompletedTasks,
} = require('../controller/taskController');

/* Register User Route */
router.route('/create').post(createTask);
router.route('/all').post(getClientTasks);
router.route('/all-completed').post(getClientCompletedTasks);
router.route('/update').post(updateTask);
router.route('/applied-tasks').post(getAppliedTasks);
router.route('/completed-tasks').post(getCompletedTasks);

module.exports = router;
