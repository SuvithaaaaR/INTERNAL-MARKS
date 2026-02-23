const express = require("express");
const router = express.Router();
const db = require("../database");

// Coding platform rubrics
const codingRubrics = {
  hackerrank: {
    2: [
      { score: 200, marks: 20 },
      { score: 300, marks: 40 },
      { score: 400, marks: 60 },
    ],
    3: [
      { score: 500, marks: 20 },
      { score: 1000, marks: 40 },
      { score: 1500, marks: 60 },
      { score: 2000, marks: 80 },
    ],
    4: [
      { score: 2500, marks: 20 },
      { score: 3000, marks: 40 },
      { score: 3500, marks: 60 },
      { score: 4000, marks: 80 },
      { score: 5000, marks: 120 },
    ],
    5: [
      { score: 6000, marks: 20 },
      { score: 8000, marks: 40 },
      { score: 10000, marks: 60 },
    ],
    6: [
      { score: 11000, marks: 20 },
      { score: 12000, marks: 40 },
    ],
    7: [{ score: 12500, marks: 20 }],
  },
  codechef: {
    3: [
      { score: 200, marks: 20 },
      { score: 250, marks: 40 },
      { score: 300, marks: 60 },
      { score: 400, marks: 80 },
    ],
    4: [
      { score: 500, marks: 20 },
      { score: 540, marks: 40 },
      { score: 580, marks: 60 },
      { score: 600, marks: 80 },
    ],
    5: [
      { score: 800, marks: 20 },
      { score: 1200, marks: 40 },
      { score: 1400, marks: 60 },
      { score: 1600, marks: 80 },
      { score: 1800, marks: 120 },
    ],
    6: [
      { score: 2000, marks: 20 },
      { score: 2100, marks: 40 },
      { score: 2200, marks: 60 },
      { score: 2300, marks: 80 },
    ],
    7: [
      { score: 2500, marks: 20 },
      { score: 2600, marks: 40 },
    ],
  },
  leetcode: {
    3: [
      { score: 2, marks: 20 },
      { score: 4, marks: 40 },
    ],
    4: [
      { score: 5, marks: 20 },
      { score: 8, marks: 40 },
      { score: 10, marks: 60 },
      { score: 12, marks: 80 },
    ],
    5: [
      { score: 30, marks: 20 },
      { score: 40, marks: 40 },
      { score: 60, marks: 60 },
      { score: 80, marks: 80 },
    ],
    6: [
      { score: 90, marks: 20 },
      { score: 100, marks: 40 },
      { score: 110, marks: 60 },
      { score: 120, marks: 80 },
      { score: 140, marks: 120 },
    ],
    7: [
      { score: 160, marks: 20 },
      { score: 180, marks: 40 },
      { score: 200, marks: 60 },
      { score: 225, marks: 80 },
      { score: 250, marks: 120 },
    ],
  },
};

function calculateCodingMarks(platform, semester, score) {
  const semesterRubrics = codingRubrics[platform]?.[semester];
  if (!semesterRubrics) return 0;

  let marks = 0;
  for (const rubric of semesterRubrics) {
    if (score >= rubric.score) {
      marks = rubric.marks;
    } else {
      break;
    }
  }
  return marks;
}

// Get all coding platform entries for a student
router.get("/student/:studentId", (req, res) => {
  const query =
    "SELECT * FROM coding_platforms WHERE student_id = ? ORDER BY created_at DESC";
  db.all(query, [req.params.studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Create new coding platform entry
router.post("/", (req, res) => {
  const {
    student_id,
    platform,
    score_rating,
    problems_solved,
    acceptance_rate,
    date_achieved,
    profile_link,
    screenshot,
  } = req.body;

  // Get student's semester first
  db.get(
    "SELECT semester FROM students WHERE id = ?",
    [student_id],
    (err, student) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const semester = student.semester;
      const score = platform === "leetcode" ? problems_solved : score_rating;
      const marks_awarded = calculateCodingMarks(platform, semester, score);

      const query = `
      INSERT INTO coding_platforms (
        student_id, platform, score_rating, problems_solved,
        acceptance_rate, date_achieved, profile_link, screenshot, marks_awarded
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      db.run(
        query,
        [
          student_id,
          platform,
          score_rating,
          problems_solved,
          acceptance_rate,
          date_achieved,
          profile_link,
          screenshot,
          marks_awarded,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({
            id: this.lastID,
            marks_awarded,
            message: "Coding platform entry created successfully",
          });
        },
      );
    },
  );
});

// Update coding platform entry
router.put("/:id", (req, res) => {
  const {
    platform,
    score_rating,
    problems_solved,
    acceptance_rate,
    date_achieved,
    profile_link,
    screenshot,
  } = req.body;

  // Get student_id to fetch semester
  db.get(
    "SELECT student_id FROM coding_platforms WHERE id = ?",
    [req.params.id],
    (err, entry) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }

      db.get(
        "SELECT semester FROM students WHERE id = ?",
        [entry.student_id],
        (err, student) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const semester = student.semester;
          const score =
            platform === "leetcode" ? problems_solved : score_rating;
          const marks_awarded = calculateCodingMarks(platform, semester, score);

          const query = `
        UPDATE coding_platforms 
        SET platform = ?, score_rating = ?, problems_solved = ?,
            acceptance_rate = ?, date_achieved = ?, profile_link = ?,
            screenshot = ?, marks_awarded = ?
        WHERE id = ?
      `;

          db.run(
            query,
            [
              platform,
              score_rating,
              problems_solved,
              acceptance_rate,
              date_achieved,
              profile_link,
              screenshot,
              marks_awarded,
              req.params.id,
            ],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({
                marks_awarded,
                message: "Coding platform entry updated successfully",
              });
            },
          );
        },
      );
    },
  );
});

// Delete coding platform entry
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM coding_platforms WHERE id = ?";
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Coding platform entry deleted successfully" });
  });
});

module.exports = router;
