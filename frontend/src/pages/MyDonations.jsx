import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import Card from '../components/Card';

export default function MyDonations() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    axios.get('/donations')
      .then(res => setDonations(res.data))
      .catch(err => console.error(err));
  }, []);

  if (user?.role !== 'donor') return <div style={{ textAlign: 'center', marginTop: '4rem' }}><h2>{t('common.error')}</h2></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{t('my_donations.title')}</h1>
      {donations.length === 0 ? (
        <Card><p>{t('my_donations.empty')}</p></Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', direction: isRtl ? 'rtl' : 'ltr' }}>
          {donations.map(d => (
            <Card key={d.id}>
              <h3>{t('my_donations.donation_to')}: {d.donation_request?.patient_name || 'Unknown'}</h3>
              <p><strong>{t('my_requests.hospital')}:</strong> {d.hospital}</p>
              <p><strong>{t('my_donations.date')}:</strong> {new Date(d.donation_date).toLocaleDateString(isRtl ? 'ar-MA' : 'fr-FR')}</p>
              <p><strong>{t('my_donations.status')}:</strong> {d.status}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

