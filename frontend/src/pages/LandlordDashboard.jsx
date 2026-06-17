import React, { useState, useEffect } from 'react';
import { 
  Home, Building2, Users, CreditCard, 
  Wrench, BarChart3, Settings, Menu, 
  Bell, Search, Plus, KeySquare, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Properties from '../components/landlord/Properties';
import Tenants from '../components/landlord/Tenants';
import MaintenanceTasks from '../components/landlord/MaintenanceTasks';
import Payments from '../components/shared/Payments';
import AIAssistant from '../components/shared/AIAssistant';

const MOCK_STATS = [
  { title: 'Total Rent Collected', value: 'KES 450,000', icon: CreditCard, accent: true },
  { title: 'Pending Balances', value: 'KES 85,000', icon: BarChart3 },
  { title: 'Occupancy Rate', value: '92%', icon: Users },
  { title: 'Overdue Accounts', value: '3', icon: Bell, danger: true }
];

const MOCK_PAYMENTS = [
  { id: 'TRX-001', tenant: 'John Doe', unit: 'Apt 4B', amount: 'KES 25,000', date: 'Oct 01, 2026', status: 'paid' },
  { id: 'TRX-002', tenant: 'Mary Wanjiku', unit: 'Shop 2', amount: 'KES 15,000', date: 'Oct 02, 2026', status: 'paid' },
  { id: 'TRX-003', tenant: 'Peter Omondi', unit: 'Apt 1A', amount: 'KES 30,000', date: 'Oct 05, 2026', status: 'pending' },
  { id: 'TRX-004', tenant: 'Sarah Kimani', unit: 'Apt 3C', amount: 'KES 20,000', date: 'Sep 28, 2026', status: 'overdue' },
];

function LandlordDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const navigate = useNavigate();

  const handleAction = (e, feature) => {
    e.preventDefault();
    if (['Dashboard', 'Properties', 'Tenants', 'Maintenance', 'Payments'].includes(feature)) {
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
          <img src={logo} alt="KeyNest Logo" style={{ maxWidth: '100%', height: 'auto', maxHeight: '45px', objectFit: 'contain' }} />
        </div>
        
        <nav className="flex-col" style={{ flex: 1 }}>
          <a href="#" onClick={(e) => handleAction(e, 'Dashboard')} className={`nav-item ${currentView === 'Dashboard' ? 'active' : ''}`}><Home size={20} /> Dashboard</a>
          <a href="#" onClick={(e) => handleAction(e, 'Properties')} className={`nav-item ${currentView === 'Properties' ? 'active' : ''}`}><Building2 size={20} /> Properties</a>
          <a href="#" onClick={(e) => handleAction(e, 'Tenants')} className={`nav-item ${currentView === 'Tenants' ? 'active' : ''}`}><Users size={20} /> Tenants</a>
          <a href="#" onClick={(e) => handleAction(e, 'Payments')} className={`nav-item ${currentView === 'Payments' ? 'active' : ''}`}><CreditCard size={20} /> Payments</a>
          <a href="#" onClick={(e) => handleAction(e, 'Maintenance')} className={`nav-item ${currentView === 'Maintenance' ? 'active' : ''}`}><Wrench size={20} /> Maintenance</a>
          <a href="#" onClick={(e) => handleAction(e, 'Reports')} className="nav-item"><BarChart3 size={20} /> Reports</a>
        </nav>

        <div className="flex-col" style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="#" onClick={(e) => handleAction(e, 'Settings')} className="nav-item"><Settings size={20} /> Settings</a>
          <a href="#" className="nav-item" onClick={handleLogout}><LogOut size={20} /> Log Out</a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="search-bar flex items-center gap-2" style={{ backgroundColor: '#F1F5F9', padding: '0.5rem 1rem', borderRadius: '99px', width: '300px' }}>
              <Search size={18} color="#64748B" />
              <input type="text" placeholder="Search tenants, units..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="btn btn-primary" onClick={(e) => handleAction(e, 'Add Property')}><Plus size={18} /> Add Property</button>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={24} color="#64748B" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, backgroundColor: 'var(--status-overdue)', borderRadius: '50%' }}></span>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              LM
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="content-area">
          {currentView === 'Dashboard' && (
            <>
              <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Overview</h1>
                  <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, Landlord. Here is what is happening across your properties today.</p>
                </div>
                <button className="btn btn-accent" onClick={(e) => handleAction(e, 'Send Reminders')}>Send Rent Reminders</button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2rem' }}>
                {MOCK_STATS.map((stat, i) => (
                  <div key={i} className="card stat-card">
                    <div>
                      <div className="stat-title">{stat.title}</div>
                      <div className="stat-value">{stat.value}</div>
                    </div>
                    <div className={`stat-icon-wrapper ${stat.accent ? 'accent' : ''}`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-time Data Table */}
              <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Payments</h2>
                  <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={(e) => handleAction(e, 'View All Payments')}>View All</button>
                </div>
                
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Tenant</th>
                        <th>Unit</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PAYMENTS.map((payment) => (
                        <tr key={payment.id}>
                          <td style={{ fontWeight: 500 }}>{payment.id}</td>
                          <td>{payment.tenant}</td>
                          <td style={{ color: 'var(--color-text-muted)' }}>{payment.unit}</td>
                          <td>{payment.date}</td>
                          <td style={{ fontWeight: 600 }}>{payment.amount}</td>
                          <td>
                            <span className={`badge badge-${payment.status}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {currentView === 'Properties' && (
            <Properties />
          )}

          {currentView === 'Tenants' && (
            <Tenants />
          )}

          {currentView === 'Maintenance' && (
            <MaintenanceTasks />
          )}

          {currentView === 'Payments' && (
            <Payments />
          )}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
}

export default LandlordDashboard;
