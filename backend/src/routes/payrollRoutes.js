const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Basic payroll routes
router.post('/calculate', payrollController.calculatePayroll);
router.get('/history', payrollController.getPayrollHistory);
router.get('/employee/:employeeId', payrollController.getEmployeePayroll);

// Dashboard statistics routes
router.get('/trends', payrollController.getPayrollTrends);
router.get('/stats/monthly', payrollController.getMonthlyPayrollStats);
router.get('/stats/department', payrollController.getDepartmentWisePayroll);
router.get('/stats/yearly', payrollController.getYearlyPayrollComparison);

module.exports = router;