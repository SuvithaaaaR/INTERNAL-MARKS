const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all hackathon entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM hackathons WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new hackathon entry
router.post("/", (req, res) => {
  const {
    student_id,
    hackathon_name,
    organizer,
    hackathon_type,
    nirf_rank,
    result,
    organized_by_industry,
    date_participated,
    proof_document,
  } = req.body;

  // Calculate marks based on rubrics
  let marks_awarded = 0;

  if (hackathon_type === "inter_intra_college") {
    marks_awarded = 20;
  } else if (nirf_rank <= 200) {
    marks_awarded = 80;
  } else if (result === "won" && !organized_by_industry) {
    marks_awarded = 160;
  } else if (result === "won" && organized_by_industry) {
    marks_awarded = 240; // Full FA marks
  }

  const query = `
    INSERT INTO hackathons (
      student_id, hackathon_name, organizer, hackathon_type,
      nirf_rank, result, organized_by_industry, date_participated, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      hackathon_name,
      organizer,
      hackathon_type,
      nirf_rank,
      result,
      organized_by_industry,
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
        message: "Hackathon entry created successfully",
      });
    },
  );
});

// Update hackathon entry
router.put("/:id", (req, res) => {
  const {
    hackathon_name,
    organizer,
    hackathon_type,
    nirf_rank,
    result,
    organized_by_industry,
    date_participated,
    proof_document,
  } = req.body;

  // First, check if this entry has been staff evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM hackathons WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let marks_awarded;

      // If staff has evaluated, preserve their marks. Otherwise, recalculate.
      if (row && row.staff_evaluated === 1) {
        marks_awarded = row.marks_awarded; // Keep staff-evaluated marks
      } else {
        // Recalculate marks based on rubrics
        marks_awarded = 0;
        if (hackathon_type === "inter_intra_college") {
          marks_awarded = 20;
        } else if (nirf_rank <= 200) {
          marks_awarded = 80;
        } else if (result === "won" && !organized_by_industry) {
          marks_awarded = 160;
        } else if (result === "won" && organized_by_industry) {
          marks_awarded = 240;
        }
      }

      const query = `
        UPDATE hackathons 
        SET hackathon_name = ?, organizer = ?, hackathon_type = ?,
            nirf_rank = ?, result = ?, organized_by_industry = ?, date_participated = ?,
            proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          hackathon_name,
          organizer,
          hackathon_type,
          nirf_rank,
          result,
          organized_by_industry,
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
            message: "Hackathon entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete hackathon entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM hackathons WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Hackathon entry deleted successfully" });
  });
});

module.exports = router;
