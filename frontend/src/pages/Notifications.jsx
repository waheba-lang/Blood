import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const [viewingContact, setViewingContact] = useState(null);

  const toggleContact = (id) => {
    setViewingContact(viewingContact === id ? null : id);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('common.loading')}</div>;

  return (
    <div className="notifications-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)' }}>{t('notifications.title')}</h1>
        <div style={{ padding: '0.5rem 1rem', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
          {t('notifications.unread', { count: notifications.filter(n => !n.is_read).length })}
        </div>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        {notifications.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: 'var(--text-muted)' }}>{t('notifications.empty')}</p>
          </Card>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className="glass-panel notification-item" 
              style={{ 
                padding: '1.5rem', 
                borderLeft: isRtl ? 'none' : (n.is_read ? '1px solid rgba(0,0,0,0.05)' : '5px solid var(--primary)'),
                borderRight: isRtl ? (n.is_read ? '1px solid rgba(0,0,0,0.05)' : '5px solid var(--primary)') : 'none',
                background: n.is_read ? 'white' : 'rgba(230, 57, 70, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.2s ease',
                borderRadius: '16px',
                boxShadow: n.is_read ? '0 4px 12px rgba(0,0,0,0.03)' : '0 8px 24px rgba(230, 57, 70, 0.08)',
                textAlign: isRtl ? 'right' : 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontWeight: n.is_read ? 500 : 700, 
                    color: 'var(--text-dark)', 
                    marginBottom: '0.25rem',
                    fontSize: '1.05rem' 
                  }}>
                    {n.message}
                  </p>
                  <small style={{ color: 'var(--text-muted)', display: 'block' }}>
                    {new Date(n.created_at).toLocaleString(isRtl ? 'ar-MA' : 'fr-FR')}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  {n.type === 'donation_response' && n.data && (
                    <button 
                      onClick={() => toggleContact(n.id)} 
                      className="btn btn-sm"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--secondary)', color: 'white' }}
                    >
                      {viewingContact === n.id ? t('notifications.hide_contact') : t('notifications.view_contact')}
                    </button>
                  )}
                  {!n.is_read && (
                    <button 
                      onClick={() => markAsRead(n.id)} 
                      className="btn btn-sm"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--success)', color: 'white' }}
                    >
                      {t('notifications.mark_read')}
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(n.id)} 
                    className="btn btn-sm"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', color: '#ff4d6d', border: '1px solid #ff4d6d' }}
                  >
                    {t('notifications.delete')}
                  </button>
                </div>
              </div>

              {/* Contact Info Expandable Area */}
              {viewingContact === n.id && n.data && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '1.5rem', 
                  background: 'rgba(69, 123, 157, 0.05)', 
                  borderRadius: '12px', 
                  border: '1px dashed var(--secondary)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  direction: isRtl ? 'rtl' : 'ltr',
                  textAlign: isRtl ? 'right' : 'left'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase' }}>{t('notifications.donor')}</span>
                    <p style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{n.data.donor_name}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase' }}>{t('notifications.phone')}</span>
                    <p style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                      <a href={`tel:${n.data.donor_phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        📞 {n.data.donor_phone || 'N/A'}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase' }}>{t('notifications.email')}</span>
                    <p style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                      <a href={`mailto:${n.data.donor_email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        ✉️ {n.data.donor_email}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .notification-item:hover {
          transform: translateX(${isRtl ? '-5px' : '5px'});
        }
      `}} />
    </div>
  );
}

