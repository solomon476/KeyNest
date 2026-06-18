import React, { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import api from '../../services/api';

export default function MeterReadings() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    unit_id: '',
    reading_type: 'water',
    reading_value: '',
    reading_date: new Date().toISOString().split('T')[0]
  });

  // In a real app we would load properties and units to populate select dropdowns
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchReadings();
    fetchProperties();
  }, []);

  async function fetchReadings() {
    try {
      const res = await api.get('/meters');
      setReadings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProperties() {
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (err) {}
  }

  async function fetchUnits(propertyId) {
    try {
      const res = await api.get(`/units?propertyId=${propertyId}`);
      setUnits(res.data);
    } catch (err) {}
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'property_id') {
      fetchUnits(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.post('/meters', { 
        ...formData, 
        caretaker_id: user.id || 1 
      });
      await fetchReadings();
      setShowForm(false);
      setFormData({
        property_id: '',
        unit_id: '',
        reading_type: 'water',
        reading_value: '',
        reading_date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading meter readings...</div>;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Meter Readings</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Submit and track utility readings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Submit Reading'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>New Reading</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Property *</label>
                <select required name="property_id" value={formData.property_id} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}>
                  <option value="">Select Property</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Unit *</label>
                <select required name="unit_id" value={formData.unit_id} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: 'white' }} disabled={!formData.property_id}>
                  <option value="">Select Unit</option>
                  {units.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Utility Type *</label>
                <select required name="reading_type" value={formData.reading_type} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}>
                  <option value="water">Water</option>
                  <option value="electricity">Electricity</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Reading Value *</label>
                <input required type="number" step="0.01" name="reading_value" value={formData.reading_value} onChange={handleInputChange} className="input" placeholder="e.g. 150.5" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Date *</label>
                <input required type="date" name="reading_date" value={formData.reading_date} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>

            </div>
            
            <div style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Reading</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          {readings.length === 0 ? (
             <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
               <FileText size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
               <p>No meter readings submitted yet.</p>
             </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Property ID</th>
                  <th>Unit ID</th>
                  <th>Utility</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(reading => (
                  <tr key={reading.id}>
                    <td>{new Date(reading.reading_date).toLocaleDateString()}</td>
                    <td>{reading.property_id}</td>
                    <td>{reading.unit_id}</td>
                    <td style={{ textTransform: 'capitalize' }}>{reading.reading_type}</td>
                    <td style={{ fontWeight: 600 }}>{reading.reading_value}</td>
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
