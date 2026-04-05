import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

export default function MyRequests() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      axios.get('/requests')
        .then(res => setRequests(res.data.filter(r => r.user_id === user.id)))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (user?.role !== 'patient') return <div style={{ textAlign: 'center', marginTop: '4rem' }}><h2>{t('common.error')}</h2></div>;
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('common.loading')}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>{t('my_requests.title')}</h1>
        <Link to="/requests/new" className="btn btn-primary">{t('my_requests.new_btn')}</Link>
      </div>
      
      {requests.length === 0 ? (
        <Card><p>{t('my_requests.empty')}</p></Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', direction: isRtl ? 'rtl' : 'ltr' }}>
          {requests.map(req => (
            <Card key={req.id}>
              <h3 style={{ marginBottom: '1rem' }}>{req.patient_name} - <span style={{ color: 'var(--primary)' }}>{req.blood_type}</span></h3>
              <p><strong>{t('my_requests.hospital')}:</strong> {req.hospital}</p>
              <p><strong>{t('my_requests.quantity')}:</strong> {req.quantity} {t('my_requests.units')}</p>
              <p><strong>{t('my_requests.urgency')}:</strong> {t(`new_request_form.urgency.${req.urgency.toLowerCase()}`)}</p>
              <p><strong>{t('my_requests.status')}:</strong> <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{req.status}</span></p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

