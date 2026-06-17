const { Pool } = require('pg');

// On Vercel, env vars are injected directly - no dotenv needed
// Locally, rely on dotenv being called in server.js before this module loads
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
    console.warn('WARNING: No database connection string found. Set POSTGRES_URL or DATABASE_URL.');
}

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
        port: parseInt(process.env.DB_PORT || '5432'),
      }
);

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('DB connection error:', err.message);
    } else {
        console.log('Successfully connected to PostgreSQL database.');
        release();
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
