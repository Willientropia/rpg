// src/components/auth/ProtectedRoute.jsx - CORRIGIDO
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    if (!isAuthenticated && !isLoading) {
      initialize();
    }
  }, [isAuthenticated, isLoading, initialize]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticação..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

// src/hooks/useAuth.js - Hook utilitário
export const useAuth = () => {
  const authStore = useAuthStore();
  
  return {
    ...authStore,
    // Métodos de utilidade
    hasRole: (role) => {
      return authStore.user?.roles?.includes(role) || false;
    },
    
    hasAnyRole: (roles) => {
      return roles.some(role => authStore.user?.roles?.includes(role));
    },
    
    getUserInitials: () => {
      const user = authStore.user;
      if (!user) return 'U';
      
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      
      if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
      }
      
      if (user.username) {
        return user.username.slice(0, 2).toUpperCase();
      }
      
      return 'U';
    },
    
    getDisplayName: () => {
      const user = authStore.user;
      if (!user) return 'Usuário';
      
      if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
      }
      
      if (user.first_name) {
        return user.first_name;
      }
      
      return user.username || 'Usuário';
    },
  };
};

// src/components/auth/AuthGuard.jsx - Componente adicional
export const AuthGuard = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If auth is not required but user is authenticated (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};