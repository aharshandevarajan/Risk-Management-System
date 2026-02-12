import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

/**
 * Wrapper around route segments that require authentication.
 * Optionally restricts by allowed roles for basic UI-level authorization.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-400">Loading session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="card max-w-md">
          <h1 className="text-lg font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your account does not have permission to view this resource.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

