import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './home.css';

export default function Requests() {
  const { t, i18n } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Filter States
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    let url = '/requests?';
    if(bloodType) url += `blood_type=${encodeURIComponent(bloodType)}&`;
    if(city) url += `city=${encodeURIComponent(city)}&`;
    if(urgency) url += `urgency=${encodeURIComponent(urgency)}&`;

    try {
      const res = await axios.get(url);
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [bloodType, city, urgency]);

  const handleDonate = async (requestId) => {
    if (!user) {
      alert(t('requests_page.login_prompt'));
      return;
    }
    
    try {
      await axios.post('/donations', { donation_request_id: requestId });
      alert(t('requests_page.success_message'));
    } catch (err) {
      console.error(err);
      alert(t('requests_page.error_message'));
    }
  };

  const isRtl = i18n.language === 'ar';

  return (
    <div className="blood-donation">
      <section className="urgent-requests" style={{ minHeight: '80vh', padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <h1 className="section-title">
              <i className="fas fa-tint"></i>
              {t('requests_page.title')}
            </h1>
            <Link to="/requests/new" className="btn btn-primary">
              <i className="fas fa-plus"></i> {t('requests_page.request_blood')}
            </Link>
          </div>

          <div className="filter-bar glass-panel" style={{ 
            padding: '1.5rem', 
            marginBottom: '3rem', 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap', 
            alignItems: 'center',
            flexDirection: isRtl ? 'row-reverse' : 'row'
          }}>
            <h4 style={{ margin: 0, marginLeft: isRtl ? '1rem' : '0', marginRight: isRtl ? '0' : '1rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-filter"></i> {t('filters.label')}
            </h4>
            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-200)', minWidth: '120px' }}>
              <option value="">{t('filters.all_groups')}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <input type="text" placeholder={t('filters.city_placeholder')} value={city} onChange={(e) => setCity(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-200)', minWidth: '150px' }} />
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-200)', minWidth: '150px' }}>
              <option value="">{t('filters.all_urgencies')}</option>
              <option value="High">{t('filters.urgency.high')}</option>
              <option value="Medium">{t('filters.urgency.medium')}</option>
              <option value="Low">{t('filters.urgency.low')}</option>
            </select>
          </div>

          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <div className="loader" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
             </div>
          ) : requests.length === 0 ? (
            <div className="step-card glass-panel" style={{ padding: '4rem', textAlign: 'center', width: '100%' }}>
              <i className="fas fa-search step-icon" style={{ opacity: 0.2, fontSize: '4rem' }}></i>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>{t('requests_page.no_results')}</p>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map(req => (
                <div key={req.id} className={"request-card " + (req.urgency === 'High' ? 'high-urgency' : '')} style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <div className="request-blood" style={{ 
                    left: isRtl ? 'auto' : '2rem', 
                    right: isRtl ? '2rem' : 'auto' 
                  }}>{req.blood_type}</div>
                  <div className="request-details" style={{ width: '100%' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{req.patient_name}</h3>
                    <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: isRtl ? 'flex-start' : 'flex-start' }}>
                      <i className="fas fa-hospital"></i> 
                      <span>{req.hospital}, {req.city}</span>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                      <span className="urgency-badge" style={{ margin: 0, background: req.urgency === 'High' ? '#ffe3e3' : '#e2e8f0', color: req.urgency === 'High' ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {req.urgency === 'High' ? t('filters.urgency.high') : req.urgency === 'Medium' ? t('filters.urgency.medium') : t('filters.urgency.low')}
                      </span>
                      <span className="urgency-badge" style={{ margin: 0, background: '#edf2f7', color: 'var(--text-muted)' }}>
                        {req.quantity} {t('requests_page.units')}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
                    <button 
                      onClick={() => handleDonate(req.id)} 
                      className="btn-respond" 
                      style={{ background: 'var(--primary)', padding: '0.6rem', fontSize: '0.9rem' }}
                    >
                      {t('requests_page.give_blood')}
                    </button>
                    <Link 
                      to={`/requests/${req.id}`} 
                      className="btn-respond" 
                      style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-dark)', padding: '0.6rem', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}
                    >
                      {t('common.details')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

