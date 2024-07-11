const express = require("express");
const { ObjectId } = require("mongodb");
const EmployeeTrackProject = require("../models/employee_track_project");
const {
  employeeTrackProjectSchema,
} = require("../joiSchemas/employeeTrackSchema");

// POST /api/employee_track_project/create
exports.createEmployeeTrackProject = async (req, res) => {
  const { error, value } = employeeTrackProjectSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(403).json({ error: error.message });
  }
  const { projectId, employeeId, joined, exit } = req.body;

  try {
    const trackProject = new EmployeeTrackProject({
      projectId,
      employeeId,
      joined,
      exit,
    });

    await trackProject.save();

    res.status(201).json({
      message: "Employee track project created successfully",
      trackProject,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCurrentWorkingProject = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    if (!projectId) {
      return res.status(400).json({ error: "projectId parameter is required" });
    }

    const employees = await EmployeeTrackProject.aggregate([
      {
        $match: {
          projectId: projectId,
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "projectId",
          as: "projectlook",
        },
      },
      {
        $unwind: "$projectlook",
      },
      {
        $project: {
          _id: "$employee._id",
          firstName: "$employee.firstName",
          lastName: "$employee.lastName",
          age: "$employee.age",
          onBoardDate: "$employee.onBoardDate",
          projectName: "$projectlook.name",
          joined: 1,
          exit: 1,
          projectId: 1,
        },
      },
    ]);

    res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEmployeesInPeriod = async (req, res) => {
  try {
    const { projectId, startDate, endDate } = req.query;

    console.log("req.query", req.query);
    // Validate required parameters
    if (!projectId || !startDate || !endDate) {
      return res.status(400).json({
        error: "projectId, startDate, and endDate parameters are required",
      });
    }

    const employees = await EmployeeTrackProject.aggregate([
      {
        $match: {
          projectId: projectId,
          joined: { $lte: new Date(endDate) }, // Employees who joined before or on endDate
          exit: { $gte: new Date(startDate) }, // Employees who exited after or on startDate
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          employeeId: "$employee._id",
          firstName: "$employee.firstName",
          lastName: "$employee.lastName",
          age: "$employee.age",
          onBoardDate: "$employee.onBoardDate",
          projectName: "$project.name",
          joined: 1,
          exit: 1,
          projectId: 1,
        },
      },
    ]);

    res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
