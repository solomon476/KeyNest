import React, { useState, useEffect } from 'react';
import { Home, FileText, Calendar, CreditCard } from 'lucide-react';
import api from '../../services/api';

export default function MyUnit() {
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyLease();
  }, []);

  async function fetchMyLease() {
    try {
      setLoading(true);
      const res = await api.get('/leases/my-lease');
      setLease(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No active lease found. Please contact your landlord.');
      } else {
        setError('Failed to load unit details.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading unit details...</div>;

  if (error || !lease) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEE2E2', borderRadius: '8px', color: '#B91C1C' }}>
        {error || 'No active lease found.'}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Unit Details</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Information about your current lease and unit.</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home color="#4F46E5" size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{lease.unit_number || 'Unknown Unit'}</h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{lease.property_name || 'Unknown Property'}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Unit Type</span>
              <span style={{ fontWeight: 500 }}>{lease.unit_type || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Monthly Rent</span>
              <span style={{ fontWeight: 500 }}>KES {lease.rent_amount || '0'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#4F46E5" /> Lease Agreement
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}><Calendar size={14} style={{display:'inline', marginRight: 4}}/> Start Date</span>
              <span style={{ fontWeight: 500 }}>{new Date(lease.start_date).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}><Calendar size={14} style={{display:'inline', marginRight: 4}}/> End Date</span>
              <span style={{ fontWeight: 500 }}>{lease.end_date ? new Date(lease.end_date).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}><CreditCard size={14} style={{display:'inline', marginRight: 4}}/> Deposit Paid</span>
              <span style={{ fontWeight: 500 }}>KES {lease.deposit_amount || '0'}</span>
            </div>
            <div style={{ marginTop: '1rem' }}>
               <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Download Lease PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
