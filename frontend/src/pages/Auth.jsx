import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Building, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Auth = () => {
  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Routing redirect destination
  const from = location.state?.from?.pathname || '/';

  // Tabs state
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('CANDIDATE'); // 'CANDIDATE' or 'RECRUITER'

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'CANDIDATE') {
        navigate('/candidate-dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/recruiter-dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Read URL query params to set active tab if passed
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register' || tabParam === 'login') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingForm(true);

    if (!email || !password || (activeTab === 'register' && !name)) {
      setErrorMsg('Please populate all mandatory fields.');
      setLoadingForm(false);
      return;
    }

    try {
      if (activeTab === 'login') {
        const userData = await login(email, password);
        // Successful login redirects
        if (userData.role === 'CANDIDATE') {
          navigate(from === '/' ? '/candidate-dashboard' : from, { replace: true });
        } else if (userData.role === 'ADMIN') {
          navigate(from === '/' ? '/admin-dashboard' : from, { replace: true });
        } else {
          navigate(from === '/' ? '/recruiter-dashboard' : from, { replace: true });
        }
      } else {
        // Register
        await register(name, email, password, role, role === 'RECRUITER' ? companyName : '');
        setSuccessMsg('Account created successfully! Please sign in.');
        setActiveTab('login');
        // Clear registration fields
        setName('');
        setCompanyName('');
      }
    } catch (err) {
      setErrorMsg(err);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Switch tab buttons */}
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          >
            Sign In
          </div>
          <div 
            className={`tab ${activeTab === 'register' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          >
            Create Account
          </div>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
          {activeTab === 'login' ? 'Welcome Back' : 'Join CareerSphere'}
        </h2>

        {/* Display Alerts */}
        {errorMsg && (
          <div className="alert alert-error" style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }}>
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success" style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Candidate vs Recruiter vs Admin Role Toggle for Register */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label className="form-label">Register As</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <label style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.25rem', cursor: 'pointer', backgroundColor: role === 'CANDIDATE' ? 'var(--primary-glow)' : 'transparent', borderColor: role === 'CANDIDATE' ? 'var(--primary)' : 'var(--border-color)', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    checked={role === 'CANDIDATE'} 
                    onChange={() => setRole('CANDIDATE')} 
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Candidate</span>
                </label>
                <label style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.25rem', cursor: 'pointer', backgroundColor: role === 'RECRUITER' ? 'var(--primary-glow)' : 'transparent', borderColor: role === 'RECRUITER' ? 'var(--primary)' : 'var(--border-color)', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    checked={role === 'RECRUITER'} 
                    onChange={() => setRole('RECRUITER')} 
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Employer</span>
                </label>
                <label style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.25rem', cursor: 'pointer', backgroundColor: role === 'ADMIN' ? 'var(--primary-glow)' : 'transparent', borderColor: role === 'ADMIN' ? 'var(--primary)' : 'var(--border-color)', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="role" 
                    checked={role === 'ADMIN'} 
                    onChange={() => setRole('ADMIN')} 
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin</span>
                </label>
              </div>
            </div>
          )}

          {/* Full Name input for Register */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="form-control" 
                  style={{ paddingLeft: '2.5rem' }} 
                  required
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="form-group">
            <label className="form-label" htmlFor="emailAddress">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                id="emailAddress" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }} 
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group">
            <label className="form-label" htmlFor="passwordInput">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                id="passwordInput" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="form-control" 
                style={{ paddingLeft: '2.5rem' }} 
                required
              />
            </div>
          </div>

          {/* Company Name input for Recruiter Register */}
          {activeTab === 'register' && role === 'RECRUITER' && (
            <div className="form-group">
              <label className="form-label" htmlFor="recCompanyName">Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  id="recCompanyName" 
                  placeholder="Enterprise Inc." 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  className="form-control" 
                  style={{ paddingLeft: '2.5rem' }} 
                  required
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            disabled={loadingForm}
          >
            {loadingForm ? (
              <div className="skeleton" style={{ width: '60px', height: '18px', margin: '0 auto' }}></div>
            ) : (
              activeTab === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
