const db = require('../config/db');

// Get all maintenance requests (can filter by tenant, landlord, or property)
exports.getRequests = async (req, res) => {
    try {
        const { tenantId, landlordId } = req.query;
        let query = `
            SELECT m.*, t.first_name, t.last_name, u.unit_number, p.name as property_name
            FROM maintenance_requests m
            JOIN tenants t ON m.tenant_id = t.id
            JOIN units u ON m.unit_id = u.id
            JOIN properties p ON u.property_id = p.id
            WHERE 1=1
        `;
        let params = [];

        if (tenantId) {
            params.push(tenantId);
            query += ` AND m.tenant_id = $${params.length}`;
        }
        if (landlordId) {
            params.push(landlordId);
            query += ` AND p.landlord_id = $${params.length}`;
        }
        
        query += ' ORDER BY m.created_at DESC';

        const result = await db.query(query, params);
        res.status(200).json(result.rows || result);
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
};

// Create a new request (Tenant)
exports.createRequest = async (req, res) => {
    try {
        const { tenantId, unitId, issueDescription } = req.body;
        
        if (!tenantId || !unitId || !issueDescription) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO maintenance_requests (tenant_id, unit_id, issue_description, status)
            VALUES ($1, $2, $3, 'open')
            RETURNING *
        `;
        const values = [tenantId, unitId, issueDescription];
        
        const result = await db.query(query, values);
        const newRequest = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
        
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating maintenance request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
};

// Update request status (Landlord/Caretaker)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const query = `
            UPDATE maintenance_requests
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const values = [status, id];
        
        const result = await db.query(query, values);
        const updatedRequest = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Failed to update request' });
    }
};
