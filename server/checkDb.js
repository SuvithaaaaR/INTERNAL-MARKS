// Verify database tables
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/internal_marks.db");
const db = new sqlite3.Database(dbPath);

console.log("📋 Checking database tables...\n");

db.all(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  [],
  (err, tables) => {
    if (err) {
      console.error("Error:", err);
      process.exit(1);
    }

    console.log("✅ Database tables created:");
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.name}`);
    });

    console.log(`\n📊 Total tables: ${tables.length}`);
    console.log("📁 Database file: database/internal_marks.db");
    console.log(`💾 File size: ${require("fs").statSync(dbPath).size} bytes`);

    db.close();
  },
);
