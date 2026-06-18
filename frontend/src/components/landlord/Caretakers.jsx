import React, { useState, useEffect } from 'react';
import { getCaretakers, assignCaretaker } from '../../services/api';

export default function Caretakers() {
  const [caretakers, setCaretakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaretakers();
  }, []);

  const fetchCaretakers = async () => {
    try {
      const data = await getCaretakers();
      setCaretakers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch caretakers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (caretaker, permissionKey) => {
    const updatedPermissions = {
      ...caretaker.permissions,
      [permissionKey]: !caretaker.permissions[permissionKey]
    };

    try {
      await assignCaretaker({
        userId: caretaker.user_id,
        permissions: updatedPermissions
      });
      fetchCaretakers();
    } catch (err) {
      alert('Failed to update permissions');
    }
  };

  if (loading) return <div>Loading caretakers...</div>;

  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Manage Caretakers</h2>
        <button className="btn btn-primary" onClick={() => alert('Add Caretaker feature coming soon')}>Add Caretaker</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email / Phone</th>
              <th>Assigned Properties</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {caretakers.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td>{c.email}<br/><small style={{color:'var(--color-text-muted)'}}>{c.phone_number}</small></td>
                <td>{c.assigned_properties?.length || 0} Properties</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <input 
                        type="checkbox" 
                        checked={c.permissions?.can_view_rent_status || false} 
                        onChange={() => handleTogglePermission(c, 'can_view_rent_status')}
                      />
                      View Rent Status
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <input 
                        type="checkbox" 
                        checked={c.permissions?.can_view_total_cashflow || false} 
                        onChange={() => handleTogglePermission(c, 'can_view_total_cashflow')}
                      />
                      View Cash Flow
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <input 
                        type="checkbox" 
                        checked={c.permissions?.can_approve_leases || false} 
                        onChange={() => handleTogglePermission(c, 'can_approve_leases')}
                      />
                      Approve Leases
                    </label>
                  </div>
                </td>
              </tr>
            ))}
            {caretakers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No caretakers assigned yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
