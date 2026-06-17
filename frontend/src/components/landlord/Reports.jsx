import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, TrendingUp, Download } from 'lucide-react';
import api from '../../../services/api';

export default function Reports() {
  const [loading, setLoading] = useState(false); // Can be set to true if fetching real data later

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Insights into your property performance.</p>
        </div>
        <button className="btn btn-outline">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#2563EB" /> Revenue Overview
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
            <p style={{ color: '#64748B' }}>Revenue Chart Visualization Coming Soon</p>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="#10B981" /> Occupancy Rates
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
            <p style={{ color: '#64748B' }}>Occupancy Chart Visualization Coming Soon</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart size={20} color="#F59E0B" /> Collection Efficiency
        </h3>
        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
          <p style={{ color: '#64748B' }}>Collection Efficiency Bar Chart Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
