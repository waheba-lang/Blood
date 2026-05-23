import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * UserRoute Component (Guard)
 * 
 * Protects routes that should ONLY be accessed by logged-in users.
 */
const UserRoute = () => {
  // Get the current logged-in user from the Auth Context
  const { user } = useAuth();

  // If no user is logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admins have their own dashboard, so redirect them if they try to access standard user pages
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If the checks pass, render the requested page (<Outlet />)
  return <Outlet />;
};

export default UserRoute;
