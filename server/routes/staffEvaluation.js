const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all entries pending evaluation for a specific activity type
router.get("/pending/:activityType", (req, res) => {
  const { activityType } = req.params;
  const query = `SELECT * FROM ${activityType} WHERE staff_evaluated = 0 ORDER BY created_at DESC`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get all entries (evaluated and pending) for a specific activity type
router.get("/all/:activityType", (req, res) => {
  const { activityType } = req.params;
  const query = `SELECT * FROM ${activityType} ORDER BY created_at DESC`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get all entries for a specific student across all activities
router.get("/student/:studentId", (req, res) => {
  const { studentId } = req.params;
  const tables = [
    "community_service",
    "patent_filing",
    "scopus_papers",
    "project_competitions",
    "hackathons",
    "workshops_seminars",
    "online_courses",
    "entrepreneurship",
    "coding_platforms",
    "minor_projects",
  ];

  const promises = tables.map((table) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT '${table}' as activity_type, * FROM ${table} WHERE student_id = ?`,
        [studentId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  });

  Promise.all(promises)
    .then((results) => {
      const allEntries = results.flat();
      res.json(allEntries);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Evaluate/Update marks for an entry
router.put("/evaluate/:activityType/:entryId", (req, res) => {
  const { activityType, entryId } = req.params;
  const { marks_awarded, staff_comments, staff_evaluated_by } = req.body;

  const query = `
    UPDATE ${activityType}
    SET marks_awarded = ?,
        staff_comments = ?,
        staff_evaluated = 1,
        staff_evaluated_by = ?,
        staff_evaluated_at = datetime('now')
    WHERE id = ?
  `;

  db.run(
    query,
    [marks_awarded, staff_comments, staff_evaluated_by, entryId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: "Entry evaluated successfully",
        marks_awarded,
        changes: this.changes,
      });
    }
  );
});

// Bulk evaluate multiple entries
router.put("/bulk-evaluate", (req, res) => {
  const { evaluations } = req.body; // Array of {activityType, entryId, marks_awarded, staff_comments, staff_evaluated_by}

  const promises = evaluations.map((evaluation) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE ${evaluation.activityType}
        SET marks_awarded = ?,
            staff_comments = ?,
            staff_evaluated = 1,
            staff_evaluated_by = ?,
            staff_evaluated_at = datetime('now')
        WHERE id = ?
      `;

      db.run(
        query,
        [
          evaluation.marks_awarded,
          evaluation.staff_comments,
          evaluation.staff_evaluated_by,
          evaluation.entryId,
        ],
        function (err) {
          if (err) reject(err);
          else resolve({ entryId: evaluation.entryId, changes: this.changes });
        }
      );
    });
  });

  Promise.all(promises)
    .then((results) => {
      res.json({
        message: "Bulk evaluation completed successfully",
        results,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Get evaluation statistics
router.get("/stats", (req, res) => {
  const tables = [
    "community_service",
    "patent_filing",
    "scopus_papers",
    "project_competitions",
    "hackathons",
    "workshops_seminars",
    "online_courses",
    "entrepreneurship",
    "coding_platforms",
    "minor_projects",
  ];

  const promises = tables.map((table) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN staff_evaluated = 1 THEN 1 ELSE 0 END) as evaluated,
          SUM(CASE WHEN staff_evaluated = 0 THEN 1 ELSE 0 END) as pending
        FROM ${table}`,
        [],
        (err, row) => {
          if (err) reject(err);
          else resolve({ table, ...row });
        }
      );
    });
  });

  Promise.all(promises)
    .then((results) => {
      const totals = results.reduce((acc, curr) => ({
        total: acc.total + curr.total,
        evaluated: acc.evaluated + curr.evaluated,
        pending: acc.pending + curr.pending,
      }), { total: 0, evaluated: 0, pending: 0 });

      res.json({
        overall: totals,
        byActivity: results,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
