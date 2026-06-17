import React, { useState } from 'react';
import { User, Bell, Shield, KeySquare, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Settings</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your account and preferences.</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '0' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', borderRadius: '12px 12px 0 0' }}>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ padding: '1rem 1.5rem', fontWeight: 600, border: 'none', background: 'transparent', borderBottom: activeTab === 'profile' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'profile' ? 'var(--color-primary)' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <User size={18} /> Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
            style={{ padding: '1rem 1.5rem', fontWeight: 600, border: 'none', background: 'transparent', borderBottom: activeTab === 'notifications' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'notifications' ? 'var(--color-primary)' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
            style={{ padding: '1rem 1.5rem', fontWeight: 600, border: 'none', background: 'transparent', borderBottom: activeTab === 'security' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'security' ? 'var(--color-primary)' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Shield size={18} /> Security
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Personal Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Full Name</label>
                  <input className="input" defaultValue={user.name || ''} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Email Address</label>
                  <input className="input" defaultValue={user.email || ''} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Phone Number</label>
                <input className="input" defaultValue={user.phoneNumber || ''} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', maxWidth: '50%' }} />
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ maxWidth: '600px' }}>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Notification Preferences</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <h4 style={{ fontWeight: 600 }}>Email Alerts</h4>
                     <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Receive daily summaries and critical alerts via email.</p>
                   </div>
                   <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem' }} />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <h4 style={{ fontWeight: 600 }}>SMS Notifications</h4>
                     <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Get text messages for late payments and urgent maintenance.</p>
                   </div>
                   <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem' }} />
                 </div>
               </div>
               <button className="btn btn-primary" style={{ marginTop: '2rem' }}>Save Preferences</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Security Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Current Password</label>
                  <input type="password" className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>New Password</label>
                  <input type="password" className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Confirm New Password</label>
                  <input type="password" className="input" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
              </div>
              <button className="btn btn-primary">Update Password</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
