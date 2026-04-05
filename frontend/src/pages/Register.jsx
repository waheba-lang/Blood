import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';

export default function Register() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '', role: 'donor', phone: '', city: '', blood_type: 'O+'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const isRtl = i18n.language === 'ar';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return setError(t('auth.password_mismatch'));
    }
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.register_error'));
    }
  };

  const inputStyle = {
    width: '100%', 
    padding: '0.9rem 1.25rem', 
    borderRadius: '12px', 
    border: '1px solid rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.5)',
    transition: 'var(--transition)',
    outline: 'none',
    fontSize: '0.9rem',
    textAlign: isRtl ? 'right' : 'left'
  };

  const labelStyle = { 
    display: 'block', 
    marginBottom: '0.5rem', 
    fontWeight: 600, 
    fontSize: '0.85rem', 
    color: 'var(--text-dark)',
    textAlign: isRtl ? 'right' : 'left'
  };

  return (
    <div className="auth-page-wrapper" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '90vh',
      padding: '4rem 2rem',
      background: 'radial-gradient(circle at top left, rgba(230, 57, 70, 0.05), transparent), radial-gradient(circle at bottom right, rgba(69, 123, 157, 0.05), transparent)'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '600px', 
        padding: '3rem',
        animation: 'fadeInUp 0.6s ease-out',
        textAlign: isRtl ? 'right' : 'left'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            color: 'var(--text-dark)', 
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px'
          }}>{t('auth.register_title')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('auth.register_subtitle')}</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(230, 57, 70, 0.1)', 
            color: 'var(--primary)', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '2rem', 
            fontSize: '0.9rem',
            border: '1px solid rgba(230, 57, 70, 0.2)',
            fontWeight: 500,
            textAlign: isRtl ? 'right' : 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1.5rem',
          direction: isRtl ? 'rtl' : 'ltr'
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>{t('auth.fullname_label')}</label>
            <input name="name" type="text" required placeholder={t('auth.fullname_placeholder')} style={inputStyle} onChange={handleChange} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>{t('auth.email_label')}</label>
            <input name="email" type="email" required placeholder="votre@email.com" style={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>{t('auth.password_label')}</label>
            <input name="password" type="password" required placeholder="••••••••" style={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>{t('auth.confirm_password_label')}</label>
            <input name="password_confirmation" type="password" required placeholder="••••••••" style={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>{t('auth.role_label')}</label>
            <select name="role" style={inputStyle} onChange={handleChange}>
              <option value="donor">{t('auth.role_donor')}</option>
              <option value="patient">{t('auth.role_patient')}</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>{t('auth.phone_label')}</label>
            <input name="phone" type="text" placeholder="+212 ..." style={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>{t('auth.city_label')}</label>
            <input name="city" type="text" required placeholder={t('filters.city_placeholder')} style={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>{t('auth.blood_type_label')}</label>
            <select name="blood_type" style={inputStyle} onChange={handleChange}>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t('auth.register_btn')}</button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          {t('auth.have_account')} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('auth.login_here')}</Link>
        </p>
      </div>
    </div>
  );
}

