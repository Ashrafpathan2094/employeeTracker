const Department = require("../models/department");

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    const newDept = new Department({
      name,
    });

    const savedDepartment = await newDept.save();

    return res.status(201).json({
      message: "Department created successfully",
      department: savedDepartment,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};
