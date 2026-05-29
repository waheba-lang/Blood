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

  //  ychouf wach user kayn wla la
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-light)' }}>
        <Loader2 size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ila makan user wla ma 3ndouch role dyal organizer wla admin, redirecti lihom l dashboard (home) --- IGNORE ---
  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // ila user kayn w 3ndouch role dyal organizer wla admin, khlli lihom ychoufou l page outlet dyalhom
  return <Outlet />;
};

export default OrganizerRoute;
