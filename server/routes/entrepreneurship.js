const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all entrepreneurship entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM entrepreneurship WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new entrepreneurship entry
router.post("/", (req, res) => {
  const {
    student_id,
    startup_name,
    registration_type,
    registration_number,
    registration_date,
    funding_secured,
    funding_amount,
    incubation_status,
    proof_document,
  } = req.body;

  // Calculate marks based on rubrics (full FA marks = 240)
  let marks_awarded = 0;

  if (registration_type === "dpiit" || funding_secured || incubation_status) {
    marks_awarded = 240;
  }

  const query = `
    INSERT INTO entrepreneurship (
      student_id, startup_name, registration_type, registration_number,
      registration_date, funding_secured, funding_amount, incubation_status,
      proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      startup_name,
      registration_type,
      registration_number,
      registration_date,
      funding_secured,
      funding_amount,
      incubation_status,
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
        message: "Entrepreneurship entry created successfully",
      });
    },
  );
});

// Update entrepreneurship entry
router.put("/:id", (req, res) => {
  const {
    startup_name,
    registration_type,
    registration_number,
    registration_date,
    funding_secured,
    funding_amount,
    incubation_status,
    proof_document,
  } = req.body;

  // Recalculate marks
  let marks_awarded = 0;

  if (registration_type === "dpiit" || funding_secured || incubation_status) {
    marks_awarded = 240;
  }

  const query = `
    UPDATE entrepreneurship 
    SET startup_name = ?, registration_type = ?, registration_number = ?,
        registration_date = ?, funding_secured = ?, funding_amount = ?,
        incubation_status = ?, proof_document = ?, marks_awarded = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      startup_name,
      registration_type,
      registration_number,
      registration_date,
      funding_secured,
      funding_amount,
      incubation_status,
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
        message: "Entrepreneurship entry updated successfully",
      });
    },
  );
});

// Delete entrepreneurship entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM entrepreneurship WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Entrepreneurship entry deleted successfully" });
  });
});

module.exports = router;
