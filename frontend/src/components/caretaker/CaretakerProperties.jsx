import React, { useState, useEffect } from 'react';
import { Building, MapPin, Users, X, Home } from 'lucide-react';
import api from '../../services/api';

export default function CaretakerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyUnits, setPropertyUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

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

  const handleViewDetails = async (property) => {
    setSelectedProperty(property);
    setLoadingUnits(true);
    try {
      const res = await api.get(`/units?propertyId=${property.id}`);
      setPropertyUnits(res.data);
    } catch (err) {
      console.error('Error fetching units', err);
    } finally {
      setLoadingUnits(false);
    }
  };

  const closeDetails = () => {
    setSelectedProperty(null);
    setPropertyUnits([]);
  };

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
                 <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => handleViewDetails(property)}>View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProperty && (
        <div className="modal-overlay" onClick={closeDetails} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={closeDetails} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', paddingRight: '2rem' }}>{selectedProperty.name}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.875rem', marginBottom: '1rem' }}>
              <MapPin size={14} /> {selectedProperty.location || 'Location not specified'}
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '2rem' }}>
              {selectedProperty.description || 'No description provided.'}
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>Units</h3>
            {loadingUnits ? (
              <p>Loading units...</p>
            ) : propertyUnits.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                <Home size={32} color="#94A3B8" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ color: '#64748B' }}>No units found for this property.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {propertyUnits.map(unit => (
                  <div key={unit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{unit.unit_number}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{unit.unit_type} • KES {unit.rent_amount}</div>
                    </div>
                    <span className={`badge ${unit.status === 'vacant' ? 'badge-pending' : unit.status === 'occupied' ? 'badge-paid' : 'badge-overdue'}`}>
                      {unit.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
