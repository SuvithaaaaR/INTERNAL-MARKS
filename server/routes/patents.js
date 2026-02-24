const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all patent entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM patent_filing WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new patent entry
router.post("/", (req, res) => {
  const {
    student_id,
    patent_type,
    patent_title,
    application_number,
    filing_date,
    status,
    prototype_developed,
    technology_transfer,
    proof_document,
  } = req.body;

  // Calculate marks (full FA marks = 240)
  let marks_awarded = 0;
  if (prototype_developed && patent_type === "filed") {
    marks_awarded = 240;
  }
  if (technology_transfer) {
    marks_awarded = 240;
  }

  const query = `
    INSERT INTO patent_filing (
      student_id, patent_type, patent_title, application_number, filing_date,
      status, prototype_developed, technology_transfer, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      patent_type,
      patent_title,
      application_number,
      filing_date,
      status,
      prototype_developed,
      technology_transfer,
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
        message: "Patent entry created successfully",
      });
    },
  );
});

// Update patent entry
router.put("/:id", (req, res) => {
  const {
    patent_type,
    patent_title,
    application_number,
    filing_date,
    status,
    prototype_developed,
    technology_transfer,
    proof_document,
  } = req.body;

  // Check if staff has evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM patent_filing WHERE id = ?",
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
        if (prototype_developed && patent_type === "filed") {
          marks_awarded = 240;
        }
        if (technology_transfer) {
          marks_awarded = 240;
        }
      }

      const query = `
        UPDATE patent_filing 
        SET patent_type = ?, patent_title = ?, application_number = ?, filing_date = ?,
            status = ?, prototype_developed = ?, technology_transfer = ?, 
            proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          patent_type,
          patent_title,
          application_number,
          filing_date,
          status,
          prototype_developed,
          technology_transfer,
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
            message: "Patent entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete patent entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM patent_filing WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Patent entry deleted successfully" });
  });
});

module.exports = router;
