import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({ requests: 0, donations: 0, reports: 0 });
  const [notifications, setNotifications] = useState([]);
  const [fetching, setFetching] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      setFetching(true);
      Promise.all([
        axios.get('/my-requests').then(res => res.data.length).catch(() => 0),
        axios.get('/donations').then(res => res.data.length).catch(() => 0),
        axios.get('/notifications').then(res => res.data).catch(() => [])
      ]).then(([reqCount, donCount, notifs]) => {
        setStats({ requests: reqCount, donations: donCount, reports: 0 });
        setNotifications(notifs.slice(0, 5)); // Only show last 5
      }).finally(() => setFetching(false));
    }
  }, [user]);

  const [viewingContact, setViewingContact] = useState(null);

  const toggleContact = (id) => {
    setViewingContact(viewingContact === id ? null : id);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="loader" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container" style={{ padding: '3rem 1rem', maxWidth: '1400px', margin: '0 auto', textAlign: isRtl ? 'right' : 'left' }}>
      {/* Header Section */}
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            {isRtl ? (
              <><span style={{ color: 'var(--primary)' }}>لوحة</span> التحكم</>
            ) : (
              <>Tableau de <span style={{ color: 'var(--primary)' }}>bord</span></>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {t('dashboard.welcome', { name: user.name })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/requests/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
             {t('requests_page.request_blood')}
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="stat-card-premium" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)', border: '1px solid rgba(230, 57, 70, 0.1)', textAlign: isRtl ? 'right' : 'left' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.stats.requests')}</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>{stats.requests}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('dashboard.stats.requests_desc')}</div>
          <i className="fas fa-hand-holding-heart" style={{ [isRtl ? 'left' : 'right']: '20px' }}></i>
        </div>
        
        <div className="stat-card-premium" style={{ background: 'linear-gradient(135deg, #f0fff4 0%, #fff 100%)', border: '1px solid rgba(42, 157, 143, 0.1)', textAlign: isRtl ? 'right' : 'left' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.stats.donations')}</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>{stats.donations}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('dashboard.stats.donations_desc')}</div>
          <i className="fas fa-tint" style={{ [isRtl ? 'left' : 'right']: '20px' }}></i>
        </div>

        <div className="stat-card-premium" style={{ background: 'linear-gradient(135deg, #ebf8ff 0%, #fff 100%)', border: '1px solid rgba(69, 123, 157, 0.1)', textAlign: isRtl ? 'right' : 'left' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('dashboard.stats.rank')}</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dark)', textTransform: 'uppercase' }}>{user.role}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('dashboard.stats.rank_desc')}</div>
          <i className="fas fa-user-shield" style={{ [isRtl ? 'left' : 'right']: '20px' }}></i>
        </div>
      </div>

      <div className="dashboard-grid" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        {/* Main Content Area */}
        <div className="dashboard-main">
          {/* Recent Activity */}
          <div className="glass-panel" style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('dashboard.recent_activity')}</h2>
              <Link to="/notifications" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                {t('dashboard.view_all')} {isRtl ? '←' : '→'}
              </Link>
            </div>

            {fetching ? (
              <p>{t('common.loading')}</p>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p>{t('dashboard.no_activity')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', borderRadius: '16px', background: n.is_read ? 'transparent' : 'rgba(230, 57, 70, 0.03)', border: '1px solid rgba(0,0,0,0.03)', textAlign: isRtl ? 'right' : 'left' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        background: n.type === 'donation_response' ? 'var(--success)' : 'var(--primary)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}>
                        {n.type === 'donation_response' ? '🤝' : '🔔'}
                      </div>
                      <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                        <p style={{ fontWeight: n.is_read ? 500 : 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{n.message}</p>
                        <small style={{ color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString(isRtl ? 'ar-MA' : 'fr-FR')}</small>
                      </div>
                      {n.type === 'donation_response' && n.data && (
                        <button 
                          onClick={() => toggleContact(n.id)} 
                          className="btn btn-sm"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--secondary)', color: 'white' }}
                        >
                          {viewingContact === n.id ? t('dashboard.hide_contact') : t('dashboard.view_contact')}
                        </button>
                      )}
                    </div>

                    {/* Contact Info Expandable */}
                    {viewingContact === n.id && n.data && (
                      <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(69, 123, 157, 0.05)', 
                        borderRadius: '12px', 
                        border: '1px dashed var(--secondary)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        fontSize: '0.9rem',
                        direction: isRtl ? 'rtl' : 'ltr'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase' }}>{t('notifications.phone')}</span>
                          <p style={{ fontWeight: 700 }}>{n.data.donor_phone || 'N/A'}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase' }}>{t('notifications.email')}</span>
                          <p style={{ fontWeight: 700, wordBreak: 'break-all' }}>{n.data.donor_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="glass-panel" style={{ marginBottom: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>{t('nav.profile')}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #ff4d6d 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('auth.blood_type_label')}</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>{user.blood_type || 'N/A'}</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('auth.city_label')}</span>
                <span style={{ fontWeight: 700 }}>{user.city || t('common.loading')}</span>
              </div>
              <Link to="/profile" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', marginTop: '1rem', textDecoration: 'none' }}>
                {t('profile.edit')}
              </Link>
            </div>
          </div>

          <div className="glass-panel" style={{ background: 'var(--text-dark)', color: 'white', textAlign: isRtl ? 'right' : 'left' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>{t('dashboard.support_title')}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>{t('dashboard.support_desc')}</p>
            <button className="btn" style={{ width: '100%', background: 'white', color: 'var(--text-dark)' }}>{t('dashboard.support_btn')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

