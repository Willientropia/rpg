import React, { useState } from 'react';

// Mock UI components
const Card = ({ children, className = '' }) => (
  <div className={`bg-gradient-to-br from-stone-50 to-stone-100 border-2 border-stone-300 
    rounded-lg shadow-xl backdrop-blur-sm relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 border-2 border-amber-200 rounded-lg opacity-30" />
    <div className="relative">{children}</div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-700 text-amber-900 hover:from-amber-300 hover:to-amber-500',
    secondary: 'bg-gradient-to-b from-stone-600 to-stone-800 border-stone-900 text-stone-100 hover:from-stone-500 hover:to-stone-700',
    danger: 'bg-gradient-to-b from-red-500 to-red-700 border-red-800 text-red-100 hover:from-red-400 hover:to-red-600'
  };
  
  return (
    <button 
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-semibold transition-all duration-200
        px-6 py-2.5 text-base rounded-md border-2 shadow-lg hover:shadow-xl active:scale-95
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Dashboard() {
  // Mock user data
  const mockUser = {
    username: 'aventureiro_lendario',
    first_name: 'Aragorn',
    last_name: 'Dúnadan',
    email: 'aragorn@gondor.com'
  };

  // Mock characters data
  const [characters] = useState([
    {
      id: 1,
      name: 'Gandalf, o Cinzento',
      class_name: 'Wizard',
      race_name: 'Human',
      level: 10,
      hit_points: 45,
      max_hit_points: 52,
      armor_class: 15,
      created_at: '2024-01-15'
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
      created_at: '2024-02-03'
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
      created_at: '2024-02-10'
    }
  ]);

  const navigate = (path) => console.log('Navigate to:', path);
  const logout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  const getUserInitials = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const getDisplayName = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-400 font-serif tracking-wider">
                ⚔️ FORGE OF HEROES
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 
                  flex items-center justify-center border-2 border-amber-700 shadow-lg">
                  <span className="text-amber-900 font-bold text-sm">
                    {getUserInitials(mockUser)}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="hidden md:block">
                  <p className="text-stone-100 font-semibold">
                    {getDisplayName(mockUser)}
                  </p>
                  <p className="text-stone-400 text-sm">
                    Mestre Aventureiro
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button variant="secondary" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">
            Bem-vindo de volta, {mockUser.first_name}!
          </h2>
          <p className="text-stone-300">
            Suas aventuras épicas aguardam. Gerencie seus heróis e continue sua jornada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⚔️</div>
              <div>
                <p className="text-2xl font-bold text-stone-800">{characters.length}</p>
                <p className="text-stone-600">Heróis Forjados</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏆</div>
              <div>
                <p className="text-2xl font-bold text-stone-800">
                  {Math.max(...characters.map(c => c.level))}
                </p>
                <p className="text-stone-600">Nível Máximo</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🛡️</div>
              <div>
                <p className="text-2xl font-bold text-stone-800">
                  {Math.round(characters.reduce((acc, c) => acc + (c.hit_points / c.max_hit_points * 100), 0) / characters.length)}%
                </p>
                <p className="text-stone-600">Saúde Média</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Characters Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-amber-400">Seus Heróis</h3>
            <Button onClick={() => navigate('/create-character')}>
              ➕ Forjar Novo Herói
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <Card key={character.id} className="p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/character/${character.id}`)}>
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
                    {character.class_name === 'Fighter' && '⚔️'}
                    {character.class_name === 'Ranger' && '🏹'}
                    {character.class_name === 'Rogue' && '🗡️'}
                    {character.class_name === 'Cleric' && '✨'}
                    {character.class_name === 'Barbarian' && '🪓'}
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
                  <span>Criado: {formatDate(character.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/character/${character.id}/edit`);
                    }}
                    className="flex-1 px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/character/${character.id}/sheet`);
                    }}
                    className="flex-1 px-3 py-1 bg-stone-200 text-stone-700 rounded text-sm font-medium hover:bg-stone-300 transition-colors"
                  >
                    Ficha
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {characters.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Nenhum herói forjado ainda
              </h3>
              <p className="text-stone-600 mb-6">
                Comece sua jornada criando seu primeiro personagem épico!
              </p>
              <Button onClick={() => navigate('/create-character')}>
                Forjar Primeiro Herói
              </Button>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h4 className="text-lg font-bold text-stone-800 mb-4">🎲 Ações Rápidas</h4>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/dice-roller')}
                className="w-full text-left p-3 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <span className="font-medium">Rolar Dados</span>
                <p className="text-sm text-stone-600">Ferramenta de dados para suas aventuras</p>
              </button>
              <button 
                onClick={() => navigate('/spells')}
                className="w-full text-left p-3 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <span className="font-medium">Buscar Feitiços</span>
                <p className="text-sm text-stone-600">Explore a biblioteca de magias</p>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-bold text-stone-800 mb-4">🏰 Campanhas</h4>
            <div className="text-center py-4">
              <p className="text-stone-600 mb-4">Sistema de campanhas em breve!</p>
              <Button variant="secondary" disabled>
                Em Desenvolvimento
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}