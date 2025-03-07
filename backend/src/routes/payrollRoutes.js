const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/auth');

router.use(auth); // Protect all routes

router.post('/calculate', payrollController.calculatePayroll);
router.get('/history', payrollController.getPayrollHistory);
router.get('/employee/:employeeId', payrollController.getEmployeePayroll);

module.exports = router;