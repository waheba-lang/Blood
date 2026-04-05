import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';
import './home.css';

const Home = () => {
  const { t } = useTranslation();
  const [liveStats, setLiveStats] = useState(null);
  const [liveRequests, setLiveRequests] = useState([]);

  useEffect(() => {
    // Fetch stats and top 3 urgent requests
    axios.get('/stats/public').then(res => setLiveStats(res.data)).catch(console.error);
    axios.get('/requests?urgency=High').then(res => setLiveRequests(res.data.slice(0, 3))).catch(console.error);
  }, []);

  // Website Statistics
  const stats = [
    { id: 1, value: liveStats ? liveStats.totalDonors + "+" : '...', label: t('home.stats.active_donors'), icon: 'fa-users', color: 'var(--primary)' },
    { id: 2, value: liveStats ? liveStats.totalRequests : '...', label: t('home.stats.urgent_requests'), icon: 'fa-exclamation-circle', color: 'var(--warning)' },
    { id: 3, value: liveStats ? liveStats.fulfilledRequests : '...', label: t('home.stats.lives_saved'), icon: 'fa-heart', color: 'var(--success)' },
    { id: 4, value: liveStats ? liveStats.totalDonations : '...', label: t('home.stats.hospitals'), icon: 'fa-hospital', color: 'var(--secondary)' }
  ];

  // Urgent Blood Requests fallback
  const urgentRequests = liveRequests.length > 0 ? liveRequests.map(r => ({
    id: r.id,
    bloodType: r.blood_type,
    hospital: r.hospital,
    location: r.city,
    urgency: t('common.urgent')
  })) : [
    { id: 'f1', bloodType: 'O-', hospital: 'Hôpital Universitaire', location: 'Oujda', urgency: t('common.urgent') },
    { id: 'f2', bloodType: 'A+', hospital: 'Centre Stagiaire', location: 'Nador', urgency: t('common.urgent') },
    { id: 'f3', bloodType: 'B-', hospital: 'Hôpital Al Farabi', location: 'Oujda', urgency: t('common.urgent') },
  ];

  return (
    <div className="blood-donation">
      {/* ========== Modern Hero Section ========== */}
      <section className="hero" style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0',
        overflow: 'hidden',
        background: '#000'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(/blood_donation_hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
          zIndex: 1
        }}></div>
        <div className="container hero-container" style={{ position: 'relative', zIndex: 2, padding: '4rem 2rem' }}>
          <div className="hero-content glass-panel-hero" style={{
            maxWidth: '650px',
            padding: '3rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            color: 'white'
          }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.5rem 1rem', 
              background: 'var(--primary)', 
              borderRadius: '30px', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              marginBottom: '1.5rem',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>{t('home.hero_tag')}</span>
            <h1 className="hero-title" style={{ color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>
              <span className="hero-title-main" style={{ display: 'block', fontSize: '3.5rem', fontWeight: 900 }}>{t('home.hero_title_main')}</span>
              <span className="hero-title-sub" style={{ display: 'block', fontSize: '2.5rem', fontWeight: 300, color: '#f1faee' }}>{t('home.hero_title_sub')}</span>
            </h1>
            <p className="hero-description" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              {t('home.hero_description')}
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large" style={{ borderRadius: '12px', padding: '1rem 2rem' }}>
                <i className="fas fa-tint"></i>
                {t('home.become_donor')}
              </Link>
              <Link to="/requests" className="btn btn-outline-light btn-large" style={{ borderRadius: '12px', padding: '1rem 2rem', border: '2px solid white', color: 'white' }}>
                <i className="fas fa-list"></i>
                {t('home.view_requests')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Statistics Section ========== */}
      <section className="stats-section" style={{ position: 'relative', marginTop: '-60px', zIndex: 10, padding: 0 }}>
        <div className="container">
          <div className="stats-grid premium-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {stats.map(stat => (
              <div key={stat.id} className="stat-card glass-panel" style={{
                background: 'white',
                border: 'none',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
                padding: '2rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                borderRadius: '20px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}>
                <div className="stat-icon" style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: stat.color,
                  opacity: 0.9,
                  color: "white",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem'
                }}>
                  <i className={"fas " + stat.icon}></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value" style={{ color: 'var(--text-dark)', fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</span>
                  <span className="stat-label" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Urgent Requests Section ========== */}
      <section className="urgent-requests" style={{ padding: '6rem 0', background: 'var(--background)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ fontSize: '2.5rem' }}>
              {t('home.urgent_title')}
            </h2>
            <Link to="/requests" className="view-all" style={{ padding: '0.5rem 1.5rem', background: 'var(--primary-light)', color: 'white', borderRadius: '30px', textDecoration: 'none', fontWeight: 600 }}>{t('home.view_all')} &rarr;</Link>
          </div>

          <div className="requests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {urgentRequests.map(request => (
              <div key={request.id} className={"request-card " + (request.urgency === t('common.urgent') ? 'high-urgency' : '')} style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary)', opacity: 0.05, borderRadius: '50%' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1.5rem' }}>
                   <div className="request-blood" style={{ margin: 0, width: '60px', height: '60px', fontSize: '1.5rem', boxShadow: '0 5px 15px rgba(230, 57, 70, 0.4)' }}>
                     {request.bloodType}
                   </div>
                   <span className="urgency-badge" style={{ margin: 0, background: request.urgency === t('common.urgent') ? '#ffe3e3' : '#fff3cd', color: request.urgency === t('common.urgent') ? 'var(--primary)' : '#856404' }}>
                     {request.urgency}
                   </span>
                </div>

                <div className="request-details" style={{ textAlign: 'left', width: '100%', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{request.hospital}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary)' }}></i> {request.location}
                  </p>
                </div>
                <Link to={"/requests"} className="btn-respond" style={{ width: '100%', textAlign: 'center', padding: '0.8rem', borderRadius: '12px', background: 'var(--primary)' }}>{t('common.respond')}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== How It Works Section ========== */}
      <section className="how-it-works" style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <h2 className="section-title text-center" style={{ fontSize: '2.5rem', marginBottom: '4rem', justifyContent: 'center' }}>{t('home.how_it_works')}</h2>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {[
              { num: 1, icon: 'fa-user-plus', title: t('home.steps.register.title'), desc: t('home.steps.register.desc') },
              { num: 2, icon: 'fa-search', title: t('home.steps.find.title'), desc: t('home.steps.find.desc') },
              { num: 3, icon: 'fa-hand-holding-heart', title: t('home.steps.donate.title'), desc: t('home.steps.donate.desc') }
            ].map(step => (
              <div key={step.num} className="step-card" style={{ padding: '2rem', textAlign: 'center', background: 'var(--background)', borderRadius: '24px', position: 'relative' }}>
                <div className="step-number" style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', fontSize: '1.2rem', top: '-20px', left: '50%', transform: 'translateX(-50%)', boxShadow: '0 10px 20px -5px rgba(230,57,70,0.5)' }}>{step.num}</div>
                <i className={"fas " + step.icon + " step-icon"} style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--primary-light)' }}></i>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="cta-section" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, #ff4d6d 100%)',
        padding: '6rem 2rem',
        margin: '4rem 2rem',
        borderRadius: '30px',
        boxShadow: '0 20px 50px -10px rgba(230,57,70,0.4)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="cta-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>{t('home.cta_title')}</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9 }}>{t('home.cta_desc')}</p>
            <div className="cta-buttons" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-large" style={{ background: 'white', color: 'var(--primary)', borderRadius: '15px', padding: '1rem 2.5rem', fontWeight: 800 }}>{t('home.become_donor')}</Link>
              <Link to="/about" className="btn btn-outline-light btn-large" style={{ borderRadius: '15px', padding: '1rem 2.5rem' }}>{t('home.learn_more')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;