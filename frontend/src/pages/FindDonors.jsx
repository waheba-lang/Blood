import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';

export default function FindDonors() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [city, setCity] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDonors = () => {
    setLoading(true);
    let url = '/users?role=donor';
    if(city) url += `&city=${encodeURIComponent(city)}`;
    if(bloodType) url += `&blood_type=${encodeURIComponent(bloodType)}`;
    
    axios.get(url)
      .then(res => setDonors(res.data.filter(d => d.is_available)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDonors();
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [city, bloodType]);

  const isRtl = i18n.language === 'ar';

  if (user?.role !== 'patient' && user?.role !== 'admin') 
    return <div style={{ textAlign: 'center', marginTop: '4rem', fontSize: '2rem', color: 'var(--text-muted)' }}>{t('find_donors.access_denied')}</div>;

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div className="section-header" style={{ marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <h1 className="section-title">
          <i className="fas fa-search-plus"></i>
          {t('find_donors.title')}
        </h1>
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
        <input 
          value={city} 
          onChange={e => setCity(e.target.value)} 
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-200)', minWidth: '150px', flex: '1', textAlign: isRtl ? 'right' : 'left' }} 
          placeholder={t('filters.city_placeholder')} 
        />
        <select 
          value={bloodType} 
          onChange={e => setBloodType(e.target.value)} 
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-200)', minWidth: '150px', flex: '1' }}
        >
          <option value="">{t('filters.all_groups')}</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
             <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '3rem' }}>
               <div className="loader" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
               <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
             </div>
        ) : donors.length > 0 ? donors.map(donor => (
          <div key={donor.id} className="request-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="request-blood" style={{ marginBottom: '1rem', position: 'static' }}>{donor.blood_type}</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{donor.name}</h3>
            <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <i className="fas fa-map-marker-alt"></i> 
              {donor.city}
            </p>
            <p style={{ marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <i className="fas fa-phone"></i> 
              {donor.phone || 'Non fourni'}
            </p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', borderRadius: '12px' }}>{t('donor_card.contact')}</button>
          </div>
        )) : (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
             <i className="fas fa-users" style={{ opacity: 0.2, fontSize: '4rem' }}></i>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>{t('find_donors.no_donors')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

