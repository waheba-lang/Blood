import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * GuestRoute Component (Guard)
 * 
 * Protects routes that should ONLY be accessed by logged-OUT users.
 * (e.g. Login page, Register page)
 */
const GuestRoute = () => {
  const { user } = useAuth();

  // If a user is already logged in, they shouldn't see the login/register pages.
  // Redirect them to their respective dashboards.
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If no user is logged in, render the requested page (<Outlet />)
  return <Outlet />;
};

export default GuestRoute;
