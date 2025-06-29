// src/store/authStore.js - Zustand Store REAL para Autenticação
import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  // Estado
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Inicializar estado do localStorage
  initialize: async () => {
    set({ isLoading: true });
    
    try {
      console.log('🔄 Inicializando autenticação...');
      
      const user = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();
      
      console.log('👤 Usuário no localStorage:', user);
      console.log('🔐 Está autenticado:', isAuthenticated);
      
      // Se tem usuário mas token inválido, tentar refresh
      if (user && !isAuthenticated) {
        console.log('🔄 Token inválido, tentando refresh...');
        const refreshResult = await authService.refreshToken();
        
        if (refreshResult.success) {
          console.log('✅ Token refreshed com sucesso');
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          console.log('❌ Refresh falhou, limpando dados');
          authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        set({
          user,
          isAuthenticated,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar auth:', error);
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
      console.log('🔐 Tentando login...', credentials.username);
      
      const result = await authService.login(credentials);
      
      if (result.success) {
        console.log('✅ Login bem-sucedido:', result.data.user);
        
        set({
          user: result.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        console.log('❌ Login falhou:', result.error);
        
        set({
          isLoading: false,
          error: result.error,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
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
      console.log('📝 Tentando registro...', userData.username);
      
      const result = await authService.register(userData);
      
      if (result.success) {
        console.log('✅ Registro bem-sucedido:', result.data.user);
        
        set({
          user: result.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        console.log('❌ Registro falhou:', result.error);
        
        set({
          isLoading: false,
          error: result.error,
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Erro no registro:', error);
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
    console.log('🚪 Fazendo logout...');
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