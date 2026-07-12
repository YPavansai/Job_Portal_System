import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0f19', color: '#ffffff' }}>
        <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and keep track of current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // User is logged in but doesn't have permissions - redirect home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
