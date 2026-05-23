import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';

/**
 * Login Page Component
 * 
 * Allows existing users to sign into their account.
 */
export default function Login() {
  const { t, i18n } = useTranslation(); // Translation hook
  
  // State variables to store the user's input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Stores any error messages from the server
  
  const { login } = useAuth(); // The login function from our Auth Context
  const navigate = useNavigate(); // Hook to redirect the user to a different page

  // Check if we are using an Arabic translation (Right-to-Left text)
  const isRtl = i18n.language === 'ar';

  /**
   * Function called when the user submits the login form
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    setError(''); // Clear any previous errors

    try {
      // Attempt to log in with the provided credentials
      const data = await login(email, password);
      const userRole = data?.user?.role;
      
      // Redirect to the appropriate dashboard based on user role
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // If login fails, extract the error message and display it
      const msg = err.response?.data?.message || err.message || t('auth.login_error');
      setError(msg);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t('auth.login_title')}</h2>
          <p>{t('auth.login_subtitle')}</p>
        </div>

        {/* Display error message if one exists */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input Field */}
          <div className="auth-group">
            <label className="auth-label">{t('auth.email_label')}</label>
            <input
              type="email"
              required
              className="auth-input"
              placeholder="votre@email.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} // Update state when user types
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            />
          </div>

          {/* Password Input Field */}
          <div className="auth-group">
            <label className="auth-label">{t('auth.password_label')}</label>
            <input
              type="password"
              required
              className="auth-input"
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} // Update state when user types
              style={{ textAlign: isRtl ? 'right' : 'left' }}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            {t('auth.login_btn')}
          </button>
        </form>

        {/* Link to Registration Page */}
        <p className="auth-footer">
          {t('auth.no_account')} 
          <Link to="/register">{t('auth.register_here')}</Link>
        </p>
      </div>
    </div>
  );
}
