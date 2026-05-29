import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminRoute Component (Guard)
 * 
 * Protects routes that should ONLY be accessed by Administrators.
 */
const AdminRoute = () => {
  const { user } = useAuth();

  //  ila user ma kaynash, redirecti lihom l admin login page
  
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // ) ila user kayn walakin ma 3ndouch role dyal admin, redirecti lihom l home page
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  //  ila user kayn w 3ndouch role dyal admin, khlli lihom ychoufou l page
  return <Outlet />;
};

export default AdminRoute;
