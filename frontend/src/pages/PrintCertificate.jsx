import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Award, Droplet, Printer, Download, MapPin, Heart } from 'lucide-react';
import { Navigate } from 'react-router-dom';

/**
 * PrintCertificate Component
 * 
 * Generates an HTML-based certificate for users who have donated multiple times.
 * It uses CSS @media print rules to hide the UI buttons when printing or saving as PDF.
 */
export default function PrintCertificate() {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after the first render (useful for SSR/animations)
  useEffect(() => {
    setMounted(true);
  }, []);

  const isRtl = i18n.language === 'ar';

  if (loading || !mounted) {
    return <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem' }}>{t('common.loading') || 'Chargement...'}</div>;
  }

  const donationCount = user?.donations?.length || 0;

  // Protect the route
  if (donationCount < 3) {
    return <Navigate to="/profile" replace />;
  }

  let badgeColor = '#b45309'; // Bronze
  let badgeName = 'Donneur Régulier (Bronze)';
  if (donationCount >= 10) {
    badgeColor = '#fbbf24'; // Gold
    badgeName = 'Héros du Don (Or)';
  } else if (donationCount >= 5) {
    badgeColor = '#94a3b8'; // Silver
    badgeName = 'Donneur Actif (Argent)';
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const lastDonationDate = user.last_donation_at 
    ? new Date(user.last_donation_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR')
    : '—';

  return (
    <div className="certificate-page-wrapper" style={{ 
      background: '#f0f4f8', 
      minHeight: '100vh', 
      padding: '3rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Controls - Hidden during print */}
      <div className="no-print" style={{ 
        maxWidth: '850px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        alignItems: 'center',
        background: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <button 
             onClick={() => window.history.back()}
             className="btn btn-text"
             style={{ padding: '0.5rem', color: '#64748b' }}
           >
             ← {t('common.back') || 'Retour'}
           </button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.8rem', 
              padding: '0.8rem 1.8rem', 
              borderRadius: '12px', 
              fontWeight: 700,
              background: '#0f172a',
              borderColor: '#0f172a',
              color: 'white'
            }}
          >
            <Printer size={20} />
            Télécharger / Imprimer
          </button>
        </div>
      </div>

      {/* The Certificate Area */}
      <div id="certificate-print-area" style={{ 
        width: '100%',
        maxWidth: '850px',
        background: 'white',
        padding: '0',
        borderRadius: '8px',
        boxShadow: '0 30px 60px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: '1.414 / 1', // A4 Landscape ratio
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Background Pattern */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          opacity: 0.04, 
          zIndex: 0,
          backgroundImage: 'radial-gradient(var(--primary) 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Top Header Strip */}
        <div style={{ height: '16px', background: 'linear-gradient(90deg, #6D2932, #C7B7A3, #6D2932)', width: '100%', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 1, padding: '50px 70px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Logo & Reference */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '60px', height: '60px', 
                background: 'var(--primary)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <Heart size={32} fill="currentColor" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>BloodConnect</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Réseau de Don de Sang</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Date d'émission</div>
               <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>{currentDate}</div>
            </div>
          </div>

          {/* Main Content Title */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{ 
              fontSize: '3.8rem', 
              fontWeight: 900, 
              color: '#0f172a', 
              margin: '0 0 10px',
              fontFamily: "'Playfair Display', serif",
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              CERTIFICAT D'HONNEUR
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ height: '2px', width: '80px', background: 'var(--primary)' }}></div>
              <p style={{ margin: 0, fontSize: '1.1rem', color: '#64748b', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>
                Décerné pour un engagement exceptionnel
              </p>
              <div style={{ height: '2px', width: '80px', background: 'var(--primary)' }}></div>
            </div>
          </div>

          {/* Donor Name Section */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: '1.3rem', color: '#64748b', marginBottom: '10px' }}>
              Ce certificat est fièrement décerné à
            </p>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 900, 
              color: 'var(--primary)', 
              margin: '0 0 20px', 
              fontFamily: "'Dancing Script', cursive",
              paddingBottom: '10px',
              display: 'inline-block',
              borderBottom: '2px solid rgba(109, 41, 50, 0.2)'
            }}>
              {user.name}
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#334155', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
              En reconnaissance de votre générosité et de votre dévouement inébranlable. Vous avez effectué <strong>{donationCount} dons de sang</strong> enregistrés, contribuant directement à sauver de nombreuses vies.
            </p>
          </div>

          {/* Bottom Details Grid */}
          <div style={{ 
            marginTop: 'auto', 
            paddingTop: '30px', 
            borderTop: '2px solid rgba(109, 41, 50, 0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Niveau Atteint</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${badgeColor}15`, color: badgeColor, padding: '8px 16px', borderRadius: '30px', fontWeight: 800 }}>
                <Award size={18} />
                {badgeName}
              </div>
            </div>

            <div style={{ textAlign: 'center', position: 'relative' }}>
               <div style={{ 
                 margin: '0 auto 10px',
                 width: '100px', 
                 height: '100px', 
                 borderRadius: '50%', 
                 border: `4px double var(--primary)`,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 position: 'relative',
                 background: 'white'
               }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{donationCount}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>DONS</div>
                 </div>
               </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '15px', fontWeight: 600, textTransform: 'uppercase' }}>Directeur Général</div>
              <div style={{ 
                fontFamily: "'Dancing Script', cursive", 
                fontSize: '1.8rem', 
                color: '#0f172a',
                height: '40px'
              }}>
                BloodConnect Maroc
              </div>
              <div style={{ width: '150px', height: '1px', background: '#cbd5e1', margin: '5px auto' }}></div>
            </div>
          </div>

        </div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', border: '40px solid rgba(109, 41, 50, 0.03)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'rgba(109, 41, 50, 0.04)', borderRadius: '40px', transform: 'rotate(15deg)' }}></div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800;900&family=Dancing+Script:wght@700&display=swap');
        
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .certificate-page-wrapper { padding: 0 !important; background: white !important; min-height: auto !important; }
          #certificate-print-area { 
            box-shadow: none !important; 
            border: 0 !important;
            width: 100% !important;
            max-width: none !important;
            height: 100vh !important;
            border-radius: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
