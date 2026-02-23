// Script to add 10 sample student records
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/internal_marks.db");
const db = new sqlite3.Database(dbPath);

const students = [
  {
    student_name: "Rahul Kumar",
    roll_number: "21CSE001",
    semester: 2,
    email: "rahul.kumar@example.com",
    department: "Computer Science Engineering",
  },
  {
    student_name: "Priya Sharma",
    roll_number: "21CSE002",
    semester: 3,
    email: "priya.sharma@example.com",
    department: "Computer Science Engineering",
  },
  {
    student_name: "Amit Patel",
    roll_number: "20CSE015",
    semester: 4,
    email: "amit.patel@example.com",
    department: "Computer Science Engineering",
  },
  {
    student_name: "Sneha Reddy",
    roll_number: "20IT010",
    semester: 5,
    email: "sneha.reddy@example.com",
    department: "Information Technology",
  },
  {
    student_name: "Arjun Singh",
    roll_number: "19CSE025",
    semester: 6,
    email: "arjun.singh@example.com",
    department: "Computer Science Engineering",
  },
  {
    student_name: "Divya Menon",
    roll_number: "19IT012",
    semester: 7,
    email: "divya.menon@example.com",
    department: "Information Technology",
  },
  {
    student_name: "Vikram Rao",
    roll_number: "21ECE008",
    semester: 3,
    email: "vikram.rao@example.com",
    department: "Electronics and Communication",
  },
  {
    student_name: "Anjali Verma",
    roll_number: "20CSE030",
    semester: 4,
    email: "anjali.verma@example.com",
    department: "Computer Science Engineering",
  },
  {
    student_name: "Karthik Krishnan",
    roll_number: "19CSE040",
    semester: 5,
    email: "karthik.k@example.com",
    department: "Computer Science Engineering",
  },
  {
    student_name: "Meera Iyer",
    roll_number: "21IT005",
    semester: 2,
    email: "meera.iyer@example.com",
    department: "Information Technology",
  },
];

console.log("📝 Adding 10 student records to database...\n");

const insertStudent = (student) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO students (student_name, roll_number, semester, email, department)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        student.student_name,
        student.roll_number,
        student.semester,
        student.email,
        student.department,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      },
    );
  });
};

// Insert all students
async function seedDatabase() {
  let successCount = 0;
  let errorCount = 0;

  for (const student of students) {
    try {
      const id = await insertStudent(student);
      console.log(
        `✅ ${successCount + 1}. Added: ${student.student_name} (${student.roll_number}) - Semester ${student.semester}`,
      );
      successCount++;
    } catch (error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        console.log(
          `⚠️  Skipped: ${student.student_name} (${student.roll_number}) - Already exists`,
        );
      } else {
        console.log(
          `❌ Error adding ${student.student_name}: ${error.message}`,
        );
      }
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   Successfully added: ${successCount}`);
  console.log(`   Skipped/Errors: ${errorCount}`);
  console.log(`   Total students in database: ${successCount}`);
  console.log("=".repeat(50));

  db.close(() => {
    console.log("\n✨ Database connection closed");
    process.exit(0);
  });
}

seedDatabase();
