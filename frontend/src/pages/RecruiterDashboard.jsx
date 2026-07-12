import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, PlusCircle, CheckCircle2, ShieldAlert, FileText, Download, Calendar, Mail, Phone, Edit, X, User, MapPin, Check, Search } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  // Tabs: 'postings' | 'post' | 'applicants'
  const [activeTab, setActiveTab] = useState('postings');

  // Recruiter stats state
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, appliedCount: 0, underReviewCount: 0, shortlistedCount: 0, rejectedCount: 0, acceptedCount: 0 });
  
  // Data states
  const [postings, setPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  
  // Loaders
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  // Form states (Post Job)
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReq, setJobReq] = useState('');
  const [jobLoc, setJobLoc] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [jobExp, setJobExp] = useState('Entry-Level');
  const [formError, setFormError] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [applicantSearch, setApplicantSearch] = useState('');

  // Selected applicant details modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Alerts
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await axios.get('/applications/stats');
      setStats(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPostings = async () => {
    try {
      const response = await axios.get('/jobs/my-postings');
      setPostings(response.data);
    } catch (e) {
      console.error(e);
      showAlert('error', 'Failed to retrieve active job postings.');
    }
  };

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('/applications/my-received');
      setApplicants(response.data);
    } catch (e) {
      console.error(e);
      showAlert('error', 'Failed to retrieve job applications.');
    }
  };

  const loadData = async () => {
    setLoadingData(true);
    await Promise.all([fetchPostings(), fetchApplicants(), fetchStats()]);
    setLoadingData(false);
  };

  useEffect(() => {
    if (user?.role === 'RECRUITER') {
      loadData();
    }
  }, [activeTab, user]);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: '', text: '' }), 5000);
  };

  const [editingJob, setEditingJob] = useState(null);

  const resetForm = () => {
    setJobTitle('');
    setJobDesc('');
    setJobReq('');
    setJobLoc('');
    setJobSalary('');
    setJobType('FULL_TIME');
    setJobExp('Entry-Level');
    setFormError('');
  };

  const handleStartEdit = (job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDesc(job.description);
    setJobReq(job.requirements || '');
    setJobLoc(job.location);
    setJobSalary(job.salaryRange || '');
    setJobType(job.jobType);
    setJobExp(job.experienceLevel);
    setActiveTab('post');
  };

  // Submit new Job Posting / Edit Job Posting
  const handlePostJob = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!jobTitle || !jobDesc || !jobLoc) {
      setFormError('Please fill out all mandatory fields.');
      return;
    }

    try {
      const payload = {
        title: jobTitle,
        description: jobDesc,
        requirements: jobReq,
        location: jobLoc,
        salaryRange: jobSalary,
        jobType,
        experienceLevel: jobExp
      };

      if (editingJob) {
        await axios.put(`/jobs/${editingJob.id}`, payload);
        showAlert('success', `Job posting "${jobTitle}" updated successfully!`);
      } else {
        await axios.post('/jobs', payload);
        showAlert('success', `Job posting "${jobTitle}" created successfully!`);
      }

      resetForm();
      setEditingJob(null);
      setActiveTab('postings');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Could not save job posting.');
    }
  };

  // Triggered when recruiter clicks view profile modal
  const handleViewApplicant = async (app) => {
    setSelectedApp(app);
    setLoadingProfile(true);
    setCandidateProfile(null);
    try {
      const response = await axios.get(`/profiles/candidate/${app.candidateId}`);
      setCandidateProfile(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Update applicant pipeline status
  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status: newStatus });
      showAlert('success', 'Candidate status updated successfully!');
      
      // Reload lists and stats
      fetchApplicants();
      fetchStats();

      // Close details modal
      setSelectedApp(null);
      setCandidateProfile(null);
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to update applicant status.');
    }
  };

  // Delete Job Posting
  const handleDeletePosting = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to deactivate "${title}"?`)) {
      return;
    }
    try {
      await axios.delete(`/jobs/${jobId}`);
      showAlert('success', 'Job posting deactivated successfully.');
      fetchPostings();
      fetchStats();
    } catch (e) {
      showAlert('error', 'Could not deactivate job listing.');
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesJob = selectedJobFilter ? app.jobId === parseInt(selectedJobFilter) : true;
    const matchesSearch = applicantSearch 
      ? app.candidateName.toLowerCase().includes(applicantSearch.toLowerCase()) || 
        app.candidateEmail.toLowerCase().includes(applicantSearch.toLowerCase())
      : true;
    return matchesJob && matchesSearch;
  });

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Alert banner */}
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
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Jobs Posted</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalJobs}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(139,92,246,0.15)', padding: '10px', borderRadius: '10px' }}>
            <Users size={22} style={{ color: 'var(--secondary)' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Applicants</span>
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
      </div>

      {/* Main Grid split */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="dashboard-grid">
        
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button 
              onClick={() => { setActiveTab('postings'); setSelectedApp(null); }}
              className="btn" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === 'postings' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'postings' ? '#ffffff' : 'var(--text-main)',
                padding: '0.75rem 1rem'
              }}
            >
              <Briefcase size={16} />
              Active Postings
            </button>
            <button 
              onClick={() => { setActiveTab('applicants'); setSelectedApp(null); }}
              className="btn" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === 'applicants' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'applicants' ? '#ffffff' : 'var(--text-main)',
                padding: '0.75rem 1rem'
              }}
            >
              <Users size={16} />
              Manage Applicants
            </button>
            <button 
              onClick={() => { setActiveTab('post'); setSelectedApp(null); setEditingJob(null); resetForm(); }}
              className="btn" 
              style={{ 
                justifyContent: 'flex-start', 
                backgroundColor: activeTab === 'post' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'post' ? '#ffffff' : 'var(--text-main)',
                padding: '0.75rem 1rem'
              }}
            >
              <PlusCircle size={16} />
              Post a Job
            </button>
          </div>
        </div>

        {/* Dynamic content view */}
        <div>
          {/* Active Postings View */}
          {activeTab === 'postings' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Your Active Listings ({postings.length})
              </h3>

              {loadingData ? (
                Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-sm)' }}></div>
                ))
              ) : postings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Briefcase size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No active job listings.</p>
                  <p style={{ fontSize: '0.85rem' }}>Click "Post a Job" to list your first corporate opening.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {postings.map((job) => (
                    <div 
                      key={job.id} 
                      className="card" 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '1.25rem',
                        border: '1px solid var(--border-color-light)'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{job.title}</h4>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} /> {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.jobType.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>{job.experienceLevel}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleStartEdit(job)} 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'rgba(99,102,241,0.2)' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePosting(job.id, job.title)} 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                        >
                          Deactivate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post Job Form View */}
          {activeTab === 'post' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                {editingJob ? `Edit Job: ${editingJob.title}` : 'Create New Job Posting'}
              </h3>

              <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {formError && (
                  <div className="alert alert-error" style={{ fontSize: '0.85rem', padding: '0.75rem 1rem' }}>
                    <ShieldAlert size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="postTitle">Job Title *</label>
                  <input 
                    type="text" 
                    id="postTitle" 
                    placeholder="e.g. Senior Software Engineer (Java)" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)} 
                    className="form-control" 
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="postType">Employment Type *</label>
                    <select 
                      id="postType" 
                      value={jobType} 
                      onChange={(e) => setJobType(e.target.value)} 
                      className="form-control"
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="REMOTE">Remote / WFH</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="postExp">Experience Level *</label>
                    <select 
                      id="postExp" 
                      value={jobExp} 
                      className="form-control"
                      onChange={(e) => setJobExp(e.target.value)}
                    >
                      <option value="Entry-Level">Entry-Level</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="postLoc">Office Location *</label>
                    <input 
                      type="text" 
                      id="postLoc" 
                      placeholder="e.g. Bangalore, KA / Remote" 
                      value={jobLoc} 
                      onChange={(e) => setJobLoc(e.target.value)} 
                      className="form-control" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="postSalary">Estimated Salary Range</label>
                    <input 
                      type="text" 
                      id="postSalary" 
                      placeholder="e.g. $110,000 - $140,000 / Year" 
                      value={jobSalary} 
                      onChange={(e) => setJobSalary(e.target.value)} 
                      className="form-control" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="postDesc">Detailed Job Description *</label>
                  <textarea 
                    id="postDesc" 
                    placeholder="Provide full description of job duties, responsibilities, team details..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="form-control"
                    style={{ minHeight: '150px' }}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="postReq">Key Qualifications & Skills (One per line)</label>
                  <textarea 
                    id="postReq" 
                    placeholder="e.g. B.Tech / M.Tech in Computer Science&#10;3+ years of Spring Boot experience&#10;Strong understanding of JPA/Hibernate and SQL"
                    value={jobReq}
                    onChange={(e) => setJobReq(e.target.value)}
                    className="form-control"
                    style={{ minHeight: '100px' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem' }}>
                    {editingJob ? 'Save Changes' : 'Publish Job Posting'}
                  </button>
                  {editingJob && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingJob(null); resetForm(); setActiveTab('postings'); }} 
                      className="btn btn-outline" 
                      style={{ padding: '0.75rem 2.5rem' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Manage Applicants View */}
          {activeTab === 'applicants' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.35rem', margin: 0 }}>
                  Hiring Pipelines
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550 }}>
                  Showing {filteredApplicants.length} of {applicants.length} applications
                </span>
              </div>

              {/* Filtering and Search Toolbar */}
              {applicants.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: 'rgba(31, 41, 55, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-light)', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flex: 1.5, minWidth: '220px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search by candidate name or email..." 
                      value={applicantSearch}
                      onChange={(e) => setApplicantSearch(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', height: '40px' }}
                    />
                  </div>
                  <select 
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="form-control"
                    style={{ flex: 1, minWidth: '220px', height: '40px', padding: '0 0.5rem' }}
                  >
                    <option value="">Filter by Job Posting (All)</option>
                    {postings.map((job) => (
                      <option key={job.id} value={job.id}>{job.title} ({job.location})</option>
                    ))}
                  </select>
                </div>
              )}

              {loadingData ? (
                Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-sm)' }}></div>
                ))
              ) : applicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Users size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No applications received yet.</p>
                  <p style={{ fontSize: '0.85rem' }}>When candidates apply to your listings, they will show up here.</p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Users size={28} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: 600 }}>No matching applications found.</p>
                  <p style={{ fontSize: '0.85rem' }}>Try clearing or widening your filters and search term.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Candidate</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Applied For</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Date Applied</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Pipeline Stage</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Process</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplicants.map((app) => (
                        <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 700 }}>{app.candidateName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.candidateEmail}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 600 }}>{app.jobTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.jobLocation}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            {new Date(app.appliedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                            <span className={`badge badge-${(app.status || 'APPLIED').toLowerCase()}`}>
                              {(app.status || 'APPLIED').replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center' }}>
                              <button 
                                onClick={() => handleViewApplicant(app)} 
                                className="btn btn-outline" 
                                title="Review Full Profile"
                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <User size={14} /> Review
                              </button>
                              
                              {app.resumeUrl && (
                                <a 
                                  href={`http://127.0.0.1:8080${app.resumeUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline"
                                  title="Download Resume"
                                  style={{ padding: '0.4rem', color: 'var(--primary)', borderColor: 'rgba(99,102,241,0.2)', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <Download size={14} />
                                </a>
                              )}

                              {app.status !== 'ACCEPTED' && (
                                <button 
                                  onClick={() => handleStatusChange(app.id, 'ACCEPTED')} 
                                  className="btn btn-success" 
                                  title="Quick Accept & Hire"
                                  style={{ padding: '0.4rem', backgroundColor: '#10b981', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <Check size={14} />
                                </button>
                              )}

                              {app.status !== 'REJECTED' && (
                                <button 
                                  onClick={() => handleStatusChange(app.id, 'REJECTED')} 
                                  className="btn btn-danger" 
                                  title="Quick Reject"
                                  style={{ padding: '0.4rem', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <X size={14} />
                                </button>
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
          )}

        </div>
      </div>

      {/* Applicant Detailed Review Modal */}
      {selectedApp && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Review Job Application</h3>
              <button 
                onClick={() => { setSelectedApp(null); setCandidateProfile(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* Header profile details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem' }}>{selectedApp.candidateName}</h4>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Mail size={12} /> {selectedApp.candidateEmail}
                    </span>
                    {candidateProfile?.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={12} /> {candidateProfile.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Loader/Skeleton */}
              {loadingProfile ? (
                <div className="skeleton" style={{ height: '250px' }}></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Job and status details */}
                  <div className="grid-2" style={{ backgroundColor: 'rgba(31, 41, 55, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Position Applied For</span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedApp.jobTitle}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Current Status</span>
                      <span className={`badge badge-${(selectedApp.status || 'APPLIED').toLowerCase()}`}>{(selectedApp.status || 'APPLIED').replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Candidate Professional details */}
                  {candidateProfile ? (
                    <>
                      {candidateProfile.title && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Headline Title</span>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{candidateProfile.title}</div>
                        </div>
                      )}

                      {candidateProfile.bio && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Professional Summary</span>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{candidateProfile.bio}</p>
                        </div>
                      )}

                       {candidateProfile.skills && (
                         <div>
                           <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Technical Skills</span>
                           <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                             {candidateProfile.skills.split(',').map(skill => skill.trim()).filter(Boolean).map((skill, sIdx) => (
                               <span key={sIdx} className="badge badge-jobtype" style={{ fontSize: '0.7rem' }}>{skill}</span>
                             ))}
                           </div>
                         </div>
                       )}

                      {candidateProfile.education && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Education Details</span>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{candidateProfile.education}</p>
                        </div>
                      )}

                      {candidateProfile.experience && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Professional Experience</span>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{candidateProfile.experience}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No detailed candidate profile found.</p>
                  )}

                  {/* Cover Letter */}
                  {selectedApp.coverLetter && (
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Candidate Cover Letter</span>
                      <p style={{ backgroundColor: 'rgba(17, 24, 39, 0.4)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                        {selectedApp.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Download Resume Link */}
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Candidate Resume</span>
                    <a 
                      href={`http://127.0.0.1:8080${selectedApp.resumeUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}
                    >
                      <FileText size={16} />
                      View/Download Resume PDF
                    </a>
                  </div>

                </div>
              )}
            </div>

            {/* Pipeline State modification buttons */}
            <div className="modal-footer" style={{ flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between' }}>
              <div>
                <button 
                  onClick={() => handleStatusChange(selectedApp.id, 'REJECTED')}
                  className="btn btn-outline"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                >
                  Reject Candidate
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleStatusChange(selectedApp.id, 'UNDER_REVIEW')}
                  className="btn btn-outline"
                >
                  Under Review
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedApp.id, 'SHORTLISTED')}
                  className="btn btn-secondary"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedApp.id, 'ACCEPTED')}
                  className="btn btn-primary"
                >
                  Accept & Hire
                </button>
              </div>
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

export default RecruiterDashboard;
