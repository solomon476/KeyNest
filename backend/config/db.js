const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize schema if the database is new or empty
const initDb = () => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (!row) {
            console.log("Initializing SQLite database with schema...");
            const schemaPath = path.resolve(__dirname, '../database_schema_sqlite.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            db.exec(schema, (err) => {
                if (err) {
                    console.error("Failed to initialize schema:", err);
                } else {
                    console.log("SQLite schema initialized successfully.");
                }
            });
        } else {
            console.log("Successfully connected to SQLite database.");
        }
    });
};

initDb();

module.exports = {
  query: (text, params = []) => {
    return new Promise((resolve, reject) => {
      // PostgreSQL uses $1, $2 for params. SQLite can use ? or $1, $2 depending on the method.
      // The sqlite3 node driver supports $1 if we pass an object, but we are passing an array.
      // So we convert $1, $2, etc. to sequentially mapped ? characters.
      // Example: "SELECT * FROM users WHERE id = $1 AND name = $2" -> "SELECT * FROM users WHERE id = ? AND name = ?"
      const sqliteText = text.replace(/\$\d+/g, '?');

      // We use db.all for all queries to ensure we capture RETURNING * rows
      db.all(sqliteText, params, function(err, rows) {
          if (err) {
              reject(err);
          } else {
              resolve({ rows });
          }
      });
    });
  }
};
