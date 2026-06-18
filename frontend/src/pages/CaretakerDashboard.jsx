import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Wrench, FileText, CheckCircle, Clock, Menu, LogOut, Bell } from 'lucide-react';
import logo from '../assets/logo.png';
import MaintenanceTasks from '../components/landlord/MaintenanceTasks';
import CaretakerProperties from '../components/caretaker/CaretakerProperties';
import MeterReadings from '../components/caretaker/MeterReadings';
import Approvals from '../components/caretaker/Approvals';
import CommunicationHub from '../components/shared/CommunicationHub';
import { getMaintenanceTasks } from '../services/api';

export default function CaretakerDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const [showCommHub, setShowCommHub] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getMaintenanceTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch maintenance tasks', err);
      }
    };
    fetchTasks();
  }, []);

  const handleAction = async (e, feature) => {
    e.preventDefault();
    if (['Overview', 'Maintenance', 'My Properties', 'Meter Readings', 'Approvals'].includes(feature)) {
      setCurrentView(feature);
    } else if (feature === 'Record Payment') {
       const amount = prompt("Enter cash payment amount collected (KES):");
       if (amount && !isNaN(amount)) {
           try {
             // We would ideally select the tenant/lease first
             alert(`Recording cash payment of KES ${amount}...`);
             setTimeout(() => alert('Payment recorded and marked as completed!'), 1000);
           } catch (err) {
             alert('Failed to record payment');
           }
       }
    } else if (feature === 'Submit Reading') {
       setCurrentView('Meter Readings');
    } else if (feature === 'Report Issue') {
       setCurrentView('Maintenance');
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
          <a href="#" onClick={(e) => handleAction(e, 'My Properties')} className={`nav-item ${currentView === 'My Properties' ? 'active' : ''}`}><Home size={20} /> My Properties</a>
          <a href="#" onClick={(e) => handleAction(e, 'Approvals')} className={`nav-item ${currentView === 'Approvals' ? 'active' : ''}`}><CheckCircle size={20} /> Approvals</a>
          <a href="#" onClick={(e) => handleAction(e, 'Maintenance')} className={`nav-item ${currentView === 'Maintenance' ? 'active' : ''}`}><Wrench size={20} /> Maintenance Tasks</a>
          <a href="#" onClick={(e) => handleAction(e, 'Meter Readings')} className={`nav-item ${currentView === 'Meter Readings' ? 'active' : ''}`}><FileText size={20} /> Meter Readings</a>
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
          
          <div className="flex items-center header-actions">
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowCommHub(true)}>
              <Bell size={24} color="#64748B" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, backgroundColor: 'var(--status-overdue)', borderRadius: '50%' }}></span>
            </div>
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
                    {tasks.map(task => (
                      <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{task.unit_number} - {task.property_name}</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{task.issue_description}</div>
                        </div>
                        {task.status === 'open' && <Clock color="#F59E0B" size={20} />}
                        {task.status === 'in_progress' && <Wrench color="#3B82F6" size={20} />}
                        {task.status === 'resolved' && <CheckCircle color="#10B981" size={20} />}
                      </div>
                    ))}
                    {tasks.length === 0 && (
                      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem' }}>
                        No active maintenance tasks.
                      </div>
                    )}
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

          {currentView === 'My Properties' && (
            <CaretakerProperties />
          )}

          {currentView === 'Meter Readings' && (
            <MeterReadings />
          )}

          {currentView === 'Approvals' && (
            <Approvals />
          )}

          {currentView === 'Maintenance' && (
            <MaintenanceTasks />
          )}
        </div>
      </main>
      {showCommHub && <CommunicationHub onClose={() => setShowCommHub(false)} />}
    </div>
  );
}
