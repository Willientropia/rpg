import React, { useEffect, useState } from 'react';

// Temporary Login Component
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    onLogin(); // Call the login function
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center p-4">
      {/* Background decoration - FIXED */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-20" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2 font-serif tracking-wider">
            ⚔️ FORGE OF HEROES
          </h1>
          <p className="text-stone-300 font-medium">
            Entre em suas aventuras épicas
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 rounded-lg shadow-xl backdrop-blur-sm relative overflow-hidden p-8">
          <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
          <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-700">
                  Nome de Usuário
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Digite seu nome de usuário"
                  className="w-full px-4 py-3 rounded-md border-2 transition-all duration-200
                    bg-stone-50 border-stone-300 text-stone-900 focus:outline-none focus:ring-2 
                    focus:ring-amber-400 focus:border-amber-400 placeholder:text-stone-500"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-700">
                  Senha
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 rounded-md border-2 transition-all duration-200
                    bg-stone-50 border-stone-300 text-stone-900 focus:outline-none focus:ring-2 
                    focus:ring-amber-400 focus:border-amber-400 placeholder:text-stone-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="relative inline-flex items-center justify-center font-semibold transition-all duration-200
                  px-6 py-2.5 text-base rounded-md bg-gradient-to-b from-amber-400 to-amber-600 
                  border-2 border-amber-700 text-amber-900 hover:from-amber-300 hover:to-amber-500
                  shadow-lg hover:shadow-xl active:scale-95 w-full text-lg"
              >
                Entrar na Taverna
              </button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-stone-600 font-medium">
                  Novo aventureiro?{' '}
                  <span className="text-amber-600 hover:text-amber-500 font-semibold transition-colors cursor-pointer">
                    Crie sua conta
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-stone-400 text-sm">
            "Todo herói tem uma história para contar..."
          </p>
        </div>
      </div>
    </div>
  );
};

// Temporary Dashboard Component
const Dashboard = ({ onLogout }) => {
  // Mock characters data
  const characters = [
    {
      id: 1,
      name: 'Gandalf, o Cinzento',
      class_name: 'Wizard',
      race_name: 'Human',
      level: 10,
      hit_points: 45,
      max_hit_points: 52,
      armor_class: 15,
    },
    {
      id: 2,
      name: 'Legolas Folha Verde',
      class_name: 'Ranger',
      race_name: 'Elf',
      level: 8,
      hit_points: 62,
      max_hit_points: 68,
      armor_class: 17,
    },
    {
      id: 3,
      name: 'Gimli, Filho de Glóin',
      class_name: 'Fighter',
      race_name: 'Dwarf',
      level: 9,
      hit_points: 78,
      max_hit_points: 85,
      armor_class: 19,
    }
  ];

  const getHealthColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900">
      {/* Header */}
      <header className="bg-stone-900/50 backdrop-blur-sm border-b-2 border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-amber-400 font-serif tracking-wider">
              ⚔️ FORGE OF HEROES
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 
                  flex items-center justify-center border-2 border-amber-700 shadow-lg">
                  <span className="text-amber-900 font-bold text-sm">AG</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-stone-100 font-semibold">Aventureiro Lendário</p>
                  <p className="text-stone-400 text-sm">Mestre dos Heróis</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-gradient-to-b from-stone-600 to-stone-800 
                border-2 border-stone-900 text-stone-100 rounded-md hover:from-stone-500 hover:to-stone-700
                transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">
            Bem-vindo de volta, Aventureiro!
          </h2>
          <p className="text-stone-300">
            Suas aventuras épicas aguardam. Gerencie seus heróis e continue sua jornada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
            rounded-lg shadow-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
            <div className="relative flex items-center">
              <div className="text-3xl mr-4">⚔️</div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{characters.length}</p>
                <p className="text-stone-600">Heróis Forjados</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
            rounded-lg shadow-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
            <div className="relative flex items-center">
              <div className="text-3xl mr-4">🏆</div>
              <div>
                <p className="text-2xl font-bold text-stone-800">
                  {Math.max(...characters.map(c => c.level))}
                </p>
                <p className="text-stone-600">Nível Máximo</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
            rounded-lg shadow-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
            <div className="relative flex items-center">
              <div className="text-3xl mr-4">🛡️</div>
              <div>
                <p className="text-2xl font-bold text-stone-800">
                  {Math.round(characters.reduce((acc, c) => acc + (c.hit_points / c.max_hit_points * 100), 0) / characters.length)}%
                </p>
                <p className="text-stone-600">Saúde Média</p>
              </div>
            </div>
          </div>
        </div>

        {/* Characters Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-amber-400">Seus Heróis</h3>
            <button className="px-6 py-2.5 text-base rounded-md bg-gradient-to-b from-amber-400 to-amber-600 
              border-2 border-amber-700 text-amber-900 hover:from-amber-300 hover:to-amber-500
              shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200">
              ➕ Forjar Novo Herói
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <div key={character.id} className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
                rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
                <div className="relative">
                  {/* Character Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-stone-800">{character.name}</h4>
                      <p className="text-stone-600">
                        {character.race_name} {character.class_name} • Nível {character.level}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {character.class_name === 'Wizard' && '🧙‍♂️'}
                      {character.class_name === 'Ranger' && '🏹'}
                      {character.class_name === 'Fighter' && '⚔️'}
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-stone-600 mb-1">
                      <span>Vida</span>
                      <span>{character.hit_points}/{character.max_hit_points}</span>
                    </div>
                    <div className="w-full bg-stone-300 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getHealthColor(character.hit_points, character.max_hit_points)}`}
                        style={{ width: `${(character.hit_points / character.max_hit_points) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-stone-600 mb-3">
                    <span>CA: {character.armor_class}</span>
                    <span>Criado hoje</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium hover:bg-amber-200 transition-colors">
                      Editar
                    </button>
                    <button className="flex-1 px-3 py-1 bg-stone-200 text-stone-700 rounded text-sm font-medium hover:bg-stone-300 transition-colors">
                      Ficha
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
            rounded-lg shadow-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
            <div className="relative">
              <h4 className="text-lg font-bold text-stone-800 mb-4">🎲 Ações Rápidas</h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors">
                  <span className="font-medium">Rolar Dados</span>
                  <p className="text-sm text-stone-600">Ferramenta de dados para suas aventuras</p>
                </button>
                <button className="w-full text-left p-3 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors">
                  <span className="font-medium">Buscar Feitiços</span>
                  <p className="text-sm text-stone-600">Explore a biblioteca de magias</p>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
            rounded-lg shadow-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
            <div className="relative">
              <h4 className="text-lg font-bold text-stone-800 mb-4">🏰 Campanhas</h4>
              <div className="text-center py-4">
                <p className="text-stone-600 mb-4">Sistema de campanhas em breve!</p>
                <button className="px-4 py-2 bg-gradient-to-b from-stone-400 to-stone-600 
                  border-2 border-stone-700 text-stone-100 rounded-md opacity-50 cursor-not-allowed">
                  Em Desenvolvimento
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'dashboard'
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function
  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView('dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4" />
          <p className="text-amber-400 font-semibold text-lg">Carregando Forge of Heroes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Demo Navigation */}
      <div className="fixed top-4 right-4 z-50 bg-stone-900/80 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-amber-400 font-semibold mb-2">Demo Navigation</h3>
        <div className="space-y-2">
          <button 
            onClick={() => setCurrentView('login')}
            className={`block w-full text-left px-3 py-1 text-sm transition-colors rounded ${
              currentView === 'login' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:text-amber-400'
            }`}
          >
            🔐 Login
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`block w-full text-left px-3 py-1 text-sm transition-colors rounded ${
              currentView === 'dashboard' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:text-amber-400'
            }`}
          >
            🏠 Dashboard
          </button>
          <button 
            onClick={handleLogin}
            className="block w-full text-left px-3 py-1 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            ✨ Mock Login
          </button>
        </div>
      </div>

      {/* Render current view */}
      {currentView === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentView === 'dashboard' && <Dashboard onLogout={handleLogout} />}
    </div>
  );
}