const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/internal_marks.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Students table
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        roll_number TEXT UNIQUE NOT NULL,
        semester INTEGER NOT NULL,
        email TEXT,
        department TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Community Service
    db.run(`
      CREATE TABLE IF NOT EXISTS community_service (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        activity_type TEXT NOT NULL,
        organization_name TEXT,
        activity_description TEXT,
        team_size INTEGER,
        date_conducted DATE,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Patent Filing
    db.run(`
      CREATE TABLE IF NOT EXISTS patent_filing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        patent_type TEXT NOT NULL,
        patent_title TEXT,
        application_number TEXT,
        filing_date DATE,
        status TEXT,
        prototype_developed INTEGER DEFAULT 0,
        technology_transfer INTEGER DEFAULT 0,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Scopus Papers
    db.run(`
      CREATE TABLE IF NOT EXISTS scopus_papers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        paper_title TEXT NOT NULL,
        publication_type TEXT,
        journal_conference_name TEXT,
        publication_date DATE,
        scopus_indexed INTEGER DEFAULT 1,
        co_authors TEXT,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Project Competitions
    db.run(`
      CREATE TABLE IF NOT EXISTS project_competitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        competition_type TEXT NOT NULL,
        competition_name TEXT,
        institution_name TEXT,
        nirf_rank INTEGER,
        result TEXT,
        industry_level INTEGER,
        date_participated DATE,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Hackathons
    db.run(`
      CREATE TABLE IF NOT EXISTS hackathons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        hackathon_name TEXT NOT NULL,
        organizer TEXT,
        hackathon_type TEXT,
        nirf_rank INTEGER,
        result TEXT,
        organized_by_industry INTEGER DEFAULT 0,
        date_participated DATE,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Workshops Seminars
    db.run(`
      CREATE TABLE IF NOT EXISTS workshops_seminars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        event_name TEXT,
        institution_name TEXT,
        nirf_rank INTEGER,
        date_attended DATE,
        duration_days INTEGER,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Online Courses
    db.run(`
      CREATE TABLE IF NOT EXISTS online_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_type TEXT NOT NULL,
        course_name TEXT,
        platform TEXT,
        duration_weeks INTEGER,
        completion_date DATE,
        certificate_number TEXT,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Entrepreneurship
    db.run(`
      CREATE TABLE IF NOT EXISTS entrepreneurship (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        startup_name TEXT NOT NULL,
        registration_type TEXT,
        registration_number TEXT,
        registration_date DATE,
        funding_secured INTEGER DEFAULT 0,
        funding_amount REAL,
        incubation_status INTEGER DEFAULT 0,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Coding Platforms
    db.run(`
      CREATE TABLE IF NOT EXISTS coding_platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        platform TEXT NOT NULL,
        score_rating INTEGER,
        problems_solved INTEGER,
        acceptance_rate REAL,
        date_achieved DATE,
        profile_link TEXT,
        screenshot TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Minor Projects
    db.run(`
      CREATE TABLE IF NOT EXISTS minor_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        project_title TEXT NOT NULL,
        problem_statement TEXT,
        industry_ngo_community TEXT,
        uniqueness_score INTEGER,
        project_description TEXT,
        github_link TEXT,
        demo_link TEXT,
        proof_document TEXT,
        marks_awarded INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables initialized");
  });
}

module.exports = db;
