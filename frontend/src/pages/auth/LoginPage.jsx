// src/pages/auth/LoginPage.jsx - Página de login com imports corrigidos
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Nome de usuário é obrigatório';
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData);
    
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2 tracking-wider">
            ⚔️ FORGE OF HEROES
          </h1>
          <p className="text-stone-300 font-medium">
            Entre em suas aventuras épicas
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="error">
                {typeof error === 'string' ? error : 'Erro ao fazer login'}
              </Alert>
            )}

            {/* Username Field */}
            <Input
              label="Nome de Usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              placeholder="Digite seu nome de usuário"
              disabled={isLoading}
              autoComplete="username"
              required
            />

            {/* Password Field */}
            <Input
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              placeholder="Digite sua senha"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar na Taverna'}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-stone-600 font-medium">
                Novo aventureiro?{' '}
                <Link 
                  to="/register"
                  className="text-amber-600 hover:text-amber-500 font-semibold transition-colors"
                >
                  Crie sua conta
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-stone-400 text-sm">
            "Todo herói tem uma história para contar..."
          </p>
        </div>
      </div>
    </div>
  );
}