import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

export default function NewRequest() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_name: '',
    blood_type: 'O+',
    quantity: 1,
    urgency: 'Normal',
    hospital: '',
    city: '',
    contact_note: ''
  });
  const [error, setError] = useState('');

  const isRtl = i18n.language === 'ar';

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/requests', formData);
      navigate('/requests');
    } catch (err) {
      setError(err.response?.data?.message || t('new_request_form.error'));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>{t('new_request_form.title')}</h1>
      <Card>
        {error && <div style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', direction: isRtl ? 'rtl' : 'ltr' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('new_request_form.patient_name')}</label>
            <input name="patient_name" required style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', outline: 'none' }} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('auth.blood_type_label')}</label>
              <select name="blood_type" style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', background: 'white', outline: 'none' }} onChange={handleChange}>
                <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('new_request_form.quantity')}</label>
              <input type="number" min="1" max="10" name="quantity" defaultValue={1} required style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', outline: 'none' }} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('new_request_form.urgency_label')}</label>
            <select name="urgency" style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', background: 'white', outline: 'none' }} onChange={handleChange}>
              <option value="Normal">{t('new_request_form.urgency.normal')}</option>
              <option value="Urgent">{t('new_request_form.urgency.urgent')}</option>
              <option value="Critical">{t('new_request_form.urgency.critical')}</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('new_request_form.hospital')}</label>
            <input name="hospital" required style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', outline: 'none' }} onChange={handleChange} />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('new_request_form.city')}</label>
            <input name="city" required style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', outline: 'none' }} onChange={handleChange} />
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '.5rem', fontSize: '0.9rem' }}>{t('new_request_form.contact_note')}</label>
            <textarea name="contact_note" rows="3" style={{ width: '100%', padding: '.85rem', borderRadius: '12px', border: '1px solid var(--gray-200)', fontFamily: 'inherit', outline: 'none' }} onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>{t('new_request_form.submit')}</button>
        </form>
      </Card>
    </div>
  );
}

