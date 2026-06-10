import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';

/**
 * Register Page Component
 * 
 * Handles new user registration, including collecting their details 
 * and allowing them to select or upload a profile picture.
 */
export default function Register() {
  const { t, i18n } = useTranslation();
  
  // Store all form fields in a single state object to keep things organized
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    password_confirmation: '', 
    role: 'donor', 
    phone: '', 
    city: '', 
    blood_type: 'O+', 
    age: '', 
    gender: 'Male',
    avatar_type: 'defaults/avatars/avatar1.png' // Default avatar path
  });
  
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const isRtl = i18n.language === 'ar';

  /**
   * Helper to update the formData state whenever any text input changes.
   * e.target.name is the name attribute of the input, e.target.value is what they typed.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles the form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Check if passwords match before sending to server
    if (formData.password !== formData.password_confirmation) {
      return setError(t('auth.password_mismatch'));
    }
    setError('');
    
    // Construct normal JSON payload instead of FormData
    const payload = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        payload[key] = formData[key];
      }
    });

    try {
      // Call the register function from AuthContext
      await register(payload);
      // Redirect directly to Home page
      navigate('/');
    } catch (err) {
      // Show error message
      setError(err.response?.data?.message || t('auth.register_error'));
    }
  };

  // Pre-defined avatars the user can choose from
  const defaultAvatars = [
    'defaults/avatars/avatar1.png',
    'defaults/avatars/avatar2.png',
    'defaults/avatars/avatar3.png',
    'defaults/avatars/avatar4.png',
  ];

  // Base URL for fetching the default avatar images
  const baseUrl = axios.defaults.baseURL ? axios.defaults.baseURL.replace('/api', '') : '';

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h2>{t('auth.register_title')}</h2>
          <p>{t('auth.register_subtitle')}</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form auth-form-grid">
          <div style={{ gridColumn: '1 / -1' }} className="auth-group">
            <label className="auth-label">{t('auth.fullname_label')}</label>
            <input 
              name="name" 
              type="text" 
              className="auth-input" 
              value={formData.name}
              onChange={handleChange} 
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }} className="auth-group">
            <label className="auth-label">{t('auth.email_label')}</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="auth-input"
              placeholder="votre@email.com" 
              value={formData.email}
              onChange={handleChange} 
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.password_label')}</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="auth-input"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange} 
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.confirm_password_label')}</label>
            <input 
              name="password_confirmation" 
              type="password" 
              required 
              className="auth-input"
              placeholder="••••••••" 
              value={formData.password_confirmation}
              onChange={handleChange} 
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.role_label')}</label>
            <select name="role" className="auth-input" value={formData.role} onChange={handleChange} style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <option value="donor">{t('auth.role_donor')}</option>
              <option value="patient">{t('auth.role_patient')}</option>
              <option value="organizer">{t('auth.role_organizer')}</option>
            </select>
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.phone_label')}</label>
            <input name="phone" type="text" placeholder="+212 ..." className="auth-input" value={formData.phone} onChange={handleChange} style={{ textAlign: isRtl ? 'right' : 'left' }} />
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.city_label')}</label>
            <input name="city" type="text" required placeholder={t('filters.city_placeholder')} className="auth-input" value={formData.city} onChange={handleChange} style={{ textAlign: isRtl ? 'right' : 'left' }} />
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.blood_type_label')}</label>
            <select name="blood_type" className="auth-input" value={formData.blood_type} onChange={handleChange} style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.age_label')}</label>
            <input name="age" type="number" min="18" max="100" placeholder="18" className="auth-input" value={formData.age} onChange={handleChange} style={{ textAlign: isRtl ? 'right' : 'left' }} />
          </div>

          <div className="auth-group">
            <label className="auth-label">{t('auth.gender_label')}</label>
            <select name="gender" className="auth-input" value={formData.gender} onChange={handleChange} style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <option value="Male">{t('auth.gender_male')}</option>
              <option value="Female">{t('auth.gender_female')}</option>
              <option value="Other">{t('auth.gender_other')}</option>
            </select>
          </div>

          <div className="auth-group" style={{ gridColumn: '1 / -1' }}>
            <label className="auth-label">{t('profile.photo_label') || 'Profile Picture'}</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {defaultAvatars.map((path, idx) => (
                <div 
                  key={idx}
                  onClick={() => setFormData({ ...formData, avatar_type: path })}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: formData.avatar_type === path ? '3px solid var(--primary)' : '3px solid transparent',
                    background: `url(${baseUrl}/${path}) center/cover`,
                    transition: 'all 0.2s ease'
                  }}
                  title={`Avatar ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t('auth.register_btn')}</button>
          </div>
        </form>

        <p className="auth-footer">
          {t('auth.have_account')} 
          <Link to="/login">{t('auth.login_here')}</Link>
        </p>
      </div>
    </div>
  );
}

