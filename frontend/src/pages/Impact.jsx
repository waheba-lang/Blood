import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';

const Impact = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({ totalDonors: 0, fulfilledRequests: 0, totalDonations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/stats/public');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stories = [
    {
      id: 1,
      name: t('stories.ahmed.name'),
      role: t('stories.ahmed.role'),
      quote: t('stories.ahmed.quote'),
      image: "https://ui-avatars.com/api/?name=Ahmed+K&background=e63946&color=fff&size=150"
    },
    {
      id: 2,
      name: t('stories.lahlou.name'),
      role: t('stories.lahlou.role'),
      quote: t('stories.lahlou.quote'),
      image: "https://ui-avatars.com/api/?name=Dr+Lahlou&background=457b9d&color=fff&size=150"
    },
    {
      id: 3,
      name: t('stories.sara.name'),
      role: t('stories.sara.role'),
      quote: t('stories.sara.quote'),
      image: "https://ui-avatars.com/api/?name=Sara+B&background=2a9d8f&color=fff&size=150"
    }
  ];

  const isRtl = i18n.language === 'ar';

  return (
    <div className="impact-page">
      <section className="impact-hero" style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, #1d3557 100%)',
        padding: '6rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>{t('impact.hero_title')}</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            {t('impact.hero_desc')}
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10, paddingBottom: '5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {loading ? '...' : (stats.totalDonors || 0)}
            </h2>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('impact.stats.donors_label')}</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '3.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
              {loading ? '...' : (stats.fulfilledRequests || 0)}
            </h2>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('impact.stats.satisfied_label')}</p>
          </div>
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '3.5rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
              {loading ? '...' : (stats.totalDonations || 0)}
            </h2>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t('impact.stats.pockets_label')}</p>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-dark)' }}>{t('impact.community_stories')}</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {stories.map(story => (
            <div key={story.id} className="testimonial-card glass-panel" style={{ padding: '2.5rem', position: 'relative', textAlign: isRtl ? 'right' : 'left' }}>
              <i className="fas fa-quote-left" style={{ 
                fontSize: '3rem', 
                color: 'var(--primary)', 
                opacity: 0.1, 
                position: 'absolute', 
                top: '1rem', 
                left: isRtl ? 'auto' : '1rem',
                right: isRtl ? '1rem' : 'auto',
                transform: isRtl ? 'scaleX(-1)' : 'none'
              }}></i>
              <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text-dark)', position: 'relative', zIndex: 1 }}>
                "{story.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <img src={story.image} alt={story.name} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{story.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{story.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Impact;

