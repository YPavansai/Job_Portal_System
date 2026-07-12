import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, Menu, X, User as UserIcon, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCandidate, isRecruiter, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderTop: 'none', borderInline: 'none', borderRadius: '0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        {/* Brand logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={20} color="#ffffff" />
          </div>
          <span>Career<span style={{ color: 'var(--primary)' }}>Sphere</span></span>
        </Link>

        {/* Desktop menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-desktop">
          <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 550, color: 'var(--text-main)' }} className="nav-link">
            <Search size={16} />
            Find Jobs
          </Link>

          {isAuthenticated && isCandidate && (
            <Link to="/candidate-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 550 }} className="nav-link">
              <LayoutDashboard size={16} />
              My Profile
            </Link>
          )}

          {isAuthenticated && isRecruiter && (
            <Link to="/recruiter-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 550 }} className="nav-link">
              <LayoutDashboard size={16} />
              Employer Console
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link to="/admin-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 550 }} className="nav-link">
              <LayoutDashboard size={16} />
              Admin Console
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={14} className="text-primary" style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'RECRUITER' ? user?.companyName : 'Candidate'}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="nav-mobile-toggle">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div style={{ display: 'none', flexDirection: 'column', padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)', gap: '1.25rem' }} className="nav-mobile-menu">
          <Link to="/jobs" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 550 }}>
            <Search size={18} />
            Find Jobs
          </Link>
          
          {isAuthenticated && isCandidate && (
            <Link to="/candidate-dashboard" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 550 }}>
              <LayoutDashboard size={18} />
              My Profile & Applications
            </Link>
          )}

          {isAuthenticated && isRecruiter && (
            <Link to="/recruiter-dashboard" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 550 }}>
              <LayoutDashboard size={18} />
              Employer Console
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 550 }}>
              <LayoutDashboard size={18} />
              Admin Console
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'RECRUITER' ? 'Employer' : 'Candidate'}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* Custom styles just for Navbar responsive display toggle */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
          .nav-mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
