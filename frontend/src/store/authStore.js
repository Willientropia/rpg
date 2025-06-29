// src/store/authStore.js - Zustand Store para Autenticação
import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  // Estado
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Inicializar estado do localStorage
  initialize: () => {
    set({ isLoading: true });
    
    try {
      const user = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();
      
      set({
        user,
        isAuthenticated,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erro ao inicializar auth:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        set({
          user: result.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.error,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        set({
          user: result.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.error,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Update user profile
  updateUser: (userData) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };
    
    set({ user: updatedUser });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },

  // Get profile from API
  getProfile: async () => {
    set({ isLoading: true });
    
    try {
      const result = await authService.getProfile();
      
      if (result.success) {
        set({
          user: result.data,
          isLoading: false,
        });
        localStorage.setItem('user', JSON.stringify(result.data));
      } else {
        set({
          isLoading: false,
          error: result.error,
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Erro ao buscar perfil',
      });
    }
  },

  // Utility methods
  getUserInitials: () => {
    const user = get().user;
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
    const user = get().user;
    if (!user) return 'Usuário';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    if (user.first_name) {
      return user.first_name;
    }
    
    return user.username || 'Usuário';
  },
}));