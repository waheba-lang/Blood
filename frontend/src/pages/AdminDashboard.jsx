import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Droplet, CheckCircle2, ArrowRight, UserPlus, History, Target, Check, X } from 'lucide-react';
import Card from '../components/Card';

/**
 * AdminDashboard Page Component
 * 
 * Provides an overview for administrators.
 * Shows total statistics, recent users, recent donations, and allows admins
 * to approve or reject new campaign requests.
 */
export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  const fetchCampaigns = () => {
    axios.get('/admin/campaigns')
      .then(res => setCampaigns(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCampaigns();
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

  const handleCampaignStatus = async (id, status) => {
    try {
      await axios.patch(`/campaigns/${id}/status`, { approval_status: status });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bms-page">
        <div className="stats-dashboard--center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Droplet size={64} className="stats-spin" />
          <p className="stats-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recent = data?.recent_activity || {};

  const statCards = [
    { label: t('admin.dashboard.stats.total_users'), value: stats.total_users, color: 'var(--secondary)', icon: Users },
    { label: t('admin.dashboard.stats.donors'), value: stats.total_donors, color: 'var(--primary)', icon: Droplet },
    { label: t('admin.dashboard.stats.donations'), value: stats.total_donations, color: '#059669', icon: CheckCircle2 },
  ];

  return (
    <div className="bms-page">
      <div style={{ marginBottom: '3rem', textAlign: isRtl ? 'right' : 'left' }} className="reveal">
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>{t('admin.dashboard.title')}</h1>
        <p className="stats-muted" style={{ fontSize: '1.1rem' }}>{t('admin.dashboard.subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel reveal" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '20px',
                backgroundColor: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                boxShadow: `0 8px 20px ${stat.color}10`
              }}>
                <Icon size={32} />
              </div>
              <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>{stat.label}</p>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        {/* Recent Users Card */}
        <div className="glass-panel reveal" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <UserPlus size={20} color="var(--primary)" />
              {t('admin.dashboard.recent_users')}
            </h2>
            <Link to="/admin/users" className="bms-status-pill bms-status-pill--wait" style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {t('admin.dashboard.view_all')}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recent.users?.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '20px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)', transition: 'transform 0.2s' }} className="hover-lift">
                <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.1rem' }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '800', fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>{u.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{u.email}</p>
                </div>
                <span className="profile-stat-badge" style={{ background: u.role === 'donor' ? 'rgba(187, 202, 225, 0.2)' : 'rgba(104, 26, 21, 0.05)', color: u.role === 'donor' ? 'var(--secondary)' : 'var(--primary)' }}>
                  {u.role === 'donor' ? t('public_profile.donor_rank') : t('public_profile.patient_rank')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donations Card */}
        <div className="glass-panel reveal" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <History size={20} color="var(--primary)" />
              {t('admin.dashboard.recent_donations')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(recent.donations || []).map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '20px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)' }} className="hover-lift">
                <div style={{ width: '50px', height: '50px', borderRadius: '16px', backgroundColor: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: '900' }}>
                  {d.quantity ?? 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '800', fontSize: '1rem', margin: 0 }}>{d.user?.name || '—'}</p>
                  <p className="stats-muted" style={{ fontSize: '0.8rem', margin: 0 }}>{d.status}</p>
                </div>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {d.donation_date ? new Date(d.donation_date).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Campaigns Section */}
      <div className="glass-panel reveal" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target size={20} color="var(--primary)" />
            {t('admin.dashboard.campaign_requests')}
          </h2>
        </div>
        {campaigns.length === 0 ? (
           <p className="stats-muted">{t('admin.dashboard.no_campaign_requests')}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {campaigns.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderRadius: '20px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '16px', backgroundColor: c.approval_status === 'pending' ? 'rgba(251, 191, 36, 0.1)' : c.approval_status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.approval_status === 'pending' ? '#fbbf24' : c.approval_status === 'approved' ? '#10b981' : '#ef4444' }}>
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontWeight: 800 }}>{c.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {t('admin.dashboard.by')} {c.user?.name || c.organizer_name || t('admin.dashboard.unknown')} • {c.city} • {c.date}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {c.approval_status === 'pending' ? (
                    <>
                      <button onClick={() => handleCampaignStatus(c.id, 'approved')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title={t('admin.dashboard.approve')}>
                        <Check size={18} />
                      </button>
                      <button onClick={() => handleCampaignStatus(c.id, 'rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }} title={t('admin.dashboard.reject')}>
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: c.approval_status === 'approved' ? '#10b981' : '#ef4444', textTransform: 'uppercase' }}>
                      {c.approval_status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
