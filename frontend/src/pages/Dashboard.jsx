// src/pages/Dashboard.jsx - Dashboard refatorado
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { charactersService } from '../services/charactersService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, getDisplayName } = useAuthStore();

  // Buscar personagens do usuário
  const { 
    data: characters = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['characters'],
    queryFn: charactersService.getCharacters,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getHealthColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getClassIcon = (className) => {
    const icons = {
      'Wizard': '🧙‍♂️',
      'Fighter': '⚔️',
      'Ranger': '🏹',
      'Rogue': '🗡️',
      'Cleric': '✨',
      'Barbarian': '🪓',
      'Bard': '🎵',
      'Druid': '🌿',
      'Monk': '👊',
      'Paladin': '🛡️',
      'Sorcerer': '🔥',
      'Warlock': '👁️',
    };
    return icons[className] || '⚔️';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Calcular estatísticas
  const stats = {
    totalCharacters: characters.length,
    maxLevel: characters.length > 0 ? Math.max(...characters.map(c => c.level)) : 0,
    averageHealth: characters.length > 0 
      ? Math.round(characters.reduce((acc, c) => acc + (c.current_hp / c.max_hp * 100), 0) / characters.length)
      : 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-amber-400 mb-2 font-medieval">
          Bem-vindo de volta, {user?.first_name || 'Aventureiro'}!
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
              <p className="text-2xl font-bold text-stone-800">{stats.totalCharacters}</p>
              <p className="text-stone-600">Heróis Forjados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🏆</div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{stats.maxLevel}</p>
              <p className="text-stone-600">Nível Máximo</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🛡️</div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{stats.averageHealth}%</p>
              <p className="text-stone-600">Saúde Média</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Characters Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-amber-400 font-medieval">Seus Heróis</h3>
          <Button onClick={() => navigate('/characters/create')}>
            ➕ Forjar Novo Herói
          </Button>
        </div>

        {error ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">
              Erro ao carregar personagens
            </h3>
            <p className="text-stone-600 mb-4">
              {error.message || 'Ocorreu um erro inesperado'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </Card>
        ) : characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <Card 
                key={character.id} 
                className="p-6 hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/characters/${character.id}`)}
              >
                {/* Character Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-stone-800 font-medieval">
                      {character.name}
                    </h4>
                    <p className="text-stone-600">
                      {character.race?.name} {character.character_class?.name} • Nível {character.level}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {getClassIcon(character.character_class?.name)}
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-stone-600 mb-1">
                    <span>Vida</span>
                    <span>{character.current_hp}/{character.max_hp}</span>
                  </div>
                  <div className="w-full bg-stone-300 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getHealthColor(character.current_hp, character.max_hp)}`}
                      style={{ width: `${(character.current_hp / character.max_hp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-stone-600 mb-3">
                  <span>CA: {character.armor_class || 10}</span>
                  <span>Criado: {formatDate(character.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/characters/${character.id}/edit`);
                    }}
                    className="flex-1 px-3 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/characters/${character.id}/sheet`);
                    }}
                    className="flex-1 px-3 py-1 bg-stone-200 text-stone-700 rounded text-sm font-medium hover:bg-stone-300 transition-colors"
                  >
                    Ficha
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">⚔️</div>
            <h3 className="text-xl font-bold text-stone-800 mb-2 font-medieval">
              Nenhum herói forjado ainda
            </h3>
            <p className="text-stone-600 mb-6">
              Comece sua jornada criando seu primeiro personagem épico!
            </p>
            <Button onClick={() => navigate('/characters/create')}>
              Forjar Primeiro Herói
            </Button>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-bold text-stone-800 mb-4 font-medieval">
            🎲 Ações Rápidas
          </h4>
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
          <h4 className="text-lg font-bold text-stone-800 mb-4 font-medieval">
            🏰 Campanhas
          </h4>
          <div className="text-center py-4">
            <p className="text-stone-600 mb-4">Sistema de campanhas em breve!</p>
            <Button variant="secondary" disabled>
              Em Desenvolvimento
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}