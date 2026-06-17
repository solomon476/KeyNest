import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeySquare, UserCircle, Shield, Building2, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';
import { loginUser } from '../services/api';

const backgrounds = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg'
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
       setError('Please enter both email and password');
       return;
    }

    try {
      setLoading(true);
      // Call actual backend API
      const response = await loginUser({ email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update global state
      onLogin(response.user);
      
      // Redirect based on role
      navigate(`/${response.user.role}`);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="btn btn-primary" 
              style={{ 
                padding: '0.875rem', 
                justifyContent: 'center', 
                fontSize: '1rem', 
                backgroundColor: '#2563EB', 
                color: '#fff', 
                width: '100%', 
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
