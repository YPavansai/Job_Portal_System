import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, ArrowRight, ShieldCheck, Users, Building, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLoc, setSearchLoc] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, isRecruiter } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append('title', searchTitle);
    if (searchLoc) params.append('location', searchLoc);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '5rem 0 3rem 0', overflow: 'hidden' }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', zIndex: -1 }}></div>

        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2.5rem' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-glow)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, color: '#818cf8' }}>
            <Cpu size={14} />
            AI-Powered Talent Matching System
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.15, fontFamily: 'var(--font-heading)' }}>
              Discover Your Next <span style={{ background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Milestone</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Find the perfect job matching your skill set or source enterprise talent with our secure, streamlined full-stack hiring pipeline.
            </p>
          </div>

          {/* Search bar Card */}
          <form onSubmit={handleSearch} className="glass search-form" style={{ display: 'flex', width: '100%', maxWidth: '850px', padding: '0.75rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color-light)', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '0.5rem', padding: '0.5rem', minWidth: '220px' }}>
              <Search style={{ color: 'var(--primary)' }} size={20} />
              <input 
                type="text" 
                placeholder="Job title, keywords, or skills..." 
                value={searchTitle} 
                onChange={(e) => setSearchTitle(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#ffffff', width: '100%', fontSize: '1rem' }} 
              />
            </div>
            
            {/* Divider */}
            <div style={{ width: '1px', backgroundColor: 'var(--border-color-light)', margin: '0.5rem 0' }} className="search-divider"></div>

            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '0.5rem', padding: '0.5rem', minWidth: '220px' }}>
              <MapPin style={{ color: 'var(--secondary)' }} size={20} />
              <input 
                type="text" 
                placeholder="City, state, or remote..." 
                value={searchLoc} 
                onChange={(e) => setSearchLoc(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', color: '#ffffff', width: '100%', fontSize: '1rem' }} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              Search
            </button>
          </form>

          {/* Metrics Showcase */}
          <div style={{ display: 'flex', width: '100%', maxWidth: '850px', justifyContent: 'space-around', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '2rem', color: '#ffffff' }}>12,000+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Listings</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '2rem', color: '#ffffff' }}>4,500+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Verified Companies</p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '2rem', color: '#ffffff' }}>9,800+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Successful Placements</p>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits / How It Works */}
      <section className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '2.25rem' }}>Designed For Modern Recruitment</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '550px' }}>
              Say goodbye to cluttered recruitment systems. Our system provides direct tools for both candidates and recruiters.
            </p>
          </div>

          <div className="grid-3" style={{ width: '100%' }}>
            
            {/* Card 1 */}
            <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={22} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Dynamic Filtering</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Locate precise job roles using specialized query filters for employment types, experience requirements, and geographical scopes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} style={{ color: 'var(--secondary)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Role-Based Dashboards</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Job seekers manage resumes and education logs, while hiring managers access dedicated applicant lists and state updates.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} style={{ color: 'var(--success)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Interactive Applications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Submit applications with custom cover letters, track status changes in real-time, and download resumes securely.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="glass cta-container" style={{ display: 'flex', padding: '3.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color-light)', position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', textAlign: 'left' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', zIndex: -1 }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '550px' }}>
            <h2 style={{ fontSize: '2rem' }}>Ready To Scale Your Engineering Squad?</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Register an employer account to list job opportunities, review applications, download candidate resumes, and track candidates.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {isAuthenticated ? (
              isRecruiter ? (
                <Link to="/recruiter-dashboard" className="btn btn-primary">
                  Go to Employer Console <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/jobs" className="btn btn-primary">
                  Browse Active Jobs <ArrowRight size={16} />
                </Link>
              )
            ) : (
              <>
                <Link to="/auth?tab=register" className="btn btn-primary">
                  Post a Job Now
                </Link>
                <Link to="/auth?tab=login" className="btn btn-outline">
                  Join as Candidate
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          h1 { font-size: 2.5rem !important; }
          .search-form { flex-direction: column !important; padding: 1.25rem !important; }
          .search-divider { display: none !important; }
          .cta-container { padding: 2rem !important; flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
