import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, Globe, LogOut, User, Home, Search, Target, Info, Droplet } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ logo = "/bloodconnect-logo.png", logoAlt = "BloodConnect Logo" }) {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(nextLng);
  };

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const isExternalLink = href =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = href => href && !isExternalLink(href);

  // Adding Icons to NavItems for the modern look
  const navItems = [
    { label: t('nav.home'), href: '/', icon: Home },
    { label: t('nav.find_donors'), href: '/find-donors', icon: Search },
    { label: t('nav.campaigns'), href: '/campaigns', icon: Target },
    { label: t('nav.about'), href: '/about', icon: Info },
    { label: t('nav.my_donations'), href: '/my-donations', icon: Droplet }
  ];

  return (
    <div className={`modern-navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <nav className="modern-navbar" aria-label="Primary">
        
        {/* Logo Section */}
        {isRouterLink(navItems?.[0]?.href) ? (
          <Link className="nav-logo" to={navItems[0].href} aria-label="Home">
            <img src={logo} alt={logoAlt} />
            <span className="desktop-only" style={{ display: 'flex' }}>Blood</span>
          </Link>
        ) : (
          <a className="nav-logo" href={navItems?.[0]?.href || '#'} aria-label="Home">
            <img src={logo} alt={logoAlt} />
            <span className="desktop-only" style={{ display: 'flex' }}>Blood</span>
          </a>
        )}

        {/* Desktop Navigation Menu */}
        <ul className="nav-menu desktop-only" role="menubar">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.href;
            const linkClass = `nav-link ${isActive ? 'active' : ''}`;
            const Icon = item.icon;
            const isProtected = !user && ['/find-donors', '/campaigns', '/my-donations'].includes(item.href);

            return (
              <li key={item.href || `item-${i}`} className="nav-item" role="none">
                {isRouterLink(item.href) ? (
                  <Link 
                    role="menuitem" 
                    to={isProtected ? "/login" : item.href} 
                    className={linkClass} 
                    aria-label={item.ariaLabel || item.label}
                    onClick={(e) => {
                      if (isProtected) {
                        e.preventDefault();
                        alert("Veuillez vous connecter pour accéder à ce contenu");
                        navigate('/login');
                      }
                    }}
                  >
                    {Icon && <Icon size={18} />}
                    {item.label}
                  </Link>
                ) : (
                  <a role="menuitem" href={item.href} className={linkClass} aria-label={item.ariaLabel || item.label}>
                    {Icon && <Icon size={18} />}
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        
        {/* Right side actions (Desktop) */}
        <div className="nav-actions desktop-only">
          <button className="action-icon-btn" title="Toggle Language" onClick={toggleLanguage}>
            <Globe size={20} />
          </button>
          
          {user && (
            <button className="action-icon-btn" title="Notifications">
              <Bell size={20} />
              <span className="nav-badge"></span>
            </button>
          )}

          <div className="nav-divider"></div>

          {user ? (
            <div className="nav-profile-container">
              <button 
                className={`nav-profile-btn ${profileDropdownOpen ? 'open' : ''}`}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-expanded={profileDropdownOpen}
              >
                <div className="nav-avatar">
                  {user.avatar_url ? <img src={user.avatar_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}/> : user.name.charAt(0)}
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                  <span className="nav-user-role">{user.role}</span>
                </div>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', transition: 'transform 0.3s', transform: profileDropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              <div className={`nav-dropdown ${profileDropdownOpen ? 'open' : ''}`}>
                <Link to="/profile" className="nav-dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                  <User size={18} /> {t('nav.profile')}
                </Link>
                <button className="nav-dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={18} /> {t('nav.logout')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="nav-login-btn">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="nav-login-btn" style={{ background: 'transparent', border: '1.5px solid var(--primary)', color: 'var(--primary)' }}>
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`hamburger-btn mobile-only ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile Menu Overlay & Drawer */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        
        {/* User Info Header for Mobile */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.5rem' }}>
            <div className="nav-avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
              {user.avatar_url ? <img src={user.avatar_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}/> : user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>{user.role}</div>
            </div>
          </div>
        )}

        <ul className="mobile-nav-list">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.href;
            const linkClass = `mobile-nav-link ${isActive ? 'active' : ''}`;
            const Icon = item.icon;
            const isProtected = !user && ['/find-donors', '/campaigns', '/my-donations'].includes(item.href);

            return (
              <li key={item.href || `mobile-item-${i}`}>
                {isRouterLink(item.href) ? (
                  <Link 
                    to={isProtected ? "/login" : item.href} 
                    className={linkClass} 
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (isProtected) {
                        e.preventDefault();
                        alert("You must log in first to access this content.");
                        navigate('/login');
                      }
                    }}
                  >
                    {Icon && <Icon size={20} />}
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                    {Icon && <Icon size={20} />}
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        
        {/* Mobile Actions */}
        <div className="mobile-actions">
          <button className="mobile-action-btn secondary" onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}>
            <Globe size={18} />
            {t('nav.change_lang')}
          </button>
          
          {user ? (
            <>
              <Link to="/profile" className="mobile-action-btn secondary" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <User size={18} /> {t('nav.profile')}
              </Link>
              <button className="mobile-action-btn danger" onClick={handleLogout}>
                <LogOut size={18} /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-action-btn secondary" style={{ textDecoration: 'none', background: 'rgba(104, 26, 21, 0.1)', color: 'var(--primary)' }} onClick={() => setIsMobileMenuOpen(false)}>
                <User size={18} /> {t('nav.login')}
              </Link>
              <Link to="/register" className="mobile-action-btn secondary" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <User size={18} /> {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
