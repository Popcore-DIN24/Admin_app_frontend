import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'employee';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
