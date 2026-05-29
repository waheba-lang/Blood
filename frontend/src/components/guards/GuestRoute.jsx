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

  //  ila user kayn, ma khassouch ychouf login/register pages
  // Redirect them  redhat 3la hsab  role dyalhom
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // ila user ma kaynash, khlli lihom ychoufou l page outlet dyalhom
  return <Outlet />;
};

export default GuestRoute;
