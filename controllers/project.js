const Project = require("../models/project");

exports.createProject = async (req, res) => {
  try {
    const { name, startedOn } = req.body;

    const newProject = new Project({ name, startedOn });

    const savedProject = await newProject.save();

    return res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};
