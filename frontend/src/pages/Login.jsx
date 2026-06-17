import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeySquare, UserCircle, Shield, Building2, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

const backgrounds = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg'
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleDemoLogin = (e) => {
    e.preventDefault();
    // Simulate authentication based on selected role
    onLogin({ role: selectedRole, name: `Demo ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` });
    navigate(`/${selectedRole}`);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Slideshow */}
      {backgrounds.map((bg, idx) => (
        <div 
          key={bg}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgIndex === idx ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: -2
          }}
        />
      ))}
      {/* Dark Overlay for readability */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: -1
      }} />

      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '2.5rem', 
        borderRadius: '16px', 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' 
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="KeyNest" style={{ height: '48px', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>Welcome to KeyNest</h1>
          <p style={{ color: '#64748B', marginTop: '0.5rem' }}>Your complete rental management system</p>
        </div>

        {!selectedRole ? (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#334155', marginBottom: '1.5rem', textAlign: 'center' }}>
              Select your role to continue:
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => setSelectedRole('landlord')}
                className="btn btn-outline" 
                style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.05rem', backgroundColor: '#fff' }}>
                <Shield size={24} color="#2563EB" style={{ marginRight: '0.75rem' }} /> I am a Landlord
              </button>
              <button 
                onClick={() => setSelectedRole('caretaker')}
                className="btn btn-outline" 
                style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.05rem', backgroundColor: '#fff' }}>
                <Building2 size={24} color="#10B981" style={{ marginRight: '0.75rem' }} /> I am a Caretaker
              </button>
              <button 
                onClick={() => setSelectedRole('tenant')}
                className="btn btn-outline" 
                style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.05rem', backgroundColor: '#fff' }}>
                <UserCircle size={24} color="#F59E0B" style={{ marginRight: '0.75rem' }} /> I am a Tenant
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDemoLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setSelectedRole(null)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748B', fontWeight: 500, padding: 0 }}
              >
                <ArrowLeft size={18} style={{ marginRight: '0.25rem' }} /> Back
              </button>
              <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>
                {selectedRole} Login
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email or Phone</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 0712345678" 
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
              Sign In
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
