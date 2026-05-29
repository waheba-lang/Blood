import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

/**
 * UserRoute Component (Guard)
 * 
 * Protects routes that should ONLY be accessed by logged-in users.
 */
const UserRoute = () => {
  // Get the current logged-in user from the Auth Context jib lina user li kayn f auth context
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("You must log in first to access this content.");
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // ila user ma kaynash, redirecti lihom l login page
  if (!user) {
    return null;
  }

  //  (ila user kayn w role dyalou admin, redirecti lihom l admin dashboard)
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  //  ila user kayn w role dyalou normal user, khlli lihom ychoufou l page outlet dyalhom
  return <Outlet />;
};

export default UserRoute;
