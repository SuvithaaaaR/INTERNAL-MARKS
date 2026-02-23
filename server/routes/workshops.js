const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all workshop/seminar entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM workshops_seminars WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new workshop/seminar entry
router.post("/", (req, res) => {
  const {
    student_id,
    event_type,
    event_name,
    institution_name,
    nirf_rank,
    date_attended,
    duration_days,
    proof_document,
  } = req.body;

  // Calculate marks based on rubrics
  let marks_awarded = 0;

  if (nirf_rank <= 200) {
    marks_awarded = 20;
  }

  const query = `
    INSERT INTO workshops_seminars (
      student_id, event_type, event_name, institution_name,
      nirf_rank, date_attended, duration_days, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      event_type,
      event_name,
      institution_name,
      nirf_rank,
      date_attended,
      duration_days,
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
        message: "Workshop/seminar entry created successfully",
      });
    },
  );
});

// Update workshop/seminar entry
router.put("/:id", (req, res) => {
  const {
    event_type,
    event_name,
    institution_name,
    nirf_rank,
    date_attended,
    duration_days,
    proof_document,
  } = req.body;

  // Recalculate marks
  let marks_awarded = 0;

  if (nirf_rank <= 200) {
    marks_awarded = 20;
  }

  const query = `
    UPDATE workshops_seminars 
    SET event_type = ?, event_name = ?, institution_name = ?,
        nirf_rank = ?, date_attended = ?, duration_days = ?,
        proof_document = ?, marks_awarded = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      event_type,
      event_name,
      institution_name,
      nirf_rank,
      date_attended,
      duration_days,
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
        message: "Workshop/seminar entry updated successfully",
      });
    },
  );
});

// Delete workshop/seminar entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM workshops_seminars WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Workshop/seminar entry deleted successfully" });
  });
});

module.exports = router;
