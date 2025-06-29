// src/pages/characters/CharacterDetail.jsx - FICHA FUNCIONAL COMPLETA
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { charactersService } from '../../services/charactersService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Componente para Modal de Ações
const ActionModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-stone-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 text-xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Componente para Input de Dano/Cura
const DamageHealInput = ({ type, onSubmit, onCancel, isLoading }) => {
  const [amount, setAmount] = useState('');
  const [damageType, setDamageType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(amount);
    if (value && value > 0) {
      onSubmit({ amount: value, type: damageType });
    }
  };

  const damageTypes = [
    'slashing', 'piercing', 'bludgeoning', 'fire', 'cold', 'lightning',
    'thunder', 'acid', 'poison', 'psychic', 'radiant', 'necrotic', 'force'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={`Quantidade de ${type === 'damage' ? 'Dano' : 'Cura'}`}
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Digite a quantidade"
        min="1"
        required
        autoFocus
      />
      
      {type === 'damage' && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Tipo de Dano (opcional)
          </label>
          <select
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
            className="w-full px-3 py-2 border-2 border-stone-300 rounded-md focus:border-amber-400"
          >
            <option value="">Selecione o tipo</option>
            {damageTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex space-x-2">
        <Button 
          type="submit" 
          className="flex-1"
          loading={isLoading}
          disabled={isLoading || !amount}
        >
          {type === 'damage' ? '💥 Aplicar Dano' : '💚 Curar'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

// Componente para Usar Spell Slot
const SpellSlotUse = ({ character, onUseSlot, isLoading }) => {
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleUseSlot = () => {
    if (selectedLevel) {
      onUseSlot(parseInt(selectedLevel));
    }
  };

  const availableSlots = Object.entries(character.spell_slots_current || {})
    .filter(([level, current]) => current > 0)
    .map(([level]) => level);

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-stone-600 mb-4">Nenhum espaço de magia disponível.</p>
        <p className="text-sm text-stone-500">Faça um descanso para recuperar espaços.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1">
          Nível do Espaço de Magia
        </label>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="w-full px-3 py-2 border-2 border-stone-300 rounded-md focus:border-amber-400"
        >
          <option value="">Selecione o nível</option>
          {availableSlots.map(level => {
            const current = character.spell_slots_current[level];
            const max = character.spell_slots_max[level];
            return (
              <option key={level} value={level}>
                Nível {level} ({current}/{max} disponíveis)
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={handleUseSlot}
          className="flex-1"
          loading={isLoading}
          disabled={isLoading || !selectedLevel}
        >
          ✨ Usar Espaço
        </Button>
      </div>
    </div>
  );
};

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados para modais
  const [modals, setModals] = useState({
    damage: false,
    heal: false,
    spellSlot: false,
    rest: false,
    levelUp: false,
  });

  const openModal = (type) => setModals(prev => ({ ...prev, [type]: true }));
  const closeModal = (type) => setModals(prev => ({ ...prev, [type]: false }));

  // Query para buscar personagem
  const { 
    data: character, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersService.getCharacter(id),
    enabled: !!(id && id !== 'undefined' && id !== 'null'),
    retry: 1,
  });

  // Mutations para ações do personagem
  const damageMutation = useMutation({
    mutationFn: ({ amount, type }) => charactersService.takeDamage(id, amount, type),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id]);
        closeModal('damage');
      }
    },
  });

  const healMutation = useMutation({
    mutationFn: ({ amount }) => charactersService.heal(id, amount),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id]);
        closeModal('heal');
      }
    },
  });

  const restMutation = useMutation({
    mutationFn: (restType) => charactersService.rest(id, restType),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id]);
        closeModal('rest');
      }
    },
  });

  const levelUpMutation = useMutation({
    mutationFn: () => charactersService.levelUp(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id]);
        closeModal('levelUp');
      }
    },
  });

  const useSpellSlotMutation = useMutation({
    mutationFn: (level) => charactersService.useSpellSlot(id, level),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id]);
        closeModal('spellSlot');
      }
    },
  });

  // Handlers
  const handleDamage = ({ amount, type }) => {
    damageMutation.mutate({ amount, type });
  };

  const handleHeal = ({ amount }) => {
    healMutation.mutate({ amount });
  };

  const handleRest = (restType) => {
    restMutation.mutate(restType);
  };

  const handleLevelUp = () => {
    levelUpMutation.mutate();
  };

  const handleUseSpellSlot = (level) => {
    useSpellSlotMutation.mutate(level);
  };

  // Loading e Error states
  if (isLoading) {
    return <LoadingSpinner message="Carregando personagem..." />;
  }

  if (error || !character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Erro ao carregar personagem
          </h2>
          <p className="text-stone-600 mb-4">
            {error?.message || 'Personagem não encontrado'}
          </p>
          <div className="space-x-2">
            <Button 
              variant="secondary"
              onClick={() => navigate('/characters')}
            >
              ← Voltar à Lista
            </Button>
            <Button onClick={() => refetch()}>
              🔄 Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Função para cor da barra de HP
  const getHealthColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Função para formatar modificador
  const formatModifier = (modifier) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  // Função para calcular XP necessário para próximo nível
  const getXPForNextLevel = (currentLevel) => {
    const xpTable = {
      1: 300, 2: 900, 3: 2700, 4: 6500, 5: 14000,
      6: 23000, 7: 34000, 8: 48000, 9: 64000, 10: 85000,
      11: 100000, 12: 120000, 13: 140000, 14: 165000, 15: 195000,
      16: 225000, 17: 265000, 18: 305000, 19: 355000
    };
    return xpTable[currentLevel] || null;
  };

  const nextLevelXP = getXPForNextLevel(character.level);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-400 font-medieval">
            {character.name}
          </h1>
          <p className="text-stone-300 text-lg">
            {character.race?.name} {character.character_class?.name} • Nível {character.level}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="secondary"
            onClick={() => navigate('/characters')}
          >
            ← Voltar
          </Button>
          <Button onClick={() => navigate(`/characters/${id}/edit`)}>
            ✏️ Editar
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/characters/${id}/sheet`)}
          >
            📜 Ficha Completa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Informações Básicas e Atributos */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              📋 Informações Básicas
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Raça:</span>
                <span className="text-stone-900">{character.race?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Classe:</span>
                <span className="text-stone-900">{character.character_class?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Background:</span>
                <span className="text-stone-900">{character.background?.name || 'Nenhum'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">Nível:</span>
                <span className="text-stone-900">{character.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-700">XP:</span>
                <span className="text-stone-900">
                  {character.experience_points?.toLocaleString() || 0}
                  {nextLevelXP && ` / ${nextLevelXP.toLocaleString()}`}
                </span>
              </div>
            </div>
          </Card>

          {/* Atributos */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              💪 Atributos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'strength', name: 'Força', abbr: 'FOR' },
                { key: 'dexterity', name: 'Destreza', abbr: 'DES' },
                { key: 'constitution', name: 'Constituição', abbr: 'CON' },
                { key: 'intelligence', name: 'Inteligência', abbr: 'INT' },
                { key: 'wisdom', name: 'Sabedoria', abbr: 'SAB' },
                { key: 'charisma', name: 'Carisma', abbr: 'CAR' },
              ].map(ability => {
                const score = character.final_abilities?.[ability.key];
                const modifier = character.ability_modifiers?.[ability.key];
                
                return (
                  <div key={ability.key} className="text-center p-3 bg-stone-50 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-stone-600 mb-1">
                      {ability.abbr}
                    </div>
                    <div className="text-2xl font-bold text-stone-800">
                      {score}
                    </div>
                    <div className="text-sm font-medium text-stone-600">
                      {formatModifier(modifier)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Progressão */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              📈 Progressão
            </h2>
            <div className="space-y-4">
              {/* Barra de XP */}
              {nextLevelXP && (
                <div>
                  <div className="flex justify-between text-sm text-stone-600 mb-2">
                    <span>Experiência</span>
                    <span>{character.experience_points} / {nextLevelXP}</span>
                  </div>
                  <div className="w-full bg-stone-300 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, (character.experience_points / nextLevelXP) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              <Button 
                className="w-full"
                onClick={() => openModal('levelUp')}
                disabled={character.level >= 20}
                loading={levelUpMutation.isLoading}
              >
                {character.level >= 20 ? '🏆 Nível Máximo' : '⬆️ Subir de Nível'}
              </Button>
              
              {character.level < 20 && (
                <div className="text-center text-sm text-stone-600">
                  {nextLevelXP ? (
                    `${(nextLevelXP - character.experience_points).toLocaleString()} XP para próximo nível`
                  ) : (
                    'Nível máximo!'
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna 2: Combat Stats e HP */}
        <div className="space-y-6">
          {/* HP e Recursos */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              ❤️ Pontos de Vida
            </h2>
            
            {/* Barra de HP */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-stone-600 mb-2">
                <span>HP Atual</span>
                <span className="font-bold">
                  {character.current_hp}/{character.max_hp}
                </span>
              </div>
              <div className="w-full bg-stone-300 rounded-full h-4 border-2 border-stone-400">
                <div 
                  className={`h-full rounded-full transition-all ${getHealthColor(character.current_hp, character.max_hp)}`}
                  style={{ width: `${Math.max(0, (character.current_hp / character.max_hp) * 100)}%` }}
                />
              </div>
              
              {/* Status de HP */}
              <div className="mt-2 text-center">
                {character.current_hp === 0 ? (
                  <span className="text-red-600 font-bold">💀 Inconsciente</span>
                ) : character.current_hp <= character.max_hp * 0.25 ? (
                  <span className="text-red-600 font-medium">🩸 Gravemente Ferido</span>
                ) : character.current_hp <= character.max_hp * 0.5 ? (
                  <span className="text-yellow-600 font-medium">⚠️ Ferido</span>
                ) : (
                  <span className="text-green-600 font-medium">✅ Saudável</span>
                )}
              </div>
            </div>

            {/* HP Temporário */}
            {character.temporary_hp > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800">
                  💙 HP Temporário: {character.temporary_hp}
                </div>
              </div>
            )}

            {/* Ações de HP */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => openModal('damage')}
                disabled={character.current_hp === 0}
              >
                💥 Dano
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openModal('heal')}
                disabled={character.current_hp >= character.max_hp}
              >
                💚 Curar
              </Button>
            </div>
          </Card>

          {/* Combat Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              ⚔️ Estatísticas de Combate
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-stone-50 rounded">
                <span className="font-medium text-stone-700">Classe de Armadura:</span>
                <span className="text-stone-900 font-bold text-lg">
                  {character.combat_stats?.armor_class}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-50 rounded">
                <span className="font-medium text-stone-700">Iniciativa:</span>
                <span className="text-stone-900 font-bold">
                  {formatModifier(character.combat_stats?.initiative_bonus)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-50 rounded">
                <span className="font-medium text-stone-700">Bônus Proficiência:</span>
                <span className="text-stone-900 font-bold">
                  +{character.combat_stats?.proficiency_bonus}
                </span>
              </div>
              
              {/* Stats de Spellcasting se aplicável */}
              {character.character_class?.is_spellcaster && (
                <>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                    <span className="font-medium text-stone-700">CD de Feitiços:</span>
                    <span className="text-amber-800 font-bold">
                      {character.combat_stats?.spell_save_dc}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                    <span className="font-medium text-stone-700">Ataque de Feitiço:</span>
                    <span className="text-amber-800 font-bold">
                      +{character.combat_stats?.spell_attack_bonus}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Descansos */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              😴 Descansos
            </h2>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleRest('short')}
                loading={restMutation.isLoading}
                disabled={restMutation.isLoading}
              >
                ⏰ Descanso Curto (1 hora)
              </Button>
              <Button 
                className="w-full"
                onClick={() => handleRest('long')}
                loading={restMutation.isLoading}
                disabled={restMutation.isLoading}
              >
                🌙 Descanso Longo (8 horas)
              </Button>
              <div className="text-xs text-stone-600 text-center">
                <p><strong>Curto:</strong> Recupera algumas habilidades</p>
                <p><strong>Longo:</strong> Recupera HP e espaços de magia</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna 3: Spell Slots e Feitiços */}
        <div className="space-y-6">
          {/* Spell Slots se for spellcaster */}
          {character.character_class?.is_spellcaster && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-stone-800 font-medieval">
                  ✨ Espaços de Magia
                </h2>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openModal('spellSlot')}
                >
                  Usar Espaço
                </Button>
              </div>
              
              {character.spell_slots_max && Object.keys(character.spell_slots_max).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(character.spell_slots_max).map(([level, maxSlots]) => {
                    const currentSlots = character.spell_slots_current?.[level] || 0;
                    const percentage = maxSlots > 0 ? (currentSlots / maxSlots) * 100 : 0;
                    
                    return (
                      <div key={level} className="p-3 bg-stone-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-stone-700">
                            Nível {level}
                          </span>
                          <span className="font-bold text-stone-900">
                            {currentSlots}/{maxSlots}
                          </span>
                        </div>
                        
                        {/* Barra de slots */}
                        <div className="w-full bg-stone-300 rounded-full h-2 mb-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        
                        {/* Círculos representando slots */}
                        <div className="flex justify-center space-x-1">
                          {Array.from({ length: maxSlots }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full border-2 ${
                                i < currentSlots 
                                  ? 'bg-amber-400 border-amber-600' 
                                  : 'bg-stone-200 border-stone-400'
                              }`}
                              title={`Slot ${i + 1} ${i < currentSlots ? 'disponível' : 'usado'}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-stone-600">
                  <p>Nenhum espaço de magia disponível neste nível.</p>
                  <p className="text-sm">Warlock: Espaços são recuperados em descanso curto</p>
                </div>
              )}
            </Card>
          )}

          {/* Feitiços */}
          {character.character_class?.is_spellcaster && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-stone-800 font-medieval">
                  📜 Feitiços
                </h2>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/characters/${id}/spells`)}
                >
                  ➕ Gerenciar
                </Button>
              </div>
              
              {character.spells && character.spells.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {character.spells
                    .sort((a, b) => a.spell_level - b.spell_level || a.spell_name.localeCompare(b.spell_name))
                    .map(spell => (
                    <div key={spell.id} className="p-3 bg-stone-50 rounded border hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-stone-800">
                            {spell.spell_name}
                          </div>
                          <div className="text-xs text-stone-600 flex items-center space-x-2">
                            <span className="bg-stone-200 px-2 py-0.5 rounded">
                              Nível {spell.spell_level}
                            </span>
                            {spell.is_prepared && (
                              <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs">
                                ✓ Preparado
                              </span>
                            )}
                            {!spell.is_known && (
                              <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs">
                                Não Conhecido
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-stone-600">
                  <div className="text-4xl mb-2">📜</div>
                  <p className="mb-4">Nenhum feitiço conhecido ainda.</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/characters/${id}/spells`)}
                  >
                    ➕ Adicionar Feitiços
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Skills e Proficiências */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4 font-medieval">
              🎯 Proficiências
            </h2>
            
            {/* Saving Throws */}
            <div className="mb-4">
              <h3 className="font-semibold text-stone-700 mb-2">Testes de Resistência</h3>
              <div className="space-y-1">
                {[
                  { key: 'strength', name: 'Força' },
                  { key: 'dexterity', name: 'Destreza' },
                  { key: 'constitution', name: 'Constituição' },
                  { key: 'intelligence', name: 'Inteligência' },
                  { key: 'wisdom', name: 'Sabedoria' },
                  { key: 'charisma', name: 'Carisma' },
                ].map(ability => {
                  const modifier = character.ability_modifiers?.[ability.key] || 0;
                  const proficiencyBonus = character.combat_stats?.proficiency_bonus || 2;
                  const isProficient = character.character_class?.saving_throw_proficiencies?.includes(ability.key) ||
                                     character.custom_saving_throw_proficiencies?.includes(ability.key);
                  const totalBonus = modifier + (isProficient ? proficiencyBonus : 0);
                  
                  return (
                    <div key={ability.key} className="flex justify-between items-center text-sm">
                      <span className={`${isProficient ? 'font-semibold text-stone-800' : 'text-stone-600'}`}>
                        {isProficient && '● '}{ability.name}
                      </span>
                      <span className={`${isProficient ? 'font-bold' : ''}`}>
                        {formatModifier(totalBonus)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold text-stone-700 mb-2">Perícias</h3>
              <div className="space-y-1 text-sm">
                {/* Background Skills */}
                {character.background?.skill_proficiencies?.map(skill => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="font-semibold text-stone-800">
                      ● {skill.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-stone-600 text-xs">Background</span>
                  </div>
                ))}
                
                {/* Custom Skills */}
                {character.custom_skill_proficiencies?.map(skill => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="font-semibold text-stone-800">
                      ● {skill.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-stone-600 text-xs">Personalizada</span>
                  </div>
                ))}

                {(!character.background?.skill_proficiencies?.length && 
                  !character.custom_skill_proficiencies?.length) && (
                  <p className="text-stone-500 italic">Nenhuma perícia proficiente</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      
      {/* Modal de Dano */}
      <ActionModal
        isOpen={modals.damage}
        onClose={() => closeModal('damage')}
        title="💥 Aplicar Dano"
      >
        <DamageHealInput
          type="damage"
          onSubmit={handleDamage}
          onCancel={() => closeModal('damage')}
          isLoading={damageMutation.isLoading}
        />
        {damageMutation.error && (
          <Alert variant="error" className="mt-4">
            {damageMutation.error.message}
          </Alert>
        )}
      </ActionModal>

      {/* Modal de Cura */}
      <ActionModal
        isOpen={modals.heal}
        onClose={() => closeModal('heal')}
        title="💚 Curar Personagem"
      >
        <DamageHealInput
          type="heal"
          onSubmit={handleHeal}
          onCancel={() => closeModal('heal')}
          isLoading={healMutation.isLoading}
        />
        {healMutation.error && (
          <Alert variant="error" className="mt-4">
            {healMutation.error.message}
          </Alert>
        )}
      </ActionModal>

      {/* Modal de Usar Spell Slot */}
      <ActionModal
        isOpen={modals.spellSlot}
        onClose={() => closeModal('spellSlot')}
        title="✨ Usar Espaço de Magia"
      >
        <SpellSlotUse
          character={character}
          onUseSlot={handleUseSpellSlot}
          isLoading={useSpellSlotMutation.isLoading}
        />
        {useSpellSlotMutation.error && (
          <Alert variant="error" className="mt-4">
            {useSpellSlotMutation.error.message}
          </Alert>
        )}
      </ActionModal>

      {/* Modal de Level Up */}
      <ActionModal
        isOpen={modals.levelUp}
        onClose={() => closeModal('levelUp')}
        title="⬆️ Subir de Nível"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-stone-700 mb-2">
              Subir do nível <strong>{character.level}</strong> para <strong>{character.level + 1}</strong>?
            </p>
            <p className="text-sm text-stone-600">
              Isso irá aumentar HP, pode conceder novas habilidades e restaurar recursos.
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">O que você ganhará:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• HP adicional baseado no dado de vida da classe</li>
              <li>• Possível aumento no bônus de proficiência</li>
              {character.character_class?.is_spellcaster && (
                <li>• Possíveis novos espaços de magia</li>
              )}
              <li>• Novas habilidades de classe (se aplicável)</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleLevelUp}
              className="flex-1"
              loading={levelUpMutation.isLoading}
              disabled={levelUpMutation.isLoading}
            >
              ⬆️ Confirmar Level Up
            </Button>
            <Button 
              variant="outline"
              onClick={() => closeModal('levelUp')}
              disabled={levelUpMutation.isLoading}
            >
              Cancelar
            </Button>
          </div>
        </div>
        
        {levelUpMutation.error && (
          <Alert variant="error" className="mt-4">
            {levelUpMutation.error.message}
          </Alert>
        )}
      </ActionModal>

      {/* Alertas de Sucesso */}
      {damageMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            Dano aplicado com sucesso!
          </Alert>
        </div>
      )}

      {healMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            Personagem curado com sucesso!
          </Alert>
        </div>
      )}

      {restMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            Descanso realizado com sucesso!
          </Alert>
        </div>
      )}

      {levelUpMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            🎉 Nível aumentado com sucesso!
          </Alert>
        </div>
      )}

      {useSpellSlotMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            Espaço de magia usado!
          </Alert>
        </div>
      )}
    </div>
  );
}