const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    departmentId: {
      type: String,
      unique: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

DepartmentSchema.pre("save", async function (next) {
  if (!this.departmentId) {
    try {
      const lastDepartment = await this.constructor.findOne(
        {},
        {},
        { sort: { departmentId: -1 } }
      );
      if (lastDepartment) {
        const lastEmployeeId = parseInt(
          lastDepartment.departmentId.replace("DEPT", "")
        );
        this.departmentId = `DEPT${String(lastEmployeeId + 1).padStart(
          3,
          "0"
        )}`;
      } else {
        this.departmentId = "DEPT001";
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("department", DepartmentSchema);
