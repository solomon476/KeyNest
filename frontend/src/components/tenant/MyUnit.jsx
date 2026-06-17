import React from 'react';
import { Home, FileText, Calendar, CreditCard } from 'lucide-react';

export default function MyUnit() {
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Apt 4B</h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Greenways Apartments</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Unit Type</span>
              <span style={{ fontWeight: 500 }}>2 Bedroom</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Monthly Rent</span>
              <span style={{ fontWeight: 500 }}>KES 25,000</span>
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
              <span style={{ fontWeight: 500 }}>Jan 1, 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}><Calendar size={14} style={{display:'inline', marginRight: 4}}/> End Date</span>
              <span style={{ fontWeight: 500 }}>Dec 31, 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}><CreditCard size={14} style={{display:'inline', marginRight: 4}}/> Deposit Paid</span>
              <span style={{ fontWeight: 500 }}>KES 25,000</span>
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
