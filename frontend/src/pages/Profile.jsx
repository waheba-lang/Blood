import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Droplet, 
  Shield, 
  CheckCircle, 
  Edit3, 
  Save, 
  X,
  Camera,
  Calendar,
  History,
  FileText,
  Clock,
  LogOut,
  ChevronRight,
  Award,
  Download,
  Target
} from 'lucide-react';
import './Profile.css';

/**
 * Profile Page Component
 * 
 * The main user dashboard where they can edit their personal details,
 * view their donation history, see their eligibility status, and track campaigns.
 */
export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [formData, setFormData] = useState({});

  const handleLogout = async () => {
    await logout();
  };
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
        city: user.city || '',
        blood_type: user.blood_type || '',
        is_available: user.is_available,
        age: user.age || '',
        gender: user.gender || 'Male',
        avatar_type: user.profile_photo_path?.startsWith('defaults/') ? user.profile_photo_path : ''
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="stats-dashboard--center">
        <Droplet size={64} className="stats-spin" />
        <p className="stats-muted">{t('common.loading')}</p>
      </div>
    );
  }

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && key !== 'avatar_url') {
         data.append(key, formData[key]);
      }
    });
    
    if (formData.profile_photo_file) {
      data.append('profile_photo', formData.profile_photo_file);
    }

    try {
      data.append('_method', 'PUT');
      await axios.post(`/users/${user.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage(t('profile.update_success'));
      setMsgType('success');
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      setMessage(t('profile.update_failed'));
      setMsgType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_photo_file: file, avatar_type: '' });
    }
  };

  const defaultAvatars = [
    'defaults/avatars/avatar1.png',
    'defaults/avatars/avatar2.png',
    'defaults/avatars/avatar3.png',
    'defaults/avatars/avatar4.png',
  ];

  const baseUrl = axios.defaults.baseURL.replace('/api', '');

  const InfoBox = ({ icon: Icon, label, value }) => (
    <div className="info-box-modern">
      <label><Icon size={14} /> {label}</label>
      <div>{value || '—'}</div>
    </div>
  );

  const donationCount = user?.donations?.length || 0;
  let badgeInfo = null;
  if (donationCount >= 10) {
    badgeInfo = { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', text: 'Héros du Don (Or)', level: 'Gold' };
  } else if (donationCount >= 5) {
    badgeInfo = { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', text: 'Donneur Actif (Argent)', level: 'Silver' };
  } else if (donationCount >= 3) {
    badgeInfo = { color: '#b45309', bg: 'rgba(180, 83, 9, 0.1)', text: 'Donneur Régulier (Bronze)', level: 'Bronze' };
  }

  return (
    <div className="profile-container container" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <section className="profile-hero">
        <div className="profile-avatar-container" style={{ backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : 'none' }}>
          {!user.avatar_url && user.name.charAt(0)}
          {isEditing && (
            <label className="avatar-edit-btn">
              <Camera size={20} />
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </label>
          )}
        </div>

        <div className="profile-header-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>{user.name}</h1>
            {badgeInfo && (
              <span style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: badgeInfo.bg, color: badgeInfo.color, 
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 
              }}>
                <Award size={16} />
                {badgeInfo.text}
              </span>
            )}
          </div>
          <div className="profile-badges" style={{ marginTop: '10px' }}>
            <span className="btn btn-outline" style={{ pointerEvents: 'none', borderRadius: '50px', fontSize: '0.8rem', height: 'auto', padding: '0.5rem 1.25rem' }}>
               {user.role.toUpperCase()}
            </span>
            <button onClick={() => setIsEditing(!isEditing)} className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.5rem 1.5rem' }}>
              {isEditing ? <><X size={18} /> {t('profile.cancel')}</> : <><Edit3 size={18} /> {t('profile.edit')}</>}
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className={`auth-error ${msgType === 'success' ? 'bms-msg-success' : ''}`} style={{ marginBottom: '2rem', borderRadius: '16px' }}>
          {message}
        </div>
      )}

      <div className="profile-grid-main">
        
        <div className="glass-card">
          <h3 className="card-title">
            <User size={24} color="var(--p-accent)" />
            {isEditing ? t('profile.edit_title') : t('profile.info_title')}
          </h3>

          {!isEditing ? (
            <div className="info-grid-modern">
               <InfoBox icon={Mail} label={t('auth.email_label')} value={user.email} />
               <InfoBox icon={Phone} label={t('auth.phone_label')} value={user.phone} />
               <InfoBox icon={MapPin} label={t('auth.city_label')} value={user.city} />
               <InfoBox icon={Droplet} label={t('auth.blood_type_label')} value={user.blood_type} />
               <InfoBox icon={User} label={t('auth.age_label')} value={user.age} />
               <InfoBox icon={Calendar} label={t('auth.gender_label')} value={user.gender} />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', display: 'block' }}>{t('profile.photo_selection')}</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {defaultAvatars.map((path, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setFormData({ ...formData, avatar_type: path, profile_photo_file: null })}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: (formData.avatar_type === path && !formData.profile_photo_file) ? '3px solid var(--p-accent)' : '2px solid #eee',
                        background: `url(${baseUrl}/${path}) center/cover`,
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="info-grid-modern">
                <input name="name" className="input-modern" value={formData.name || ''} placeholder={t('auth.fullname_label')} required onChange={handleChange} />
                <input name="phone" className="input-modern" value={formData.phone || ''} placeholder={t('auth.phone_label')} onChange={handleChange} />
                <input name="city" className="input-modern" value={formData.city || ''} placeholder={t('auth.city_label')} onChange={handleChange} />
                <input name="age" type="number" className="input-modern" value={formData.age || ''} placeholder={t('auth.age_label')} onChange={handleChange} />
                <select name="blood_type" className="input-modern" value={formData.blood_type || ''} onChange={handleChange}>
                  <option value="">{t('profile.select_group')}</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                </select>
                <select name="gender" className="input-modern" value={formData.gender || ''} onChange={handleChange}>
                  <option value="Male">{t('auth.gender_male')}</option>
                  <option value="Female">{t('auth.gender_female')}</option>
                  <option value="Other">{t('auth.gender_other')}</option>
                </select>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                <span style={{ fontWeight: 600 }}>{t('profile.availability_checkbox')}</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', borderRadius: '12px', padding: '1rem' }} disabled={saving}>
                {saving ? t('profile.saving') : t('profile.save_changes')}
              </button>
            </form>
          )}
        </div>

        <div>
          {user.role === 'donor' && (
            <div className="status-card-lite">
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: 0, fontWeight: 800 }}>{t('profile.eligibility_status')}</h4>
                  <span className={`status-tag ${user.is_eligible ? 'active' : 'waiting'}`}>
                    {user.is_eligible ? 'Eligible' : 'Waiting'}
                  </span>
               </div>
               <p style={{ color: 'var(--p-text-light)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.5rem' }}>
                 {user.is_eligible 
                   ? t('profile.eligible_active') 
                   : `${t('profile.next_eligibility')}: ${new Date(user.next_eligible_date).toLocaleDateString()}`}
               </p>
               <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t('profile.last_donation')}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{user.last_donation_at ? new Date(user.last_donation_at).toLocaleDateString() : '—'}</span>
               </div>
               
               {donationCount >= 3 && (
                 <button onClick={() => navigate('/certificate')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.8rem' }}>
                   <Download size={18} style={{ marginRight: '8px' }} />
                   Télécharger mon certificat
                 </button>
               )}
            </div>
          )}

          <div className="glass-card" style={{ padding: '2rem' }}>
             <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', borderRadius: '12px', color: '#dc2626' }}>
               <LogOut size={18} />
               {t('nav.logout')}
             </button>
          </div>
        </div>
      </div>

      {user.role === 'donor' && (
        <>
          <section style={{ marginTop: '4rem' }}>
             <h3 className="card-title"><History size={24} /> {t('profile.donation_history')}</h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
               {user.donations?.length > 0 ? user.donations.map(donation => (
                 <div key={donation.id} className="history-item-modern">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '45px', height: '45px', background: '#fff5f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-accent)' }}>
                        <Droplet size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>{donation.hospital || 'Don de sang'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--p-text-light)' }}>{new Date(donation.donation_date || donation.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/donations/${donation.id}/print`)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                      {t('common.details')}
                    </button>
                 </div>
               )) : (
                 <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                   <p style={{ color: 'var(--p-text-light)' }}>{t('my_donations.empty')}</p>
                 </div>
               )}
             </div>
          </section>

          <section style={{ marginTop: '4rem' }}>
             <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--p-accent)"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
               Campagnes Rejointes
             </h3>
             <div style={{ display: 'grid', gap: '1rem' }}>
               {user.joined_campaigns?.length > 0 ? user.joined_campaigns.map(campaign => (
                 <div key={campaign.id} className="history-item-modern">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '45px', height: '45px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>{campaign.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--p-text-light)' }}>{campaign.date} à {campaign.city}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', background: 'rgba(230, 57, 70, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {campaign.status}
                    </span>
                 </div>
               )) : (
                 <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                   <p style={{ color: 'var(--p-text-light)' }}>Vous n'avez rejoint aucune campagne pour le moment.</p>
                   <button onClick={() => navigate('/campaigns')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                     Voir les campagnes
                   </button>
                 </div>
               )}
             </div>
          </section>
        </>
      )}

      {user && (
        <section style={{ marginTop: '4rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={24} color="var(--primary)" />
            Mes Demandes de Campagnes
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {user.created_campaigns?.length > 0 ? user.created_campaigns.map(campaign => (
              <div key={campaign.id} className="history-item-modern">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', background: campaign.approval_status === 'pending' ? 'rgba(251, 191, 36, 0.1)' : campaign.approval_status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: campaign.approval_status === 'pending' ? '#fbbf24' : campaign.approval_status === 'approved' ? '#10b981' : '#ef4444' }}>
                    <Target size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{campaign.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--p-text-light)' }}>Créé le: {new Date(campaign.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: campaign.approval_status === 'pending' ? '#fbbf24' : campaign.approval_status === 'approved' ? '#10b981' : '#ef4444', background: campaign.approval_status === 'pending' ? 'rgba(251, 191, 36, 0.1)' : campaign.approval_status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', textTransform: 'uppercase' }}>
                  {campaign.approval_status === 'pending' ? 'En Attente' : campaign.approval_status === 'approved' ? 'Approuvée' : 'Rejetée'}
                </span>
              </div>
            )) : (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--p-text-light)' }}>Vous n'avez soumis aucune demande de campagne.</p>
                <button onClick={() => navigate('/campaigns')} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Organiser une campagne
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
