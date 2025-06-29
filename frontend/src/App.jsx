// src/App.jsx - Estrutura principal com roteamento
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Páginas de autenticação
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Páginas principais
import Dashboard from './pages/Dashboard';
import CharacterList from './pages/characters/CharacterList';
import CharacterCreate from './pages/characters/CharacterCreate';
import CharacterDetail from './pages/characters/CharacterDetail';
import CharacterEdit from './pages/characters/CharacterEdit';
import CharacterSheet from './pages/characters/CharacterSheet';

// Componentes de proteção
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Criar QueryClient para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  const { initialize, isLoading } = useAuthStore();

  // Inicializar autenticação ao carregar o app
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Mostrar loading enquanto inicializa
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Personagens */}
            <Route path="characters" element={<CharacterList />} />
            <Route path="characters/create" element={<CharacterCreate />} />
            <Route path="characters/:id" element={<CharacterDetail />} />
            <Route path="characters/:id/edit" element={<CharacterEdit />} />
            <Route path="characters/:id/sheet" element={<CharacterSheet />} />
            
            {/* Redirect dashboard para / */}
            <Route path="dashboard" element={<Navigate to="/" replace />} />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;