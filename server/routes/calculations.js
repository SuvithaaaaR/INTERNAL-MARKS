const express = require("express");
const router = express.Router();
const db = require("../database");

// Calculate total marks for a student
router.get("/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const calculations = {};

  // Helper function to get sum of marks from a table
  const getMarksSum = (table) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COALESCE(SUM(marks_awarded), 0) as total FROM ${table} WHERE student_id = ?`;
      db.get(query, [studentId], (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });
  };

  // Helper function to get all entries from a table
  const getEntries = (table) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE student_id = ?`;
      db.all(query, [studentId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  Promise.all([
    getMarksSum("community_service"),
    getMarksSum("patent_filing"),
    getMarksSum("scopus_papers"),
    getMarksSum("project_competitions"),
    getMarksSum("hackathons"),
    getMarksSum("workshops_seminars"),
    getMarksSum("online_courses"),
    getMarksSum("entrepreneurship"),
    getMarksSum("coding_platforms"),
    getMarksSum("minor_projects"),
    getEntries("community_service"),
    getEntries("patent_filing"),
    getEntries("scopus_papers"),
    getEntries("project_competitions"),
    getEntries("hackathons"),
    getEntries("workshops_seminars"),
    getEntries("online_courses"),
    getEntries("entrepreneurship"),
    getEntries("coding_platforms"),
    getEntries("minor_projects"),
  ])
    .then((results) => {
      const [
        communityService,
        patentFiling,
        scopusPapers,
        projectCompetitions,
        hackathons,
        workshops,
        onlineCourses,
        entrepreneurship,
        codingPlatforms,
        minorProjects,
        communityServiceEntries,
        patentFilingEntries,
        scopusPapersEntries,
        projectCompetitionsEntries,
        hackathonsEntries,
        workshopsEntries,
        onlineCoursesEntries,
        entrepreneurshipEntries,
        codingPlatformsEntries,
        minorProjectsEntries,
      ] = results;

      // Apply caps
      const cappedCommunityService = Math.min(communityService, 40);
      const cappedWorkshops = Math.min(workshops, 20);
      const cappedOnlineCourses = Math.min(onlineCourses, 80);
      const cappedCodingPlatforms = Math.min(codingPlatforms, 120);
      const cappedMinorProjects = Math.min(minorProjects, 160);

      // Full FA marks (240) - only highest one counts
      const fullFAMarks = Math.max(
        patentFiling > 0 ? 240 : 0,
        scopusPapers > 0 ? 240 : 0,
        projectCompetitions >= 160 ? 240 : projectCompetitions,
        hackathons >= 240 ? 240 : hackathons,
        entrepreneurship > 0 ? 240 : 0,
      );

      const totalMarks =
        cappedCommunityService +
        fullFAMarks +
        cappedWorkshops +
        cappedOnlineCourses +
        cappedCodingPlatforms +
        cappedMinorProjects;

      res.json({
        studentId,
        breakdown: {
          communityService: {
            total: communityService,
            capped: cappedCommunityService,
            cap: 40,
            entries: communityServiceEntries,
          },
          patentFiling: {
            total: patentFiling,
            entries: patentFilingEntries,
          },
          scopusPapers: {
            total: scopusPapers,
            entries: scopusPapersEntries,
          },
          projectCompetitions: {
            total: projectCompetitions,
            entries: projectCompetitionsEntries,
          },
          hackathons: {
            total: hackathons,
            entries: hackathonsEntries,
          },
          fullFAMarks: {
            total: fullFAMarks,
            description:
              "Highest from Patent/Scopus/Major Competition/Major Hackathon/Entrepreneurship",
          },
          workshops: {
            total: workshops,
            capped: cappedWorkshops,
            cap: 20,
            entries: workshopsEntries,
          },
          onlineCourses: {
            total: onlineCourses,
            capped: cappedOnlineCourses,
            cap: 80,
            entries: onlineCoursesEntries,
          },
          entrepreneurship: {
            total: entrepreneurship,
            entries: entrepreneurshipEntries,
          },
          codingPlatforms: {
            total: codingPlatforms,
            capped: cappedCodingPlatforms,
            cap: 120,
            entries: codingPlatformsEntries,
          },
          minorProjects: {
            total: minorProjects,
            capped: cappedMinorProjects,
            cap: 160,
            entries: minorProjectsEntries,
          },
        },
        totalMarks,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get summary report
router.get("/report/summary", (req, res) => {
  const query = `
    SELECT 
      s.id,
      s.student_name,
      s.roll_number,
      s.semester,
      s.department,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM community_service WHERE student_id = s.id) as community_service_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM patent_filing WHERE student_id = s.id) as patent_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM scopus_papers WHERE student_id = s.id) as scopus_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM project_competitions WHERE student_id = s.id) as competition_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM hackathons WHERE student_id = s.id) as hackathon_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM workshops_seminars WHERE student_id = s.id) as workshop_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM online_courses WHERE student_id = s.id) as course_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM entrepreneurship WHERE student_id = s.id) as entrepreneurship_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM coding_platforms WHERE student_id = s.id) as coding_marks,
      (SELECT COALESCE(SUM(marks_awarded), 0) FROM minor_projects WHERE student_id = s.id) as project_marks
    FROM students s
    ORDER BY s.student_name
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const report = rows.map((row) => {
      const fullFAMarks = Math.max(
        row.patent_marks > 0 ? 240 : 0,
        row.scopus_marks > 0 ? 240 : 0,
        row.competition_marks >= 160 ? 240 : row.competition_marks,
        row.hackathon_marks >= 240 ? 240 : row.hackathon_marks,
        row.entrepreneurship_marks > 0 ? 240 : 0,
      );

      const totalMarks =
        Math.min(row.community_service_marks, 40) +
        fullFAMarks +
        Math.min(row.workshop_marks, 20) +
        Math.min(row.course_marks, 80) +
        Math.min(row.coding_marks, 120) +
        Math.min(row.project_marks, 160);

      return {
        ...row,
        full_fa_marks: fullFAMarks,
        total_marks: totalMarks,
      };
    });

    res.json(report);
  });
});

module.exports = router;
