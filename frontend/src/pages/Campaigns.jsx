import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';

const Campaigns = () => {
  const { t, i18n } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get('/campaigns');
        setCampaigns(res.data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const isRtl = i18n.language === 'ar';

  if (loading) return <div style={{textAlign:'center', padding:'5rem', fontSize:'1.5rem', color:'var(--primary)'}}>{t('campaigns.loading')}</div>;

  return (
    <div className="campaigns-page">
      <section className="campaigns-hero" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(/blood_donation_campaign.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 2rem',
        textAlign: 'center',
        color: 'white',
        borderRadius: '0 0 40px 40px',
        marginBottom: '4rem'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>{t('campaigns.hero_title')}</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            {t('campaigns.hero_desc')}
          </p>
        </div>
      </section>

      <div className="container" style={{ marginBottom: '5rem' }}>
        <div className="campaigns-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-card glass-panel" style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              textAlign: isRtl ? 'right' : 'left'
            }}>
              {campaign.date === "Aujourd'hui" && (
                 <span style={{
                   background: 'var(--primary)',
                   color: 'white',
                   padding: '0.25rem 0.75rem',
                   borderRadius: '20px',
                   fontSize: '0.8rem',
                   fontWeight: 'bold',
                   alignSelf: isRtl ? 'flex-end' : 'flex-start',
                   animation: 'pulse 2s infinite'
                 }}>{t('common.urgent')}</span>
              )}
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)' }}>{campaign.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: isRtl ? 'flex-start' : 'flex-start' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-calendar-alt"></i> 
                  {campaign.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-clock"></i> 
                  {campaign.time}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <i className="fas fa-map-marker-alt"></i> 
                {campaign.location}
              </p>
              <p style={{ lineHeight: '1.6', marginTop: '0.5rem' }}>{campaign.description}</p>
              
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <span>{campaign.current} {t('campaigns.donors_count')}</span>
                  <span>{t('campaigns.goal')}: {campaign.target}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: ((campaign.current / campaign.target) * 100) + "%", 
                    height: '100%', 
                    background: 'var(--primary)',
                    borderRadius: '4px',
                    float: isRtl ? 'right' : 'left'
                  }}></div>
                </div>
              </div>
              
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', textAlign: 'center' }}>
                {t('campaigns.participate')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;

