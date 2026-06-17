const db = require('../config/db');

// Get dashboard stats for a landlord
exports.getLandlordStats = async (req, res) => {
    try {
        const landlordId = req.query.landlordId || 1;
        
        // Very basic mock stats from DB (in reality, requires aggregation queries)
        // Here we just return mock structure for the UI
        const stats = {
            totalRentCollected: 450000,
            pendingBalances: 85000,
            occupancyRate: 92,
            overdueAccounts: 3
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
