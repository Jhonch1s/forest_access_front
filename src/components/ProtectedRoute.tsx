import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredProfile?: string;
}

function ProtectedRoute({ children, requiredProfile }: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasProfile } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (requiredProfile && !hasProfile(requiredProfile)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
