import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PublicUserRoute Component (Guard)
 * 
 * Protects public pages, but with a special rule: 
 * If an admin is logged in, they shouldn't be browsing the public user-facing site.
 * Redirect them to the admin dashboard instead.
 */
const PublicUserRoute = () => {
  const { user } = useAuth();

  // Redirect admins to their dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Everyone else (guests and normal users) can see the public page
  return <Outlet />;
};

export default PublicUserRoute;
