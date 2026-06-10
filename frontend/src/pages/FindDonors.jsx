import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { Search, MapPin, Droplet, Phone, Users, SlidersHorizontal, CheckCircle2, User } from 'lucide-react';
import './FindDonors.css';

// The list of all valid blood types to display in the filter bar
const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

// Fallback mock donors list to show when the backend API is offline or empty
const MOCK_DONORS = [
  { id: 101, name: 'Karim El Amrani', city: 'Casablanca', blood_type: 'O+', phone: '+212661223344', is_available: true, avatar_url: 'defaults/avatars/avatar1.png' },
  { id: 102, name: 'Fatima Zahra El Fassi', city: 'Rabat', blood_type: 'A+', phone: '+212662445566', is_available: true, avatar_url: 'defaults/avatars/avatar2.png' },
  { id: 103, name: 'Youssef Berrada', city: 'Marrakech', blood_type: 'B-', phone: '+212663778899', is_available: true, avatar_url: 'defaults/avatars/avatar6.png' },
  { id: 104, name: 'Amina Bennani', city: 'Fes', blood_type: 'AB+', phone: '+212664123123', is_available: true, avatar_url: 'defaults/avatars/avatar7.png' },
  { id: 105, name: 'Hassan Alaoui', city: 'Tangier', blood_type: 'O-', phone: '+212665321321', is_available: true, avatar_url: 'defaults/avatars/avatar1.png' },
  { id: 106, name: 'Laila Benali', city: 'Oujda', blood_type: 'AB+', phone: '+212666123456', is_available: true, avatar_url: 'defaults/avatars/avatar2.png' },
  { id: 107, name: 'Tarik Mezouar', city: 'Meknes', blood_type: 'B+', phone: '+212667987654', is_available: true, avatar_url: 'defaults/avatars/avatar3.png' },
  { id: 108, name: 'Merieme Belkhayat', city: 'Fes', blood_type: 'A-', phone: '+212668554433', is_available: true, avatar_url: 'defaults/avatars/avatar6.png' },
  { id: 109, name: 'Zineb El Fassi', city: 'Casablanca', blood_type: 'O+', phone: '+212669221100', is_available: true, avatar_url: 'defaults/avatars/avatar7.png' },
  { id: 110, name: 'Reda Berrada', city: 'Marrakech', blood_type: 'B+', phone: '+212670776655', is_available: true, avatar_url: 'defaults/avatars/avatar1.png' },
  { id: 111, name: 'Yasmina Bennis', city: 'Rabat', blood_type: 'A+', phone: '+212671554499', is_available: true, avatar_url: 'defaults/avatars/avatar2.png' },
  { id: 112, name: 'Khalid Tazi', city: 'Kenitra', blood_type: 'O-', phone: '+212672112233', is_available: true, avatar_url: 'defaults/avatars/avatar3.png' },
  { id: 113, name: 'Asmae El Idrissi', city: 'Agadir', blood_type: 'AB+', phone: '+212673443322', is_available: true, avatar_url: 'defaults/avatars/avatar6.png' },
  { id: 114, name: 'Anas Filali', city: 'El Jadida', blood_type: 'B-', phone: '+212674998877', is_available: true, avatar_url: 'defaults/avatars/avatar1.png' },
  { id: 115, name: 'Bouchra Skali', city: 'Tetouan', blood_type: 'AB-', phone: '+212675665544', is_available: true, avatar_url: 'defaults/avatars/avatar2.png' },
  { id: 116, name: 'Mustapha Alami', city: 'Safi', blood_type: 'O+', phone: '+212676112233', is_available: true, avatar_url: 'defaults/avatars/avatar3.png' },
  { id: 117, name: 'waheba noualla', city: 'Oujda', blood_type: 'O+', phone: '0766554433', is_available: true, avatar_url: 'defaults/avatars/avatar4.png' }
];

/**
 * FindDonors Page Component
 * 
 * Allows users to search the database for blood donors.
 * Includes filters for city, blood type, name, and availability status.
 */
export default function FindDonors() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if the user is logged in

  // --- Search and Filter States ---
  const [donors, setDonors] = useState([]); // List of donors fetched from the API
  const [city, setCity] = useState(''); // The city the user is searching for
  const [bloodType, setBloodType] = useState(''); // The selected blood group filter
  const [name, setName] = useState(''); // The name the user is typing into the search bar
  const [availableOnly, setAvailableOnly] = useState(true); // Toggle to show only "Available" donors
  
  // --- UI States ---
  const [loading, setLoading] = useState(false); // Shows a loading spinner while fetching data
  const [totalCount, setTotalCount] = useState(0); // Total number of donors found

  const isRtl = i18n.language === 'ar';

  /**
   * Performs client-side filtering on our mock data when the API is down
   */
  const getFilteredMocks = () => {
    return MOCK_DONORS.filter(donor => {
      if (availableOnly && !donor.is_available) return false;
      if (bloodType && donor.blood_type !== bloodType) return false;
      if (city && !donor.city.toLowerCase().includes(city.toLowerCase())) return false;
      if (name && !donor.name.toLowerCase().includes(name.toLowerCase())) return false;
      return true;
    });
  };

  /**
   * Fetches the list of donors from the backend API based on the current filters.
   */
  const fetchDonors = () => {
    setLoading(true);
    
    // Build the query URL dynamically based on what the user has typed/selected
    let url = '/users?role=donor';
    if (availableOnly) url += '&is_available=1';
    if (city) url += `&city=${encodeURIComponent(city)}`;
    if (bloodType) url += `&blood_type=${encodeURIComponent(bloodType)}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;

    // Call the API
    axios.get(url)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setDonors(res.data);
          setTotalCount(res.data.length);
        } else {
          // If server is online but returns an empty list, use mock data fallback
          const mocks = getFilteredMocks();
          setDonors(mocks);
          setTotalCount(mocks.length);
        }
      })
      .catch(err => {
        console.warn("API server is offline or returned an error. Using local mock donors fallback.", err);
        const mocks = getFilteredMocks();
        setDonors(mocks);
        setTotalCount(mocks.length);
      })
      .finally(() => setLoading(false));
  };

  /**
   * Effect Hook: Automatically run 'fetchDonors' whenever a filter changes.
   * Uses a "debounce" (setTimeout) so we don't spam the server with requests 
   * every single time the user types a single letter.
   */
  useEffect(() => {
    // Wait 350ms after the user stops typing/clicking before fetching
    const timeout = setTimeout(() => {
      fetchDonors();
    }, 350); 
    
    // Cleanup the timer if the user types again before the 350ms is up
    return () => clearTimeout(timeout);
  }, [city, bloodType, name, availableOnly]);

  /**
   * Safely gets the avatar URL
   */
  const getPhotoUrl = (donor) => {
    const path = donor.profile_photo_path || donor.avatar_url;
    if (!path) return null;
    if (path.startsWith('http')) {
      return path;
    }
    if (path.startsWith('defaults/')) {
      return '/' + path;
    }
    if (path.startsWith('/defaults/')) {
      return path;
    }
    return path;
  };

  const renderAvatar = (donor) => {
    const url = getPhotoUrl(donor);
    return (
      <div 
        className="donor-avatar" 
        style={{ 
          background: url ? `url(${url}) center/cover` : 'var(--primary-light)',
          color: 'var(--primary-dark)'
        }}
      >
        {!url && getInitials(donor.name)}
      </div>
    );
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  };

  if (!user) {
    return (
      <div className="stats-dashboard--center">
        <Droplet size={64} className="stats-spin" />
        <h2>{t('find_donors.login_required_title')}</h2>
        <p className="stats-muted">{t('find_donors.login_required_body')}</p>
        <button className="btn btn-primary" style={{marginTop: '2rem'}} onClick={() => navigate('/login')}>
          {t('find_donors.login_cta')}
        </button>
      </div>
    );
  }

  return (
    <div className="find-donors-page" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Header */}
      <section className="find-donors-hero">
        <div className="container">
          <div className="stats-hero__badge" style={{ margin: '0 auto 1.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
            <Droplet size={18} fill="currentColor" />
            {t('find_donors.brand_badge')}
          </div>
          <h1 style={{color: 'var(--text-primary)', textAlign: 'center', fontWeight: '800', fontSize: '2.5rem', marginBottom: '1rem'}}>{t('find_donors.title')}</h1>
          <p style={{color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem'}}>
            {t('find_donors.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} color="var(--primary)" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('filters.name_placeholder')}
              />
            </div>
            <div className="search-input-wrapper">
              <MapPin size={20} color="var(--primary)" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder={t('filters.city_placeholder')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Advanced Filter Bar */}
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            {t('filters.label')}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`blood-type-btn ${bloodType === '' ? 'active' : ''}`}
              onClick={() => setBloodType('')}
            >
              {t('filters.all_groups')}
            </button>
            {BLOOD_TYPES.map(bt => (
              <button
                key={bt}
                className={`blood-type-btn ${bloodType === bt ? 'active' : ''}`}
                onClick={() => setBloodType(bt === bloodType ? '' : bt)}
              >
                {bt}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
            <div className="toggle-switch" style={{ background: availableOnly ? 'var(--primary)' : '#e2e8f0' }} onClick={() => setAvailableOnly(!availableOnly)}>
              <div className="toggle-switch-circle" style={{
                left: isRtl ? undefined : (availableOnly ? '22px' : '4px'),
                right: isRtl ? (availableOnly ? '22px' : '4px') : undefined
              }} />
            </div>
            <span style={{color: availableOnly ? 'var(--primary)' : 'var(--text-muted)'}}>
              {t('filters.available_only')}
            </span>
          </label>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2.5rem 0.5rem 1.5rem' }}>
          <p style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
            {loading ? '...' : t('find_donors.donors_found_count', { count: totalCount })}
          </p>
          {availableOnly && (
            <span className="avail-badge online" style={{fontSize: '0.85rem'}}>
              <CheckCircle2 size={16} />
              {t('find_donors.filter_available_only')}
            </span>
          )}
        </div>

        {/* Grid */}
        <div className="campaigns-grid" style={{paddingBottom: '5rem'}}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="donor-card" style={{minHeight: '200px', opacity: 0.5}}>
                 <div className="stats-spin" style={{margin: 'auto'}}><Droplet /></div>
              </div>
            ))
          ) : donors.length > 0 ? (
            donors.map(donor => (
              <div key={donor.id} className="donor-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {renderAvatar(donor)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }} className="text-truncate">{donor.name}</h3>
                    <div className="donor-info-item" style={{ marginTop: '0.35rem' }}>
                      <MapPin size={14} />
                      {donor.city}
                    </div>
                  </div>
                  <div className="type-badge">{donor.blood_type}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                   <span className={`avail-badge ${donor.is_available ? 'online' : 'offline'}`}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                      {donor.is_available ? t('find_donors.available_badge') : t('find_donors.unavailable_badge')}
                   </span>
                </div>

                {donor.phone && (
                  <div className="donor-info-item" style={{ marginBottom: '1.5rem' }}>
                    <Phone size={16} />
                    <span>{donor.phone}</span>
                  </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <a 
                    href={donor.phone ? `tel:${donor.phone}` : '#'} 
                    className={`btn ${donor.phone ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', visibility: donor.phone ? 'visible' : 'hidden' }}
                  >
                    <Phone size={18} />
                    {t('find_donors.call_now')}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem' }} className="glass-panel">
               <User size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
               <h3>{t('find_donors.no_donors')}</h3>
               <button 
                className="btn btn-outline" 
                style={{marginTop: '1.5rem'}}
                onClick={() => { setCity(''); setBloodType(''); setName(''); setAvailableOnly(false); }}
               >
                 {t('find_donors.reset_filters')}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
