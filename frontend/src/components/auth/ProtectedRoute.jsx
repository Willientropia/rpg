// src/components/auth/ProtectedRoute.jsx
import React, { useEffect } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  // Mock auth store - replace with actual useAuthStore()
  const mockAuthStore = {
    isAuthenticated: false,
    isLoading: false,
    initialize: () => console.log('Initialize auth'),
  };
  
  const { isAuthenticated, isLoading, initialize } = mockAuthStore;
  // const location = useLocation();

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    initialize();
  }, [initialize]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4" />
          <p className="text-amber-400 font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
    console.log('User not authenticated, would redirect to login');
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-400 font-semibold">Acesso negado - Faça login primeiro</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

// src/components/auth/AuthGuard.jsx
export const AuthGuard = ({ children, requireAuth = true }) => {
  const mockAuthStore = {
    isAuthenticated: false,
    isLoading: false,
  };
  
  const { isAuthenticated, isLoading } = mockAuthStore;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400" />
      </div>
    );
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // or redirect component
  }

  // If auth is not required but user is authenticated (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    return null; // or redirect to dashboard
  }

  return children;
};

// src/hooks/useAuth.js
export const useAuth = () => {
  // Mock hook - replace with actual useAuthStore()
  const mockAuthStore = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async () => ({ success: true }),
    register: async () => ({ success: true }),
    logout: () => console.log('Logout'),
    clearError: () => console.log('Clear error'),
  };

  return mockAuthStore;
};

// src/utils/auth.js
export const authUtils = {
  // Check if user has specific role
  hasRole: (user, role) => {
    return user?.roles?.includes(role) || false;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (user, roles) => {
    return roles.some(role => authUtils.hasRole(user, role));
  },

  // Get user initials for avatar
  getUserInitials: (user) => {
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

  // Format user display name
  getDisplayName: (user) => {
    if (!user) return 'Usuário';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    if (user.first_name) {
      return user.first_name;
    }
    
    return user.username || 'Usuário';
  },

  // Check if token is expired (basic check)
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
};