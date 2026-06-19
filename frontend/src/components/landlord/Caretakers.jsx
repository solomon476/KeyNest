import React, { useState, useEffect } from 'react';
import { getCaretakers, assignCaretaker, getUsers, getProperties } from '../../services/api';

export default function Caretakers() {
  const [caretakers, setCaretakers] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ userId: '', assignedProperties: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [caretakersData, usersData, propertiesData] = await Promise.all([
        getCaretakers(),
        getUsers(),
        getProperties()
      ]);
      setCaretakers(caretakersData.data || []);
      setUsers(usersData || []);
      setProperties(propertiesData || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
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
      fetchData();
    } catch (err) {
      alert('Failed to update permissions');
    }
  };

  const handlePropertyToggle = (propertyId) => {
    setFormData(prev => {
      const isAssigned = prev.assignedProperties.includes(propertyId);
      if (isAssigned) {
        return { ...prev, assignedProperties: prev.assignedProperties.filter(id => id !== propertyId) };
      } else {
        return { ...prev, assignedProperties: [...prev.assignedProperties, propertyId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) return alert('Please select a user');
    try {
      await assignCaretaker({
        userId: parseInt(formData.userId),
        assignedProperties: formData.assignedProperties
      });
      await fetchData();
      setShowForm(false);
      setFormData({ userId: '', assignedProperties: [] });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div>Loading caretakers...</div>;

  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Manage Caretakers</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Caretaker'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Assign New Caretaker</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Select User *</label>
              <select 
                required 
                value={formData.userId} 
                onChange={(e) => setFormData({...formData, userId: e.target.value})} 
                className="input" 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              >
                <option value="">-- Choose a User --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email || u.phone_number})</option>
                ))}
              </select>
              <small style={{ color: 'var(--color-text-muted)' }}>Only registered users can be assigned as caretakers.</small>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Assign Properties (Optional)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '8px', backgroundColor: '#fff' }}>
                {properties.map(p => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.assignedProperties.includes(p.id)}
                      onChange={() => handlePropertyToggle(p.id)}
                    />
                    {p.name}
                  </label>
                ))}
                {properties.length === 0 && <span style={{ color: '#64748B' }}>No properties found.</span>}
              </div>
            </div>

            <div style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Save Caretaker</button>
            </div>
          </form>
        </div>
      )}

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
