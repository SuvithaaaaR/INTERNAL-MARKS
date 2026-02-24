// Migration script to add staff evaluation columns to all tables
const db = require("./database");

console.log("Adding staff evaluation columns to all tables...");

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

const addColumns = (tableName) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Add staff_evaluated column
      db.run(
        `ALTER TABLE ${tableName} ADD COLUMN staff_evaluated INTEGER DEFAULT 0`,
        (err) => {
          if (err && !err.message.includes("duplicate column")) {
            console.error(`Error adding staff_evaluated to ${tableName}:`, err.message);
          }
        }
      );

      // Add staff_comments column
      db.run(
        `ALTER TABLE ${tableName} ADD COLUMN staff_comments TEXT`,
        (err) => {
          if (err && !err.message.includes("duplicate column")) {
            console.error(`Error adding staff_comments to ${tableName}:`, err.message);
          }
        }
      );

      // Add staff_evaluated_by column
      db.run(
        `ALTER TABLE ${tableName} ADD COLUMN staff_evaluated_by TEXT`,
        (err) => {
          if (err && !err.message.includes("duplicate column")) {
            console.error(`Error adding staff_evaluated_by to ${tableName}:`, err.message);
          }
        }
      );

      // Add staff_evaluated_at column
      db.run(
        `ALTER TABLE ${tableName} ADD COLUMN staff_evaluated_at DATETIME`,
        (err) => {
          if (err && !err.message.includes("duplicate column")) {
            console.error(`Error adding staff_evaluated_at to ${tableName}:`, err.message);
          } else {
            console.log(`✅ Added staff evaluation columns to ${tableName}`);
          }
          resolve();
        }
      );
    });
  });
};

// Add columns to all tables
Promise.all(tables.map(addColumns))
  .then(() => {
    console.log("\n✅ All tables updated successfully!");
    console.log("Staff can now evaluate entries and assign marks.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error during migration:", err);
    process.exit(1);
  });
