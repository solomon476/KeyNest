import React, { useState, useEffect } from 'react';
import { Building, MapPin, Users } from 'lucide-react';
import api from '../../services/api';

export default function CaretakerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      // For MVP, we'll fetch all properties, or in the future
      // filter by the caretaker's assigned properties.
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading assigned properties...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Assigned Properties</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage buildings and estates under your care.</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {properties.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '2px dashed #E2E8F0', gridColumn: '1 / -1' }}>
            <Building size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>No Properties Assigned</h3>
            <p style={{ color: '#64748B', marginTop: '0.5rem' }}>You have not been assigned any properties yet.</p>
          </div>
        ) : (
          properties.map(property => (
            <div key={property.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{property.name}</h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <MapPin size={14} /> {property.location || 'Location not specified'}
                </p>
                <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {property.description || 'No description provided.'}
                </p>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600 }}>
                    <Users size={16} /> Active Status
                 </div>
                 <button className="btn btn-outline" style={{ fontSize: '0.85rem' }}>View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
