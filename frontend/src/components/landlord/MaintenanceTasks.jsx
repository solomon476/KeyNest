import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Wrench } from 'lucide-react';
import api from '../../services/api';

export default function MaintenanceTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.get(`/maintenance?landlordId=${user.id || 1}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/maintenance/${id}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Maintenance Requests</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage repairs and tenant issues.</p>
      </div>

      <div className="card">
        <div className="table-container">
          {tasks.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              <Wrench size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <p>No active maintenance tasks.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Property/Unit</th>
                  <th>Tenant</th>
                  <th>Issue</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{task.unit_number}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{task.property_name}</div>
                    </td>
                    <td>{task.first_name} {task.last_name}</td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.issue_description}
                    </td>
                    <td>{new Date(task.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${task.status === 'open' ? 'badge-pending' : task.status === 'resolved' ? 'badge-paid' : ''}`}
                            style={task.status === 'in_progress' ? {background: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600} : {}}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={task.status} 
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        className="input"
                        style={{ padding: '0.25rem', fontSize: '0.85rem' }}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
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
