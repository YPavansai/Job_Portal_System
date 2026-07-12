import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Trash2, Search, ShieldCheck, Briefcase, ShieldAlert, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account and all their related data (profile, jobs, applications)? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    setError('');
    setActionSuccess('');

    try {
      const response = await axios.delete(`/admin/users/${id}`);
      setActionSuccess(response.data.message || 'User deleted successfully.');
      // Refresh user list
      setUsers(users.filter(u => u.id !== id));
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter users based on query and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const candidatesCount = users.filter(u => u.role === 'CANDIDATE').length;
  const recruitersCount = users.filter(u => u.role === 'RECRUITER').length;
  const adminsCount = users.filter(u => u.role === 'ADMIN').length;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>Admin Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage system users, monitor registrations, and perform administrative operations.</p>
        </div>
        <button 
          onClick={fetchUsers} 
          className="btn btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Reload Data
        </button>
      </div>

      {/* Success/Error Alerts */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}
      {actionSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
          <ShieldCheck size={20} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Total Users */}
        <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--primary-glow)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550, textTransform: 'uppercase' }}>Total Accounts</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{totalUsers}</h3>
          </div>
        </div>

        {/* Candidates */}
        <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: '#3b82f6' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550, textTransform: 'uppercase' }}>Candidates</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{candidatesCount}</h3>
          </div>
        </div>

        {/* Employers */}
        <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
            <Briefcase size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550, textTransform: 'uppercase' }}>Employers</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{recruitersCount}</h3>
          </div>
        </div>

        {/* Admins */}
        <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 550, textTransform: 'uppercase' }}>Administrators</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{adminsCount}</h3>
          </div>
        </div>

      </div>

      {/* Control Bar (Search & Filter) */}
      <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, email, or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>

        {/* Role Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Filter Role:</span>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem 2rem 0.5rem 0.75rem', width: '160px' }}
          >
            <option value="ALL">All Roles</option>
            <option value="CANDIDATE">Candidates</option>
            <option value="RECRUITER">Employers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>

        {/* Total displayed users count */}
        <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing {filteredUsers.length} of {users.length} users
        </div>

      </div>

      {/* Table Container */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0', gap: '1rem' }}>
            <div className="skeleton-loader" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
            <span style={{ color: 'var(--text-muted)' }}>Fetching user records...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No users found matching your filters.</p>
            <p style={{ fontSize: '0.9rem' }}>Try clearing your search query or selecting a different role filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 650, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 650, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>User Details</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 650, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 650, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Company / Context</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 650, color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const isAdminUser = user.role === 'ADMIN';
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="table-row">
                      {/* ID */}
                      <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        #{user.id}
                      </td>
                      {/* Name & Email */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: '#ffffff' }}>{user.name}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
                        </div>
                      </td>
                      {/* Role Badge */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          letterSpacing: '0.05em',
                          backgroundColor: user.role === 'ADMIN' ? 'rgba(245, 158, 11, 0.15)' : user.role === 'RECRUITER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: user.role === 'ADMIN' ? '#fbbf24' : user.role === 'RECRUITER' ? '#34d399' : '#60a5fa'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      {/* Company Name */}
                      <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-main)', fontWeight: 550 }}>
                        {user.role === 'RECRUITER' ? (
                          user.companyName || 'Unknown Company'
                        ) : user.role === 'ADMIN' ? (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>System Access</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Job Seeker</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-outline-danger"
                          style={{ 
                            padding: '0.45rem', 
                            borderRadius: '8px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: isAdminUser ? 0.3 : 1,
                            cursor: isAdminUser ? 'not-allowed' : 'pointer'
                          }}
                          disabled={isAdminUser || deletingId === user.id}
                          title={isAdminUser ? 'Cannot delete admin accounts' : 'Delete user account'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.015);
        }
        .btn-outline-danger {
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: transparent;
          color: #ef4444;
          transition: all 0.2s;
        }
        .btn-outline-danger:hover:not(:disabled) {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        .skeleton-loader {
          border: 3px solid rgba(255,255,255,0.05);
          border-top: 3px solid var(--primary);
          animation: spin 0.8s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default AdminDashboard;
