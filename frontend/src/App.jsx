import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Jobs from './pages/Jobs';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    // Wrap the entire app with AuthProvider to manage authentication state globally
    <AuthProvider>
      {/* Router provides navigation and routing functionality */}
      <Router>
        {/* Navbar is always visible at the top */}
        <Navbar />
        
        {/* Main content area where different routes will render */}
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/jobs" element={<Jobs />} />

            {/* Protected routes - only accessible to specific roles */}
            <Route
              path="/candidate-dashboard"
              element={
                // Only users with role 'CANDIDATE' can access CandidateDashboard
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiter-dashboard"
              element={
                // Accessible to both 'RECRUITER' and 'ADMIN' roles
                <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                // Only 'ADMIN' role can access AdminDashboard
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer is always visible at the bottom */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
