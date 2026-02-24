const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all project competition entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM project_competitions WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new project competition entry
router.post("/", (req, res) => {
  const {
    student_id,
    competition_type,
    competition_name,
    institution_name,
    nirf_rank,
    result,
    industry_level,
    date_participated,
    proof_document,
  } = req.body;

  // Calculate marks based on rubrics
  let marks_awarded = 0;

  if (result === "won") {
    marks_awarded = 80;
  } else if (industry_level >= 3 && industry_level <= 5) {
    marks_awarded = 100; // Project Development and implementation with Industry (Level 3-5)
  } else if (competition_type === "participation" && nirf_rank <= 300) {
    marks_awarded = 40;
  }

  const query = `
    INSERT INTO project_competitions (
      student_id, competition_type, competition_name, institution_name,
      nirf_rank, result, industry_level, date_participated, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      competition_type,
      competition_name,
      institution_name,
      nirf_rank,
      result,
      industry_level,
      date_participated,
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
        message: "Project competition entry created successfully",
      });
    },
  );
});

// Update project competition entry
router.put("/:id", (req, res) => {
  const {
    competition_type,
    competition_name,
    institution_name,
    nirf_rank,
    result,
    industry_level,
    date_participated,
    proof_document,
  } = req.body;

  // Check if staff has evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM project_competitions WHERE id = ?",
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
        if (competition_type === "participation" && nirf_rank <= 300) {
          marks_awarded = 40;
        } else if (result === "won") {
          marks_awarded = 80;
        } else if (industry_level >= 3 && industry_level <= 5) {
          marks_awarded = 160;
        }
      }

      const query = `
        UPDATE project_competitions 
        SET competition_type = ?, competition_name = ?, institution_name = ?,
            nirf_rank = ?, result = ?, industry_level = ?, date_participated = ?,
            proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          competition_type,
          competition_name,
          institution_name,
          nirf_rank,
          result,
          industry_level,
          date_participated,
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
            message: "Project competition entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete project competition entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM project_competitions WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Project competition entry deleted successfully" });
  });
});

module.exports = router;
