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
      processedBy: req.user.id,
      status: 'processed',
      processedDate: new Date()
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
      .populate('processedBy', 'username')
      .sort({ processedDate: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeePayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName')
      .populate('processedBy', 'username')
      .sort({ processedDate: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayrollTrends = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const payrollTrends = await Payroll.aggregate([
      {
        $match: {
          processedDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$processedDate" },
            month: { $month: "$processedDate" }
          },
          totalAmount: { $sum: "$netSalary" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month"
                }
              }
            }
          },
          totalAmount: 1,
          count: 1
        }
      }
    ]);
    res.json({ data: payrollTrends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyPayrollStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const monthlyStats = await Payroll.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear
        }
      },
      {
        $group: {
          _id: null,
          totalPayroll: { $sum: "$netSalary" },
          totalAllowances: { $sum: "$allowances" },
          totalDeductions: { $sum: "$deductions" },
          processedCount: { $sum: 1 }
        }
      }
    ]);

    const employeeCount = await Employee.countDocuments();

    res.json({
      stats: monthlyStats[0] || {
        totalPayroll: 0,
        totalAllowances: 0,
        totalDeductions: 0,
        processedCount: 0
      },
      totalEmployees: employeeCount,
      pendingCount: employeeCount - (monthlyStats[0]?.processedCount || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDepartmentWisePayroll = async (req, res) => {
  try {
    const departmentPayroll = await Payroll.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employee',
          foreignField: '_id',
          as: 'employeeData'
        }
      },
      {
        $unwind: '$employeeData'
      },
      {
        $group: {
          _id: '$employeeData.department',
          totalSalary: { $sum: '$netSalary' },
          employeeCount: { $sum: 1 }
        }
      },
      {
        $project: {
          department: '$_id',
          totalSalary: 1,
          employeeCount: 1,
          averageSalary: { $divide: ['$totalSalary', '$employeeCount'] }
        }
      }
    ]);

    res.json({ data: departmentPayroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getYearlyPayrollComparison = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearlyComparison = await Payroll.aggregate([
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month'
          },
          totalAmount: { $sum: '$netSalary' }
        }
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': 1
        }
      }
    ]);

    res.json({ data: yearlyComparison });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;