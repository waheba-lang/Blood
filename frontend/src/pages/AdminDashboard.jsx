import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    axios.get('/admin/stats')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <AdminLayout><div className="loading">{t('common.loading')}</div></AdminLayout>;

  const stats = data?.stats || {};
  const recent = data?.recent_activity || {};

  const statCards = [
    { label: t('admin.dashboard.stats.total_users'), value: stats.total_users, color: '#4cc9f0', icon: '👤' },
    { label: t('admin.dashboard.stats.donors'), value: stats.total_donors, color: '#4361ee', icon: '🩸' },
    { label: t('admin.dashboard.stats.requests'), value: stats.total_requests, color: '#f72585', icon: '📋' },
    { label: t('admin.dashboard.stats.donations'), value: stats.total_donations, color: '#4caf50', icon: '✅' },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2.5rem', textAlign: isRtl ? 'right' : 'left' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '800' }}>{t('admin.dashboard.title')}</h1>
        <p style={{ color: '#666' }}>{t('admin.dashboard.subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '16px', 
              backgroundColor: `${stat.color}15`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: '600', marginBottom: '0.2rem' }}>{stat.label}</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        <Card>
          <div style={{ padding: '0.5rem', textAlign: isRtl ? 'right' : 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t('admin.dashboard.recent_users')}</h2>
              <Link to="/admin/users" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}>{t('admin.dashboard.view_all')}</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recent.users?.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '12px', background: '#fcfcfc', border: '1px solid #f1f1f1', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #e63946, #f1faee)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{u.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{u.email}</p>
                  </div>
                  <div style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '20px', backgroundColor: u.role === 'donor' ? '#e1f5fe' : '#f3e5f5', color: u.role === 'donor' ? '#0288d1' : '#7b1fa2', fontWeight: '700', textTransform: 'capitalize' }}>
                    {u.role === 'donor' ? t('public_profile.donor_rank') : t('public_profile.patient_rank')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '0.5rem', textAlign: isRtl ? 'right' : 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t('admin.dashboard.recent_requests')}</h2>
              <Link to="/admin/content" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}>{t('admin.dashboard.view_all')}</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recent.requests?.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '12px', background: '#fcfcfc', border: '1px solid #f1f1f1', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '800' }}>
                    {r.blood_type}
                  </div>
                  <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{t('request_detail.title', { name: r.patient_name || t('home.hero.title') })}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{r.hospital}, {r.city}</p>
                  </div>
                  <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: r.urgency === 'Critical' || r.urgency === 'Urgent' ? '#d32f2f' : '#ef6c00', fontWeight: '800' }}>
                      {t(`new_request_form.urgency.${r.urgency.toLowerCase()}`)}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#999' }}>{new Date(r.created_at).toLocaleDateString(isRtl ? 'ar-MA' : 'fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

