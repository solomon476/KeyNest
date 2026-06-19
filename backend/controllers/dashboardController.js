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

        // 2. Pending balances
        // Calculate total rent due across all active leases minus total payments made
        const pendingQuery = `
            SELECT COALESCE(SUM(l.rent_amount), 0) - (
                SELECT COALESCE(SUM(p.amount), 0)
                FROM payments p
                JOIN leases pl ON p.lease_id = pl.id
                JOIN units pu ON pl.unit_id = pu.id
                JOIN properties pprop ON pu.property_id = pprop.id
                WHERE pprop.landlord_id = $1 AND p.status = 'completed'
            ) as pending
            FROM leases l
            JOIN units u ON l.unit_id = u.id
            JOIN properties pr ON u.property_id = pr.id
            WHERE pr.landlord_id = $1 AND l.status = 'active'
        `;
        const pendingResult = await db.query(pendingQuery, [landlordId]);
        const pendingBalances = parseFloat(pendingResult.rows?.[0]?.pending || 0);

        // 2b. Overdue accounts
        // Any lease where the payments so far are less than the expected rent
        const overdueQuery = `
            SELECT COUNT(*) as overdue_count
            FROM leases l
            JOIN units u ON l.unit_id = u.id
            JOIN properties pr ON u.property_id = pr.id
            WHERE pr.landlord_id = $1 AND l.status = 'active'
            AND l.rent_amount > (
                SELECT COALESCE(SUM(p.amount), 0)
                FROM payments p
                WHERE p.lease_id = l.id AND p.status = 'completed'
            )
        `;
        const overdueResult = await db.query(overdueQuery, [landlordId]);
        const overdueAccounts = parseInt(overdueResult.rows?.[0]?.overdue_count || 0);

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
            pendingBalances: pendingBalances < 0 ? 0 : pendingBalances, 
            occupancyRate,
            overdueAccounts
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
            SELECT l.* 
            FROM leases l
            JOIN tenants t ON l.tenant_id = t.id
            WHERE RIGHT(t.phone_number, 9) = RIGHT((SELECT phone_number FROM users WHERE id = $1), 9)
            AND l.status = 'active' LIMIT 1
        `;
        const leaseResult = await db.query(leaseQuery, [tenantId]);
        const lease = leaseResult.rows?.[0];

        if (!lease) {
            return res.status(200).json({ currentBalance: 0, nextDueDate: 'N/A' });
        }

        // Calculate next due date (e.g. 5th of the next month)
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 5);
        
        // Return stats
        res.status(200).json({
            currentBalance: parseFloat(lease.rent_amount), // Simple assumption: rent amount due
            nextDueDate: nextMonth.toISOString().split('T')[0]
        });

    } catch (error) {
        console.error('Error fetching tenant stats:', error);
        res.status(500).json({ error: 'Failed to fetch tenant stats' });
    }
};
