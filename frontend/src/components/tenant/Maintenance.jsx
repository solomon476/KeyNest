import React, { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle, Clock } from 'lucide-react';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/_/backend/api/maintenance?tenantId=1');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/_/backend/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: 1, unitId: 1, issueDescription }) // Hardcoded IDs for demo
      });
      if (!res.ok) throw new Error('Failed to create request');
      await fetchRequests();
      setShowForm(false);
      setIssueDescription('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Maintenance</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Report and track issues in your unit.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'Cancel' : 'Report Issue'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontWeight: 600 }}>Describe the issue</label>
            <textarea 
              required 
              rows="4" 
              value={issueDescription} 
              onChange={e => setIssueDescription(e.target.value)}
              className="input" 
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              placeholder="E.g., The sink in the kitchen is leaking..."
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Request</button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            No maintenance requests found.
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{req.issue_description}</p>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{new Date(req.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                {req.status === 'open' && <span className="badge badge-pending"><Clock size={12} style={{display:'inline', marginRight: 4}}/> Open</span>}
                {req.status === 'in_progress' && <span className="badge badge-pending" style={{background: '#DBEAFE', color: '#1E40AF'}}><Wrench size={12} style={{display:'inline', marginRight: 4}}/> In Progress</span>}
                {req.status === 'resolved' && <span className="badge badge-paid"><CheckCircle size={12} style={{display:'inline', marginRight: 4}}/> Resolved</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
