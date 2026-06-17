const db = require('../config/db');

// Get dashboard stats for a landlord
exports.getLandlordStats = async (req, res) => {
    try {
        const landlordId = req.query.landlordId || req.user?.id;
        if (!landlordId) return res.status(400).json({ error: 'Landlord ID required' });
        
        // 1. Total rent collected
        const rentQuery = `
            SELECT COALESCE(SUM(amount), 0) as total
            FROM payments p
            JOIN leases l ON p.lease_id = l.id
            JOIN units u ON l.unit_id = u.id
            JOIN properties pr ON u.property_id = pr.id
            WHERE pr.landlord_id = $1 AND p.status = 'completed'
        `;
        const rentResult = await db.query(rentQuery, [landlordId]);
        const totalRentCollected = parseFloat(rentResult.rows?.[0]?.total || 0);

        // 2. Pending balances (Mocked for now, assumes expected rent vs paid)
        // A simple way is sum of all active lease rents - sum of all payments this month
        // We will just do a mock for pending balances and overdue accounts for simplicity
        
        // 3. Occupancy rate
        const occupancyQuery = `
            SELECT 
                COUNT(*) as total_units,
                SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_units
            FROM units u
            JOIN properties pr ON u.property_id = pr.id
            WHERE pr.landlord_id = $1
        `;
        const occResult = await db.query(occupancyQuery, [landlordId]);
        const totalUnits = parseInt(occResult.rows?.[0]?.total_units || 0);
        const occupiedUnits = parseInt(occResult.rows?.[0]?.occupied_units || 0);
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

        const stats = {
            totalRentCollected,
            pendingBalances: 0, // Placeholder
            occupancyRate,
            overdueAccounts: 0 // Placeholder
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

// Get dashboard stats for a tenant
exports.getTenantStats = async (req, res) => {
    try {
        const tenantId = req.query.tenantId || req.user?.id;
        if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

        // Get lease info
        const leaseQuery = `
            SELECT * FROM leases WHERE tenant_id = $1 AND status = 'active' LIMIT 1
        `;
        const leaseResult = await db.query(leaseQuery, [tenantId]);
        const lease = leaseResult.rows?.[0];

        if (!lease) {
            return res.status(200).json({ currentBalance: 0, nextDueDate: 'N/A' });
        }

        // Return stats
        res.status(200).json({
            currentBalance: parseFloat(lease.rent_amount), // Simple assumption: rent amount due
            nextDueDate: '5th of Next Month' // Mock date
        });

    } catch (error) {
        console.error('Error fetching tenant stats:', error);
        res.status(500).json({ error: 'Failed to fetch tenant stats' });
    }
};
