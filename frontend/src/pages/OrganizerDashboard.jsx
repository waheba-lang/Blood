import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users, Plus, Edit2, Trash2, Clock, Activity, Search } from 'lucide-react';
import './Campaigns.css';

/**
 * OrganizerDashboard Page Component
 * 
 * Used by "organizer" roles to manage their blood donation campaigns.
 * Allows them to create new campaigns, edit existing ones, and delete them.
 */
const OrganizerDashboard = () => {
  const { t, i18n } = useTranslation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', date: '', start_time: '', end_time: '', location: '', city: '',
    description: '', target: '', organizer_name: '', contact_info: '',
    blood_types: [], status: 'upcoming'
  });
  
  const isRtl = i18n.language === 'ar';
  
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

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let types = [...formData.blood_types];
      if (checked) types.push(value);
      else types = types.filter(t => t !== value);
      setFormData({ ...formData, blood_types: types });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await axios.put(`/campaigns/${editingCampaign.id}`, formData);
      } else {
        await axios.post('/campaigns', formData);
      }
      setShowModal(false);
      fetchCampaigns();
    } catch (error) {
      console.error("Error saving campaign", error);
      alert("Error saving campaign");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('organizer.confirm_delete'))) {
      try {
        await axios.delete(`/campaigns/${id}`);
        fetchCampaigns();
      } catch (error) {
        console.error("Error deleting", error);
      }
    }
  };

  const openModal = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        title: campaign.title || '',
        date: campaign.date || '',
        start_time: campaign.start_time || '',
        end_time: campaign.end_time || '',
        location: campaign.location || '',
        city: campaign.city || '',
        description: campaign.description || '',
        target: campaign.target || '',
        organizer_name: campaign.organizer_name || '',
        contact_info: campaign.contact_info || '',
        blood_types: campaign.blood_types || [],
        status: campaign.status || 'upcoming'
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        title: '', date: '', start_time: '', end_time: '', location: '', city: '',
        description: '', target: '', organizer_name: '', contact_info: '',
        blood_types: [], status: 'upcoming'
      });
    }
    setShowModal(true);
  };

  const allBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (loading) return <div className="stats-dashboard--center">{t('organizer.loading')}</div>;

  return (
    <div className="campaigns-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="campaigns-hero">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>{t('organizer.title')}</h1>
            <p>{t('organizer.subtitle')}</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            {t('organizer.new_campaign')}
          </button>
        </div>
      </header>

      <div className="container">
        <div className="campaigns-grid">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`urgent-badge`} style={{ background: campaign.status === 'completed' ? '#4CAF50' : 'var(--primary)' }}>
                  {campaign.status}
                </span>
                <div>
                  <button onClick={() => openModal(campaign)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '5px' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(campaign.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '5px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3>{campaign.title}</h3>
              
              <div className="campaign-meta">
                <span className="campaign-meta-item"><Calendar size={16} /> {campaign.date}</span>
                <span className="campaign-meta-item"><Clock size={16} /> {campaign.start_time} - {campaign.end_time}</span>
              </div>
              
              <p className="campaign-meta-item"><MapPin size={16} /> {campaign.city} - {campaign.location}</p>
              <p className="campaign-desc">{campaign.description}</p>
              
              <div className="progress-container" style={{ marginTop: 'auto' }}>
                <div className="progress-header">
                  <span><Users size={14} style={{ marginRight: '6px' }} />{t('organizer.registered')} {campaign.participants_count || campaign.current}</span>
                  <span>{t('organizer.target')} {campaign.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>{editingCampaign ? t('organizer.edit_campaign') : t('organizer.create_campaign')}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>{t('organizer.form_title')}</label>
                <input type="text" name="title" className="auth-input" value={formData.title} onChange={handleInputChange} required />
              </div>
              
              <div>
                <label>{t('organizer.form_date')}</label>
                <input type="date" name="date" className="auth-input" value={formData.date} onChange={handleInputChange} required />
              </div>
              
              <div>
                <label>{t('organizer.form_city')}</label>
                <input type="text" name="city" className="auth-input" value={formData.city} onChange={handleInputChange} required />
              </div>

              <div>
                <label>{t('organizer.form_start_time')}</label>
                <input type="time" name="start_time" className="auth-input" value={formData.start_time} onChange={handleInputChange} />
              </div>

              <div>
                <label>{t('organizer.form_end_time')}</label>
                <input type="time" name="end_time" className="auth-input" value={formData.end_time} onChange={handleInputChange} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>{t('organizer.form_location')}</label>
                <input type="text" name="location" className="auth-input" value={formData.location} onChange={handleInputChange} required />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>{t('organizer.form_description')}</label>
                <textarea name="description" className="auth-input" rows="3" value={formData.description} onChange={handleInputChange} required />
              </div>

              <div>
                <label>{t('organizer.form_target')}</label>
                <input type="number" name="target" className="auth-input" value={formData.target} onChange={handleInputChange} required />
              </div>

              <div>
                <label>{t('organizer.form_status')}</label>
                <select name="status" className="auth-input" value={formData.status} onChange={handleInputChange}>
                  <option value="upcoming">{t('organizer.status_upcoming')}</option>
                  <option value="ongoing">{t('organizer.status_ongoing')}</option>
                  <option value="completed">{t('organizer.status_completed')}</option>
                </select>
              </div>

              <div>
                <label>{t('organizer.form_organizer')}</label>
                <input type="text" name="organizer_name" className="auth-input" value={formData.organizer_name} onChange={handleInputChange} />
              </div>

              <div>
                <label>{t('organizer.form_contact')}</label>
                <input type="text" name="contact_info" className="auth-input" value={formData.contact_info} onChange={handleInputChange} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label>{t('organizer.form_blood_types')}</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {allBloodTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input 
                        type="checkbox" 
                        name="blood_types" 
                        value={type} 
                        checked={formData.blood_types.includes(type)}
                        onChange={handleInputChange} 
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>{t('organizer.btn_cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('organizer.btn_save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
