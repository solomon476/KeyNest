import React, { useState, useEffect } from 'react';
import { 
  Home, Building2, Users, CreditCard, 
  Wrench, BarChart3, Settings, Menu, 
  Bell, Search, Plus, KeySquare, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Properties from '../components/landlord/Properties';
import Units from '../components/landlord/Units';
import Tenants from '../components/landlord/Tenants';
import Leases from '../components/landlord/Leases';
import MaintenanceTasks from '../components/landlord/MaintenanceTasks';
import Payments from '../components/shared/Payments';
import Reports from '../components/landlord/Reports';
import SettingsView from '../components/shared/Settings';
import AIAssistant from '../components/shared/AIAssistant';
import Caretakers from '../components/landlord/Caretakers';
import CommunicationHub from '../components/shared/CommunicationHub';

import { getDashboardStats, getPayments } from '../services/api';


function LandlordDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [sendingReminders, setSendingReminders] = useState(false);
  const [showCommHub, setShowCommHub] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [paymentsList, setPaymentsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, paymentsData] = await Promise.all([
          getDashboardStats(),
          getPayments()
        ]);
        setDashboardStats(statsData);
        setPaymentsList(paymentsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  // Handle various actions from the dashboard navigation and buttons
  const handleAction = (e, feature) => {
    e.preventDefault();
    if (['Dashboard', 'Properties', 'Units', 'Tenants', 'Leases', 'Caretakers', 'Maintenance', 'Payments', 'Reports', 'Settings'].includes(feature)) {
      setCurrentView(feature);
    } else if (feature === 'Send Reminders') {
      setSendingReminders(true);
      setTimeout(() => {
        setSendingReminders(false);
        alert('Reminders sent successfully to tenants with overdue balances!');
      }, 1500);
    } else if (feature === 'Add Property') {
      setCurrentView('Properties');
    } else if (feature === 'View All Payments') {
      setCurrentView('Payments');
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
          <a href="#" onClick={(e) => handleAction(e, 'Units')} className={`nav-item ${currentView === 'Units' ? 'active' : ''}`}><Home size={20} /> Units</a>
          <a href="#" onClick={(e) => handleAction(e, 'Tenants')} className={`nav-item ${currentView === 'Tenants' ? 'active' : ''}`}><Users size={20} /> Tenants</a>
          <a href="#" onClick={(e) => handleAction(e, 'Leases')} className={`nav-item ${currentView === 'Leases' ? 'active' : ''}`}><KeySquare size={20} /> Leases</a>
          <a href="#" onClick={(e) => handleAction(e, 'Caretakers')} className={`nav-item ${currentView === 'Caretakers' ? 'active' : ''}`}><Users size={20} /> Caretakers</a>
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

          <div className="flex items-center header-actions">
            <button className="btn btn-primary" onClick={(e) => handleAction(e, 'Add Property')}><Plus size={18} /> <span className="hide-mobile">Add Property</span></button>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowCommHub(true)}>
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
                <button className="btn btn-accent" onClick={(e) => handleAction(e, 'Send Reminders')} disabled={sendingReminders} style={{ opacity: sendingReminders ? 0.7 : 1 }}>
                  {sendingReminders ? 'Sending...' : 'Send Rent Reminders'}
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2rem' }}>
                <div className="card stat-card">
                  <div>
                    <div className="stat-title">Total Rent Collected</div>
                    <div className="stat-value">KES {dashboardStats?.totalRentCollected?.toLocaleString() || '0'}</div>
                  </div>
                  <div className="stat-icon-wrapper accent"><CreditCard size={24} /></div>
                </div>
                <div className="card stat-card">
                  <div>
                    <div className="stat-title">Pending Balances</div>
                    <div className="stat-value">KES {dashboardStats?.pendingBalances?.toLocaleString() || '0'}</div>
                  </div>
                  <div className="stat-icon-wrapper"><BarChart3 size={24} /></div>
                </div>
                <div className="card stat-card">
                  <div>
                    <div className="stat-title">Occupancy Rate</div>
                    <div className="stat-value">{dashboardStats?.occupancyRate || '0'}%</div>
                  </div>
                  <div className="stat-icon-wrapper"><Users size={24} /></div>
                </div>
                <div className="card stat-card">
                  <div>
                    <div className="stat-title">Overdue Accounts</div>
                    <div className="stat-value">{dashboardStats?.overdueAccounts || '0'}</div>
                  </div>
                  <div className="stat-icon-wrapper"><Bell size={24} /></div>
                </div>
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
                      {paymentsList.slice(0, 5).map((payment) => (
                        <tr key={payment.id}>
                          <td style={{ fontWeight: 500 }}>{payment.id}</td>
                          <td>{payment.first_name} {payment.last_name}</td>
                          <td style={{ color: 'var(--color-text-muted)' }}>{payment.unit_number}</td>
                          <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 600 }}>KES {parseFloat(payment.amount).toLocaleString()}</td>
                          <td>
                            <span className={`badge badge-${payment.status}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {paymentsList.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No recent payments found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {currentView === 'Properties' && (
            <Properties />
          )}

          {currentView === 'Units' && (
            <Units />
          )}

          {currentView === 'Tenants' && (
            <Tenants />
          )}

          {currentView === 'Leases' && (
            <Leases />
          )}

          {currentView === 'Caretakers' && (
            <Caretakers />
          )}

          {currentView === 'Maintenance' && (
            <MaintenanceTasks />
          )}

          {currentView === 'Payments' && (
            <Payments />
          )}

          {currentView === 'Reports' && (
            <Reports />
          )}

          {currentView === 'Settings' && (
            <SettingsView />
          )}
        </div>
      </main>

      <AIAssistant />
      {showCommHub && <CommunicationHub onClose={() => setShowCommHub(false)} />}
    </div>
  );
}

export default LandlordDashboard;
