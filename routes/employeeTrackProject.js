const express = require("express");
const {
  createEmployeeTrackProject,
  getCurrentWorkingProject,
  getEmployeesInPeriod,
} = require("../controllers/employee_track_project");

const router = express.Router();

router.post("/", createEmployeeTrackProject);
router.get("/", getCurrentWorkingProject);
router.get("/bydates", getEmployeesInPeriod);

module.exports = router;
