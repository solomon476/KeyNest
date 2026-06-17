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

  const handleDemoLogin = (e, role) => {
    e.preventDefault();
    if (!email) {
       alert("Please enter your credentials first");
       return;
    }
    // Simulate authentication based on selected role
    onLogin({ role: role, name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}` });
    navigate(`/${role}`);
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

        <div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email or Phone</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 0712345678 or landlord@keynest.com" 
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
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B', marginBottom: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sign In As
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={(e) => { setSelectedRole('landlord'); handleDemoLogin(e, 'landlord'); }}
                className="btn btn-outline" 
                style={{ padding: '0.875rem', justifyContent: 'center', fontSize: '1rem', backgroundColor: '#fff', width: '100%', borderColor: '#2563EB', color: '#2563EB' }}>
                <Shield size={20} style={{ marginRight: '0.5rem' }} /> Landlord
              </button>
              <button 
                onClick={(e) => { setSelectedRole('caretaker'); handleDemoLogin(e, 'caretaker'); }}
                className="btn btn-outline" 
                style={{ padding: '0.875rem', justifyContent: 'center', fontSize: '1rem', backgroundColor: '#fff', width: '100%', borderColor: '#10B981', color: '#10B981' }}>
                <Building2 size={20} style={{ marginRight: '0.5rem' }} /> Caretaker
              </button>
              <button 
                onClick={(e) => { setSelectedRole('tenant'); handleDemoLogin(e, 'tenant'); }}
                className="btn btn-outline" 
                style={{ padding: '0.875rem', justifyContent: 'center', fontSize: '1rem', backgroundColor: '#fff', width: '100%', borderColor: '#F59E0B', color: '#F59E0B' }}>
                <UserCircle size={20} style={{ marginRight: '0.5rem' }} /> Tenant
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
