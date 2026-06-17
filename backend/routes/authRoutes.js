const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Basic stub for user login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // This is a stub! In a real app, you would hash the password and check the DB.
        // e.g., const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        res.status(200).json({ 
            message: 'Login successful',
            token: 'mock-jwt-token-12345',
            user: {
                id: 1,
                email: email,
                role: role || 'tenant'
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
