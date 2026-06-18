import React, { useState, useEffect } from 'react';
import { approveLease, rejectLease } from '../../services/api';
import api from '../../services/api'; // direct api access for leases

export default function Approvals() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLeases();
  }, []);

  const fetchPendingLeases = async () => {
    try {
      const response = await api.get('/leases');
      const allLeases = response.data || [];
      const pending = allLeases.filter(l => l.approval_status === 'pending');
      setLeases(pending);
    } catch (err) {
      console.error('Failed to fetch leases', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this tenant and finalize lease?")) return;
    try {
      await approveLease(id);
      fetchPendingLeases();
    } catch (err) {
      alert("Failed to approve lease");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this lease application?")) return;
    try {
      await rejectLease(id);
      fetchPendingLeases();
    } catch (err) {
      alert("Failed to reject lease");
    }
  };

  if (loading) return <div>Loading pending approvals...</div>;

  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pending Tenant Approvals</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Unit</th>
              <th>Start Date</th>
              <th>Deposit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leases.map((l) => (
              <tr key={l.id}>
                <td style={{ fontWeight: 500 }}>{l.first_name} {l.last_name}</td>
                <td>{l.unit_number}</td>
                <td>{new Date(l.start_date).toLocaleDateString()}</td>
                <td>KES {l.deposit_amount}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleApprove(l.id)}>Approve</button>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: 'red', borderColor: 'red' }} onClick={() => handleReject(l.id)}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {leases.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No pending lease approvals.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
