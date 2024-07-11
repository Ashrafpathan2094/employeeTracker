const { ObjectId } = require("mongodb");
const { employeeAddSchema } = require("../joiSchemas/employeeSchema");
const Employee = require("../models/employee");

exports.createEmployee = async (req, res) => {
  try {
    const { error, value } = employeeAddSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(403).json({ error: error.message });
    }

    const { firstName, lastName, age, onBoardDate, departmentId } = req.body;

    const newEmployee = new Employee({
      firstName,
      lastName,
      age,
      onBoardDate,
      departmentId,
    });

    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      message: "Employee created successfully",
      employee: savedEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

exports.getAllEmployee = async (req, res) => {
  try {
    let matchStage = {
      deleted: false,
    };

    let lookupStage = {
      $lookup: {
        from: "employeetrackprojects",
        let: { empId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$employeeId", "$$empId"] },
            },
          },
          {
            $lookup: {
              from: "projects",
              localField: "projectId",
              foreignField: "_id",
              as: "projectDetails",
            },
          },
          {
            $project: {
              projectId: 1,
              joined: 1,
              exit: 1,
              project: { $arrayElemAt: ["$projectDetails", 0] },
            },
          },
          { $unset: "projectDetails" },
        ],
        as: "projects",
      },
    };

    if (req.query.employeeId) {
      matchStage.employeeId = req.query.employeeId;
    }

    let searchQuery = req.query.searchQuery;
    if (searchQuery) {
      let regex = new RegExp(searchQuery, "i");
      matchStage.$or = [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { employeeId: { $regex: regex } },
      ];
    }

    const employees = await Employee.aggregate([
      { $match: matchStage },
      lookupStage,
      {
        $lookup: {
          from: "departments",
          localField: "departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          age: 1,
          employeeId: 1,
          onBoardDate: 1,
          deleted: 1,
          department: { $arrayElemAt: ["$department", 0] },
          projects: 1,
        },
      },
    ]);

    res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEmployeeByDept = async (req, res) => {
  try {
    const departmentId = req.query.departmentId;

    if (!departmentId) {
      return res
        .status(400)
        .json({ error: "departmentId parameter is required" });
    }

    // Convert departmentId from string to ObjectId
    // const departmentObjectId = mongoose.Types.ObjectId(departmentId);

    const employees = await Employee.aggregate([
      {
        $match: {
          $match: { deleted: false },
          departmentId: new ObjectId(departmentId),
        },
      },
      {
        $lookup: {
          from: "departments", // Collection name for Department model
          localField: "departmentId",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          age: 1,
          employeeId: 1,
          onBoardDate: 1,
          deleted: 1,
          department: { $arrayElemAt: ["$department", 0] },
        },
      },
    ]);

    res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAvgAge = async (req, res) => {
  try {
    const results = await Employee.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: "$departmentId",
          totalAge: { $sum: "$age" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $project: {
          _id: 1,
          departmentName: { $arrayElemAt: ["$department.name", 0] },
          averageAge: { $divide: ["$totalAge", "$count"] },
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Error fetching department ages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { userId } = req.body;

  try {
    const employee = await Employee.findByIdAndUpdate(
      userId,
      { deleted: true },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
