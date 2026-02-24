const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all scopus paper entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM scopus_papers WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new scopus paper entry
router.post("/", (req, res) => {
  const {
    student_id,
    paper_title,
    publication_type,
    journal_conference_name,
    publication_date,
    scopus_indexed,
    co_authors,
    proof_document,
  } = req.body;

  // Calculate marks (full FA marks = 240)
  let marks_awarded = 0;
  if (scopus_indexed) {
    marks_awarded = 240;
  }

  const query = `
    INSERT INTO scopus_papers (
      student_id, paper_title, publication_type, journal_conference_name,
      publication_date, scopus_indexed, co_authors, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      paper_title,
      publication_type,
      journal_conference_name,
      publication_date,
      scopus_indexed,
      co_authors,
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
        message: "Scopus paper entry created successfully",
      });
    },
  );
});

// Update scopus paper entry
router.put("/:id", (req, res) => {
  const {
    paper_title,
    publication_type,
    journal_conference_name,
    publication_date,
    scopus_indexed,
    co_authors,
    proof_document,
  } = req.body;

  // Check if staff has evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM scopus_papers WHERE id = ?",
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
        if (scopus_indexed) {
          marks_awarded = 240;
        }
      }

      const query = `
        UPDATE scopus_papers 
        SET paper_title = ?, publication_type = ?, journal_conference_name = ?,
            publication_date = ?, scopus_indexed = ?, co_authors = ?, 
            proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          paper_title,
          publication_type,
          journal_conference_name,
          publication_date,
          scopus_indexed,
          co_authors,
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
            message: "Scopus paper entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete scopus paper entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM scopus_papers WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Scopus paper entry deleted successfully" });
  });
});

module.exports = router;
