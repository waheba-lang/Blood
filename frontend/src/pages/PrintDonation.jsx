import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import { Award, CheckCircle, Droplet, Printer, Share2 } from 'lucide-react';

/**
 * PrintDonation Component
 * 
 * Generates an HTML-based printable summary for a specific, single donation event.
 * Like PrintCertificate, it uses CSS to format nicely on an A4 sheet.
 */
export default function PrintDonation() {
  const { id } = useParams(); // Get the donation ID from the URL
  const { t, i18n } = useTranslation();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  /**
   * Effect Hook: Fetches the details of this specific donation from the API.
   */
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await axios.get(`/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        console.error('Error fetching donation details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem' }}>{t('print.loading')}</div>;
  if (!donation) return <div style={{ textAlign: 'center', padding: '10rem', fontSize: '1.2rem' }}>{t('request_detail.not_found')}</div>;

  const handlePrint = () => {
    window.print();
  };

  const donationDate = new Date(donation.donation_date || donation.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
             ← {t('print.back')}
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
              background: '#0891b2', // Teal/Cyan
              borderColor: '#0891b2'
            }}
          >
            <Printer size={20} />
            {t('print.download_print')}
          </button>
        </div>
      </div>

      {/* The Certificate Area */}
      <div id="certificate-print-area" style={{ 
        width: '100%',
        maxWidth: '850px',
        background: 'white',
        padding: '0',
        borderRadius: '4px',
        boxShadow: '0 30px 60px rgba(15, 23, 42, 0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: '1.414 / 1', // A4 Landscape ratio
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Medical Pattern Background */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          opacity: 0.03, 
          zIndex: 0,
          backgroundImage: 'radial-gradient(#0891b2 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>

        {/* Top Header Strip */}
        <div style={{ height: '12px', background: 'linear-gradient(90deg, #0e7490, #22d3ee)', width: '100%', zIndex: 1 }}></div>

        <div style={{ position: 'relative', zIndex: 1, padding: '50px 70px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Logo & Reference */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '50px', height: '50px', 
                background: '#0891b2', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                <Droplet size={28} fill="currentColor" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>BloodConnect</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{t('print.network_maroc')}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('print.donation_cert')}</div>
               <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>#{donation.certificate_id || `BC-${donation.id}`}</div>
            </div>
          </div>

          {/* Main Content Title */}
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 800, 
              color: '#0f172a', 
              margin: '0 0 10px',
              fontFamily: "'Playfair Display', serif" 
            }}>
              {t('print.cert_recognition')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <div style={{ height: '1px', width: '60px', background: '#e2e8f0' }}></div>
              <p style={{ margin: 0, fontSize: '1rem', color: '#64748b', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' }}>
                {t('print.noble_contribution')}
              </p>
              <div style={{ height: '1px', width: '60px', background: '#e2e8f0' }}></div>
            </div>
          </div>

          {/* Donor Name Section */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '15px' }}>
              {t('print.we_certify')}
            </p>
            <h2 style={{ 
              fontSize: '3.2rem', 
              fontWeight: 900, 
              color: '#0891b2', 
              margin: '0 0 25px', 
              fontFamily: "'Playfair Display', serif",
              paddingBottom: '10px',
              display: 'inline-block',
              borderBottom: '2px solid rgba(8, 145, 178, 0.2)'
            }}>
              {donation.user.name}
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
              {t('print.contributed_1')} {donation.user.blood_type}{t('print.contributed_2')} {donationDate}.
            </p>
          </div>

          {/* Bottom Details Grid */}
          <div style={{ 
            marginTop: 'auto', 
            paddingTop: '40px', 
            borderTop: '1px solid #f1f5f9',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            alignItems: 'end'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>{t('print.establishment')}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>{donation.hospital || t('print.transfusion_center')}</div>
            </div>

            <div style={{ textAlign: 'center', position: 'relative' }}>
               {/* Medical Seal */}
               <div style={{ 
                 margin: '0 auto 10px',
                 width: '90px', 
                 height: '90px', 
                 borderRadius: '50%', 
                 border: '2px dashed #0891b2',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 position: 'relative'
               }}>
                 <div style={{ 
                    width: '70px', height: '70px', 
                    background: 'rgba(8, 145, 178, 0.05)', 
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                 }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0891b2' }}>{donation.user.blood_type}</span>
                    <span style={{ fontSize: '0.6rem', color: '#0891b2', fontWeight: 800, textTransform: 'uppercase' }}>{t('print.rh_type')}</span>
                 </div>
               </div>
               <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{t('print.verified')}</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '15px', fontWeight: 600 }}>{t('print.admin_signature')}</div>
              <div style={{ 
                fontFamily: "'Dancing Script', cursive", 
                fontSize: '1.6rem', 
                color: '#0f172a',
                height: '40px'
              }}>
                BloodConnect Maroc
              </div>
              <div style={{ width: '150px', height: '1px', background: '#e2e8f0', margin: '5px auto' }}></div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
             <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
               {t('print.quote')}
             </p>
          </div>

        </div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'rgba(8, 145, 178, 0.03)', borderRadius: '40px', transform: 'rotate(15deg)' }}></div>

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
