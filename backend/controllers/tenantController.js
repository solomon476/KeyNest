const db = require('../config/db');

// Get all tenants for a landlord
exports.getTenants = async (req, res) => {
    try {
        const landlordId = req.query.landlordId || 1; 
        const result = await db.query('SELECT * FROM tenants WHERE landlord_id = $1 ORDER BY created_at DESC', [landlordId]);
        res.status(200).json(result.rows || result);
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({ error: 'Failed to fetch tenants' });
    }
};

// Create a tenant
exports.createTenant = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, idNumber, email, landlordId } = req.body;
        
        if (!firstName || !lastName || !phoneNumber) {
            return res.status(400).json({ error: 'First Name, Last Name, and Phone Number are required' });
        }

        const landlord_id = landlordId || 1;

        const query = `
            INSERT INTO tenants (landlord_id, first_name, last_name, phone_number, id_number, email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [landlord_id, firstName, lastName, phoneNumber, idNumber, email];
        
        const result = await db.query(query, values);
        const newTenant = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
        
        res.status(201).json(newTenant);
    } catch (error) {
        console.error('Error creating tenant:', error);
        res.status(500).json({ error: 'Failed to create tenant' });
    }
};
