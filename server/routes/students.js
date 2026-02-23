const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all students
router.get("/", (req, res) => {
  const query = "SELECT * FROM students ORDER BY created_at DESC";
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get student by ID
router.get("/:id", (req, res) => {
  const query = "SELECT * FROM students WHERE id = ?";
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(row);
  });
});

// Create new student
router.post("/", (req, res) => {
  const { student_name, roll_number, semester, email, department } = req.body;

  const query = `
    INSERT INTO students (student_name, roll_number, semester, email, department)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [student_name, roll_number, semester, email, department],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: "Student created successfully" });
    },
  );
});

// Update student
router.put("/:id", (req, res) => {
  const { student_name, roll_number, semester, email, department } = req.body;

  const query = `
    UPDATE students 
    SET student_name = ?, roll_number = ?, semester = ?, email = ?, department = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(
    query,
    [student_name, roll_number, semester, email, department, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student updated successfully" });
    },
  );
});

// Delete student
router.delete("/:id", (req, res) => {
  const query = "DELETE FROM students WHERE id = ?";

  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Student deleted successfully" });
  });
});

// Search students
router.get("/search/:term", (req, res) => {
  const searchTerm = `%${req.params.term}%`;
  const query = `
    SELECT * FROM students 
    WHERE student_name LIKE ? OR roll_number LIKE ? OR email LIKE ?
    ORDER BY created_at DESC
  `;

  db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
