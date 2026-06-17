import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png';
import { loginUser, registerUser } from '../services/api';

const backgrounds = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg'
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Shared
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Register only
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('landlord');

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
      navigate(`/${response.user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !phone || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      const response = await registerUser({ name, email, phoneNumber: phone, password, role });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
      navigate(`/${response.user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1.5px solid #E2E8F0',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#F8FAFC',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: -1
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        animation: 'fadeSlideUp 0.4s ease-out'
      }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img src={logo} alt="KeyNest" style={{ height: '44px', marginBottom: '0.75rem' }} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p style={{ color: '#64748B', marginTop: '0.35rem', fontSize: '0.875rem' }}>
            {mode === 'login' ? 'Sign in to your KeyNest account' : 'Start managing your properties today'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '1.75rem',
        }}>
          {['login', 'register'].map((tab) => (
            <button
              key={tab}
              onClick={() => switchMode(tab)}
              style={{
                flex: 1,
                padding: '0.55rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === tab ? '#fff' : 'transparent',
                color: mode === tab ? '#2563EB' : '#64748B',
                boxShadow: mode === tab ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              {tab === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ padding: '0.7rem 1rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', borderLeft: '3px solid #EF4444' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '0.7rem 1rem', background: '#DCFCE7', color: '#166534', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', borderLeft: '3px solid #22C55E' }}>
            {success}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="landlord@keynest.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                padding: '0.875rem',
                background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
              Don't have an account?{' '}
              <span
                onClick={() => switchMode('register')}
                style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign Up
              </span>
            </p>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Kamau"
                style={inputStyle}
                autoComplete="name"
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                style={inputStyle}
                autoComplete="tel"
              />
            </div>
            <div>
              <label style={labelStyle}>I am a</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="landlord">Landlord / Property Owner</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.25rem',
                padding: '0.875rem',
                background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
              Already have an account?{' '}
              <span
                onClick={() => switchMode('login')}
                style={{ color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign In
              </span>
            </p>
          </form>
        )}

      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
