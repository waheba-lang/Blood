import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <footer className="footer" style={{ textAlign: isRtl ? 'right' : 'left' }}>
      <div className="container">
        <div className="footer-grid" style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div className="footer-info">
            <div className="footer-logo">🩸 Blood Connect</div>
            <p>{t('footer.slogan')}</p>
            <div className="social-links" style={{ justifyContent: isRtl ? 'flex-start' : 'flex-start' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>{t('footer.links_title')}</h4>
            <ul>
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/campaigns">{t('nav.campaigns')}</Link></li>
              <li><Link to="/requests">{t('nav.requests')}</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>{t('footer.contact_title')}</h4>
            <ul style={{ padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <i className="fas fa-phone"></i> <span>05 36 50 12 34</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <i className="fas fa-envelope"></i> <span>contact@donnezdusang.ma</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <i className="fas fa-map-marker-alt"></i> <span>123, Rue de la Liberté, Oujda</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}

