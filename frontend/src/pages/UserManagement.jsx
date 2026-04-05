import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import Card from '../components/Card';
import AdminLayout from '../components/AdminLayout';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getRoleBadgeStyle = (role) => {
    const base = { padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' };
    if (role === 'admin') return { ...base, backgroundColor: '#fff0f0', color: '#e63946' };
    if (role === 'donor') return { ...base, backgroundColor: '#e1f5fe', color: '#0288d1' };
    return { ...base, backgroundColor: '#f3e5f5', color: '#7b1fa2' };
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>User Management</h1>
          <p style={{ color: '#666', marginTop: '0.2rem' }}>Manage platform accounts and roles.</p>
        </div>
        <button className="btn btn-primary" onClick={fetchUsers}>Refresh List</button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f1f1' }}>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>USER</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>ROLE</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>AVAILABILITY</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>JOINED</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                  <td style={{ padding: '1.2rem 1rem' }}>
                    <div style={{ fontWeight: '700' }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1.2rem 1rem' }}>
                    <span style={getRoleBadgeStyle(u.role)}>{u.role}</span>
                  </td>
                  <td style={{ padding: '1.2rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: u.is_available ? '#4caf50' : '#bdbdbd' }}></div>
                      <span style={{ fontSize: '0.9rem' }}>{u.is_available ? 'Available' : 'Unavailable'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 1rem', color: '#666', fontSize: '0.9rem' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.2rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => alert('Edit user functionality is under development.')}>Edit</button>
                      <button 
                        className="btn" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#fff5f5', color: '#e63946', border: '1px solid #ffcdd2' }}
                        onClick={() => handleDelete(u.id, u.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}

