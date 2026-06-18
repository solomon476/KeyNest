import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ tenantId: '', unitId: '', startDate: '', endDate: '', depositAmount: '', rentAmount: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const landlordId = user.id || 1;
      const [leasesRes, tenantsRes, unitsRes] = await Promise.all([
        api.get('/leases'), // Again, backend could filter by landlord via unit->property->landlord
        api.get(`/tenants?landlordId=${landlordId}`),
        api.get('/units') // Assuming filtering later or just showing all landlord's units
      ]);
      setLeases(leasesRes.data);
      setTenants(tenantsRes.data);
      
      // Filter out units that are already occupied
      const vacantUnits = unitsRes.data.filter(u => u.status === 'vacant');
      setUnits(vacantUnits);

      if (tenantsRes.data.length > 0 && vacantUnits.length > 0) {
          setFormData(prev => ({
              ...prev, 
              tenantId: tenantsRes.data[0].id, 
              unitId: vacantUnits[0].id,
              rentAmount: vacantUnits[0].rent_amount
          }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updates = { [name]: value };
    
    // Auto-fill rent amount if unit is selected
    if (name === 'unitId') {
        const selectedUnit = units.find(u => u.id.toString() === value);
        if (selectedUnit) {
            updates.rentAmount = selectedUnit.rent_amount;
        }
    }
    
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leases', formData);
      await fetchData();
      setShowForm(false);
      // Reset form
      if (tenants.length > 0 && units.length > 0) {
          setFormData({ 
              tenantId: tenants[0].id, 
              unitId: units[0].id, 
              startDate: '', 
              endDate: '', 
              depositAmount: '', 
              rentAmount: units[0].rent_amount 
          });
      }
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div>Loading leases...</div>;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Leases</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage rental agreements and assignments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Create Lease'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create New Lease</h2>
          {tenants.length === 0 || units.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '8px' }}>
                  Please ensure you have added at least one tenant and have at least one vacant unit available before creating a lease.
              </div>
          ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Tenant *</label>
                <select required name="tenantId" value={formData.tenantId} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Unit *</label>
                <select required name="unitId" value={formData.unitId} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.unit_number} - {u.property_name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Start Date *</label>
                <input type="date" required name="startDate" value={formData.startDate} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Agreed Rent Amount *</label>
                <input type="number" required name="rentAmount" value={formData.rentAmount} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Deposit Amount *</label>
                <input type="number" required name="depositAmount" value={formData.depositAmount} onChange={handleInputChange} className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
            </div>

            <div style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Create Lease</button>
            </div>
          </form>
          )}
        </div>
      )}

      <div className="card">
        <div className="table-container">
          {leases.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              <FileText size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <p>No leases found.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Start Date</th>
                  <th>Rent Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leases.map(lease => (
                  <tr key={lease.id}>
                    <td style={{ fontWeight: 600 }}>{lease.first_name} {lease.last_name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{lease.unit_number}</td>
                    <td>{new Date(lease.start_date).toLocaleDateString()}</td>
                    <td>KES {lease.rent_amount}</td>
                    <td>
                      <span className={`badge ${lease.status === 'active' ? 'badge-paid' : 'badge-pending'}`}>
                        {lease.status}
                      </span>
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
