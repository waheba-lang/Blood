import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Heart, Users, Activity, Clock, MapPin, Search, CalendarCheck, Phone, Mail, MessageCircle } from 'lucide-react';
import './bms-pages.css';

export default function About() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const direction = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'right' : 'left';

  const features = [
    { icon: Search, title: t('about.feature1_title'), desc: t('about.feature1_desc') },
    { icon: CalendarCheck, title: t('about.feature2_title'), desc: t('about.feature2_desc') },
    { icon: Activity, title: t('about.feature3_title'), desc: t('about.feature3_desc') },
    { icon: Shield, title: t('about.feature4_title'), desc: t('about.feature4_desc') }
  ];

  const steps = [
    { number: '01', title: t('about.step1_title'), desc: t('about.step1_desc') },
    { number: '02', title: t('about.step2_title'), desc: t('about.step2_desc') },
    { number: '03', title: t('about.step3_title'), desc: t('about.step3_desc') },
    { number: '04', title: t('about.step4_title'), desc: t('about.step4_desc') }
  ];

  const stats = [
    { label: t('about.stat1_label'), value: "5,000+" },
    { label: t('about.stat2_label'), value: "12,000+" },
    { label: t('about.stat3_label'), value: "150+" },
    { label: t('about.stat4_label'), value: "25+" }
  ];

  return (
    <div className="bms-page" style={{ direction, textAlign }}>
      {/* Hero Section */}
      <header className="bms-hero reveal" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div className="bms-hero-inner" style={{ alignItems: 'center' }}>
          <div>
            <div className="bms-hero-badge" style={{ margin: '0 auto 1.5rem' }}>
              <Heart size={16} color="var(--primary)" />
              {t('about.mission_badge')}
            </div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 1rem' }}>{t('about.mission_title')}</h1>
            <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
              {t('about.mission_desc')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Features */}
      <section style={{ marginBottom: '4rem' }} className="reveal">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{t('about.features_title')}</h2>
          <p className="stats-muted">{t('about.features_subtitle')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel hover-lift" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(104, 26, 21, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 800 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section style={{ marginBottom: '4rem' }} className="reveal">
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{t('about.how_it_works_title')}</h2>
            <p className="stats-muted">{t('about.how_it_works_subtitle')}</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '16px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 900, margin: '0 auto 1.5rem', boxShadow: '0 8px 20px rgba(104, 26, 21, 0.3)' }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', fontWeight: 800 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section style={{ marginBottom: '4rem' }} className="reveal">
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '24px', padding: '3rem', color: 'white', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{stat.value}</div>
              <div style={{ fontSize: '1rem', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Support */}
      <section className="reveal" style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{t('about.contact_title')}</h2>
          <p className="stats-muted">{t('about.contact_subtitle')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: 'rgba(104, 26, 21, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800 }}>{t('about.contact_email')}</h4>
              <a href="mailto:support@bloodconnect.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>support@bloodconnect.com</a>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: 'rgba(104, 26, 21, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800 }}>{t('about.contact_phone')}</h4>
              <a href="tel:+212500000000" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>+212 5 00 00 00 00</a>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: 'rgba(104, 26, 21, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800 }}>{t('about.contact_bot')}</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('about.contact_bot_desc')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
