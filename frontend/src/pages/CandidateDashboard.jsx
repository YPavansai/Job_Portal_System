import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, FileText, CheckCircle2, ShieldAlert, Upload, Phone, Edit, Calendar, MapPin, Eye, X, Download } from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'profile'

  // Application and Stats States
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ totalApplications: 0, shortlistedCount: 0, underReviewCount: 0, rejectedCount: 0, acceptedCount: 0 });
  const [loadingApps, setLoadingApps] = useState(true);

  // Profile Form States
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Modal display for viewing cover letters
  const [selectedApp, setSelectedApp] = useState(null);

  // Alert Notifications
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [profileError, setProfileError] = useState('');

  // Fetch candidate applications & metrics
  const fetchApplicationsAndStats = async () => {
    setLoadingApps(true);
    try {
      const appsRes = await axios.get('/applications/my-applications');
      setApplications(appsRes.data);

      const statsRes = await axios.get('/applications/stats');
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
      showAlert('error', 'Failed to retrieve application history.');
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch candidate profile data
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await axios.get(`/profiles/candidate/${user.id}`);
      const data = response.data;
      setPhone(data.phone || '');
      setTitle(data.title || '');
      setBio(data.bio || '');
      setSkills(data.skills || '');
      setEducation(data.education || '');
      setExperience(data.experience || '');
      setResumeUrl(data.resumeUrl || '');
    } catch (e) {
      console.error(e);
      showAlert('error', 'Failed to load profile details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchApplicationsAndStats();
      fetchProfile();
    }
  }, [user]);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: '', text: '' }), 5000);
  };

  // Handle profile updates
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    try {
      const payload = { phone, title, bio, skills, education, experience, resumeUrl };
      const response = await axios.put('/profiles/candidate', payload);
      showAlert('success', 'Candidate Profile updated successfully!');
      
      // Update local credentials if needed
      setPhone(response.data.phone);
      setTitle(response.data.title);
      setBio(response.data.bio);
      setSkills(response.data.skills);
      setEducation(response.data.education);
      setExperience(response.data.experience);
      setResumeUrl(response.data.resumeUrl);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Could not save profile.');
    }
  };

  // Handle uploading resume inside profile
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('File size exceeds the 5MB limit.');
      return;
    }

    setUploadingResume(true);
    setProfileError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/profiles/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResumeUrl(response.data.resumeUrl);
      showAlert('success', 'Resume document uploaded successfully!');
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const getProfileCompletion = () => {
    let score = 0;
    const total = 7;
    if (phone && phone.trim()) score++;
    if (title && title.trim()) score++;
    if (bio && bio.trim()) score++;
    if (skills && skills.trim()) score++;
    if (education && education.trim()) score++;
    if (experience && experience.trim()) score++;
    if (resumeUrl && resumeUrl.trim()) score++;
    return Math.round((score / total) * 100);
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Alert Panel */}
      {alert.text && (
        <div className={`alert alert-${alert.type}`} style={{ margin: 0 }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span>{alert.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid-3 stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', padding: '10px', borderRadius: '10px' }}>
            <Briefcase size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Applied Jobs</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalApplications}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--success-bg)', padding: '10px', borderRadius: '10px' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Shortlisted</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.shortlistedCount + stats.acceptedCount}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--warning-bg)', padding: '10px', borderRadius: '10px' }}>
            <Calendar size={22} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Under Review</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.underReviewCount}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--danger-bg)', padding: '10px', borderRadius: '10px' }}>
            <ShieldAlert size={22} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Rejected</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="dashboard-grid">
        
        {/* Sidebar Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button 
              onClick={() => setActiveTab('applications')}
              className="btn" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === 'applications' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'applications' ? '#ffffff' : 'var(--text-main)',
                padding: '0.75rem 1rem'
              }}
            >
              <Briefcase size={16} />
              Applied Jobs
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className="btn" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'profile' ? '#ffffff' : 'var(--text-main)',
                padding: '0.75rem 1rem'
              }}
            >
              <User size={16} />
              My Profile Portfolio
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div>
          {activeTab === 'applications' ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Application History
              </h3>

              {loadingApps ? (
                Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-sm)' }}></div>
                ))
              ) : applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Briefcase size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No applications submitted yet.</p>
                  <p style={{ fontSize: '0.85rem' }}>Explore active job listings and submit your profile.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Job Posting</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Location</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Applied On</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Pipeline Status</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 700 }}>{app.jobTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.companyName}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>{app.jobLocation}</td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                            <span className={`badge badge-${(app.status || 'APPLIED').toLowerCase()}`}>
                              {(app.status || 'APPLIED').replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                              <button 
                                onClick={() => setSelectedApp(app)} 
                                className="btn btn-outline" 
                                title="View Application Details"
                                style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center' }}
                              >
                                <Eye size={14} />
                              </button>
                              {app.resumeUrl && (
                                <a 
                                  href={`http://127.0.0.1:8080${app.resumeUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline"
                                  title="Download Submitted Resume"
                                  style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', color: 'var(--primary)', borderColor: 'rgba(99,102,241,0.2)' }}
                                >
                                  <Download size={14} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Profile Tab */
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Professional Portfolio Settings
              </h3>

              {loadingProfile ? (
                <div className="skeleton" style={{ height: '350px' }}></div>
              ) : (
                <>
                  {/* Profile Completion Meter */}
                  <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.3)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Profile Portfolio Completion</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{getProfileCompletion()}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${getProfileCompletion()}%`, height: '100%', backgroundColor: getProfileCompletion() === 100 ? '#10b981' : 'var(--primary)', transition: 'width 0.4s ease' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {getProfileCompletion() === 100 
                        ? 'Amazing! Your profile is fully complete.' 
                        : 'Complete all sections (phone, headline, biography, skills, education, experience, resume) to reach 100% and stand out to recruiters.'}
                    </span>
                  </div>

                  <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {profileError && (
                      <div className="alert alert-error" style={{ fontSize: '0.85rem', padding: '0.75rem 1rem' }}>
                        <ShieldAlert size={16} />
                        <span>{profileError}</span>
                      </div>
                    )}

                  {/* Personal Block */}
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="candName">Full Name</label>
                      <input 
                        type="text" 
                        id="candName" 
                        value={user.name} 
                        className="form-control" 
                        disabled 
                        style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="candEmail">Email Address</label>
                      <input 
                        type="email" 
                        id="candEmail" 
                        value={user.email} 
                        className="form-control" 
                        disabled 
                        style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="candPhone">Contact Phone</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="tel" 
                          id="candPhone" 
                          placeholder="+1 555-0199" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          className="form-control" 
                          style={{ paddingLeft: '2.25rem' }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="candTitle">Professional Headline</label>
                      <div style={{ position: 'relative' }}>
                        <Edit size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          id="candTitle" 
                          placeholder="Senior React Developer | B.Tech CSE" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          className="form-control" 
                          style={{ paddingLeft: '2.25rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Block */}
                  <div className="form-group">
                    <label className="form-label">Default Resume Document</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {resumeUrl ? (
                        <a 
                          href={`http://127.0.0.1:8080${resumeUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline" 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}
                        >
                          <FileText size={16} />
                          View Uploaded Resume
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No default resume uploaded.</span>
                      )}
                      
                      <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                        <Upload size={16} />
                        {uploadingResume ? 'Uploading...' : 'Upload New File'}
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          style={{ display: 'none' }}
                          disabled={uploadingResume}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="candBio">Professional Biography</label>
                    <textarea 
                      id="candBio" 
                      placeholder="Brief summary of your professional expertise, career goals..." 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="form-control"
                      style={{ minHeight: '100px' }}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="candSkills">Skills (Comma-separated)</label>
                    <input 
                      type="text" 
                      id="candSkills" 
                      placeholder="React, Java, Spring Boot, SQL, REST APIs" 
                      value={skills} 
                      onChange={(e) => setSkills(e.target.value)} 
                      className="form-control" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="candEducation">Educational History</label>
                    <textarea 
                      id="candEducation" 
                      placeholder="University name, degree details, GPA, graduation dates..." 
                      value={education} 
                      onChange={(e) => setEducation(e.target.value)} 
                      className="form-control"
                      style={{ minHeight: '80px' }}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="candExp">Professional Experience</label>
                    <textarea 
                      id="candExp" 
                      placeholder="Job title, company names, key achievements, timestamps..." 
                      value={experience} 
                      onChange={(e) => setExperience(e.target.value)} 
                      className="form-control"
                      style={{ minHeight: '100px' }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2.5rem' }}>
                    Save Profile Changes
                  </button>

                </form>
              </>
            )}
            </div>
          )}
        </div>

      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Application Details</h3>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{selectedApp.jobTitle}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedApp.companyName} • {selectedApp.jobLocation}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Status</span>
                <span className={`badge badge-${(selectedApp.status || 'APPLIED').toLowerCase()}`} style={{ marginBottom: '1.25rem' }}>{(selectedApp.status || 'APPLIED').replace('_', ' ')}</span>

                {/* Progress Stepper Timeline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', position: 'relative', padding: '0 0.5rem' }}>
                  {/* Connection line background */}
                  <div style={{ position: 'absolute', top: '16px', left: '8%', right: '8%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }}></div>
                  {/* Connection line active progress */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    left: '8%', 
                    width: selectedApp.status === 'REJECTED' 
                      ? '42%' 
                      : `${(selectedApp.status === 'ACCEPTED' ? 3 : selectedApp.status === 'SHORTLISTED' ? 2 : selectedApp.status === 'UNDER_REVIEW' ? 1 : 0) * 42}%`, 
                    height: '2px', 
                    backgroundColor: selectedApp.status === 'REJECTED' ? 'var(--danger)' : 'var(--primary)', 
                    transition: 'width 0.4s ease',
                    zIndex: 1 
                  }}></div>
                  
                  {/* Step 1: Applied */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--primary)', 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '0.8rem',
                      border: '3px solid var(--bg-surface)' 
                    }}>1</div>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-main)', fontWeight: 550 }}>Applied</span>
                  </div>

                  {/* Step 2: Under Review */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: (selectedApp.status !== 'APPLIED' || selectedApp.status === 'REJECTED') ? 'var(--primary)' : 'var(--border-color-light)', 
                      color: (selectedApp.status !== 'APPLIED' || selectedApp.status === 'REJECTED') ? '#ffffff' : 'var(--text-muted)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '0.8rem',
                      border: '3px solid var(--bg-surface)',
                      outline: selectedApp.status === 'UNDER_REVIEW' ? '2px solid var(--primary)' : 'none'
                    }}>2</div>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: (selectedApp.status !== 'APPLIED' || selectedApp.status === 'REJECTED') ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 550 }}>Reviewing</span>
                  </div>

                  {/* Step 3: Shortlisted / Rejected */}
                  {selectedApp.status === 'REJECTED' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--danger)', 
                        color: '#ffffff', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 700, 
                        fontSize: '0.8rem',
                        border: '3px solid var(--bg-surface)' 
                      }}>X</div>
                      <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--danger)', fontWeight: 550 }}>Rejected</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: (selectedApp.status === 'SHORTLISTED' || selectedApp.status === 'ACCEPTED') ? 'var(--primary)' : 'var(--border-color-light)', 
                          color: (selectedApp.status === 'SHORTLISTED' || selectedApp.status === 'ACCEPTED') ? '#ffffff' : 'var(--text-muted)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 700, 
                          fontSize: '0.8rem',
                          border: '3px solid var(--bg-surface)',
                          outline: selectedApp.status === 'SHORTLISTED' ? '2px solid var(--primary)' : 'none'
                        }}>3</div>
                        <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: (selectedApp.status === 'SHORTLISTED' || selectedApp.status === 'ACCEPTED') ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 550 }}>Shortlisted</span>
                      </div>

                      {/* Step 4: Hired */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: selectedApp.status === 'ACCEPTED' ? 'var(--success)' : 'var(--border-color-light)', 
                          color: selectedApp.status === 'ACCEPTED' ? '#ffffff' : 'var(--text-muted)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 700, 
                          fontSize: '0.8rem',
                          border: '3px solid var(--bg-surface)',
                          outline: selectedApp.status === 'ACCEPTED' ? '2px solid var(--success)' : 'none'
                        }}>4</div>
                        <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: selectedApp.status === 'ACCEPTED' ? 'var(--success)' : 'var(--text-muted)', fontWeight: 550 }}>Hired</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Submitted Resume</span>
                <a 
                  href={`http://127.0.0.1:8080${selectedApp.resumeUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  <FileText size={16} />
                  View Submitted Resume
                </a>
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Cover Letter</span>
                  <p style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-line', border: '1px solid var(--border-color)' }}>
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                Applied on: {new Date(selectedApp.appliedAt).toLocaleString()}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedApp(null)} className="btn btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CandidateDashboard;
