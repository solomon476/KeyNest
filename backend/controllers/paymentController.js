const db = require('../config/db');

// Get all payments (can filter by landlord, tenant, lease)
exports.getPayments = async (req, res) => {
    try {
        const { landlordId, tenantId } = req.query;
        let query = `
            SELECT p.*, t.first_name, t.last_name, u.unit_number 
            FROM payments p
            JOIN leases l ON p.lease_id = l.id
            JOIN tenants t ON l.tenant_id = t.id
            JOIN units u ON l.unit_id = u.id
            JOIN properties prop ON u.property_id = prop.id
            WHERE 1=1
        `;
        let params = [];

        if (landlordId) {
            params.push(landlordId);
            query += ` AND prop.landlord_id = $${params.length}`;
        }
        if (tenantId) {
            params.push(tenantId);
            query += ` AND t.id = $${params.length}`;
        }
        
        query += ' ORDER BY p.payment_date DESC';

        const result = await db.query(query, params);
        res.status(200).json(result.rows || result);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

// Record manual payment
exports.recordPayment = async (req, res) => {
    try {
        const { leaseId, amount, paymentMethod, mpesaReceiptNumber, status } = req.body;
        
        if (!leaseId || !amount) {
            return res.status(400).json({ error: 'Lease ID and Amount are required' });
        }

        const query = `
            INSERT INTO payments (lease_id, amount, payment_method, mpesa_receipt_number, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [leaseId, amount, paymentMethod || 'cash', mpesaReceiptNumber || null, status || 'completed'];
        
        const result = await db.query(query, values);
        const newPayment = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
        
        res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ error: 'Failed to record payment' });
    }
};
