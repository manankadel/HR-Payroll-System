const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');

// Protect all routes
router.use(auth);

// Leave application routes
router.post('/apply', leaveController.applyLeave);
router.get('/', leaveController.getAllLeaves);
router.get('/employee/:employeeId', leaveController.getEmployeeLeaves);
router.put('/:id/status', leaveController.updateLeaveStatus);

// Leave balance and statistics
router.get('/balance/:employeeId', leaveController.getLeaveBalance);
router.get('/top-takers', leaveController.getTopLeaveTakers);
router.get('/calendar', leaveController.getLeaveCalendar);

module.exports = router;