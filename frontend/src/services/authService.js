// src/services/authService.js
import api from './api';

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      const { access, refresh, user } = response.data;

      // Salvar tokens e user no localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, data: { access, refresh, user } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  },

  // Register
  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData);
      const { access, refresh, user } = response.data;

      // Auto-login após registro
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, data: { access, refresh, user } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erro ao criar conta',
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar perfil',
      };
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);

      return { success: true, data: { access } };
    } catch (error) {
      // Clear tokens on refresh failure
      this.logout();
      return {
        success: false,
        error: 'Sessão expirada, faça login novamente',
      };
    }
  },
};