require('dotenv').config({ path: '../.env.production' });
const db = require('./config/db');

const resetData = async () => {
    try {
        console.log('Resetting database data (keeping users but removing properties, tenants, leases, etc.)...');
        
        const query = `
            TRUNCATE TABLE 
                properties, 
                units, 
                tenants, 
                leases, 
                payments, 
                maintenance_requests, 
                messages, 
                notifications, 
                meter_readings, 
                caretakers 
            CASCADE;
        `;
        
        await db.query(query);
        console.log('Successfully wiped all transactional data. The system is now a clean slate for new entries.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to reset data:', err);
        process.exit(1);
    }
};

resetData();
