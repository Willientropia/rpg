import React, { useState, useEffect } from 'react';
// Note: Install react-router-dom for navigation
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';

// Mock UI components - replace with actual imports
const Button = ({ children, loading, disabled, onClick, className, ...props }) => (
  <button 
    onClick={onClick}
    disabled={disabled || loading}
    className={`relative inline-flex items-center justify-center font-semibold transition-all duration-200
      px-6 py-2.5 text-base rounded-md bg-gradient-to-b from-amber-400 to-amber-600 
      border-2 border-amber-700 text-amber-900 hover:from-amber-300 hover:to-amber-500
      shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {loading && (
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    )}
    {children}
  </button>
);

const Input = ({ label, error, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-semibold text-stone-700">{label}</label>}
    <input
      className={`w-full px-4 py-3 rounded-md border-2 transition-all duration-200
        bg-stone-50 border-stone-300 text-stone-900 focus:outline-none focus:ring-2 
        focus:ring-amber-400 focus:border-amber-400 placeholder:text-stone-500
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Card = ({ children, className }) => (
  <div className={`bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
    rounded-lg shadow-xl backdrop-blur-sm relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
    <div className="relative">{children}</div>
  </div>
);

const Alert = ({ children, variant = 'error' }) => {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };
  
  return (
    <div className={`p-4 rounded-md border-2 ${variants[variant]}`}>
      {children}
    </div>
  );
};

export default function RegisterPage() {
  // Mock navigation and auth store
  const navigate = (path) => console.log('Navigate to:', path);
  
  const mockAuthStore = {
    register: async (userData) => {
      console.log('Register attempt:', userData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate validation errors
      if (userData.username === 'admin') {
        return { success: false, error: { username: ['Este nome de usuário já existe'] } };
      }
      
      return { success: true };
    },
    isAuthenticated: false,
    isLoading: false,
    error: null,
    clearError: () => console.log('Clear error')
  };
  
  const { register, isAuthenticated, isLoading, error, clearError } = mockAuthStore;
  
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
      navigate('/dashboard');
    }
  }, [isAuthenticated]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

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
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
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
        navigate('/dashboard');
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
      <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`} />
      
      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2 font-serif tracking-wider">
            ⚔️ FORGE OF HEROES
          </h1>
          <p className="text-stone-300 font-medium">
            Junte-se à guilda dos aventureiros
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
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
                placeholder="Mínimo 6 caracteres"
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
              onClick={handleSubmit}
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
                <span 
                  onClick={() => navigate('/login')}
                  className="text-amber-600 hover:text-amber-500 font-semibold transition-colors cursor-pointer"
                >
                  Faça login
                </span>
              </p>
            </div>
          </div>
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