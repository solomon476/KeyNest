const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, phoneNumber, password, role } = req.body;
    
    try {
        if (!name || !email || !phoneNumber || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR phone_number = $2', [email, phoneNumber]);
        if (userExists.rows && userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email or phone number already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const query = `
            INSERT INTO users (name, email, phone_number, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, phone_number, role
        `;
        const values = [name, email, phoneNumber, hashedPassword, role || 'tenant'];
        
        const result = await db.query(query, values);
        const newUser = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

        // Generate JWT
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Find user by email
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile (protected endpoint example)
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, phone_number, role FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
