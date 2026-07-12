import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Briefcase, DollarSign, Clock, Building, X, Upload, ShieldAlert, CheckCircle2, FileText, Filter } from 'lucide-react';

const Jobs = () => {
  const { isAuthenticated, user, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Job data states
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search filter states (read from URL query parameters if present)
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [expLevel, setExpLevel] = useState(searchParams.get('experienceLevel') || '');

  // Application modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  
  // Feedback alerts
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });
  const [modalError, setModalError] = useState('');

  // Sync state inputs with URL searchParams when URL changes
  useEffect(() => {
    setTitle(searchParams.get('title') || '');
    setLocation(searchParams.get('location') || '');
    setJobType(searchParams.get('jobType') || '');
    setExpLevel(searchParams.get('experienceLevel') || '');
  }, [searchParams]);

  // Fetch jobs on filter change or mount
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      const t = searchParams.get('title');
      const l = searchParams.get('location');
      const jt = searchParams.get('jobType');
      const el = searchParams.get('experienceLevel');
      
      if (t) params.title = t;
      if (l) params.location = l;
      if (jt) params.jobType = jt;
      if (el) params.experienceLevel = el;

      const response = await axios.get('/jobs', { params });
      setJobs(response.data);
      
      // Auto-select first job if available
      if (response.data.length > 0) {
        setSelectedJob(response.data[0]);
      } else {
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Error fetching jobs", error);
      showAlert('error', 'Failed to retrieve job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  // Sync state with search filters
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (location) params.append('location', location);
    if (jobType) params.append('jobType', jobType);
    if (expLevel) params.append('experienceLevel', expLevel);
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setTitle('');
    setLocation('');
    setJobType('');
    setExpLevel('');
    setSearchParams({});
  };

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 5000);
  };

  // Triggered when user clicks "Apply Now" button
  const handleApplyClick = () => {
    if (!isAuthenticated) {
      // Redirect to login page and preserve redirect state
      navigate('/auth', { state: { from: { pathname: '/jobs' } } });
      return;
    }
    
    if (user?.role === 'RECRUITER' || user?.role === 'ADMIN') {
      showAlert('error', 'Recruiter and Admin accounts are not authorized to submit job applications.');
      return;
    }

    // Reset apply form states
    setCoverLetter('');
    setResumeFile(null);
    setResumeUrl('');
    setModalError('');
    setShowApplyModal(true);

    // Fetch existing profile resume if candidate already uploaded one
    fetchCandidateResume();
  };

  const fetchCandidateResume = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.get(`/profiles/candidate/${user.id}`);
      if (response.data.resumeUrl) {
        setResumeUrl(response.data.resumeUrl);
      }
    } catch (e) {
      console.log("No existing profile resume found.");
    }
  };

  // Handles resume file uploading
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size limit check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setModalError('File size exceeds the 5MB limit.');
      return;
    }

    setUploadingResume(true);
    setModalError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/profiles/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResumeUrl(response.data.resumeUrl);
      setResumeFile(file);
      showAlert('success', 'Resume file uploaded successfully!');
    } catch (error) {
      console.error(error);
      setModalError(error.response?.data?.message || 'Could not upload file. Try a PDF or DOCX file.');
    } finally {
      setUploadingResume(false);
    }
  };

  // Submit the job application
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl) {
      setModalError('Please upload your resume to apply.');
      return;
    }

    try {
      await axios.post(`/applications/apply/${selectedJob.id}`, {
        resumeUrl,
        coverLetter
      });

      setShowApplyModal(false);
      showAlert('success', `Application for "${selectedJob.title}" submitted successfully!`);
    } catch (error) {
      setModalError(error.response?.data?.message || 'Failed to submit application. You might have already applied.');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '80vh' }}>
      
      {/* Alert Banner */}
      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type}`} style={{ margin: '1rem 0 0 0' }}>
          {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <form onSubmit={handleApplyFilters} className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1.5, gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flex: 1, minWidth: '180px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Keywords..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="form-control" 
              style={{ paddingLeft: '2.25rem', height: '40px' }}
            />
          </div>
          <div style={{ display: 'flex', flex: 1, minWidth: '180px', position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Location..." 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="form-control" 
              style={{ paddingLeft: '2.25rem', height: '40px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, gap: '0.5rem', flexWrap: 'wrap' }}>
          <select 
            value={jobType} 
            onChange={(e) => {
              const val = e.target.value;
              setJobType(val);
              const params = new URLSearchParams(searchParams);
              if (val) params.set('jobType', val);
              else params.delete('jobType');
              setSearchParams(params);
            }}
            className="form-control"
            style={{ flex: 1, minWidth: '130px', height: '40px', padding: '0 0.5rem' }}
          >
            <option value="">Job Type (All)</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>

          <select 
            value={expLevel} 
            onChange={(e) => {
              const val = e.target.value;
              setExpLevel(val);
              const params = new URLSearchParams(searchParams);
              if (val) params.set('experienceLevel', val);
              else params.delete('experienceLevel');
              setSearchParams(params);
            }}
            className="form-control"
            style={{ flex: 1, minWidth: '140px', height: '40px', padding: '0 0.5rem' }}
          >
            <option value="">Experience (All)</option>
            <option value="Entry-Level">Entry-Level</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }} className="button-group">
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', height: '40px' }}>
            Filter
          </button>
          <button type="button" onClick={handleClearFilters} className="btn btn-outline" style={{ padding: '0 1.5rem', height: '40px' }}>
            Reset
          </button>
        </div>
      </form>

      {/* Split Pane View */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem', height: 'calc(100vh - 240px)', minHeight: '550px' }} className="split-pane">
        
        {/* Left Pane: Job List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="job-list-pane">
          {loading ? (
            Array(4).fill(0).map((_, idx) => (
              <div key={idx} className="card skeleton" style={{ height: '110px' }}></div>
            ))
          ) : jobs.length === 0 ? (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <Briefcase size={36} style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600 }}>No job postings found.</p>
              <p style={{ fontSize: '0.85rem' }}>Try clearing filters or search terms.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div 
                key={job.id} 
                className={`card card-hover ${selectedJob?.id === job.id ? 'active-card' : ''}`}
                onClick={() => setSelectedJob(job)}
                style={{ 
                  cursor: 'pointer', 
                  textAlign: 'left', 
                  padding: '1.25rem',
                  borderColor: selectedJob?.id === job.id ? 'var(--primary)' : 'var(--border-color)',
                  backgroundColor: selectedJob?.id === job.id ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-surface)'
                }}
              >
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>{job.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <Building size={12} />
                  <span>{job.postedByCompanyName || 'Staffing Firm'}</span>
                  <span>•</span>
                  <MapPin size={12} />
                  <span>{job.location}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-jobtype" style={{ fontSize: '0.65rem' }}>
                    {job.jobType.replace('_', ' ')}
                  </span>
                  <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}>
                    {job.experienceLevel}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Pane: Selected Job Details */}
        <div style={{ overflowY: 'auto' }} className="job-details-pane">
          {selectedJob ? (
            <div className="card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' }}>
              
              {/* Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.65rem' }}>{selectedJob.title}</h3>
                  <button 
                    onClick={handleApplyClick} 
                    className="btn btn-primary" 
                    style={{ padding: '0.6rem 1.75rem' }}
                  >
                    Apply Now
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building size={16} />
                    <span>{selectedJob.postedByCompanyName || 'Staffing Firm'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={16} />
                    <span>{selectedJob.location}</span>
                  </div>
                  {selectedJob.salaryRange && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <DollarSign size={16} />
                      <span>{selectedJob.salaryRange}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} />
                    <span>{selectedJob.jobType.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Job Description</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                    {selectedJob.description}
                  </p>
                </div>

                {selectedJob.requirements && (
                  <div>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Requirements & Qualifications</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                      {selectedJob.requirements}
                    </p>
                  </div>
                )}
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Posted by: {selectedJob.postedByName}</span>
                  <span>Experience: {selectedJob.experienceLevel}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No Listing Selected</h3>
              <p style={{ fontSize: '0.9rem' }}>Please select a job from the list to view the full specification.</p>
            </div>
          )}
        </div>

      </div>

      {/* Application Form Modal */}
      {showApplyModal && selectedJob && (
        <div className="modal-backdrop">
          <div className="modal-content">
            
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Apply for {selectedJob.title}</h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {modalError && (
                  <div className="alert alert-error" style={{ fontSize: '0.85rem', padding: '0.75rem 1rem' }}>
                    <ShieldAlert size={16} />
                    <span>{modalError}</span>
                  </div>
                )}

                {/* Resume Upload File Box */}
                <div className="form-group">
                  <label className="form-label">Resume (PDF/DOCX, Max 5MB)</label>
                  
                  <div style={{ 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.5rem', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: 'rgba(31, 41, 55, 0.2)',
                    transition: 'all 0.2s'
                  }}>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ 
                        position: 'absolute', 
                        top: 0, left: 0, right: 0, bottom: 0, 
                        opacity: 0, cursor: 'pointer' 
                      }}
                      disabled={uploadingResume}
                    />
                    
                    {uploadingResume ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Uploading resume file...</span>
                      </div>
                    ) : resumeUrl ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                        <FileText size={32} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Resume Uploaded!</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {resumeFile ? resumeFile.name : 'Using existing resume on profile'}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={32} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to select or drop resume here</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, DOC, or DOCX formats accepted</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover letter textarea */}
                <div className="form-group">
                  <label className="form-label" htmlFor="coverLetterInput">Cover Letter (Optional)</label>
                  <textarea 
                    id="coverLetterInput" 
                    placeholder="Describe why you are a great fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="form-control"
                    style={{ minHeight: '120px' }}
                  ></textarea>
                </div>

              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={uploadingResume || !resumeUrl}
                >
                  Submit Application
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .split-pane { grid-template-columns: 1fr !important; height: auto !important; }
          .job-details-pane { display: none; } /* On mobile, we list first, detail can toggle */
        }
      `}</style>
    </div>
  );
};

export default Jobs;
