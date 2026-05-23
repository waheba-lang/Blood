import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { Calendar, CheckCircle2, Droplet, History, Loader2 } from 'lucide-react';
import './bms-pages.css';

/**
 * MyDonations Page Component
 * 
 * Allows users to view their past donations and log new ones.
 * It enforces the 3-month health rule between donations.
 */
export default function MyDonations() {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth(); // Current logged-in user
  
  // State variables for the donation form and list
  const [donations, setDonations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const locale = i18n.language.startsWith('ar') ? 'ar-MA' : 'fr-FR';
  const isRtl = i18n.language === 'ar';

  /**
   * Calculate the exact date the user is next allowed to donate.
   * Blood donation requires a 3-month gap for health reasons.
   */
  const nextEligibleDate = useMemo(() => {
    if (!user?.last_donation_at) return null;
    const last = new Date(user.last_donation_at);
    const next = new Date(last);
    next.setMonth(next.getMonth() + 3);
    return next;
  }, [user]);

  /**
   * Determine if the user is currently allowed to donate (is today >= nextEligibleDate?).
   */
  const canDonate = useMemo(() => {
    if (!nextEligibleDate) return true;
    return new Date() >= nextEligibleDate;
  }, [nextEligibleDate]);

  /**
   * Fetch the user's past donations from the backend.
   */
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/donations');
      setDonations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations when the component mounts, if the user is logged in
  useEffect(() => {
    if (user) fetchDonations();
  }, [user]);

  const handleDeclareDonation = async () => {
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const { data } = await axios.post('/donations', { quantity });
      setMessage(t('bms.saved_next', { date: data.next_available_date }));
      await fetchDonations();
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      const nextDate = err?.response?.data?.next_available_date;
      setError(
        nextDate
          ? `${apiMessage || t('bms.error_save')} (${t('bms.next_eligible', { date: nextDate })})`
          : apiMessage || t('bms.error_save')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="bms-loader">{t('bms.loading')}</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="bms-loader">
        <Loader2 className="spin" size={32} style={{ animation: 'spin 0.9s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="bms-page">
      <header className="bms-hero" style={{ marginBottom: '1.5rem' }}>
        <div className="bms-hero-inner">
          <div>
            <div className="bms-hero-badge">
              <Droplet size={16} />
              {t('bms.my_donations_badge')}
            </div>
            <h1>{t('bms.declare_title')}</h1>
            <p>{t('bms.declare_subtitle')}</p>
          </div>
        </div>
      </header>

      <section className="glass-panel bms-panel bms-declare-card">
        <h3 className="bms-section-title" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle2 size={22} color="var(--primary)" />
          {t('bms.i_donated_today')}
        </h3>

        {!canDonate && (
          <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.05)', border: '1px solid rgba(230, 57, 70, 0.2)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: isRtl ? 'right' : 'left', direction: isRtl ? 'rtl' : 'ltr' }}>
            <h4 style={{ color: '#e63946', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              Vous ne pouvez pas encore donner. Votre prochaine date d'éligibilité est le : {nextEligibleDate?.toLocaleDateString(locale)}
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              Le don de sang nécessite une période de récupération de 3 mois pour protéger votre santé. Donner avant ce délai augmente les risques de :
            </p>
            <ul style={{ margin: 0, paddingLeft: isRtl ? 0 : '1.5rem', paddingRight: isRtl ? '1.5rem' : 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <li>Fatigue excessive et affaiblissement du système immunitaire</li>
              <li>Vertiges et évanouissements (Dizziness)</li>
              <li>Faible taux de fer et anémie (Low iron levels)</li>
              <li>Faiblesse générale (Weakness)</li>
              <li>Autres complications de santé sévères</li>
            </ul>
          </div>
        )}
        <div className="bms-declare-row">
          <label htmlFor="quantity">{t('bms.units_label')}</label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={5}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={submitting || !canDonate}
            onClick={handleDeclareDonation}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {submitting ? <Loader2 size={18} className="spin" style={{ animation: 'spin 0.8s linear infinite' }} /> : <Droplet size={18} />}
            {submitting ? t('bms.saving') : t('bms.confirm_donation')}
          </button>
          {!canDonate && (
            <span className="bms-status-pill bms-status-pill--wait">
              {t('bms.not_eligible')}
            </span>
          )}
        </div>
        {message && <div className="bms-msg-success">{message}</div>}
        {error && <div className="bms-msg-error">{error}</div>}
      </section>

      <section className="glass-panel bms-panel">
        <h3 className="bms-section-title">
          <History size={22} />
          {t('bms.history')}
        </h3>
        {donations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>{t('bms.no_donations')}</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {donations.map((donation) => (
              <div key={donation.id} className="bms-history-item">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800 }}>
                  <Calendar size={18} color="var(--primary)" />
                  {new Date(donation.donation_date || donation.created_at).toLocaleDateString(locale)}
                </span>
                <span style={{ fontWeight: 700 }}>
                  {donation.quantity || 1}{' '}
                  {(donation.quantity || 1) > 1 ? t('bms.units_plural') : t('bms.unit_singular')}
                </span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  {t(`donation_status.${donation.status}`, { defaultValue: donation.status })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
