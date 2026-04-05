import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';

export default function Login() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const isRtl = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || t('auth.login_error');
      setError(msg);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '85vh',
      padding: '2rem',
      background: 'radial-gradient(circle at top right, rgba(230, 57, 70, 0.05), transparent), radial-gradient(circle at bottom left, rgba(69, 123, 157, 0.05), transparent)'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '450px', 
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
          }}>{t('auth.login_title')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('auth.login_subtitle')}</p>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{t('auth.email_label')}</label>
            <input
              type="email"
              required
              placeholder="votre@email.com"
              style={{ 
                width: '100%', 
                padding: '0.9rem 1.25rem', 
                borderRadius: '12px', 
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.5)',
                transition: 'var(--transition)',
                outline: 'none',
                textAlign: isRtl ? 'right' : 'left'
              }}
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{t('auth.password_label')}</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '0.9rem 1.25rem', 
                borderRadius: '12px', 
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.5)',
                transition: 'var(--transition)',
                outline: 'none',
                textAlign: isRtl ? 'right' : 'left'
              }}
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>{t('auth.login_btn')}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          {t('auth.no_account')} <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{t('auth.register_here')}</Link>
        </p>
      </div>
    </div>
  );
}

