import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { Activity, Droplet, HeartPulse, Users, Zap, ShieldCheck, Clock, Search, ArrowRight, Heart } from 'lucide-react';
import ColorBends from '../components/ColorBends';
import './bms-pages.css';
import './home.css';

/**
 * Home Page Component
 * 
 * The main landing page of the application.
 * It displays the 3D animated hero section, live statistics from the backend, 
 * and informational sections explaining how the platform works.
 */
const Home = () => {
  const { t } = useTranslation(); // Translation hook
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fallback mock dashboard stats when the backend API is offline
  const MOCK_DASHBOARD = {
    total_donors: 32,
    available_donors: 20,
    not_available_donors: 12,
    total_donations: 124,
    total_stock_units: 149,
    blood_stock: [
      { blood_type: 'A+', quantity: 35 },
      { blood_type: 'A-', quantity: 7 },
      { blood_type: 'B+', quantity: 22 },
      { blood_type: 'B-', quantity: 5 },
      { blood_type: 'AB+', quantity: 14 },
      { blood_type: 'AB-', quantity: 3 },
      { blood_type: 'O+', quantity: 42 },
      { blood_type: 'O-', quantity: 4 }
    ]
  };

  // State to hold the live statistics fetched from the server
  const [dashboard, setDashboard] = useState(null);

  /**
   * Effect Hook: Fetch live stats when the page first loads
   */
  useEffect(() => {
    // Make a GET request to the /dashboard API endpoint
    axios.get('/dashboard')
      .then((res) => {
        if (res.data) {
          setDashboard(res.data);
        } else {
          setDashboard(MOCK_DASHBOARD);
        }
      })
      .catch((err) => {
        console.warn("API server is offline. Using local mock stats fallback.", err);
        setDashboard(MOCK_DASHBOARD);
      });
  }, []); // Empty array means this runs exactly ONCE

  // Define the statistics cards we want to display.
  // The 'key' must match the data returned by our backend API.
  const stats = [
    { key: 'total_donors', label: t('bms.stat_donors') || 'Total Donors', icon: Users, color: 'var(--primary)' },
    { key: 'available_donors', label: t('bms.stat_available') || 'Available Donors', icon: HeartPulse, color: 'var(--success)' },
    { key: 'total_donations', label: t('bms.stat_donations') || 'Total Donations', icon: Activity, color: 'var(--info)' },
    { key: 'total_stock_units', label: t('bms.stat_stock') || 'Stock Units', icon: Droplet, color: 'var(--secondary-hover)' },
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <ColorBends
          colors={["#681A15", "#4d120f", "#BBCAE1"]}
          rotation={90}
          speed={0.5}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.2}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
        <div className="hero-content">
          <div className="hero-badge">
            <Heart size={16} className="heart-pulse" /> <span>{t('home.hero_badge')}</span>
          </div>
          <h1 className="hero-title">
            {t('home.hero_title_part1')} <br /> {t('home.hero_title_part2')} <span className="text-primary">{t('home.hero_title_part3')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('home.hero_subtitle')}
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              {t('home.hero_btn_register')} <ArrowRight size={18} />
            </Link>
            <Link 
              to={user ? "/find-donors" : "/login"} 
              className="btn btn-outline btn-lg"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert(" Veuillez vous connecter pour accéder à ce contenu.");
                  navigate('/login');
                }
              }}
            >
              <Search size={18} /> {t('home.hero_btn_find')}
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats Overview (Existing Logic) */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-heading">
            <Activity size={24} className="text-primary" /> {t('home.stats_title')}
          </h2>
          <div className="stats-grid">
            {stats.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {dashboard ? Number(dashboard[key] ?? 0).toLocaleString() : '—'}
                  </div>
                  <div className="stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. How to Use Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title">{t('home.how_it_works_title')}</h2>
            <p className="section-desc">{t('home.how_it_works_subtitle')}</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><Users size={32} /></div>
              <h3>{t('home.step1_title')}</h3>
              <p>{t('home.step1_desc')}</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><Search size={32} /></div>
              <h3>{t('home.step2_title')}</h3>
              <p>{t('home.step2_desc')}</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><HeartPulse size={32} /></div>
              <h3>{t('home.step3_title')}</h3>
              <p>{t('home.step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Features / Benefits */}
      <section className="features-section">
        <div className="container">
          <div className="features-layout">
            <div className="features-content">
              <h2 className="section-title">{t('home.features_title')}</h2>
              <p className="section-desc">{t('home.features_subtitle')}</p>
              
              <ul className="feature-list">
                <li>
                  <div className="feature-icon"><Zap size={24} /></div>
                  <div className="feature-text">
                    <h4>{t('home.feature1_title')}</h4>
                    <p>{t('home.feature1_desc')}</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon"><ShieldCheck size={24} /></div>
                  <div className="feature-text">
                    <h4>{t('home.feature2_title')}</h4>
                    <p>{t('home.feature2_desc')}</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon"><Clock size={24} /></div>
                  <div className="feature-text">
                    <h4>{t('home.feature3_title')}</h4>
                    <p>{t('home.feature3_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Blood Stock Panel (Existing Logic) */}
            <div className="blood-stock-panel">
              <h3 className="stock-title">
                <Droplet size={20} className="text-primary" />
                {t('home.stock_title')}
              </h3>
              <div className="stock-grid">
                {(dashboard?.blood_stock || []).map((row) => {
                  const low = Number(row.quantity) < 10;
                  return (
                    <div key={row.blood_type} className={`stock-item ${low ? 'low-stock' : ''}`}>
                      <div className="stock-type">{row.blood_type}</div>
                      <div className="stock-qty">
                        {row.quantity} <span>{t('home.stock_units')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!dashboard?.blood_stock?.length && (
                <p className="no-data">{t('home.stock_fetching')}</p>
              )}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
