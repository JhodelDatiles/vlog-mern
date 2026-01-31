import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Robust admin check
  const isUserAdmin = user?.role === 'admin' || user?.data?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;