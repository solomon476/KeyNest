const db = require('../config/db');

// Middleware to check if the user has a specific caretaker permission
const requirePermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            // If landlord or admin, they have all permissions
            if (req.user.role === 'landlord' || req.user.role === 'admin') {
                return next();
            }

            // If tenant, they don't have caretaker permissions
            if (req.user.role !== 'caretaker') {
                return res.status(403).json({ error: 'Access denied: Requires caretaker or landlord role' });
            }

            // Fetch caretaker permissions from DB
            const query = 'SELECT permissions FROM caretakers WHERE user_id = $1';
            const result = await db.query(query, [req.user.id]);
            const caretaker = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

            if (!caretaker || !caretaker.permissions) {
                return res.status(403).json({ error: 'Access denied: No permissions found' });
            }

            // Check specific permission
            if (caretaker.permissions[permissionKey] !== true) {
                return res.status(403).json({ error: `Access denied: Missing permission '${permissionKey}'` });
            }

            // Permission granted
            next();
        } catch (err) {
            console.error('Permission middleware error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = requirePermission;
