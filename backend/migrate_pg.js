require('dotenv').config({ path: '../.env.production' });
const db = require('./config/db');

const applyMigration = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS meter_readings (
                id SERIAL PRIMARY KEY,
                unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
                property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
                caretaker_id INT REFERENCES caretakers(id) ON DELETE SET NULL,
                reading_type VARCHAR(50) NOT NULL,
                reading_value DECIMAL(10, 2) NOT NULL,
                reading_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        console.log('Applying migration to PostgreSQL...');
        await db.query(query);
        console.log('Migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

applyMigration();
