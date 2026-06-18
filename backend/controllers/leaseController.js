const db = require('../config/db');

// Get all leases (or filter by tenantId/unitId)
exports.getLeases = async (req, res) => {
    try {
        const { tenantId, unitId } = req.query;
        let query = `
            SELECT l.*, t.first_name, t.last_name, u.unit_number 
            FROM leases l
            JOIN tenants t ON l.tenant_id = t.id
            JOIN units u ON l.unit_id = u.id
            WHERE 1=1
        `;
        let params = [];

        if (tenantId) {
            params.push(tenantId);
            query += ` AND l.tenant_id = $${params.length}`;
        }
        if (unitId) {
            params.push(unitId);
            query += ` AND l.unit_id = $${params.length}`;
        }
        
        query += ' ORDER BY l.created_at DESC';

        const result = await db.query(query, params);
        res.status(200).json(result.rows || result);
    } catch (error) {
        console.error('Error fetching leases:', error);
        res.status(500).json({ error: 'Failed to fetch leases' });
    }
};

// Create a lease
exports.createLease = async (req, res) => {
    try {
        const { tenantId, unitId, startDate, endDate, depositAmount, rentAmount } = req.body;
        
        if (!tenantId || !unitId || !startDate || !depositAmount || !rentAmount) {
            return res.status(400).json({ error: 'Missing required lease fields' });
        }

        const query = `
            INSERT INTO leases (tenant_id, unit_id, start_date, end_date, deposit_amount, rent_amount, status, approval_status)
            VALUES ($1, $2, $3, $4, $5, $6, 'active', 'pending')
            RETURNING *
        `;
        const values = [tenantId, unitId, startDate, endDate, depositAmount, rentAmount];
        
        const result = await db.query(query, values);
        const newLease = (result.rows && result.rows[0]) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);
        
        // Update unit status to occupied
        await db.query(`UPDATE units SET status = 'occupied' WHERE id = $1`, [unitId]);
        
        // --- Trigger Notifications ---
        // Find the property ID for this unit
        const unitRes = await db.query(`SELECT property_id, unit_number FROM units WHERE id = $1`, [unitId]);
        const unitInfo = unitRes.rows ? unitRes.rows[0] : null;

        if (unitInfo) {
            const propertyId = unitInfo.property_id;
            const landlordRes = await db.query(`SELECT landlord_id FROM properties WHERE id = $1`, [propertyId]);
            const landlordId = landlordRes.rows ? landlordRes.rows[0]?.landlord_id : null;

            // Notify Landlord
            if (landlordId) {
                await db.query(`
                    INSERT INTO notifications (user_id, title, message, related_entity_type, related_entity_id)
                    VALUES ($1, 'New Lease Pending Approval', 'A new lease was signed for Unit ' || $2 || ' and is pending approval.', 'lease', $3)
                `, [landlordId, unitInfo.unit_number, newLease.id]);
            }

            // Notify Caretakers assigned to this property
            const caretakersRes = await db.query(`
                SELECT user_id FROM caretakers WHERE $1 = ANY(assigned_properties)
            `, [propertyId]);
            
            const caretakers = caretakersRes.rows || [];
            for (let c of caretakers) {
                await db.query(`
                    INSERT INTO notifications (user_id, title, message, related_entity_type, related_entity_id)
                    VALUES ($1, 'New Tenant Onboarding', 'A new lease was signed for Unit ' || $2 || '. Please receive the tenant and approve.', 'lease', $3)
                `, [c.user_id, unitInfo.unit_number, newLease.id]);
            }
        }
        
        res.status(201).json(newLease);
    } catch (error) {
        console.error('Error creating lease:', error);
        res.status(500).json({ error: 'Failed to create lease' });
    }
};

// Approve a lease
exports.approveLease = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            UPDATE leases 
            SET approval_status = 'approved', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [id]);
        const updatedLease = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

        if (!updatedLease) {
            return res.status(404).json({ error: 'Lease not found' });
        }

        res.status(200).json({ message: 'Lease approved successfully', data: updatedLease });
    } catch (error) {
        console.error('Error approving lease:', error);
        res.status(500).json({ error: 'Failed to approve lease' });
    }
};

// Reject a lease
exports.rejectLease = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            UPDATE leases 
            SET approval_status = 'rejected', status = 'terminated', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [id]);
        const updatedLease = result.rows ? result.rows[0] : (Array.isArray(result) ? result[0] : null);

        if (!updatedLease) {
            return res.status(404).json({ error: 'Lease not found' });
        }
        
        // Also free up the unit
        await db.query(`UPDATE units SET status = 'vacant' WHERE id = $1`, [updatedLease.unit_id]);

        res.status(200).json({ message: 'Lease rejected successfully', data: updatedLease });
    } catch (error) {
        console.error('Error rejecting lease:', error);
        res.status(500).json({ error: 'Failed to reject lease' });
    }
};

// Get my active lease (for tenant)
exports.getMyLease = async (req, res) => {
    try {
        const tenantId = req.user?.id;
        if (!tenantId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const query = `
            SELECT l.*, u.unit_number, u.unit_type, p.name as property_name
            FROM leases l
            JOIN units u ON l.unit_id = u.id
            JOIN properties p ON u.property_id = p.id
            WHERE l.tenant_id = $1 AND l.status = 'active'
            LIMIT 1
        `;
        const result = await db.query(query, [tenantId]);
        
        if (result.rows && result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'No active lease found' });
        }
    } catch (error) {
        console.error('Error fetching my lease:', error);
        res.status(500).json({ error: 'Failed to fetch lease details' });
    }
};
