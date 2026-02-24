const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all minor project entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM minor_projects WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new minor project entry
router.post("/", (req, res) => {
  const {
    student_id,
    project_title,
    problem_statement,
    industry_ngo_community,
    uniqueness_score,
    project_description,
    github_link,
    demo_link,
    proof_document,
  } = req.body;

  // Calculate marks based on uniqueness (max 160, but uniqueness of problem = 20 as per rubric)
  // For now, we'll award the uniqueness score directly
  let marks_awarded = uniqueness_score || 20;

  const query = `
    INSERT INTO minor_projects (
      student_id, project_title, problem_statement, industry_ngo_community,
      uniqueness_score, project_description, github_link, demo_link,
      proof_document, marks_awarded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      student_id,
      project_title,
      problem_statement,
      industry_ngo_community,
      uniqueness_score,
      project_description,
      github_link,
      demo_link,
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
        message: "Minor project entry created successfully",
      });
    },
  );
});

// Update minor project entry
router.put("/:id", (req, res) => {
  const {
    project_title,
    problem_statement,
    industry_ngo_community,
    uniqueness_score,
    project_description,
    github_link,
    demo_link,
    proof_document,
  } = req.body;

  // Check if staff has evaluated
  db.get(
    "SELECT staff_evaluated, marks_awarded FROM minor_projects WHERE id = ?",
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
        marks_awarded = uniqueness_score || 20;
      }

      const query = `
        UPDATE minor_projects 
        SET project_title = ?, problem_statement = ?, industry_ngo_community = ?,
            uniqueness_score = ?, project_description = ?, github_link = ?,
            demo_link = ?, proof_document = ?, marks_awarded = ?
        WHERE id = ?
      `;

      db.run(
        query,
        [
          project_title,
          problem_statement,
          industry_ngo_community,
          uniqueness_score,
          project_description,
          github_link,
          demo_link,
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
            message: "Minor project entry updated successfully",
          });
        },
      );
    },
  );
});

// Delete minor project entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM minor_projects WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Minor project entry deleted successfully" });
  });
});

module.exports = router;
