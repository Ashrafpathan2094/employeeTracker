const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProjectsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      unique: true,
      index: true,
    },
    startedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ProjectsSchema.pre("save", async function (next) {
  if (!this.projectId) {
    try {
      const lastProject = await this.constructor.findOne(
        {},
        {},
        { sort: { projectId: -1 } }
      );
      if (lastProject) {
        const lastEmployeeId = parseInt(
          lastProject.projectId.replace("PROJ", "")
        );
        this.projectId = `PROJ${String(lastEmployeeId + 1).padStart(3, "0")}`;
      } else {
        this.projectId = "PROJ001";
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("projects", ProjectsSchema);
