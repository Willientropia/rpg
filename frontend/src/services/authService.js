// src/services/authService.js - Serviço de autenticação
import api from './api';

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      
      // A resposta do Django vem em formato diferente
      const data = response.data;
      
      if (data.success !== false) {
        // Extrair tokens e user
        const access = data.access;
        const refresh = data.refresh;
        const user = data.user;

        // Salvar tokens e user no localStorage
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        return { success: true, data: { access, refresh, user } };
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao fazer login',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Tratar diferentes tipos de erro
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Usuário ou senha incorretos',
        };
      }
      
      if (error.response?.data?.errors) {
        return {
          success: false,
          error: error.response.data.errors,
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao conectar com o servidor',
      };
    }
  },

  // Register
  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData);
      const data = response.data;

      if (data.success !== false) {
        // Se o registro for bem-sucedido, fazer login automático
        const loginResult = await this.login({
          username: userData.username,
          password: userData.password,
        });

        return loginResult;
      } else {
        return {
          success: false,
          error: data.errors || 'Erro ao criar conta',
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      
      // Tratar erros de validação do Django
      if (error.response?.data?.errors) {
        return {
          success: false,
          error: error.response.data.errors,
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao conectar com o servidor',
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
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    
    if (!token) return false;
    
    // Verificar se o token não está expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      // Se não conseguir decodificar, considerar inválido
      return false;
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile/');
      
      // Atualizar localStorage com dados atualizados
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar perfil',
      };
    }
  },

  // Update profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile/update/', userData);
      
      if (response.data.success) {
        // Atualizar localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return { success: true, data: response.data.user };
      } else {
        return {
          success: false,
          error: response.data.errors || 'Erro ao atualizar perfil',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao atualizar perfil',
      };
    }
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao alterar senha',
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

  // Validate token
  async validateToken() {
    try {
      // Tentar fazer uma requisição autenticada simples
      await api.get('/auth/profile/');
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token inválido, tentar refresh
        const refreshResult = await this.refreshToken();
        return refreshResult.success;
      }
      return false;
    }
  },
};