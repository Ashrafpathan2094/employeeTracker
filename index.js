const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Employee = require("./routes/employee.js");
const department = require("./routes/department.js");
const project = require("./routes/project");
const multer = require("multer");
const employeeTrackProject = require("./routes/employeeTrackProject.js");
const mongoString =
  "mongodb://Stark:Stark2094@ac-fjtscrl-shard-00-00.95ghcza.mongodb.net:27017,ac-fjtscrl-shard-00-01.95ghcza.mongodb.net:27017,ac-fjtscrl-shard-00-02.95ghcza.mongodb.net:27017/?ssl=true&replicaSet=atlas-11x3jt-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoString);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log("Database Connection Error");
  console.log(error);
});

database.once("connected", () => {
  console.log("Connected to DataBase");
});
const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).json({ error: "Invalid JSON" });
  } else {
    next(err);
  }
});

app.get("/", (req, res) => {
  const response = {
    message: "Server is working!",
  };

  res.json(response);
});

const upload = multer({ dest: "../uploads" });

app.post("/upload", upload.single("file"), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) return res.status(500).json({ error: "File upload failed" });

    res
      .status(200)
      .json({ message: "File uploaded successfully", filePath: targetPath });
  });
});
app.listen(3000, () => {
  console.log(`Server started at Port ${3000}`);
});

app.use("/employees", Employee);
app.use("/project", project);
app.use("/department", department);
app.use("/employeeTrackProject", employeeTrackProject);
