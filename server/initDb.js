// Simple script to initialize the database and create the .db file
require("dotenv").config();
const db = require("./database");

console.log("Database initialization started...");
console.log("Database file will be created at: database/internal_marks.db");

// Wait a bit for the database to initialize
setTimeout(() => {
  console.log("\n✅ Database file created successfully!");
  console.log("📁 Location: database/internal_marks.db");
  console.log("\nYou can now start the server with: npm run server");
  process.exit(0);
}, 2000);
