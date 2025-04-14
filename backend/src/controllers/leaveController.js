const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Calculate number of days
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Create leave application
    const leave = new Leave({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      days
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'firstName lastName department')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvalComments: comments,
        approvedBy: req.user.id,
        approvalDate: new Date()
      },
      { new: true }
    ).populate('employee', 'firstName lastName email');

    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const employeeId = req.params.employeeId;

    // Get all approved leaves for the current year
    const approvedLeaves = await Leave.find({
      employee: employeeId,
      status: 'approved',
      startDate: {
        $gte: new Date(currentYear, 0, 1),
        $lte: new Date(currentYear, 11, 31)
      }
    });

    // Calculate used leaves by type
    const usedLeaves = approvedLeaves.reduce((acc, leave) => {
      acc[leave.leaveType] = (acc[leave.leaveType] || 0) + leave.days;
      return acc;
    }, {});

    // Get leave policy (you might want to make this configurable)
    const leavePolicy = {
      annual: 20,
      sick: 10,
      casual: 5
    };

    // Calculate remaining balance
    const balance = {
      annual: leavePolicy.annual - (usedLeaves.annual || 0),
      sick: leavePolicy.sick - (usedLeaves.sick || 0),
      casual: leavePolicy.casual - (usedLeaves.casual || 0)
    };

    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopLeaveTakers = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const topLeaveTakers = await Leave.aggregate([
      {
        $match: {
          status: 'approved',
          startDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: '$employee',
          totalDays: { $sum: '$days' }
        }
      },
      {
        $sort: { totalDays: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeDetails'
        }
      },
      {
        $unwind: '$employeeDetails'
      },
      {
        $project: {
          _id: 1,
          totalDays: 1,
          firstName: '$employeeDetails.firstName',
          lastName: '$employeeDetails.lastName',
          department: '$employeeDetails.department'
        }
      }
    ]);

    res.json(topLeaveTakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaveCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const leaves = await Leave.find({
      status: 'approved',
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) }
    }).populate('employee', 'firstName lastName');

    const calendarEvents = leaves.map(leave => ({
      id: leave._id,
      title: `${leave.employee.firstName} ${leave.employee.lastName} - ${leave.leaveType}`,
      start: leave.startDate,
      end: leave.endDate,
      type: leave.leaveType
    }));

    res.json(calendarEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;