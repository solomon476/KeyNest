const db = require('../config/db');

// Get all notifications for the current user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT * FROM notifications 
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        const result = await db.query(query, [userId]);
        const notifications = result.rows || result;

        res.status(200).json({ data: notifications });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const query = `
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const result = await db.query(query, [id, userId]);
        const notification = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found or unauthorized' });
        }

        res.status(200).json({ message: 'Notification marked as read', data: notification });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
