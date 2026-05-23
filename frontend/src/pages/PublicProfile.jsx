import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { 
  MapPin, 
  Droplet, 
  ArrowLeft, 
  Shield, 
  User,
  History,
  Calendar
} from 'lucide-react';
import './Profile.css';

/**
 * PublicProfile Page Component
 * 
 * Displays the public view of a donor's profile.
 * Other users can view this to see their blood type, city, and donation history.
 */
export default function PublicProfile() {
  const { t, i18n } = useTranslation();
  
  // Extracts the 'id' parameter from the URL (e.g., /users/123 -> id is 123)
  const { id } = useParams();
  
  // State to hold the fetched profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  /**
   * Effect Hook: Fetches the user's profile from the backend when the component mounts
   * or when the 'id' in the URL changes.
   */
  useEffect(() => {
    axios.get(`/users/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="stats-dashboard--center">
        <Droplet size={64} className="stats-spin" />
        <p className="stats-muted">{t('common.loading')}</p>
      </div>
    );
  }
  
  if (!profile) return (
    <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
      <h3>{t('public_profile.not_found')}</h3>
      <Link to="/find-donors" className="btn btn-primary" style={{ borderRadius: '50px' }}>{t('common.back')}</Link>
    </div>
  );

  return (
    <div className="profile-container container" dir={isRtl ? 'rtl' : 'ltr'}>
      <header style={{ marginBottom: '3rem' }}>
        <Link to="/find-donors" className="btn btn-outline" style={{ borderRadius: '50px', padding: '0.5rem 1.5rem' }}>
           <ArrowLeft size={18} />
           {t('common.back')}
        </Link>
      </header>

      <section className="profile-hero">
        <div className="profile-avatar-container" style={{ backgroundImage: profile.avatar_url ? `url(${profile.avatar_url})` : 'none' }}>
          {!profile.avatar_url && profile.name.charAt(0)}
        </div>

        <div className="profile-header-info">
          <h1>{profile.name}</h1>
          <div className="profile-badges">
            <span className="btn btn-outline" style={{ pointerEvents: 'none', borderRadius: '50px', fontSize: '0.8rem', height: 'auto', padding: '0.5rem 1.25rem' }}>
               {profile.role.toUpperCase()}
            </span>
            {profile.role === 'donor' && (
              <span className={`status-tag ${profile.is_available ? 'active' : 'waiting'}`}>
                 {profile.is_available ? t('public_profile.available') : t('public_profile.not_available')}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="profile-grid-main">
        
        <div className="glass-card">
          <h3 className="card-title">
            <User size={24} color="var(--p-accent)" />
            {t('public_profile.about')}
          </h3>
          <div className="info-grid-modern">
            <div className="info-box-modern">
              <label><Droplet size={14} /> {t('auth.blood_type_label')}</label>
              <div style={{ color: 'var(--p-accent)', fontWeight: 800 }}>{profile.blood_type}</div>
            </div>
            <div className="info-box-modern">
              <label><MapPin size={14} /> {t('auth.city_label')}</label>
              <div>{profile.city}</div>
            </div>
            <div className="info-box-modern">
              <label><Calendar size={14} /> Member Since</label>
              <div>{new Date(profile.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="status-card-lite" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
             <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--p-accent)', lineHeight: 1 }}>{profile.donations_count || 0}</div>
             <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', marginTop: '0.5rem', letterSpacing: '1px' }}>{t('public_profile.stats.donations')}</div>
             <p style={{ marginTop: '1.5rem', color: 'var(--p-text-light)', fontSize: '0.9rem' }}>
               {t('public_profile.stats.impact_msg')}
             </p>
          </div>
        </div>

      </div>

      {profile.role === 'donor' && profile.donations?.length > 0 && (
        <section style={{ marginTop: '4rem' }}>
           <h3 className="card-title"><History size={24} /> {t('profile.donation_history')}</h3>
           <div style={{ display: 'grid', gap: '1rem' }}>
             {profile.donations.map(donation => (
               <div key={donation.id} className="history-item-modern">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', background: '#fff5f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-accent)' }}>
                      <Droplet size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{donation.hospital}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--p-text-light)' }}>{new Date(donation.donation_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.85rem' }}>{donation.status}</div>
               </div>
             ))}
           </div>
        </section>
      )}
    </div>
  );
}
