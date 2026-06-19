import React, { useState, useEffect } from 'react';
import { Plus, Users, UserPlus, Phone, FileText } from 'lucide-react';
import api from '../../services/api';

export default function Tenants({ onAssignLease }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '', idNumber: '', email: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.get(`/tenants?landlordId=${user.id || 1}`);
      setTenants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.post('/tenants', { ...formData, landlordId: user.id || 1 });
      await fetchTenants();
      setShowForm(false);
      setFormData({ firstName: '', lastName: '', phoneNumber: '', idNumber: '', email: '' });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div>Loading tenants...</div>;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tenants</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your renters and their details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <UserPlus size={18} /> {showForm ? 'Cancel' : 'Add Tenant'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Tenant</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>First Name *</label>
                <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Last Name *</label>
                <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Phone Number (For M-Pesa) *</label>
                <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="input" placeholder="2547XXXXXXXX" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>National ID</label>
                <input name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
            <div style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Tenant</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          {tenants.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              <Users size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <p>No tenants found.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>ID Number</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td style={{ fontWeight: 500 }}>{tenant.first_name} {tenant.last_name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}><Phone size={14} style={{display:'inline', marginRight: 4}}/>{tenant.phone_number}</td>
                    <td>{tenant.id_number || 'N/A'}</td>
                    <td>{new Date(tenant.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-outline" onClick={() => onAssignLease && onAssignLease(tenant.id)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Assign Lease</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
