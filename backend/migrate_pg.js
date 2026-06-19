require('dotenv').config({ path: '../.env.production.local' });
const db = require('./config/db');

const applyMigration = async () => {
    try {
        const query = `
            ALTER TABLE leases ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
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
