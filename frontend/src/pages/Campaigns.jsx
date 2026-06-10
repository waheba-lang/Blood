import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Target, Users, AlertCircle, Droplet, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Campaigns.css';

/**
 * Campaigns Page Component
 * 
 * Displays a list of blood donation events (campaigns).
 * Allows users to join campaigns, and allows organizers to request new ones.
 */
const Campaigns = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth(); // Current logged-in user
  
  // --- UI States ---
  const [campaigns, setCampaigns] = useState([]); // List of campaigns from the API
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(false); // Controls the "Create Campaign" modal
  const navigate = useNavigate();

  // State to hold data for the "Create Campaign" form
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', city: '', start_time: '', end_time: '', contact_info: '', description: '', target: 50, blood_types: []
  });

  /**
   * Health Rule: A user can only donate blood once every 3 months.
   * This calculation figures out their NEXT eligible date based on their LAST donation.
   * useMemo is used to calculate this ONLY when the `user` object changes, saving performance.
   */
  const nextEligibleDate = useMemo(() => {
    if (!user?.last_donation_at) return null;
    const last = new Date(user.last_donation_at);
    const next = new Date(last);
    next.setMonth(next.getMonth() + 3); // Add 3 months
    return next;
  }, [user]);

  /**
   * Determines if the user is currently allowed to donate.
   */
  const canDonate = useMemo(() => {
    if (!nextEligibleDate) return true; // If they've never donated, they can!
    return new Date() >= nextEligibleDate; // Can donate if today is AFTER their next eligible date
  }, [nextEligibleDate]);

  // Fallback mock campaigns when the backend API is offline or empty
  const MOCK_CAMPAIGNS = [
    {
      id: 201,
      title: 'Collecte Spéciale Ramadan',
      date: '2026-06-19',
      start_time: '19:00',
      end_time: '23:30',
      time: '19:00 - 23:30',
      location: 'Place Mohammed V, devant la Wilaya',
      city: 'Casablanca',
      description: 'Collecte de sang nocturne spéciale pendant le mois sacré du Ramadan pour compenser la baisse des dons en journée et reconstituer les réserves d\'urgence.',
      target: 300,
      participants_count: 120,
      organizer_name: 'Association Al Amal Oujda',
      contact_info: '+212620304050',
      blood_types: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-'],
      status: 'upcoming',
      approval_status: 'approved'
    },
    {
      id: 202,
      title: 'Campagne Universitaire - UMP',
      date: '2026-06-08',
      start_time: '09:00',
      end_time: '17:00',
      time: '09:00 - 17:00',
      location: 'Maison de l\'Étudiant, Université Mohammed Premier',
      city: 'Oujda',
      description: 'Grande collecte étudiante ouverte à tous les départements. Venez nombreux montrer votre solidarité et sauver des vies !',
      target: 150,
      participants_count: 45,
      organizer_name: 'Association Al Amal Oujda',
      contact_info: '+212620304050',
      blood_types: ['A+', 'A-', 'B+', 'O+', 'O-', 'AB+'],
      status: 'upcoming',
      approval_status: 'approved'
    },
    {
      id: 203,
      title: 'Urgence Réserves Négatives',
      date: '2026-06-01',
      start_time: '08:00',
      end_time: '18:00',
      time: '08:00 - 18:00',
      location: 'Centre Régional de Transfusion Sanguine, CHU Ibn Sina',
      city: 'Rabat',
      description: 'Mobilisation d\'urgence pour pallier la pénurie critique de rhésus négatifs (O-, A-, B-). Tous les donneurs de ces groupes sont invités à se présenter.',
      target: 200,
      participants_count: 195,
      organizer_name: 'Dr. Rachid Idrissi (Croissant Rouge)',
      contact_info: '+212630405060',
      blood_types: ['O-', 'A-', 'B-', 'AB-'],
      status: 'completed',
      approval_status: 'approved'
    },
    {
      id: 204,
      title: 'Solidarité Estivale Agadir',
      date: '2026-08-04',
      start_time: '10:00',
      end_time: '20:00',
      time: '10:00 - 20:00',
      location: 'Esplanade de la Marina d\'Agadir',
      city: 'Agadir',
      description: 'Collecte d\'été à destination des vacanciers et résidents. Assurer la continuité des stocks durant la période estivale est primordial pour la région.',
      target: 250,
      participants_count: 8,
      organizer_name: 'Dr. Rachid Idrissi (Croissant Rouge)',
      contact_info: '+212630405060',
      blood_types: ['O+', 'A+', 'B+', 'AB+', 'O-'],
      status: 'upcoming',
      approval_status: 'approved'
    }
  ];

  /**
   * Fetches all campaigns from the backend API.
   */
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('/campaigns');
      if (res.data && res.data.length > 0) {
        setCampaigns(res.data);
      } else {
        setCampaigns(MOCK_CAMPAIGNS);
      }
    } catch (err) {
      console.warn("Error fetching campaigns. Using local mock campaigns fallback.", err);
      setCampaigns(MOCK_CAMPAIGNS);
    } finally {
      setLoading(false);
    }
  };

  // Run `fetchCampaigns` exactly ONCE when the component first loads
  useEffect(() => {
    fetchCampaigns();
  }, []);

  /**
   * Function to handle when a user clicks the "Join Campaign" button.
   */
  const handleJoin = async (id) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axios.post(`/campaigns/${id}/join`);
      setSuccessMsg(t('campaigns.join_success'));
      fetchCampaigns(); // Refresh the list to update the participant count
    } catch (err) {
      // 422 usually means a validation error from the backend (e.g. they already joined, or health rules blocked them)
      if (err.response?.status === 422) {
        setErrorMsg(err.response.data.message + " Prochaine date : " + err.response.data.next_available_date);
      } else {
        setErrorMsg(t('campaigns.join_error'));
      }
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axios.post('/campaigns', formData);
      setSuccessMsg(t('campaigns.request_success'));
      setShowForm(false);
      setFormData({ title: '', date: '', time: '', location: '', city: '', start_time: '', end_time: '', contact_info: '', description: '', target: 50, blood_types: [] });
    } catch (err) {
      setErrorMsg(t('campaigns.request_error'));
    }
  };

  const handleBloodTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      blood_types: prev.blood_types.includes(type)
        ? prev.blood_types.filter(t => t !== type)
        : [...prev.blood_types, type]
    }));
  };

  const isRtl = i18n.language === 'ar';
  const locale = isRtl ? 'ar-MA' : 'fr-FR';

  if (loading) {
    return (
      <div className="stats-dashboard--center">
        <div className="stats-spin">
          <Clock size={48} />
        </div>
        <p className="stats-muted">{t('campaigns.loading')}</p>
      </div>
    );
  }

  return (
    <div className="campaigns-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="campaigns-hero" style={{ position: 'relative' }}>
        <div className="container">
          <h1>{t('campaigns.hero_title') || 'Campagnes de Don'}</h1>
          <p>{t('campaigns.hero_desc')}</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--primary)', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 'bold' }}
            onClick={() => {
              if (!user) navigate('/login');
              else setShowForm(true);
            }}
          >
            <Plus size={20} />
            {t('campaigns.organize_btn')}
          </button>
        </div>
      </header>

      <div className="container" style={{ marginTop: '2rem' }}>
        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.1)', color: '#e63946', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {successMsg}
          </div>
        )}

        {user && !canDonate && (
          <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.05)', border: '1px solid rgba(230, 57, 70, 0.2)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#e63946', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
              {t('campaigns.not_eligible_title')} {nextEligibleDate?.toLocaleDateString(locale)}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              {t('campaigns.not_eligible_desc')}
            </p>
          </div>
        )}

        <div className="campaigns-grid">
          {campaigns.map(campaign => {
            const progress = (campaign.participants_count / campaign.target) * 100 || 0;
            const isCompleted = campaign.status === 'completed';
            
            return (
              <div key={campaign.id} className="campaign-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={`urgent-badge`} style={{ background: isCompleted ? '#4CAF50' : 'var(--primary)' }}>
                  {campaign.status === 'completed' ? t('campaigns.status_completed') : campaign.status === 'ongoing' ? t('campaigns.status_ongoing') : t('campaigns.status_upcoming')}
                </span>
                
                <h3>{campaign.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {t('campaigns.organized_by')} <strong>{campaign.organizer_name || 'BloodConnect'}</strong>
                </p>
                
                <div className="campaign-meta">
                  <span className="campaign-meta-item">
                    <Calendar size={16} /> 
                    {campaign.date}
                  </span>
                  <span className="campaign-meta-item">
                    <Clock size={16} /> 
                    {campaign.start_time} - {campaign.end_time}
                  </span>
                </div>
                
                <p className="campaign-meta-item" style={{ marginTop: '0.5rem' }}>
                  <MapPin size={16} /> 
                  {campaign.city} - {campaign.location}
                </p>

                {campaign.blood_types && campaign.blood_types.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Droplet size={14} color="var(--primary)" style={{ marginTop: '3px' }} />
                    {campaign.blood_types.map(bt => (
                      <span key={bt} style={{ background: 'rgba(230, 57, 70, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {bt}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="campaign-desc" style={{ marginTop: '1rem' }}>{campaign.description}</p>
                
                <div className="progress-container" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <div className="progress-header">
                    <span>
                      <Users size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {campaign.participants_count || 0} {t('campaigns.registered')}
                    </span>
                    <span>
                      <Target size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      {t('campaigns.target')} {campaign.target}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                
                {!user ? (
                  <Link to="/login" className="btn btn-outline" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    {t('campaigns.login_to_join')}
                  </Link>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '1.5rem', width: '100%', opacity: (!canDonate || isCompleted) ? 0.5 : 1, cursor: (!canDonate || isCompleted) ? 'not-allowed' : 'pointer' }}
                    onClick={() => handleJoin(campaign.id)}
                    disabled={!canDonate || isCompleted || user.role !== 'donor'}
                  >
                    {isCompleted ? t('campaigns.btn_completed') : (!canDonate ? t('campaigns.btn_not_eligible') : t('campaigns.btn_join'))}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{t('campaigns.form_title')}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label>{t('campaigns.label_title')}</label>
                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>{t('campaigns.label_city')}</label>
                  <input type="text" className="form-control" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div>
                  <label>{t('campaigns.label_date')}</label>
                  <input type="date" className="form-control" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>{t('campaigns.label_start_time')}</label>
                  <input type="time" className="form-control" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                </div>
                <div>
                  <label>{t('campaigns.label_end_time')}</label>
                  <input type="time" className="form-control" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                </div>
              </div>
              <div>
                <label>{t('campaigns.label_location')}</label>
                <input type="text" className="form-control" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label>{t('campaigns.label_blood_types')}</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleBloodTypeToggle(type)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        border: '1px solid #cbd5e1', 
                        background: formData.blood_types.includes(type) ? 'var(--primary)' : 'white',
                        color: formData.blood_types.includes(type) ? 'white' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label>{t('campaigns.label_description')}</label>
                <textarea className="form-control" required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>{t('campaigns.label_contact')}</label>
                  <input type="text" className="form-control" value={formData.contact_info} onChange={e => setFormData({...formData, contact_info: e.target.value})} />
                </div>
                <div>
                  <label>{t('campaigns.label_target')}</label>
                  <input type="number" className="form-control" required min="1" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>{t('campaigns.submit')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
