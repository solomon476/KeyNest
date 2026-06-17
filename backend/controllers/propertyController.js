const db = require('../config/db');

// Get all properties for a landlord
exports.getProperties = async (req, res) => {
    try {
        const landlordId = req.query.landlordId || 1; // Default to 1 for demo purposes
        const result = await db.query('SELECT * FROM properties WHERE landlord_id = $1 ORDER BY created_at DESC', [landlordId]);
        res.status(200).json(result.rows || result); // Handle both pg and generic db adapters
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
};

// Get single property
exports.getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM properties WHERE id = $1', [id]);
        const property = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : null);
        
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.status(200).json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
};

// Create a property
exports.createProperty = async (req, res) => {
    try {
        const { name, location, description, landlordId } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const landlord_id = landlordId || 1; // Default to 1 for demo purposes

        const query = `
            INSERT INTO properties (landlord_id, name, location, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [landlord_id, name, location, description];
        
        const result = await db.query(query, values);
        const newProperty = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
        
        res.status(201).json(newProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
};

// Update a property
exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, description } = req.body;

        const query = `
            UPDATE properties
            SET name = COALESCE($1, name),
                location = COALESCE($2, location),
                description = COALESCE($3, description),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        const values = [name, location, description, id];
        
        const result = await db.query(query, values);
        const updatedProperty = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Failed to update property' });
    }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM properties WHERE id = $1', [id]);
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Failed to delete property' });
    }
};
