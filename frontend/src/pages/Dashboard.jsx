import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { Activity, AlertTriangle, Droplet, HeartPulse, LayoutDashboard, Users } from 'lucide-react';
import './bms-pages.css';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    axios.get('/dashboard').then((res) => setDashboard(res.data)).catch(() => setDashboard(null));
  }, []);

  if (loading) {
    return (
      <div className="bms-loader">
        <div className="loader" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  const stats = [
    { key: 'total_donors', label: t('bms.stat_total_donors'), icon: Users },
    { key: 'available_donors', label: t('bms.stat_available_donors'), icon: HeartPulse },
    { key: 'total_donations', label: t('bms.stat_total_donations'), icon: Activity },
    { key: 'total_stock_units', label: t('bms.stat_stock_units'), icon: Droplet },
  ];

  return (
    <div className="bms-page">
      <header className="bms-hero" style={{ marginBottom: '1.5rem' }}>
        <div className="bms-hero-inner">
          <div>
            <div className="bms-hero-badge">
              <LayoutDashboard size={16} />
              {t('bms.dashboard_badge')}
            </div>
            <h1>{t('bms.operations_center')}</h1>
            <p>{t('bms.greeting', { name: user.name })}</p>
            <div className="bms-hero-actions" style={{ marginTop: '1.25rem' }}>
              <Link className="btn btn-primary" to="/my-donations">
                <Droplet size={18} />
                {t('bms.i_donated')}
              </Link>
              <Link className="btn btn-outline-light" to="/find-donors">
                {t('bms.view_donors')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="bms-stat-grid">
        {stats.map(({ key, label, icon: Icon }) => (
          <div key={key} className="glass-panel bms-stat-card">
            <div className="bms-stat-card-icon">
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div className="bms-stat-card-label">{label}</div>
            <div className="bms-stat-card-value">
              {dashboard
                ? Number(dashboard[key] ?? 0).toLocaleString()
                : '—'}
            </div>
          </div>
        ))}
      </div>

      <section className="glass-panel bms-panel">
        <h3 className="bms-section-title">
          <Droplet size={22} color="#dc2626" />
          {t('bms.blood_stock_title')}
        </h3>
        <div className="bms-blood-grid">
          {(dashboard?.blood_stock || []).map((row) => {
            const low = Number(row.quantity) < 10;
            return (
              <div
                key={row.blood_type}
                className={`bms-blood-cell${low ? ' bms-blood-cell--low' : ''}`}
              >
                <div className="bms-blood-cell-type">{row.blood_type}</div>
                <div className="bms-blood-cell-qty">{row.quantity} {t('bms.units')}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`glass-panel bms-panel ${(dashboard?.low_stock_alerts || []).length ? 'bms-alert-panel' : ''}`}>
        <h3 className="bms-section-title">
          <AlertTriangle size={22} color="#dc2626" />
          {t('bms.low_stock_title')}
        </h3>
        {(dashboard?.low_stock_alerts || []).length === 0 ? (
          <p style={{ color: 'var(--success)', marginBottom: 0, fontWeight: 600 }}>
            {t('bms.all_groups_ok')}
          </p>
        ) : (
          <div>
            {dashboard.low_stock_alerts.map((alert) => (
              <div key={alert.blood_type} className="bms-alert-item">
                <AlertTriangle size={18} />
                <span>
                  {t('bms.low_stock_line', { type: alert.blood_type, count: alert.quantity })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
