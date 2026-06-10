import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';
import { Users, UserX, RefreshCw, Trash2, Search, Filter } from 'lucide-react';

/**
 * UserManagement Page Component
 * 
 * Used by administrators to view, search, and delete user accounts.
 */
export default function UserManagement() {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isRtl = i18n.language === 'ar';

  const fetchUsers = () => {
    setLoading(true);
    axios.get('/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This will also remove all their requests and activity.`)) {
      try {
        await axios.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bms-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem', direction: isRtl ? 'rtl' : 'ltr' }} className="reveal">
        <div>
          <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>User Management</h1>
          <p className="stats-muted" style={{ fontSize: '1.1rem', marginTop: '0.4rem' }}>Oversee platform members and their roles.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-input-wrapper" style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} color="var(--primary)" />
            <input
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600 }}
            />
          </div>
          <button className="btn btn-primary" onClick={fetchUsers}>
            <RefreshCw size={18} style={{ marginRight: '0.4rem' }} />
            Refresh
          </button>
        </div>
      </div>

      <div className="glass-panel reveal" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '1.5rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>User</th>
                <th style={{ padding: '1.5rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</th>
                <th style={{ padding: '1.5rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Availability</th>
                <th style={{ padding: '1.5rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Joined</th>
                <th style={{ padding: '1.5rem 1.25rem', color: 'var(--text-muted)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', textAlign: isRtl ? 'left' : 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1.5px solid #f8fafc', transition: 'background 0.2s' }} className="hover-lift">
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <span className="profile-stat-badge" style={{ background: u.role === 'admin' ? 'rgba(104, 26, 21, 0.05)' : 'rgba(187, 202, 225, 0.15)', color: u.role === 'admin' ? 'var(--primary)' : 'var(--secondary)' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.is_available ? '#059669' : '#94a3b8' }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: u.is_available ? '#059669' : 'var(--text-muted)' }}>{u.is_available ? 'Available' : 'Unavailable'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem', textAlign: isRtl ? 'left' : 'right' }}>
                    <div style={{ display: 'flex', justifyContent: isRtl ? 'flex-start' : 'flex-end', gap: '0.75rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }} onClick={() => alert('Edit user functionality is under development.')}>Edit</button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px', background: 'rgba(104, 26, 21, 0.1)', color: 'var(--primary)', border: 'none' }}
                        onClick={() => handleDelete(u.id, u.name)}
                      >
                        <Trash2 size={14} style={{ marginRight: '0.3rem' }} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                    <UserX size={48} color="var(--text-muted)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p className="stats-muted">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
