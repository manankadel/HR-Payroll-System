const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Basic CRUD routes
router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Dashboard statistics routes
router.get('/stats/department', employeeController.getDepartmentStats);
router.get('/stats/general', employeeController.getEmployeeStats);
router.get('/stats/leaves', employeeController.getEmployeeLeaves);
router.get('/stats/salary', employeeController.getSalaryStats);

module.exports = router;