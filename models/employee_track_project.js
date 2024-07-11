const mongoose = require("mongoose");

const EmployeeTrackProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    joined: {
      type: Date,
      default: Date.now,
      required: true,
    },
    exit: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmployeeTrackProject",
  EmployeeTrackProjectSchema
);
