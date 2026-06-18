const db = require('../config/db');

// Create or update a caretaker record for a user
exports.assignCaretaker = async (req, res) => {
    try {
        const landlordId = req.user.id;
        const { userId, assignedProperties, permissions } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if caretaker already exists
        const checkQuery = 'SELECT * FROM caretakers WHERE user_id = $1 AND landlord_id = $2';
        const existing = await db.query(checkQuery, [userId, landlordId]);

        let result;
        if (existing.rows && existing.rows.length > 0) {
            // Update
            const query = `
                UPDATE caretakers 
                SET assigned_properties = COALESCE($1, assigned_properties),
                    permissions = COALESCE($2, permissions),
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $3 AND landlord_id = $4
                RETURNING *
            `;
            const updateRes = await db.query(query, [
                assignedProperties || existing.rows[0].assigned_properties,
                permissions || existing.rows[0].permissions,
                userId,
                landlordId
            ]);
            result = updateRes.rows[0];
        } else {
            // Create
            const defaultPermissions = {
                can_view_rent_status: true,
                can_view_total_cashflow: false,
                can_approve_leases: true
            };
            const query = `
                INSERT INTO caretakers (user_id, landlord_id, assigned_properties, permissions)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const createRes = await db.query(query, [
                userId,
                landlordId,
                assignedProperties || [],
                permissions || defaultPermissions
            ]);
            result = createRes.rows ? createRes.rows[0] : (Array.isArray(createRes) ? createRes[0] : createRes);
        }

        // Update user role to 'caretaker' if not already
        await db.query("UPDATE users SET role = 'caretaker' WHERE id = $1", [userId]);

        res.status(201).json({ message: 'Caretaker assigned successfully', data: result });
    } catch (err) {
        console.error('Error assigning caretaker:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all caretakers for the current landlord
exports.getCaretakers = async (req, res) => {
    try {
        const landlordId = req.user.id;

        const query = `
            SELECT c.*, u.name, u.email, u.phone_number 
            FROM caretakers c
            JOIN users u ON c.user_id = u.id
            WHERE c.landlord_id = $1
        `;
        const result = await db.query(query, [landlordId]);
        const caretakers = result.rows || result;

        res.status(200).json({ data: caretakers });
    } catch (err) {
        console.error('Error fetching caretakers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
