import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/notifications');
      const unread = res.data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(nextLng);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container header-container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="logo-section">
          <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="logo-icon" style={{ fontSize: '2rem' }}>🩸</span>
            <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>Blood<span className="logo-highlight" style={{ color: 'var(--primary)' }}>Connect</span></span>
          </Link>
        </div>

        <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)} style={{ display: 'none' }}>
          ☰
        </button>

        <nav className={`nav-menu ${isMobileOpen ? 'active' : ''}`} style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{ textDecoration: 'none', fontWeight: 600, color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setIsMobileOpen(false)}>{t('nav.home')}</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} style={{ textDecoration: 'none', fontWeight: 600, color: isActive('/about') ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setIsMobileOpen(false)}>{t('nav.about')}</Link>
          <Link to="/campaigns" className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`} style={{ textDecoration: 'none', fontWeight: 600, color: isActive('/campaigns') ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setIsMobileOpen(false)}>{t('nav.campaigns')}</Link>
          <Link to="/impact" className={`nav-link ${isActive('/impact') ? 'active' : ''}`} style={{ textDecoration: 'none', fontWeight: 600, color: isActive('/impact') ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setIsMobileOpen(false)}>{t('nav.impact')}</Link>
          <Link to="/requests" className={`nav-link ${isActive('/requests') ? 'active' : ''}`} style={{ textDecoration: 'none', fontWeight: 600, color: isActive('/requests') ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setIsMobileOpen(false)}>{t('nav.requests')}</Link>
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} style={{ textDecoration: 'none', fontWeight: 600, color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)' }} onClick={() => setIsMobileOpen(false)}>{t('nav.dashboard')}</Link>
          )}
        </nav>

        <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={toggleLanguage} className="lang-switcher" style={{ 
            background: 'rgba(0,0,0,0.05)', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '0.4rem 0.8rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            color: 'var(--text-dark)',
            fontSize: '0.9rem',
            minWidth: '45px'
          }}>
            {i18n.language === 'fr' ? 'ع' : 'FR'}
          </button>

          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline" style={{ borderRadius: '12px', padding: '0.6rem 1.2rem' }} onClick={() => setIsMobileOpen(false)}>{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', background: 'var(--primary)', color: 'white', textDecoration: 'none' }} onClick={() => setIsMobileOpen(false)}>{t('nav.register')}</Link>
            </>
          ) : (
            <div className="user-profile-nav" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none', color: 'var(--text-dark)', fontSize: '1.4rem', display: 'flex', alignItems: 'center' }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-5px', 
                    right: '-5px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    fontSize: '0.65rem', 
                    fontWeight: 900, 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 0 0 2px white'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="btn-profile" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                textDecoration: 'none', 
                color: 'var(--text-dark)', 
                fontWeight: 700,
                background: 'rgba(0,0,0,0.03)',
                padding: '0.4rem 1rem 0.4rem 0.4rem',
                borderRadius: '30px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #ff4d6d 100%)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1rem',
                  boxShadow: '0 4px 10px rgba(230, 57, 70, 0.3)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.95rem' }} className="profile-text">{t('nav.profile')}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '10px' }}>
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .mobile-toggle { display: block !important; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
          .nav-menu { 
            display: none; 
            position: absolute; 
            top: 80px; 
            left: 0; 
            right: 0; 
            background: white; 
            flex-direction: column; 
            padding: 2rem; 
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); 
            z-index: 1000;
          }
          .nav-menu.active { display: flex; }
          .auth-buttons { display: none; }
        }
        .btn-profile:hover {
          background: rgba(0,0,0,0.06) !important;
          transform: translateY(-2px);
        }
        [dir="rtl"] .logo-section { margin-left: auto; margin-right: 0; }
        [dir="rtl"] .auth-buttons { margin-right: auto; margin-left: 0; }
        [dir="rtl"] .logo { flex-direction: row-reverse; }
        @media (max-width: 768px) {
          .profile-text { display: none; }
        }
      `}} />
    </header>
  );
}

