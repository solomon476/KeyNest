const db = require('../config/db');

// Get all units for a property (or all units for a landlord if no propertyId is given)
exports.getUnits = async (req, res) => {
    try {
        const { propertyId } = req.query;
        let query = `
            SELECT u.*, p.name as property_name 
            FROM units u
            JOIN properties p ON u.property_id = p.id
        `;
        let params = [];

        if (propertyId) {
            query += ' WHERE u.property_id = $1';
            params.push(propertyId);
        }
        
        query += ' ORDER BY u.created_at DESC';

        const result = await db.query(query, params);
        res.status(200).json(result.rows || result);
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ error: 'Failed to fetch units' });
    }
};

// Create a unit
exports.createUnit = async (req, res) => {
    try {
        const { propertyId, unitNumber, unitType, rentAmount, status } = req.body;
        
        if (!propertyId || !unitNumber || !rentAmount) {
            return res.status(400).json({ error: 'Property ID, Unit Number, and Rent Amount are required' });
        }

        const query = `
            INSERT INTO units (property_id, unit_number, unit_type, rent_amount, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [propertyId, unitNumber, unitType || 'Standard', rentAmount, status || 'vacant'];
        
        const result = await db.query(query, values);
        const newUnit = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
        
        res.status(201).json(newUnit);
    } catch (error) {
        console.error('Error creating unit:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'A unit with this number already exists in this property.' });
        }
        res.status(500).json({ error: 'Failed to create unit' });
    }
};

// Update a unit
exports.updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { unitNumber, unitType, rentAmount, status } = req.body;

        const query = `
            UPDATE units
            SET unit_number = COALESCE($1, unit_number),
                unit_type = COALESCE($2, unit_type),
                rent_amount = COALESCE($3, rent_amount),
                status = COALESCE($4, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        const values = [unitNumber, unitType, rentAmount, status, id];
        
        const result = await db.query(query, values);
        const updatedUnit = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

        res.status(200).json(updatedUnit);
    } catch (error) {
        console.error('Error updating unit:', error);
        res.status(500).json({ error: 'Failed to update unit' });
    }
};

// Delete a unit
exports.deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM units WHERE id = $1', [id]);
        res.status(200).json({ message: 'Unit deleted successfully' });
    } catch (error) {
        console.error('Error deleting unit:', error);
        res.status(500).json({ error: 'Failed to delete unit' });
    }
};
