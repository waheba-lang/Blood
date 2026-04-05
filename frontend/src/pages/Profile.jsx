import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import Card from '../components/Card';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({});
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
        is_available: user.is_available
      });
    }
  }, [user]);

  if (authLoading || !user) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('common.loading')}</div>;

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/users/${user.id}`, formData);
      setMsgType('success');
      setMessage(t('profile.update_success'));
      setTimeout(() =>setMessage(''), 3000);
    } catch (err) {
      setMsgType('error');
      setMessage(t('profile.update_failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '3rem', paddingBottom: '5rem', textAlign: isRtl ? 'right' : 'left' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{t('profile.title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('profile.subtitle')}</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        {message && (
          <div style={{ 
            background: msgType === 'error' ? 'rgba(230, 57, 70, 0.1)' : 'rgba(42, 157, 143, 0.1)', 
            color: msgType === 'error' ? 'var(--primary)' : 'var(--success)', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '2rem',
            fontWeight: 600,
            textAlign: 'center',
            border: '1px solid currentColor'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem', direction: isRtl ? 'rtl' : 'ltr' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.6rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{t('auth.fullname_label')}</label>
            <input name="name" value={formData.name || ''} required style={{ width: '100%', padding: '0.9rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.6rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{t('auth.email_label')}</label>
            <input value={user.email} disabled style={{ width: '100%', padding: '0.9rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)', color: 'var(--text-muted)', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.6rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{t('auth.phone_label')}</label>
              <input name="phone" value={formData.phone || ''} placeholder="+212 ..." style={{ width: '100%', padding: '0.9rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.6rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{t('auth.city_label')}</label>
              <input name="city" value={formData.city || ''} placeholder={t('filters.city_placeholder')} style={{ width: '100%', padding: '0.9rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.6rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{t('auth.blood_type_label')}</label>
            <select name="blood_type" value={formData.blood_type || ''} style={{ width: '100%', padding: '0.9rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} onChange={handleChange}>
              <option value="">{t('profile.select_group')}</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '1.5rem', 
            background: 'rgba(42, 157, 143, 0.05)', 
            borderRadius: '16px',
            border: '1px dashed var(--success)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', fontWeight: 600, color: 'var(--success)' }}>
              <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} style={{ width: '22px', height: '22px', accentColor: 'var(--success)' }} />
              {t('profile.availability_checkbox')}
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '1.5rem', width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
            {saving ? t('profile.saving') : t('profile.save')}
          </button>
        </form>
      </div>
    </div>
  );
}

