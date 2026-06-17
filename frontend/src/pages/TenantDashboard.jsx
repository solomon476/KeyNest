import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, Wrench, Menu, LogOut, Bell, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import MyUnit from '../components/tenant/MyUnit';
import Maintenance from '../components/tenant/Maintenance';
import Payments from '../components/shared/Payments';

export default function TenantDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('Overview');
  const navigate = useNavigate();

  const handleAction = (e, feature) => {
    e.preventDefault();
    if (['Overview', 'My Unit', 'Maintenance', 'Payments'].includes(feature)) {
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
          <a href="#" onClick={(e) => handleAction(e, 'My Unit')} className={`nav-item ${currentView === 'My Unit' ? 'active' : ''}`}><Home size={20} /> My Unit</a>
          <a href="#" onClick={(e) => handleAction(e, 'Payments')} className={`nav-item ${currentView === 'Payments' ? 'active' : ''}`}><CreditCard size={20} /> Payments</a>
          <a href="#" onClick={(e) => handleAction(e, 'Maintenance')} className={`nav-item ${currentView === 'Maintenance' ? 'active' : ''}`}><Wrench size={20} /> Maintenance</a>
        </nav>

        <div className="flex-col" style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="#" className="nav-item" onClick={handleLogout}><LogOut size={20} /> Log Out</a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B' }}>Tenant Portal</div>
          </div>
          
          <div className="flex items-center gap-6">
            <Bell size={24} color="#64748B" />
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              TN
            </div>
          </div>
        </header>

        <div className="content-area">
          {currentView === 'Overview' && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome Home</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Apt 4B • Greenways Apartments</p>
              </div>

              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Payment Summary */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>CURRENT BALANCE</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--status-overdue)', margin: '0.5rem 0' }}>KES 25,000</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Due by Oct 5th, 2026</div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem', backgroundColor: '#10B981' }} onClick={(e) => handleAction(e, 'M-Pesa Payment')}>
                    Pay Now with M-Pesa
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Activity</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <CheckCircle color="#10B981" size={24} style={{ marginTop: '0.125rem' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>Rent Payment Received</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>KES 25,000 via M-Pesa (Ref: TRX-001)</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.25rem' }}>Sep 1, 2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentView === 'My Unit' && (
            <MyUnit />
          )}

          {currentView === 'Maintenance' && (
            <Maintenance />
          )}

          {currentView === 'Payments' && (
            <Payments />
          )}
        </div>
      </main>
    </div>
  );
}
