// Script to view all students in the database
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/internal_marks.db');
const db = new sqlite3.Database(dbPath);

console.log('👥 Student Records in Database\n');
console.log('='.repeat(80));

const query = `
  SELECT id, student_name, roll_number, semester, email, department, created_at
  FROM students
  ORDER BY semester, roll_number
`;

db.all(query, [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  
  if (rows.length === 0) {
    console.log('No students found in database.');
    console.log('\n💡 Run "npm run seed-students" to add sample data');
  } else {
    console.log(`Total Students: ${rows.length}\n`);
    
    rows.forEach((student, index) => {
      console.log(`${index + 1}. ${student.student_name}`);
      console.log(`   Roll Number: ${student.roll_number}`);
      console.log(`   Semester: ${student.semester} | Department: ${student.department}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   ID: ${student.id}`);
      console.log('   ' + '-'.repeat(70));
    });
  }
  
  console.log('='.repeat(80));
  
  db.close();
});
