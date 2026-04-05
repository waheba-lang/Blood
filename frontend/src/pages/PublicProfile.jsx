import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

export default function PublicProfile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    axios.get(`/users/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('common.loading')}</div>;
  if (!profile) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('public_profile.not_found')}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>{t('public_profile.title', { name: profile.name })}</h1>
        <Link to="/requests" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          {isRtl ? '→' : '←'} {t('request_detail.back')}
        </Link>
      </div>

      <Card style={{ textAlign: 'center', padding: '3rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(to right, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem', fontWeight: 'bold' }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profile.name}</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>
          {profile.role === 'donor' ? t('public_profile.donor_rank') : t('public_profile.patient_rank')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{profile.donations_count || 0}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('public_profile.stats.donations')}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>{profile.donation_requests_count || 0}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('public_profile.stats.requests')}</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: isRtl ? 'right' : 'left' }}>
          {profile.role === 'donor' && (
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{t('my_donations.status')}: </strong>
              <span style={{ color: profile.is_available ? 'var(--success)' : 'var(--text-muted)', fontWeight: 'bold' }}>
                {profile.is_available ? t('public_profile.available') : t('public_profile.not_available')}
              </span>
            </p>
          )}
          {profile.blood_type && (
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{t('auth.blood_type_label')}: </strong>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 'bold' }}>
                {profile.blood_type}
              </span>
            </p>
          )}
          {profile.city && (
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>{t('auth.city_label')}:</strong> {profile.city}
            </p>
          )}
        </div>
        
        {currentUser?.id !== profile.id && (
          <div style={{ marginTop: '2.5rem' }}>
            <button className="btn btn-primary" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
              {isRtl ? 'مراسلة المستخدم' : 'Contacter'}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

