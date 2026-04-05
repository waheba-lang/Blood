import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>{t('about.title')}</h1>
      <Card style={{ marginBottom: '2rem', padding: '2rem' }}>
        <h2>{t('about.mission_title')}</h2>
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
          {t('about.mission_text')}
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <Card style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>{t('about.for_donors_title')}</h3>
          <p style={{ lineHeight: '1.6' }}>
            {t('about.for_donors_text')}
          </p>
        </Card>
        <Card style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{t('about.for_patients_title')}</h3>
          <p style={{ lineHeight: '1.6' }}>
            {t('about.for_patients_text')}
          </p>
        </Card>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t('about.contact_us')}</h2>
      <Card style={{ textAlign: 'center' }}>
        <p><strong>Email:</strong> support@bloodconnect.com</p>
        <p><strong>Phone:</strong> +212 500 000 000</p>
        <p><strong>Address:</strong> Casablanca, Morocco</p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn-secondary">{t('about.return_home')}</Link>
        </div>
      </Card>
    </div>
  );
}

