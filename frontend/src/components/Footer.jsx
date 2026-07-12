import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', padding: '3rem 0 1.5rem 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem', textAlign: 'left', marginBottom: '2rem' }} className="footer-grid">
          
          {/* Logo & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
              <div style={{ backgroundColor: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={16} color="#ffffff" />
              </div>
              <span>Career<span style={{ color: 'var(--primary)' }}>Sphere</span></span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.6 }}>
              A next-generation job portal enabling students and professionals to discover career milestones and manage hiring pipelines seamlessly.
            </p>
          </div>

          {/* Candidates column */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>For Candidates</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/jobs" style={{ transition: 'color 0.2s' }} className="footer-link">Search Jobs</Link></li>
              <li><Link to="/candidate-dashboard" style={{ transition: 'color 0.2s' }} className="footer-link">Update Profile</Link></li>
              <li><Link to="/candidate-dashboard" style={{ transition: 'color 0.2s' }} className="footer-link">Applications Tracker</Link></li>
            </ul>
          </div>

          {/* Recruiters column */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>For Employers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/recruiter-dashboard" style={{ transition: 'color 0.2s' }} className="footer-link">Post a Job</Link></li>
              <li><Link to="/recruiter-dashboard" style={{ transition: 'color 0.2s' }} className="footer-link">Manage Applications</Link></li>
              <li><Link to="/auth" style={{ transition: 'color 0.2s' }} className="footer-link">Recruiter Register</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '2rem 0 1.5rem 0' }}></div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }} className="footer-bottom">
          <div>
            <span>© {new Date().getFullYear()} CareerSphere. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Built with</span>
            <Heart size={12} style={{ color: 'var(--danger)', fill: 'var(--danger)' }} />
            <span>as a professional portfolio application.</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ transition: 'color 0.2s' }} className="social-link"><Github size={16} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ transition: 'color 0.2s' }} className="social-link"><Linkedin size={16} /></a>
            <a href="mailto:support@careersphere.com" style={{ transition: 'color 0.2s' }} className="social-link"><Mail size={16} /></a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--primary) !important; }
        .social-link:hover { color: var(--primary) !important; }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .footer-bottom { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
