const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

exports.calculatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, allowances, deductions } = req.body;

    // Get employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate net salary
    const basicSalary = employee.salary;
    const totalAllowances = allowances || 0;
    const totalDeductions = deductions || 0;
    const netSalary = basicSalary + totalAllowances - totalDeductions;

    // Create payroll record
    const payroll = new Payroll({
      employee: employeeId,
      month,
      year,
      basicSalary,
      allowances: totalAllowances,
      deductions: totalDeductions,
      netSalary,
      processedBy: req.user.id
    });

    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPayrollHistory = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('employee', 'firstName lastName')
      .populate('processedBy', 'username');
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeePayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName')
      .populate('processedBy', 'username');
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};