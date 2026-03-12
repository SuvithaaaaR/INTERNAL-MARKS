require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, "../database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = require("./database");

// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const communityServiceRoutes = require("./routes/communityService");
const patentRoutes = require("./routes/patents");
const scopusRoutes = require("./routes/scopus");
const projectCompRoutes = require("./routes/projectCompetitions");
const hackathonRoutes = require("./routes/hackathons");
const workshopRoutes = require("./routes/workshops");
const onlineCourseRoutes = require("./routes/onlineCourses");
const entrepreneurshipRoutes = require("./routes/entrepreneurship");
const codingPlatformRoutes = require("./routes/codingPlatforms");
const minorProjectRoutes = require("./routes/minorProjects");
const calculationRoutes = require("./routes/calculations");
const staffEvaluationRoutes = require("./routes/staffEvaluation");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/community-service", communityServiceRoutes);
app.use("/api/patents", patentRoutes);
app.use("/api/scopus", scopusRoutes);
app.use("/api/project-competitions", projectCompRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/online-courses", onlineCourseRoutes);
app.use("/api/entrepreneurship", entrepreneurshipRoutes);
app.use("/api/coding-platforms", codingPlatformRoutes);
app.use("/api/minor-projects", minorProjectRoutes);
app.use("/api/calculations", calculationRoutes);
app.use("/api/staff-evaluation", staffEvaluationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is in use, trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Server is running on port ${PORT + 1}`);
    });
  } else {
    console.error("Server error:", err);
  }
});

module.exports = app;
