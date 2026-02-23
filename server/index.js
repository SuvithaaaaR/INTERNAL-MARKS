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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
