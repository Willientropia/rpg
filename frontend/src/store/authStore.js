// src/store/authStore.js
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
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    set({
      user,
      isAuthenticated,
      isLoading: false,
      error: null,
    });
  },

  // Login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
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
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
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
    set({ user: { ...get().user, ...userData } });
    localStorage.setItem('user', JSON.stringify({ ...get().user, ...userData }));
  },

  // Get profile
  getProfile: async () => {
    set({ isLoading: true });
    
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
  },
}));