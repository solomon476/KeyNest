const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        // In production, we'll use a real secret from .env
        const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
        const decoded = jwt.verify(token, secret);
        
        // Add user payload to request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
