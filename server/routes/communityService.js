const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all community service entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM community_service WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new community service entry
router.post("/", (req, res) => {
  const {
    student_id,
    activity_type,
    organization_name,
    activity_description,
    team_size,
    date_conducted,
    proof_document,
  } = req.body;

  // Calculate marks based on rubrics
  let marks_awarded = 0;
  if (activity_type === "workshop" && team_size <= 3) {
    marks_awarded = 40;
  }

  const query = `
    INSERT INTO community_service (
      student_id, activity_type, organization_name, activity_description,
      team_size, date_conducted, proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      activity_type,
      organization_name,
      activity_description,
      team_size,
      date_conducted,
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
        message: "Community service entry created successfully",
      });
    },
  );
});

// Update community service entry
router.put("/:id", (req, res) => {
  const {
    activity_type,
    organization_name,
    activity_description,
    team_size,
    date_conducted,
    proof_document,
  } = req.body;

  // Check if staff has evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM community_service WHERE id = ?",
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
        if (activity_type === "workshop" && team_size <= 3) {
          marks_awarded = 40;
        }
      }

      const query = `
        UPDATE community_service 
        SET activity_type = ?, organization_name = ?, activity_description = ?,
            team_size = ?, date_conducted = ?, proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          activity_type,
          organization_name,
          activity_description,
          team_size,
          date_conducted,
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
            message: "Community service entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete community service entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM community_service WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Community service entry deleted successfully" });
  });
});

module.exports = router;
