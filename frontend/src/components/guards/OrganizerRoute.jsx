import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * OrganizerRoute Component (Guard)
 * 
 * Protects routes that should ONLY be accessed by Organizers (and Admins).
 */
const OrganizerRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading spinner while checking authentication status
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-light)' }}>
        <Loader2 size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If no user, or user is not an organizer/admin, redirect them
  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the checks pass, render the requested organizer page (<Outlet />)
  return <Outlet />;
};

export default OrganizerRoute;
