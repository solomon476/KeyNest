const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Vercel Postgres usually exposes POSTGRES_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const pool = new Pool(
  connectionString 
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'keynest',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
      }
);

// Initialize schema if the database is new or empty
const initDb = async () => {
    try {
        const res = await pool.query("SELECT to_regclass('public.users') as table_exists;");
        if (!res.rows[0].table_exists) {
            console.log("Initializing PostgreSQL database with schema...");
            // Use the root database_schema.sql for PostgreSQL
            const schemaPath = path.resolve(__dirname, '../../database_schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await pool.query(schema);
            console.log("PostgreSQL schema initialized successfully.");
        } else {
            console.log("Successfully connected to PostgreSQL database.");
        }
    } catch (err) {
        console.error("Failed to check or initialize schema:", err);
    }
};

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
