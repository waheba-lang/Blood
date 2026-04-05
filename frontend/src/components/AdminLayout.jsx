import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const isRtl = i18n.language === 'ar';

  const sidebarStyle = {
    width: '260px',
    backgroundColor: '#fff',
    borderRight: isRtl ? 'none' : '1px solid var(--border)',
    borderLeft: isRtl ? '1px solid var(--border)' : 'none',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    height: '100%',
    textAlign: isRtl ? 'right' : 'left'
  };

  const linkStyle = (path) => ({
    padding: '0.8rem 1.2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    color: location.pathname === path ? 'white' : 'var(--text-dark)',
    backgroundColor: location.pathname === path ? 'var(--primary)' : 'transparent',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexDirection: isRtl ? 'row-reverse' : 'row'
  });

  const contentStyle = {
    flex: 1,
    padding: '2.5rem',
    backgroundColor: 'var(--background)',
    minHeight: '80vh',
    textAlign: isRtl ? 'right' : 'left'
  };

  const containerStyle = {
    display: 'flex',
    minHeight: 'calc(100vh - 70px)', // adjust for navbar height
    flexDirection: isRtl ? 'row-reverse' : 'row'
  };

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <h3 style={{ margin: isRtl ? '0 1.2rem 1.5rem 0' : '0 0 1.5rem 1.2rem', fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>{t('admin.sidebar.title')}</h3>
        <Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}>
          <span style={{ fontSize: '1.2rem' }}>📊</span> {t('admin.sidebar.overview')}
        </Link>
        <Link to="/admin/users" style={linkStyle('/admin/users')}>
          <span style={{ fontSize: '1.2rem' }}>👥</span> {t('admin.sidebar.users')}
        </Link>
        <Link to="/admin/content" style={linkStyle('/admin/content')}>
          <span style={{ fontSize: '1.2rem' }}>📝</span> {t('admin.sidebar.content')}
        </Link>
      </aside>
      <main style={contentStyle}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

