const express = require("express");
const router = express.Router();
const db = require("../database");

const ALLOWED_COMPONENT_KEYS = new Set([
  "communityService",
  "fullFAMarks",
  "workshops",
  "onlineCourses",
  "codingPlatforms",
  "minorProjects",
]);

router.get("/:studentId", (req, res) => {
  const query = `
    SELECT component_key, course_code, updated_at
    FROM internal_course_mappings
    WHERE student_id = ?
    ORDER BY component_key
  `;

  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

router.put("/:studentId", (req, res) => {
  const { componentKey, courseCode } = req.body;

  if (!ALLOWED_COMPONENT_KEYS.has(componentKey)) {
    return res.status(400).json({
      error: "Invalid component key",
    });
  }

  const normalizedCourseCode =
    typeof courseCode === "string" ? courseCode.trim().toUpperCase() : "";

  if (!normalizedCourseCode) {
    db.run(
      "DELETE FROM internal_course_mappings WHERE student_id = ? AND component_key = ?",
      [req.params.studentId, componentKey],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          message: "Mapping removed successfully",
          changes: this.changes,
        });
      },
    );
    return;
  }

  const query = `
    INSERT INTO internal_course_mappings (
      student_id,
      component_key,
      course_code,
      updated_at
    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(student_id, component_key)
    DO UPDATE SET
      course_code = excluded.course_code,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(
    query,
    [req.params.studentId, componentKey, normalizedCourseCode],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: "Mapping saved successfully",
        component_key: componentKey,
        course_code: normalizedCourseCode,
      });
    },
  );
});

module.exports = router;
