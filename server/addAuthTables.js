const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "database", "internal_marks.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'faculty')),
      student_id INTEGER,
      full_name TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err);
      } else {
        console.log("✓ Users table created/verified");
      }
    }
  );

  // Insert default faculty user (password: admin123)
  db.run(
    `INSERT OR IGNORE INTO users (username, password, role, full_name, email) 
     VALUES ('faculty', 'admin123', 'faculty', 'Faculty Admin', 'faculty@college.edu')`,
    (err) => {
      if (err) {
        console.error("Error inserting faculty user:", err);
      } else {
        console.log("✓ Default faculty user created (username: faculty, password: admin123)");
      }
    }
  );

  // Create student users for existing students
  db.all("SELECT id, student_name, roll_number, email FROM students", (err, students) => {
    if (err) {
      console.error("Error fetching students:", err);
      db.close();
      return;
    }

    if (students.length === 0) {
      console.log("✓ No students found to create accounts for");
      db.close();
      return;
    }

    let completed = 0;
    students.forEach((student) => {
      const username = student.roll_number.toLowerCase();
      const password = "student123"; // Default password
      
      db.run(
        `INSERT OR IGNORE INTO users (username, password, role, student_id, full_name, email) 
         VALUES (?, ?, 'student', ?, ?, ?)`,
        [username, password, student.id, student.student_name, student.email],
        (err) => {
          if (err && !err.message.includes("UNIQUE")) {
            console.error(`Error creating user for ${student.student_name}:`, err);
          }
          
          completed++;
          if (completed === students.length) {
            console.log(`✓ Created student accounts for ${students.length} students`);
            console.log("  Default password for all students: student123");
            console.log("  Students login with their roll number as username");
            
            db.close((err) => {
              if (err) {
                console.error("Error closing database:", err);
              } else {
                console.log("\n✓ Authentication tables setup complete!");
                console.log("\nDefault Credentials:");
                console.log("  Faculty - username: faculty, password: admin123");
                console.log("  Students - username: [roll_number], password: student123");
              }
            });
          }
        }
      );
    });
  });
});
