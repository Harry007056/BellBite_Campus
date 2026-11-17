import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../../store/authStore';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  const authError = useAuthStore((state) => state.authError);
  const location = useLocation();

  if (!isInitialized) {
    return <div className="p-8 text-center text-[#4A2922]">Checking your session…</div>;
  }
  if (authError) {
    return <div role="alert" className="p-8 text-center text-[#963F2B]">{authError}</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'canteen_admin' ? '/admin' : '/'} replace />;
  }
  return children;
}
