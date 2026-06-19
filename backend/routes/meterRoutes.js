const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get meter readings for a property or unit
router.get('/', async (req, res) => {
    try {
        const { propertyId, unitId } = req.query;
        let query = 'SELECT * FROM meter_readings WHERE 1=1';
        let params = [];
        let paramIndex = 1;

        if (propertyId) {
            query += ` AND property_id = $${paramIndex}`;
            params.push(propertyId);
            paramIndex++;
        }
        if (unitId) {
            query += ` AND unit_id = $${paramIndex}`;
            params.push(unitId);
            paramIndex++;
        }

        query += ' ORDER BY reading_date DESC';

        const result = await db.query(query, params);
        res.json(result.rows || result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Submit a new meter reading
router.post('/', async (req, res) => {
    try {
        const { unit_id, property_id, caretaker_id, reading_type, reading_value, reading_date } = req.body;
        
        if (!unit_id || !property_id || !reading_type || !reading_value || !reading_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // The frontend passes user.id as caretaker_id. We need to look up the actual caretaker table ID.
        let actualCaretakerId = null;
        if (caretaker_id) {
            const caretakerResult = await db.query('SELECT id FROM caretakers WHERE user_id = $1', [caretaker_id]);
            if (caretakerResult.rows && caretakerResult.rows.length > 0) {
                actualCaretakerId = caretakerResult.rows[0].id;
            } else if (Array.isArray(caretakerResult) && caretakerResult.length > 0) {
                actualCaretakerId = caretakerResult[0].id;
            }
        }

        const query = `
            INSERT INTO meter_readings (unit_id, property_id, caretaker_id, reading_type, reading_value, reading_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;

        const result = await db.query(query, [unit_id, property_id, actualCaretakerId, reading_type, reading_value, reading_date]);
        const id = result.rows ? result.rows[0].id : result[0].id;
        
        res.status(201).json({ id, message: 'Meter reading submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
