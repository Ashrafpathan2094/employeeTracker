const mongoose = require("mongoose");

const EmployeesSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    employeeId: {
      type: String, // Change type to String
      unique: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    onBoardDate: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

EmployeesSchema.pre("save", async function (next) {
  if (!this.employeeId) {
    try {
      const lastEmployee = await this.constructor.findOne(
        {},
        {},
        { sort: { employeeId: -1 } }
      );
      if (lastEmployee) {
        const lastEmployeeId = parseInt(
          lastEmployee.employeeId.replace("EMP", "")
        );
        this.employeeId = `EMP${String(lastEmployeeId + 1).padStart(3, "0")}`;
      } else {
        this.employeeId = "EMP001";
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Employee", EmployeesSchema);
