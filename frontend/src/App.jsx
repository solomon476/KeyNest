import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import LandlordDashboard from './pages/LandlordDashboard';
import CaretakerDashboard from './pages/CaretakerDashboard';
import TenantDashboard from './pages/TenantDashboard';

function App() {
  // Mock authentication state
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {/* Protected Routes */}
        <Route 
          path="/landlord/*" 
          element={user?.role === 'landlord' ? <LandlordDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/caretaker/*" 
          element={user?.role === 'caretaker' ? <CaretakerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/tenant/*" 
          element={user?.role === 'tenant' ? <TenantDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
