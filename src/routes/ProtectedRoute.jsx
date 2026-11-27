import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isAdminRole } from '../utils/roles';

function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdminRole(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;