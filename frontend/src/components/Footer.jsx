import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Droplet,
  Users
} from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const { t, i18n } = useTranslation();
  
  // RTL handling if needed, though design is explicitly formatted
  const isRtl = i18n.language === 'ar';

  return (
    <footer className="footer-custom">
      {/* Wave Shape Divider */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z" 
            fill="var(--footer-bg)" 
          />
          {/* Accent Line (Burgundy Red) */}
          <path 
            d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60" 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="4" 
          />
        </svg>
      </div>

      <div className="container">
        <div className="footer-grid">
          
          {/* Column 1: Brand & Contact & Social */}
          <div className="footer-col-1">
            <div className="footer-logo-container">
              <img src="/bloodconnect-logo.png" alt="BloodConnect Logo" className="footer-logo-img" />
              <div className="footer-brand-text">
                <h2>Blood<span>Connect</span></h2>
                <p>{t('footer.platform_desc')}<br/>{t('footer.national_service')}</p>
              </div>
            </div>

            <div className="footer-contact-info">
              <div className="contact-line">
                <MapPin size={16} />
                <span>{t('footer.hq_address')}</span>
              </div>
              <div className="contact-line">
                <Phone size={16} />
                <span>+212 522 123456</span>
              </div>
              <div className="contact-line">
                <Mail size={16} />
                <span>info@bloodconnect.ma</span>
              </div>
            </div>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Column 2: CONTACT */}
          <div className="footer-col-2 align-right">
            <h4 className="footer-title">{t('footer.contact_title')}</h4>
            <ul className="footer-links">
              <li><Link to="/faq">{t('footer.faq')}</Link></li>
              <li><Link to="/mentions">{t('footer.legal')}</Link></li>
              <li><Link to="/contact">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            </ul>
          </div>

          {/* Column 3: INFORMATIONS */}
          <div className="footer-col-3 align-right">
            <h4 className="footer-title">{t('footer.info_title')}</h4>
            <ul className="footer-links">
              <li><Link to="/register">{t('footer.register')}</Link></li>
              <li><Link to="/find-donors">{t('footer.centers')}</Link></li>
              <li><Link to="/eligibility">{t('footer.eligibility')}</Link></li>
              <li><Link to="/hospitals">{t('footer.hospitals')}</Link></li>
              <li><Link to="/about">{t('footer.about')}</Link></li>
              <li><Link to="/news">{t('footer.news')}</Link></li>
            </ul>
          </div>

          {/* Column 4: LIENS RAPIDES */}
          <div className="footer-col-4">
            <h4 className="footer-title">{t('footer.quick_links')}</h4>
            
            <div className="footer-buttons">
              <Link to="/donate" className="footer-btn btn-red">
                <span>{t('footer.donate_now').split('\\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br/>}</React.Fragment>)}</span> <Droplet size={16} className="btn-icon"/>
              </Link>
              <Link to="/organization" className="footer-btn btn-red">
                <span>{t('footer.register_org').split('\\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br/>}</React.Fragment>)}</span> <Users size={16} className="btn-icon"/>
              </Link>
            </div>

            <div className="footer-map-card">
              <span>{t('footer.find_center')}</span>
              <div className="map-icon-wrapper">
                <MapPin size={24} color="var(--primary)" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-partners">
            <div className="partner-logo">
              <span className="partner-icon">🌙</span> {t('footer.red_crescent')}
            </div>
            <div className="partner-logo">
              <span className="partner-icon">⚕️</span> {t('footer.health_ministry')}
            </div>
          </div>
          <div className="footer-copyright">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}
