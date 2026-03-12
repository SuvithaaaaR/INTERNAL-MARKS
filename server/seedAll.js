// Comprehensive seed script: students + faculty + sample activity data
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/internal_marks.db");
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

async function seed() {
  console.log("Seeding database...\n");

  // ── Students ────────────────────────────────────────────
  const students = [
    { name: "Rahul Kumar",       roll: "21CSE001", sem: 4, email: "rahul.kumar@college.edu",    dept: "Computer Science Engineering" },
    { name: "Priya Sharma",      roll: "21CSE002", sem: 4, email: "priya.sharma@college.edu",   dept: "Computer Science Engineering" },
    { name: "Amit Patel",        roll: "20CSE015", sem: 6, email: "amit.patel@college.edu",     dept: "Computer Science Engineering" },
    { name: "Sneha Reddy",       roll: "20IT010",  sem: 6, email: "sneha.reddy@college.edu",    dept: "Information Technology" },
    { name: "Arjun Singh",       roll: "19CSE025", sem: 7, email: "arjun.singh@college.edu",    dept: "Computer Science Engineering" },
    { name: "Divya Menon",       roll: "19IT012",  sem: 7, email: "divya.menon@college.edu",    dept: "Information Technology" },
    { name: "Vikram Rao",        roll: "21ECE008", sem: 4, email: "vikram.rao@college.edu",     dept: "Electronics and Communication" },
    { name: "Anjali Verma",      roll: "20CSE030", sem: 5, email: "anjali.verma@college.edu",   dept: "Computer Science Engineering" },
    { name: "Karthik Krishnan",  roll: "19CSE040", sem: 6, email: "karthik.k@college.edu",      dept: "Computer Science Engineering" },
    { name: "Meera Iyer",        roll: "21IT005",  sem: 3, email: "meera.iyer@college.edu",     dept: "Information Technology" },
  ];

  for (const s of students) {
    try {
      await run(
        `INSERT OR IGNORE INTO students (student_name, roll_number, semester, email, department)
         VALUES (?, ?, ?, ?, ?)`,
        [s.name, s.roll, s.sem, s.email, s.dept]
      );
    } catch (e) { /* duplicate, skip */ }
  }
  console.log("✓ 10 students inserted");

  // ── Users (auth) ────────────────────────────────────────
  // Faculty accounts
  const facultyUsers = [
    { user: "faculty",    pass: "admin123", name: "Dr. Ramesh Kumar",   email: "ramesh@college.edu" },
    { user: "hod_cse",    pass: "admin123", name: "Dr. Sunita Agarwal", email: "sunita@college.edu" },
  ];

  for (const f of facultyUsers) {
    try {
      await run(
        `INSERT OR IGNORE INTO users (username, password, role, full_name, email)
         VALUES (?, ?, 'faculty', ?, ?)`,
        [f.user, f.pass, f.name, f.email]
      );
    } catch (e) { /* duplicate, skip */ }
  }
  console.log("✓ Faculty accounts created");

  // Student accounts (username = roll_number in lowercase, password = student123)
  const allStudents = await all("SELECT id, student_name, roll_number, email FROM students");
  for (const st of allStudents) {
    try {
      await run(
        `INSERT OR IGNORE INTO users (username, password, role, student_id, full_name, email)
         VALUES (?, 'student123', 'student', ?, ?, ?)`,
        [st.roll_number.toLowerCase(), st.id, st.student_name, st.email]
      );
    } catch (e) { /* duplicate, skip */ }
  }
  console.log("✓ Student login accounts created");

  // ── Sample activity data ────────────────────────────────
  const ids = allStudents.map((s) => s.id);

  // Community Service entries
  const communityEntries = [
    [ids[0], "workshop", "Local School NGO", "Conducted coding workshop for school students", 3, "2025-06-15", "", 30],
    [ids[1], "coding_session", "Tech4Good NGO", "Python programming bootcamp for underprivileged youth", 2, "2025-07-20", "", 35],
    [ids[2], "workshop", "Rural Education Trust", "IoT demo session for rural engineering students", 3, "2025-05-10", "", 25],
    [ids[4], "coding_session", "CodeReach Foundation", "Web development crash course at community college", 1, "2025-08-01", "", 40],
    [ids[6], "workshop", "Green India Initiative", "Electronics recycling awareness drive", 2, "2025-09-12", "", 20],
  ];
  for (const e of communityEntries) {
    await run(
      `INSERT INTO community_service (student_id, activity_type, organization_name, activity_description, team_size, date_conducted, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Community service entries added");

  // Patent Filing entries
  const patentEntries = [
    [ids[2], "utility", "Smart Irrigation Controller Using IoT", "APP/2025/001234", "2025-04-15", "filed", 1, 0, "", 120],
    [ids[4], "design", "Ergonomic Laptop Stand Design", "DES/2025/005678", "2025-03-20", "published", 1, 1, "", 200],
  ];
  for (const e of patentEntries) {
    await run(
      `INSERT INTO patent_filing (student_id, patent_type, patent_title, application_number, filing_date, status, prototype_developed, technology_transfer, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Patent entries added");

  // Scopus Papers
  const scopusEntries = [
    [ids[0], "Machine Learning Based Crop Disease Detection", "conference", "IEEE ICSE 2025", "2025-05-20", 1, "Dr. Ramesh Kumar", "", 80],
    [ids[2], "IoT-Enabled Smart Campus Framework", "journal", "Elsevier IoT Journal", "2025-07-01", 1, "Dr. Sunita Agarwal", "", 120],
    [ids[3], "Blockchain for Supply Chain Transparency", "conference", "ACM Blockchain Conf", "2025-06-15", 1, "Dr. Ramesh Kumar", "", 90],
  ];
  for (const e of scopusEntries) {
    await run(
      `INSERT INTO scopus_papers (student_id, paper_title, publication_type, journal_conference_name, publication_date, scopus_indexed, co_authors, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Scopus paper entries added");

  // Hackathons
  const hackathonEntries = [
    [ids[0], "Smart India Hackathon 2025", "Government", "national", null, "winner", 0, "2025-03-15", "", 100],
    [ids[1], "HackMIT 2025", "MIT", "college", 5, "participant", 0, "2025-04-10", "", 30],
    [ids[5], "TechCrunch Disrupt Hack", "TechCrunch", "industry", null, "finalist", 1, "2025-05-25", "", 80],
    [ids[7], "Google Solution Challenge", "Google", "industry", null, "winner", 1, "2025-06-20", "", 150],
  ];
  for (const e of hackathonEntries) {
    await run(
      `INSERT INTO hackathons (student_id, hackathon_name, organizer, hackathon_type, nirf_rank, result, organized_by_industry, date_participated, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Hackathon entries added");

  // Workshops & Seminars
  const workshopEntries = [
    [ids[1], "workshop", "AI/ML Workshop", "IIT Madras", 1, "2025-02-20", 2, "", 15],
    [ids[3], "seminar", "Cloud Computing Seminar", "NIT Trichy", 10, "2025-03-10", 1, "", 10],
    [ids[6], "workshop", "VLSI Design Workshop", "IIT Bombay", 3, "2025-04-05", 3, "", 20],
    [ids[8], "seminar", "Cybersecurity Trends", "IIIT Hyderabad", 25, "2025-05-18", 1, "", 10],
  ];
  for (const e of workshopEntries) {
    await run(
      `INSERT INTO workshops_seminars (student_id, event_type, event_name, institution_name, nirf_rank, date_attended, duration_days, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Workshop entries added");

  // Online Courses
  const courseEntries = [
    [ids[0], "mooc", "Machine Learning Specialization", "Coursera", 12, "2025-06-01", "CERT001", "", 40],
    [ids[1], "nptel", "Data Structures & Algorithms", "NPTEL", 8, "2025-05-15", "NPTEL2025-123", "", 60],
    [ids[3], "mooc", "AWS Solutions Architect", "Udemy", 8, "2025-07-10", "UDEMY456", "", 30],
    [ids[5], "nptel", "Computer Networks", "NPTEL", 4, "2025-04-20", "NPTEL2025-456", "", 40],
    [ids[9], "mooc", "React Advanced Patterns", "Coursera", 6, "2025-08-01", "CERT789", "", 30],
  ];
  for (const e of courseEntries) {
    await run(
      `INSERT INTO online_courses (student_id, course_type, course_name, platform, duration_weeks, completion_date, certificate_number, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Online course entries added");

  // Entrepreneurship
  const entrepreneurEntries = [
    [ids[4], "TechVenture Labs", "udyam", "UDYAM-2025-001234", "2025-01-15", 1, 500000, 1, "", 200],
    [ids[7], "GreenBot Solutions", "dpiit", "DPIIT-2025-005678", "2025-03-01", 0, 0, 0, "", 100],
  ];
  for (const e of entrepreneurEntries) {
    await run(
      `INSERT INTO entrepreneurship (student_id, startup_name, registration_type, registration_number, registration_date, funding_secured, funding_amount, incubation_status, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Entrepreneurship entries added");

  // Coding Platforms
  const codingEntries = [
    [ids[0], "leetcode", 1800, 450, 65.5, "2025-06-01", "https://leetcode.com/rahul001", "", 80],
    [ids[1], "codechef", 1650, 200, 58.0, "2025-05-10", "https://codechef.com/priya002", "", 60],
    [ids[2], "hackerrank", 2000, 300, 72.0, "2025-04-15", "https://hackerrank.com/amit015", "", 90],
    [ids[8], "leetcode", 2100, 600, 70.0, "2025-07-01", "https://leetcode.com/karthik040", "", 100],
    [ids[9], "codechef", 1500, 150, 55.0, "2025-08-05", "https://codechef.com/meera005", "", 50],
  ];
  for (const e of codingEntries) {
    await run(
      `INSERT INTO coding_platforms (student_id, platform, score_rating, problems_solved, acceptance_rate, date_achieved, profile_link, screenshot, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Coding platform entries added");

  // Minor Projects
  const projectEntries = [
    [ids[0], "Smart Attendance System", "Automated attendance using face recognition", "Industry - TechCorp", 8, "Face recognition based attendance for classrooms", "https://github.com/rahul/smart-attendance", "", "", 80],
    [ids[3], "Water Quality Monitor", "Real-time water quality monitoring for rural areas", "NGO - CleanWater Foundation", 9, "IoT-based water quality measurement and alerting system", "https://github.com/sneha/water-quality", "", "", 120],
    [ids[5], "EduBot - AI Tutor", "AI-powered tutoring chatbot for school students", "Community - Local School", 7, "NLP chatbot that helps K-12 students with homework", "https://github.com/divya/edubot", "", "", 100],
    [ids[8], "FarmConnect", "Direct farmer-to-consumer marketplace", "Community - Village Cooperative", 9, "Mobile app connecting farmers to consumers, eliminating middlemen", "https://github.com/karthik/farmconnect", "", "", 140],
  ];
  for (const e of projectEntries) {
    await run(
      `INSERT INTO minor_projects (student_id, project_title, problem_statement, industry_ngo_community, uniqueness_score, project_description, github_link, demo_link, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Minor project entries added");

  // Project Competitions
  const compEntries = [
    [ids[0], "inter_college", "National Project Expo 2025", "IIT Delhi", 1, "winner", 0, "2025-04-20", "", 80],
    [ids[2], "industry", "Microsoft Imagine Cup", "Microsoft", null, "finalist", 1, "2025-05-15", "", 60],
    [ids[7], "inter_college", "Smart India Hackathon - Project", "NIT Warangal", 15, "participant", 0, "2025-06-01", "", 30],
  ];
  for (const e of compEntries) {
    await run(
      `INSERT INTO project_competitions (student_id, competition_type, competition_name, institution_name, nirf_rank, result, industry_level, date_participated, proof_document, marks_awarded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, e
    );
  }
  console.log("✓ Project competition entries added");

  console.log("\n========================================");
  console.log("  Database seeded successfully!");
  console.log("========================================");
  console.log("\nLogin Credentials:");
  console.log("  Faculty  → username: faculty,  password: admin123");
  console.log("  Faculty  → username: hod_cse,  password: admin123");
  console.log("  Students → username: <roll_number>, password: student123");
  console.log("  Example  → username: 21cse001, password: student123");
  console.log("========================================\n");

  db.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  db.close();
  process.exit(1);
});
