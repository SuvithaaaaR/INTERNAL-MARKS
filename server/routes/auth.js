const express = require("express");
const router = express.Router();
const db = require("../database");

// Login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.get(
    `SELECT u.*, s.roll_number, s.semester, s.department 
     FROM users u 
     LEFT JOIN students s ON u.student_id = s.id 
     WHERE u.username = ?`,
    [username.toLowerCase()],
    (err, user) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Don't send password back to client
      delete user.password;

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          email: user.email,
          student_id: user.student_id,
          roll_number: user.roll_number,
          semester: user.semester,
          department: user.department,
        },
      });
    },
  );
});

// Get current user (for session persistence)
router.get("/me", (req, res) => {
  // In a real app, you'd validate a JWT token here
  // For simplicity, we'll rely on client-side storage
  res.json({ message: "Session check endpoint" });
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
