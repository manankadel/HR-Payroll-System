const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDepartmentStats = async (req, res) => {
  try {
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          value: { $sum: 1 },
          totalSalary: { $sum: "$salary" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
          totalSalary: 1
        }
      }
    ]);
    res.json({ data: departmentStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalSalary = await Employee.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$salary" }
        }
      }
    ]);

    const recentJoinees = await Employee.find()
      .sort({ joiningDate: -1 })
      .limit(5);

    const departmentWiseCount = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalEmployees,
      totalSalary: totalSalary[0]?.total || 0,
      recentJoinees,
      departmentWiseCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeLeaves = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const leaveStats = await Employee.aggregate([
      {
        $lookup: {
          from: 'leaves',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'leaves'
        }
      },
      {
        $project: {
          name: { $concat: ["$firstName", " ", "$lastName"] },
          totalLeaves: {
            $size: {
              $filter: {
                input: "$leaves",
                as: "leave",
                cond: {
                  $and: [
                    { $eq: [{ $month: "$$leave.startDate" }, currentMonth] },
                    { $eq: [{ $year: "$$leave.startDate" }, currentYear] }
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    res.json({ data: leaveStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSalaryStats = async (req, res) => {
  try {
    const salaryStats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          averageSalary: { $avg: "$salary" },
          highestSalary: { $max: "$salary" },
          lowestSalary: { $min: "$salary" },
          totalSalary: { $sum: "$salary" }
        }
      }
    ]);

    const salaryRanges = await Employee.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$salary", 30000] }, then: "0-30k" },
                { case: { $lte: ["$salary", 50000] }, then: "30k-50k" },
                { case: { $lte: ["$salary", 80000] }, then: "50k-80k" },
              ],
              default: "80k+"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: salaryStats[0],
      salaryRanges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;