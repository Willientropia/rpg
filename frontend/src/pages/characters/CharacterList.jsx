// src/pages/characters/CharacterList.jsx - Lista de personagens
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import charactersService  from '../../services/charactersService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function CharacterList() {
  const navigate = useNavigate();

  // Buscar personagens do usuário
  const { 
    data: characters = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['characters'],
    queryFn: charactersService.getCharacters,
  });

  if (isLoading) {
    return <LoadingSpinner message="Carregando personagens..." />;
  }

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

  const getHealthColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">
            ⚔️ Seus Heróis
          </h1>
          <p className="text-stone-300 mt-2">
            Gerencie todos os seus personagens de D&D
          </p>
        </div>
        <Button onClick={() => navigate('/characters/create')}>
          ➕ Criar Novo Herói
        </Button>
      </div>

      {/* Character Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map(character => (
            <Card 
              key={character.id} 
              className="p-6 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/characters/${character.id}`)}
            >
              {/* Character Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-stone-800">
                    {character.name}
                  </h4>
                  <p className="text-stone-600">
                    {character.race?.name} {character.character_class?.name}
                  </p>
                  <p className="text-sm text-stone-500">
                    Nível {character.level}
                  </p>
                </div>
                <div className="text-3xl">
                  {getClassIcon(character.character_class?.name)}
                </div>
              </div>

              {/* Health Bar */}
              <div className="mb-4">
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
              <div className="flex justify-between text-sm text-stone-600 mb-4">
                <span>CA: {character.armor_class || 10}</span>
                <span>XP: {character.experience_points || 0}</span>
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
          <h3 className="text-xl font-bold text-stone-800 mb-2">
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
  );
}