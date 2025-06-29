// src/pages/auth/RegisterPage.jsx - Página de registro
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError]);

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      errors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    // Name validation
    if (!formData.first_name.trim()) {
      errors.first_name = 'Nome é obrigatório';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Sobrenome é obrigatório';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      errors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    
    // Password confirmation
    if (!formData.password_confirm) {
      errors.password_confirm = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Senhas não conferem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await register(formData);
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else if (result.error && typeof result.error === 'object') {
      // Handle field-specific errors from backend
      setFormErrors(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(result.error).map(([key, value]) => [
            key, 
            Array.isArray(value) ? value[0] : value
          ])
        )
      }));
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Bem-vindo, Aventureiro!</h2>
          <p className="text-stone-600 mb-4">Sua conta foi criada com sucesso!</p>
          <Alert variant="success">
            Redirecionando para o painel principal...
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2 tracking-wider">
            ⚔️ FORGE OF HEROES
          </h1>
          <p className="text-stone-300 font-medium">
            Junte-se à guilda dos aventureiros
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && typeof error === 'string' && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={formErrors.first_name}
                placeholder="Seu nome"
                disabled={isLoading}
                autoComplete="given-name"
              />
              
              <Input
                label="Sobrenome"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={formErrors.last_name}
                placeholder="Seu sobrenome"
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>

            {/* Username Field */}
            <Input
              label="Nome de Usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={formErrors.username}
              placeholder="Escolha um nome único"
              disabled={isLoading}
              autoComplete="username"
            />

            {/* Email Field */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="seu@email.com"
              disabled={isLoading}
              autoComplete="email"
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                placeholder="Mínimo 8 caracteres"
                disabled={isLoading}
                autoComplete="new-password"
              />
              
              <Input
                label="Confirmar Senha"
                name="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                error={formErrors.password_confirm}
                placeholder="Digite a senha novamente"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Forjar Herói'}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-stone-600 font-medium">
                Já possui uma conta?{' '}
                <Link 
                  to="/login"
                  className="text-amber-600 hover:text-amber-500 font-semibold transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-stone-400 text-sm">
            "A jornada de mil milhas começa com um único passo..."
          </p>
        </div>
      </div>
    </div>
  );
}