import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Wrench, FileText, CheckCircle, Clock, Menu, LogOut, Bell } from 'lucide-react';
import logo from '../assets/logo.png';
import MaintenanceTasks from '../components/landlord/MaintenanceTasks';

const MOCK_TASKS = [
  { id: 1, unit: 'Apt 4B', issue: 'Leaking Faucet', status: 'pending' },
  { id: 2, unit: 'Apt 1A', issue: 'Broken Door Lock', status: 'in-progress' },
  { id: 3, unit: 'Shop 2', issue: 'Paint Touch-up', status: 'completed' },
];

export default function CaretakerDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const navigate = useNavigate();

  const handleAction = (e, feature) => {
    e.preventDefault();
    if (['Overview', 'Maintenance'].includes(feature)) {
      setCurrentView(feature);
    } else {
      alert(`${feature} feature coming soon!`);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if(onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className={`mobile-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', padding: '0.25rem 0' }}>
          <img src={logo} alt="KeyNest" style={{ maxHeight: '45px', objectFit: 'contain' }} />
        </div>
        
        <nav className="flex-col" style={{ flex: 1 }}>
          <a href="#" onClick={(e) => handleAction(e, 'Overview')} className={`nav-item ${currentView === 'Overview' ? 'active' : ''}`}><Home size={20} /> Overview</a>
          <a href="#" onClick={(e) => handleAction(e, 'My Properties')} className="nav-item"><Home size={20} /> My Properties</a>
          <a href="#" onClick={(e) => handleAction(e, 'Maintenance')} className={`nav-item ${currentView === 'Maintenance' ? 'active' : ''}`}><Wrench size={20} /> Maintenance Tasks</a>
          <a href="#" onClick={(e) => handleAction(e, 'Meter Readings')} className="nav-item"><FileText size={20} /> Meter Readings</a>
        </nav>

        <div className="flex-col" style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="#" className="nav-item" onClick={handleLogout}><LogOut size={20} /> Log Out</a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>Caretaker Portal</div>
          </div>
          
          <div className="flex items-center gap-6">
            <Bell size={24} color="#64748B" />
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              CT
            </div>
          </div>
        </header>

        <div className="content-area">
          {currentView === 'Overview' && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Caretaker Portal</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your assigned tasks and properties.</p>
              </div>

              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Maintenance Tasks */}
                <div className="card">
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Active Maintenance Tasks</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {MOCK_TASKS.map(task => (
                      <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{task.unit}</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{task.issue}</div>
                        </div>
                        {task.status === 'pending' && <Clock color="#F59E0B" size={20} />}
                        {task.status === 'in-progress' && <Wrench color="#3B82F6" size={20} />}
                        {task.status === 'completed' && <CheckCircle color="#10B981" size={20} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Actions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => handleAction(e, 'Record Payment')}>Record Cash Payment</button>
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => handleAction(e, 'Submit Reading')}>Submit Water Reading</button>
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => handleAction(e, 'Report Issue')}>Report New Issue</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentView === 'Maintenance' && (
            <MaintenanceTasks />
          )}
        </div>
      </main>
    </div>
  );
}
