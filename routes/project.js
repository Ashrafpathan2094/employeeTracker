const express = require("express");
const { createProject } = require("../controllers/project");

const router = express.Router();

router.post("/", createProject);

module.exports = router;
