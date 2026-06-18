const db = require('../config/db');

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;
        const receiverIdInt = parseInt(receiverId);

        if (!receiverIdInt || !content) {
            return res.status(400).json({ error: 'Receiver ID and content are required' });
        }

        // Verify receiver exists
        const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [receiverIdInt]);
        if (!userCheck.rows || userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Recipient user not found' });
        }

        const query = `
            INSERT INTO messages (sender_id, receiver_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await db.query(query, [senderId, receiverIdInt, content]);
        const message = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

        res.status(201).json({ message: 'Message sent', data: message });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get conversation with a specific user
exports.getConversation = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { userId } = req.params;

        const query = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = $2) 
               OR (sender_id = $2 AND receiver_id = $1)
            ORDER BY created_at ASC
        `;
        const result = await db.query(query, [currentUserId, userId]);
        const messages = result.rows || result;

        res.status(200).json({ data: messages });
    } catch (err) {
        console.error('Error fetching conversation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const query = `
            UPDATE messages 
            SET read_status = TRUE 
            WHERE id = $1 AND receiver_id = $2
            RETURNING *
        `;
        const result = await db.query(query, [id, currentUserId]);
        const message = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

        if (!message) {
            return res.status(404).json({ error: 'Message not found or unauthorized' });
        }

        res.status(200).json({ message: 'Message marked as read', data: message });
    } catch (err) {
        console.error('Error marking message as read:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
