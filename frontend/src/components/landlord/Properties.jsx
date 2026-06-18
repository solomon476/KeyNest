import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building, MapPin } from 'lucide-react';
import api from '../../services/api';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      // The backend should derive landlordId from the JWT token in the future,
      // but for now we pass it explicitly if needed, or rely on backend default.
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.get(`/properties?landlordId=${user.id || 1}`);
      setProperties(res.data);
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
      await api.post('/properties', { ...formData, landlordId: user.id || 1 });
      await fetchProperties();
      setShowForm(false);
      setFormData({ name: '', location: '', description: '' });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      await fetchProperties();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Properties</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your buildings and estates.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add Property'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Property</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Property Name *</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} className="input" placeholder="e.g. Greenways Apartments" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Location</label>
                <input name="location" value={formData.location} onChange={handleInputChange} className="input" placeholder="e.g. Nairobi CBD" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="input" placeholder="Brief description of the property..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', resize: 'vertical' }}></textarea>
            </div>
            <div style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Property</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {properties.length === 0 && !showForm && (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '2px dashed #E2E8F0', gridColumn: '1 / -1' }}>
            <Building size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>No Properties Yet</h3>
            <p style={{ color: '#64748B', marginTop: '0.5rem' }}>Add your first property to start managing units and tenants.</p>
          </div>
        )}

        {properties.map(property => (
          <div key={property.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{property.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)' }} title="Edit"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(property.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-overdue)' }} title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem', marginBottom: '1rem' }}>
                <MapPin size={14} /> {property.location || 'Location not specified'}
              </p>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {property.description || 'No description provided.'}
              </p>
            </div>
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: 'auto' }}>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Manage Units</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
