import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminRoute Component (Guard)
 * 
 * Protects routes that should ONLY be accessed by Administrators.
 */
const AdminRoute = () => {
  const { user } = useAuth();

  // If no user is logged in, redirect them to the admin login page
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // If the user is logged in but is NOT an admin, redirect them to the normal dashboard (which is now home)
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If the checks pass, render the requested admin page (<Outlet />)
  return <Outlet />;
};

export default AdminRoute;
