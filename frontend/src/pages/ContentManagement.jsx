import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import Card from '../components/Card';
import AdminLayout from '../components/AdminLayout';

export default function ContentManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    axios.get('/requests')
      .then(res => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation request? This action cannot be undone.')) {
      try {
        await axios.delete(`/admin/requests/${id}`);
        setRequests(requests.filter(r => r.id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting request');
      }
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Content Moderation</h1>
          <p style={{ color: '#666', marginTop: '0.2rem' }}>Monitor and manage donation requests across the platform.</p>
        </div>
        <button className="btn btn-primary" onClick={fetchRequests}>Refresh List</button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f1f1' }}>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>PATIENT / TYPE</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>LOCATION</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>URGENCY</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>STATUS</th>
                <th style={{ padding: '1.2rem 1rem', color: '#888', fontWeight: '600', fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No donation requests found.</td>
                </tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ fontWeight: '700' }}>{r.patient_name || 'Anonymous'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '800' }}>{r.blood_type} - {r.quantity} Bags</div>
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{r.hospital}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{r.city}</div>
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        color: r.urgency === 'Critical' ? '#d32f2f' : (r.urgency === 'Urgent' ? '#ef6c00' : '#0288d1')
                      }}>
                        {r.urgency}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1rem' }}>
                       <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        backgroundColor: r.status === 'Open' ? '#e8f5e9' : '#f5f5f5',
                        color: r.status === 'Open' ? '#2e7d32' : '#616161'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem 1rem', textAlign: 'right' }}>
                      <button 
                        className="btn" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#fff5f5', color: '#e63946', border: '1px solid #ffcdd2' }}
                        onClick={() => handleDelete(r.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
