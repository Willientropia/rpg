// src/pages/characters/SpellManagement.jsx - Sistema Completo de Feitiços
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { charactersService, spellsService } from '../../services/charactersService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Componente para Modal de Adicionar Feitiço
const AddSpellModal = ({ isOpen, onClose, character, onAddSpell, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [isPrepared, setIsPrepared] = useState(true);

  // Buscar feitiços da API
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['spells', 'search', character.character_class.name, searchQuery, selectedLevel],
    queryFn: () => spellsService.getSpellsForClass(
      character.character_class.name.toLowerCase(),
      selectedLevel === 'all' ? '' : selectedLevel
    ),
    enabled: isOpen && character.character_class.is_spellcaster,
  });

  if (!isOpen) return null;

  const handleAddSpell = () => {
    if (selectedSpell) {
      onAddSpell({
        spell_slug: selectedSpell.slug,
        spell_name: selectedSpell.name,
        spell_level: selectedSpell.level,
        is_prepared: isPrepared,
        is_known: true,
      });
      setSelectedSpell(null);
      setSearchQuery('');
    }
  };

  // Filtrar feitiços por busca
  const filteredSpells = useMemo(() => {
    if (!searchResults?.spells_by_level) return {};
    
    const filtered = {};
    Object.entries(searchResults.spells_by_level).forEach(([level, spells]) => {
      if (searchQuery) {
        filtered[level] = spells.filter(spell => 
          spell.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        filtered[level] = spells;
      }
    });
    
    return filtered;
  }, [searchResults, searchQuery]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-stone-800">
            ➕ Adicionar Feitiços - {character.character_class.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Buscar feitiços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border-2 border-stone-300 rounded-md focus:border-amber-400"
          >
            <option value="all">Todos os níveis</option>
            <option value="0">Cantrips (Nível 0)</option>
            {[1,2,3,4,5,6,7,8,9].map(level => (
              <option key={level} value={level}>Nível {level}</option>
            ))}
          </select>
        </div>

        {/* Lista de Feitiços */}
        <div className="h-96 overflow-y-auto mb-4 border rounded-lg">
          {searchLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="p-4">
              {Object.entries(filteredSpells).map(([level, spells]) => (
                <div key={level} className="mb-6">
                  <h4 className="font-bold text-stone-800 mb-3 sticky top-0 bg-white border-b pb-2">
                    {level === '0' ? 'Cantrips' : `Nível ${level}`} ({spells.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {spells.map(spell => (
                      <div
                        key={spell.slug}
                        onClick={() => setSelectedSpell(spell)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedSpell?.slug === spell.slug
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="font-medium text-stone-800">{spell.name}</div>
                        <div className="text-sm text-stone-600">
                          {spell.school && `${spell.school} • `}
                          {spell.casting_time}
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          {spell.range} • {spell.concentration ? 'Concentração' : 'Sem concentração'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Opções de Preparação */}
        {selectedSpell && (
          <div className="mb-4 p-4 bg-amber-50 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">
              Feitiço Selecionado: {selectedSpell.name}
            </h4>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPrepared}
                  onChange={(e) => setIsPrepared(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-amber-700">
                  {character.character_class.spell_slots_type === 'warlock' ? 'Conhecido' : 'Preparado'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex space-x-2">
          <Button
            onClick={handleAddSpell}
            disabled={!selectedSpell || isLoading}
            loading={isLoading}
            className="flex-1"
          >
            ➕ Adicionar Feitiço
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente para Detalhes do Feitiço
const SpellDetail = ({ spell, onClose }) => {
  const { data: spellDetails, isLoading } = useQuery({
    queryKey: ['spell', 'detail', spell?.spell_slug],
    queryFn: () => spellsService.getSpellDetails(spell.spell_slug),
    enabled: !!spell,
  });

  if (!spell) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-stone-800">{spell.spell_name}</h3>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 text-2xl"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : spellDetails ? (
          <div className="space-y-4">
            {/* Informações Básicas */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-lg">
              <div>
                <span className="font-semibold">Nível:</span> {spell.spell_level === 0 ? 'Cantrip' : spell.spell_level}
              </div>
              <div>
                <span className="font-semibold">Escola:</span> {spellDetails.school || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Tempo:</span> {spellDetails.casting_time || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Alcance:</span> {spellDetails.range || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Componentes:</span> {spellDetails.components || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Duração:</span> {spellDetails.duration || 'N/A'}
              </div>
            </div>

            {/* Descrição */}
            {spellDetails.description && (
              <div>
                <h4 className="font-semibold mb-2">Descrição:</h4>
                <div 
                  className="text-stone-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: spellDetails.description.replace(/\n/g, '<br>') }}
                />
              </div>
            )}

            {/* Em Níveis Superiores */}
            {spellDetails.higher_level && (
              <div>
                <h4 className="font-semibold mb-2">Em Níveis Superiores:</h4>
                <p className="text-stone-700">{spellDetails.higher_level}</p>
              </div>
            )}

            {/* Status no Personagem */}
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Status:</h4>
              <div className="flex space-x-4">
                {spell.is_known && (
                  <span className="text-green-600">✓ Conhecido</span>
                )}
                {spell.is_prepared && (
                  <span className="text-blue-600">✓ Preparado</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-stone-600">
            Não foi possível carregar os detalhes do feitiço.
          </div>
        )}

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente para Limites de Feitiços
const SpellLimitsInfo = ({ character, counts }) => {
  const getSpellLimits = () => {
    const classType = character.character_class.spell_slots_type;
    const level = character.level;
    
    switch (classType) {
      case 'warlock':
        // Warlock conhece feitiços limitados mas sempre preparados
        return {
          cantrips: character.spell_slots_max?.['0'] || 0,
          spells: 15, // Máximo de feitiços conhecidos
          prepared: 'Todos conhecidos são preparados',
          notes: 'Warlock: Feitiços conhecidos são sempre preparados'
        };
        
      case 'full':
        // Wizard prepara, outros conhecem
        if (character.character_class.name === 'Wizard') {
          return {
            cantrips: character.spell_slots_max?.['0'] || 0,
            spells: 'Ilimitado (no livro de feitiços)',
            prepared: `${Math.max(1, character.ability_modifiers?.intelligence || 0) + level}`,
            notes: 'Wizard: Prepara feitiços do livro'
          };
        } else {
          return {
            cantrips: character.spell_slots_max?.['0'] || 0,
            spells: 'Baseado na tabela da classe',
            prepared: 'Todos conhecidos são preparados',
            notes: 'Sorcerer/Bard: Feitiços conhecidos são sempre preparados'
          };
        }
        
      case 'half':
        // Paladin e Ranger
        return {
          cantrips: 0,
          spells: 'Baseado na tabela da classe',
          prepared: character.character_class.name === 'Paladin' 
            ? `${Math.max(1, character.ability_modifiers?.charisma || 0) + Math.floor(level / 2)}`
            : 'Todos conhecidos são preparados',
          notes: character.character_class.name === 'Paladin' 
            ? 'Paladin: Prepara feitiços'
            : 'Ranger: Feitiços conhecidos são sempre preparados'
        };
        
      case 'third':
        // Eldritch Knight e Arcane Trickster
        return {
          cantrips: character.spell_slots_max?.['0'] || 0,
          spells: 'Baseado na tabela da subclasse',
          prepared: 'Todos conhecidos são preparados',
          notes: 'Third Caster: Feitiços conhecidos são sempre preparados'
        };
        
      default:
        return {
          cantrips: 0,
          spells: 0,
          prepared: 0,
          notes: 'Esta classe não usa magia'
        };
    }
  };

  const limits = getSpellLimits();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-stone-800 mb-4 font-medieval">
        📊 Limites de Feitiços
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-stone-50 rounded">
          <span className="font-medium text-stone-700">Cantrips:</span>
          <span className="text-stone-900">
            {counts.cantrips} / {limits.cantrips}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-stone-50 rounded">
          <span className="font-medium text-stone-700">Feitiços Conhecidos:</span>
          <span className="text-stone-900">
            {counts.spells} / {limits.spells}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-stone-50 rounded">
          <span className="font-medium text-stone-700">Preparados:</span>
          <span className="text-stone-900">
            {counts.prepared} / {limits.prepared}
          </span>
        </div>
        
        <div className="text-xs text-stone-600 bg-amber-50 p-3 rounded">
          <strong>Nota:</strong> {limits.notes}
        </div>
      </div>
    </Card>
  );
};

export default function SpellManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [filter, setFilter] = useState('all');

  // Buscar personagem
  const { data: character, isLoading: characterLoading } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersService.getCharacter(id),
    enabled: !!id,
  });

  // Buscar feitiços do personagem
  const { data: characterSpells = [], isLoading: spellsLoading } = useQuery({
    queryKey: ['character', id, 'spells'],
    queryFn: () => charactersService.getCharacterSpells(id),
    enabled: !!id,
  });

  // Mutation para adicionar feitiço
  const addSpellMutation = useMutation({
    mutationFn: (spellData) => charactersService.addSpell(id, spellData),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id, 'spells']);
        queryClient.invalidateQueries(['character', id]);
        setShowAddModal(false);
      }
    },
  });

  // Mutation para remover feitiço
  const removeSpellMutation = useMutation({
    mutationFn: (spellSlug) => charactersService.removeSpell(id, spellSlug),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries(['character', id, 'spells']);
        queryClient.invalidateQueries(['character', id]);
      }
    },
  });

  // Mutation para alternar preparação (futuro)
  const togglePreparedMutation = useMutation({
    mutationFn: ({ spellId, isPrepared }) => {
      // Implementar endpoint para toggle prepared
      console.log('Toggle prepared:', spellId, isPrepared);
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['character', id, 'spells']);
    },
  });

  if (characterLoading) {
    return <LoadingSpinner message="Carregando personagem..." />;
  }

  if (!character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="error">Personagem não encontrado</Alert>
      </div>
    );
  }

  if (!character.character_class?.is_spellcaster) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <h2 className="text-xl font-bold text-stone-800 mb-4">
            Personagem Não-Mágico
          </h2>
          <p className="text-stone-600 mb-4">
            {character.name} é um {character.character_class.name} e não possui acesso a magia.
          </p>
          <Button onClick={() => navigate(`/characters/${id}`)}>
            ← Voltar ao Personagem
          </Button>
        </Card>
      </div>
    );
  }

  // Filtrar feitiços
  const filteredSpells = useMemo(() => {
    let filtered = characterSpells;

    if (filter === 'cantrips') {
      filtered = filtered.filter(spell => spell.spell_level === 0);
    } else if (filter === 'spells') {
      filtered = filtered.filter(spell => spell.spell_level > 0);
    } else if (filter === 'prepared') {
      filtered = filtered.filter(spell => spell.is_prepared);
    } else if (filter !== 'all') {
      const level = parseInt(filter);
      filtered = filtered.filter(spell => spell.spell_level === level);
    }

    return filtered.sort((a, b) => {
      if (a.spell_level !== b.spell_level) {
        return a.spell_level - b.spell_level;
      }
      return a.spell_name.localeCompare(b.spell_name);
    });
  }, [characterSpells, filter]);

  // Contar feitiços por categoria
  const counts = useMemo(() => {
    const cantrips = characterSpells.filter(s => s.spell_level === 0).length;
    const spells = characterSpells.filter(s => s.spell_level > 0).length;
    const prepared = characterSpells.filter(s => s.is_prepared).length;

    return { cantrips, spells, prepared };
  }, [characterSpells]);

  const handleAddSpell = (spellData) => {
    addSpellMutation.mutate(spellData);
  };

  const handleRemoveSpell = (spell) => {
    if (confirm(`Remover ${spell.spell_name}?`)) {
      removeSpellMutation.mutate(spell.spell_slug);
    }
  };

  const handleTogglePrepared = (spell) => {
    // Só permitir toggle se a classe pode preparar feitiços
    const canToggle = ['wizard', 'cleric', 'druid', 'paladin'].includes(
      character.character_class.name.toLowerCase()
    );
    
    if (canToggle) {
      togglePreparedMutation.mutate({
        spellId: spell.id,
        isPrepared: !spell.is_prepared
      });
    }
  };

  const canTogglePrepared = (spell) => {
    // Só pode alternar preparação em classes que preparam feitiços
    const preparingClasses = ['wizard', 'cleric', 'druid', 'paladin'];
    return preparingClasses.includes(character.character_class.name.toLowerCase()) && spell.spell_level > 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-400 font-medieval">
              📜 Grimório de {character.name}
            </h1>
            <p className="text-stone-300 text-lg">
              {character.character_class.name} Nível {character.level}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="secondary"
              onClick={() => navigate(`/characters/${id}`)}
            >
              ← Voltar
            </Button>
            <Button 
              onClick={() => setShowAddModal(true)}
              disabled={addSpellMutation.isLoading}
            >
              ➕ Adicionar Feitiços
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-800">
                {counts.cantrips}
              </div>
              <div className="text-sm text-stone-600">
                Cantrips Conhecidos
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-800">
                {counts.spells}
              </div>
              <div className="text-sm text-stone-600">
                Feitiços Conhecidos
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-800">
                {counts.prepared}
              </div>
              <div className="text-sm text-stone-600">
                Preparados
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {character.combat_stats?.spell_save_dc || 'N/A'}
              </div>
              <div className="text-sm text-stone-600">
                CD de Feitiços
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Lista de Feitiços */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filtros */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todos ({characterSpells.length})
              </Button>
              <Button
                variant={filter === 'cantrips' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('cantrips')}
              >
                Cantrips ({counts.cantrips})
              </Button>
              <Button
                variant={filter === 'spells' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('spells')}
              >
                Feitiços ({counts.spells})
              </Button>
              <Button
                variant={filter === 'prepared' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('prepared')}
              >
                Preparados ({counts.prepared})
              </Button>
              
              {/* Filtros por nível */}
              <div className="border-l border-stone-300 ml-2 pl-2 flex gap-2">
                {[1,2,3,4,5,6,7,8,9].map(level => {
                  const count = characterSpells.filter(s => s.spell_level === level).length;
                  if (count === 0) return null;
                  
                  return (
                    <Button
                      key={level}
                      variant={filter === level.toString() ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(level.toString())}
                    >
                      Nv{level} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Lista de Feitiços */}
          <div className="space-y-4">
            {spellsLoading ? (
              <LoadingSpinner message="Carregando feitiços..." />
            ) : filteredSpells.length > 0 ? (
              filteredSpells.map(spell => (
                <Card key={spell.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedSpell(spell)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-stone-800">
                          {spell.spell_name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          spell.spell_level === 0 
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {spell.spell_level === 0 ? 'Cantrip' : `Nível ${spell.spell_level}`}
                        </span>
                        {spell.is_prepared && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            ✓ {character.character_class.spell_slots_type === 'warlock' ? 'Conhecido' : 'Preparado'}
                          </span>
                        )}
                        {!spell.is_prepared && spell.is_known && canTogglePrepared(spell) && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            ○ Não Preparado
                          </span>
                        )}
                      </div>
                      
                      {spell.spell_details && (
                        <div className="text-sm text-stone-600 space-y-1">
                          <div>
                            <strong>Tempo:</strong> {spell.spell_details.casting_time || 'N/A'} • 
                            <strong> Alcance:</strong> {spell.spell_details.range || 'N/A'}
                          </div>
                          <div>
                            <strong>Componentes:</strong> {spell.spell_details.components || 'N/A'} • 
                            <strong> Duração:</strong> {spell.spell_details.duration || 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {canTogglePrepared(spell) && (
                        <Button
                          size="sm"
                          variant={spell.is_prepared ? "outline" : "primary"}
                          onClick={() => handleTogglePrepared(spell)}
                          loading={togglePreparedMutation.isLoading}
                          disabled={togglePreparedMutation.isLoading}
                        >
                          {spell.is_prepared ? '○' : '●'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSpell(spell)}
                      >
                        👁️ Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemoveSpell(spell)}
                        loading={removeSpellMutation.isLoading}
                        disabled={removeSpellMutation.isLoading}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  {filter === 'all' ? 'Nenhum feitiço conhecido' : 'Nenhum feitiço nesta categoria'}
                </h3>
                <p className="text-stone-600 mb-6">
                  {character.character_class.name}s podem aprender feitiços conforme sobem de nível.
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  ➕ Adicionar Primeiro Feitiço
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar - Informações e Limites */}
        <div className="space-y-6">
          {/* Limites de Feitiços */}
          <SpellLimitsInfo character={character} counts={counts} />

          {/* Informações da Classe */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">
              ℹ️ Informações de Magia
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-stone-700 mb-2">Como Funciona:</h4>
                {character.character_class.spell_slots_type === 'warlock' ? (
                  <ul className="text-stone-600 space-y-1">
                    <li>• <strong>Pact Magic:</strong> Poucos espaços, mas sempre do nível mais alto</li>
                    <li>• <strong>Feitiços Conhecidos:</strong> Limitados, mas sempre preparados</li>
                    <li>• <strong>Recuperação:</strong> Espaços voltam em descanso curto</li>
                    <li>• <strong>Cantrips:</strong> Ilimitados, melhoram com o nível</li>
                  </ul>
                ) : character.character_class.spell_slots_type === 'full' ? (
                  <ul className="text-stone-600 space-y-1">
                    <li>• <strong>Full Caster:</strong> Progressão completa de magia</li>
                    <li>• <strong>Espaços até 9º nível</strong></li>
                    <li>• <strong>Recuperação:</strong> Descanso longo</li>
                    {character.character_class.name === 'Wizard' ? (
                      <li>• <strong>Wizard:</strong> Prepara feitiços do livro</li>
                    ) : (
                      <li>• <strong>Conhecidos:</strong> Sempre preparados</li>
                    )}
                  </ul>
                ) : character.character_class.spell_slots_type === 'half' ? (
                  <ul className="text-stone-600 space-y-1">
                    <li>• <strong>Half Caster:</strong> Progressão reduzida</li>
                    <li>• <strong>Espaços até 5º nível</strong></li>
                    <li>• <strong>Inicia:</strong> Nível 2</li>
                    <li>• <strong>Recuperação:</strong> Descanso longo</li>
                  </ul>
                ) : (
                  <ul className="text-stone-600 space-y-1">
                    <li>• <strong>Third Caster:</strong> Magia limitada</li>
                    <li>• <strong>Espaços até 4º nível</strong></li>
                    <li>• <strong>Inicia:</strong> Nível 3</li>
                    <li>• <strong>Subclasse específica</strong></li>
                  </ul>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-stone-700 mb-2">Estatísticas Atuais:</h4>
                <div className="text-stone-600 space-y-1">
                  <div><strong>CD de Feitiços:</strong> {character.combat_stats?.spell_save_dc}</div>
                  <div><strong>Bônus de Ataque:</strong> +{character.combat_stats?.spell_attack_bonus}</div>
                  <div><strong>Atributo:</strong> {character.character_class.spellcasting_ability?.toUpperCase()} ({character.ability_modifiers?.[character.character_class.spellcasting_ability] >= 0 ? '+' : ''}{character.ability_modifiers?.[character.character_class.spellcasting_ability]})</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AddSpellModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        character={character}
        onAddSpell={handleAddSpell}
        isLoading={addSpellMutation.isLoading}
      />

      <SpellDetail
        spell={selectedSpell}
        onClose={() => setSelectedSpell(null)}
      />

      {/* Alerts de Sucesso/Erro */}
      {addSpellMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            Feitiço adicionado com sucesso!
          </Alert>
        </div>
      )}

      {removeSpellMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="success">
            Feitiço removido com sucesso!
          </Alert>
        </div>
      )}

      {(addSpellMutation.error || removeSpellMutation.error) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="error">
            {addSpellMutation.error?.message || removeSpellMutation.error?.message}
          </Alert>
        </div>
      )}
    </div>
  );
}