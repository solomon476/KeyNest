import React, { useState, useEffect } from 'react';
import { Plus, Home, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function Units() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ propertyId: '', unitNumber: '', unitType: 'Standard', rentAmount: '', status: 'vacant' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const [unitsRes, propsRes] = await Promise.all([
        api.get('/units'), // The backend doesn't currently filter by landlordId for units, but joins property. We might need to adjust backend later if we want strict landlord filtering here, but for now we'll fetch all.
        api.get(`/properties?landlordId=${user.id || 1}`)
      ]);
      setUnits(unitsRes.data);
      setProperties(propsRes.data);
      if (propsRes.data.length > 0) {
          setFormData(prev => ({...prev, propertyId: propsRes.data[0].id}));
      }
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
      await api.post('/units', formData);
      await fetchData();
      setShowForm(false);
      setFormData({ propertyId: properties.length > 0 ? properties[0].id : '', unitNumber: '', unitType: 'Standard', rentAmount: '', status: 'vacant' });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    try {
      await api.delete(`/units/${id}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div>Loading units...</div>;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Units</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage individual units and their statuses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add Unit'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Unit</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Property *</label>
                <select required name="propertyId" value={formData.propertyId} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Unit Number *</label>
                <input required name="unitNumber" value={formData.unitNumber} onChange={handleInputChange} className="input" placeholder="e.g. Apt 4B" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Unit Type</label>
                <input name="unitType" value={formData.unitType} onChange={handleInputChange} className="input" placeholder="e.g. 2 Bedroom" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Rent Amount *</label>
                <input type="number" required name="rentAmount" value={formData.rentAmount} onChange={handleInputChange} className="input" placeholder="e.g. 25000" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Unit</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          {units.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              <Home size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <p>No units found. Add a property and unit first.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Unit Number</th>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Rent Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map(unit => (
                  <tr key={unit.id}>
                    <td style={{ fontWeight: 600 }}>{unit.unit_number}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{unit.property_name}</td>
                    <td>{unit.unit_type}</td>
                    <td>KES {unit.rent_amount}</td>
                    <td>
                      <span className={`badge ${unit.status === 'vacant' ? 'badge-pending' : unit.status === 'occupied' ? 'badge-paid' : 'badge-overdue'}`}>
                        {unit.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(unit.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-overdue)' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
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
