import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  
  // State to hold the live statistics fetched from the server
  const [dashboard, setDashboard] = useState(null);

  /**
   * Effect Hook: Fetch live stats when the page first loads
   */
  useEffect(() => {
    // Make a GET request to the /dashboard API endpoint
    axios.get('/dashboard')
      .then((res) => setDashboard(res.data))
      .catch(() => setDashboard(null));
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
            <Heart size={16} className="heart-pulse" /> <span>Be a hero today</span>
          </div>
          <h1 className="hero-title">
            Save Lives, <br /> Give <span className="text-primary">Blood</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of donors making a difference. BloodConnect connects you directly with those in need in real-time.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Become a Donor <ArrowRight size={18} />
            </Link>
            <Link to="/find-donors" className="btn btn-outline btn-lg">
              <Search size={18} /> Find Blood
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats Overview (Existing Logic) */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-heading">
            <Activity size={24} className="text-primary" /> Live Statistics
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
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">Three simple steps to make a huge impact.</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><Users size={32} /></div>
              <h3>Register</h3>
              <p>Create an account and set your blood type and location. It takes less than 2 minutes.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><Search size={32} /></div>
              <h3>Connect</h3>
              <p>Get notified when someone needs your blood type, or search for donors if you are in need.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><HeartPulse size={32} /></div>
              <h3>Save a Life</h3>
              <p>Donate blood safely at verified centers and receive your digital certificate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Features / Benefits */}
      <section className="features-section">
        <div className="container">
          <div className="features-layout">
            <div className="features-content">
              <h2 className="section-title">Why Choose BloodConnect?</h2>
              <p className="section-desc">We leverage modern technology to make blood donation fast, secure, and transparent.</p>
              
              <ul className="feature-list">
                <li>
                  <div className="feature-icon"><Zap size={24} /></div>
                  <div className="feature-text">
                    <h4>Real-time Tracking</h4>
                    <p>Live updates on blood stock and instant notifications for urgent requests.</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon"><ShieldCheck size={24} /></div>
                  <div className="feature-text">
                    <h4>Verified Donors</h4>
                    <p>All users go through a simple verification process to ensure safety and reliability.</p>
                  </div>
                </li>
                <li>
                  <div className="feature-icon"><Clock size={24} /></div>
                  <div className="feature-text">
                    <h4>Automated Certificates</h4>
                    <p>Receive official, downloadable certificates for every successful donation.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Blood Stock Panel (Existing Logic) */}
            <div className="blood-stock-panel">
              <h3 className="stock-title">
                <Droplet size={20} className="text-primary" />
                Current Blood Stock
              </h3>
              <div className="stock-grid">
                {(dashboard?.blood_stock || []).map((row) => {
                  const low = Number(row.quantity) < 10;
                  return (
                    <div key={row.blood_type} className={`stock-item ${low ? 'low-stock' : ''}`}>
                      <div className="stock-type">{row.blood_type}</div>
                      <div className="stock-qty">
                        {row.quantity} <span>units</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!dashboard?.blood_stock?.length && (
                <p className="no-data">Fetching latest stock data...</p>
              )}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
