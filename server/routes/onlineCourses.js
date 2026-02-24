const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all online course entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM online_courses WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new online course entry
router.post("/", (req, res) => {
  const {
    student_id,
    course_type,
    course_name,
    platform,
    duration_weeks,
    completion_date,
    certificate_number,
    proof_document,
  } = req.body;

  // Calculate marks based on rubrics
  let marks_awarded = 0;

  if (course_type === "mooc") {
    marks_awarded = 20;
  } else if (course_type === "nptel_4week") {
    marks_awarded = 40;
  } else if (course_type === "nptel_8week" || duration_weeks >= 8) {
    marks_awarded = 80;
  }

  const query = `
    INSERT INTO online_courses (
      student_id, course_type, course_name, platform,
      duration_weeks, completion_date, certificate_number, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      course_type,
      course_name,
      platform,
      duration_weeks,
      completion_date,
      certificate_number,
      proof_document,
      marks_awarded,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        marks_awarded,
        message: "Online course entry created successfully",
      });
    },
  );
});

// Update online course entry
router.put("/:id", (req, res) => {
  const {
    course_type,
    course_name,
    platform,
    duration_weeks,
    completion_date,
    certificate_number,
    proof_document,
  } = req.body;

  // Check if staff has evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM online_courses WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let marks_awarded;

      // If staff evaluated, preserve marks. Otherwise recalculate.
      if (row && row.staff_evaluated === 1) {
        marks_awarded = row.marks_awarded;
      } else {
        marks_awarded = 0;
        if (course_type === "mooc") {
          marks_awarded = 20;
        } else if (course_type === "nptel_4week") {
          marks_awarded = 40;
        } else if (course_type === "nptel_8week" || duration_weeks >= 8) {
          marks_awarded = 80;
        }
      }

      const query = `
        UPDATE online_courses 
        SET course_type = ?, course_name = ?, platform = ?,
            duration_weeks = ?, completion_date = ?, certificate_number = ?,
            proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          course_type,
          course_name,
          platform,
          duration_weeks,
          completion_date,
          certificate_number,
          proof_document,
          marks_awarded,
          req.params.id,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({
            marks_awarded,
            message: "Online course entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete online course entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM online_courses WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Online course entry deleted successfully" });
  });
});

module.exports = router;
