const express = require("express");
const {
  createEmployee,
  getAllEmployee,
  getEmployeeByDept,
  getAvgAge,
  deleteEmployee,
} = require("../controllers/employee");

const router = express.Router();

router.post("/", createEmployee);
router.post("/delete", deleteEmployee);

router.get("/", getAllEmployee);
router.get("/getByDept", getEmployeeByDept);
router.get("/getAvgAge", getAvgAge);

module.exports = router;
