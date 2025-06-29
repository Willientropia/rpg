// src/pages/characters/CharacterDetail.jsx - Versão com Sistema de Feitiços CORRIGIDA
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  charactersService  from '../../services/charactersService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
// Imports corrigidos dos componentes de feitiços
import SpellSlots from '../../components/characters/SpellSlots';
import Spellbook from '../../components/characters/Spellbook';
import CastSpellModal from '../../components/characters/CastSpellModal';

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('overview');
  const [spellToCast, setSpellToCast] = useState(null);
  const [showCastModal, setShowCastModal] = useState(false);

  // Buscar dados do personagem
  const { data: character, isLoading: characterLoading, error } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersService.getCharacter(id),
    enabled: !!id,
  });

  // Buscar feitiços do personagem (só se for caster)
  const { data: characterSpells = [], isLoading: spellsLoading } = useQuery({
    queryKey: ['character', id, 'spells'],
    queryFn: () => charactersService.getCharacterSpells(id),
    enabled: !!id && character?.character_class?.is_spellcaster,
  });

  // Mutation para alternar preparação de feitiço
  const togglePreparedMutation = useMutation({
    mutationFn: ({ spell, isPrepared }) => 
      charactersService.toggleSpellPrepared(id, spell.id, isPrepared),
    onSuccess: () => {
      queryClient.invalidateQueries(['character', id, 'spells']);
    },
  });

  // Mutation para descanso
  const restMutation = useMutation({
    mutationFn: (restType) => charactersService.rest(id, restType),
    onSuccess: () => {
      queryClient.invalidateQueries(['character', id]);
    },
  });

  // Mutation para conjurar feitiço
  const castSpellMutation = useMutation({
    mutationFn: (spellData) => charactersService.castSpell(id, spellData),
    onSuccess: () => {
      queryClient.invalidateQueries(['character', id]);
      queryClient.invalidateQueries(['character', id, 'spells']);
    },
  });

  const handleTogglePrepared = (spell) => {
    togglePreparedMutation.mutate({
      spell,
      isPrepared: !spell.is_prepared
    });
  };

  const handleCastSpell = (spell, slotLevel, isRitual) => {
    // Abrir modal de conjuração para feitiços que não são cantrips
    if (spell.spell_level > 0) {
      setSpellToCast(spell);
      setShowCastModal(true);
    } else {
      // Cantrips são conjurados diretamente
      castSpellMutation.mutate({
        spell_slug: spell.spell_slug,
        spell_level: spell.spell_level,
        slot_level: 0,
        is_ritual: false,
      });
    }
  };

  const handleModalCast = (spell, slotLevel, isRitual) => {
    castSpellMutation.mutate({
      spell_slug: spell.spell_slug,
      spell_level: spell.spell_level,
      slot_level: slotLevel,
      is_ritual: isRitual,
    });
  };

  const handleShortRest = () => {
    restMutation.mutate('short');
  };

  const handleLongRest = () => {
    restMutation.mutate('long');
  };

  if (characterLoading) {
    return <LoadingSpinner message="Carregando personagem..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-stone-600 mb-4">
            Não foi possível carregar o personagem.
          </p>
          <Button onClick={() => navigate('/characters')}>
            ← Voltar para Lista
          </Button>
        </Card>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-stone-800 mb-4">
            Personagem não encontrado
          </h2>
          <Button onClick={() => navigate('/characters')}>
            ← Voltar para Lista
          </Button>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📋 Visão Geral', },
    { id: 'combat', label: '⚔️ Combate' },
    ...(character.character_class?.is_spellcaster ? [
      { id: 'spells', label: '📜 Feitiços' }
    ] : []),
    { id: 'equipment', label: '🎒 Equipamentos' },
    { id: 'notes', label: '📝 Anotações' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-amber-400 font-medieval">
              {character.name}
            </h1>
            <p className="text-stone-300 text-xl">
              {character.race?.name} {character.character_class?.name} - Nível {character.level}
            </p>
            {character.background && (
              <p className="text-stone-400">
                {character.background.name}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="secondary"
              onClick={() => navigate('/characters')}
            >
              ← Voltar
            </Button>
            <Button 
              onClick={() => navigate(`/characters/${id}/edit`)}
            >
              ✏️ Editar
            </Button>
            {character.character_class?.is_spellcaster && (
              <Button 
                variant="outline"
                onClick={() => navigate(`/characters/${id}/spells`)}
              >
                📜 Gerenciar Feitiços
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-700">
          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-400 hover:text-stone-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Atributos */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-stone-800 mb-4">
                  📊 Atributos
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {Object.entries(character.ability_scores || {}).map(([ability, score]) => (
                    <div key={ability} className="text-center">
                      <div className="text-xs font-medium text-stone-600 uppercase">
                        {ability}
                      </div>
                      <div className="text-2xl font-bold text-stone-800">
                        {score}
                      </div>
                      <div className="text-sm text-stone-600">
                        {character.ability_modifiers?.[ability] >= 0 ? '+' : ''}
                        {character.ability_modifiers?.[ability]}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Estatísticas de Combate */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-stone-800 mb-4">
                  ⚔️ Combate
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-stone-600">CA</div>
                    <div className="text-xl font-bold text-stone-800">
                      {character.combat_stats?.armor_class || 10}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-stone-600">PV</div>
                    <div className="text-xl font-bold text-stone-800">
                      {character.hit_points_current || 0}/{character.hit_points_max || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-stone-600">Velocidade</div>
                    <div className="text-xl font-bold text-stone-800">
                      {character.combat_stats?.speed || 30} ft
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-stone-600">Prof.</div>
                    <div className="text-xl font-bold text-stone-800">
                      +{character.combat_stats?.proficiency_bonus || 2}
                    </div>
                  </div>
                </div>

                {/* Estatísticas de Magia */}
                {character.character_class?.is_spellcaster && (
                  <div className="mt-6 pt-6 border-t border-stone-200">
                    <h4 className="font-semibold text-stone-800 mb-3">📜 Magia</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-stone-600">CD de Feitiços</div>
                        <div className="text-xl font-bold text-amber-600">
                          {character.combat_stats?.spell_save_dc || 'N/A'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-stone-600">Bônus de Ataque</div>
                        <div className="text-xl font-bold text-amber-600">
                          +{character.combat_stats?.spell_attack_bonus || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-stone-600">Atributo</div>
                        <div className="text-lg font-bold text-amber-600">
                          {character.character_class?.spellcasting_ability?.toUpperCase() || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Espaços de Feitiço */}
              {character.character_class?.is_spellcaster && (
                <SpellSlots character={character} />
              )}

              {/* Proficiências */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-stone-800 mb-4">
                  🎯 Proficiências
                </h3>
                <div className="space-y-3">
                  {character.saving_throw_proficiencies?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-stone-700">Resistências:</h4>
                      <div className="text-sm text-stone-600">
                        {character.saving_throw_proficiencies.join(', ')}
                      </div>
                    </div>
                  )}
                  {character.skill_proficiencies?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-stone-700">Perícias:</h4>
                      <div className="text-sm text-stone-600">
                        {character.skill_proficiencies.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'spells' && character.character_class?.is_spellcaster && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-800">
                  📜 Livro de Feitiços
                </h2>
                <div className="text-sm text-stone-600">
                  {characterSpells.length} feitiços conhecidos
                </div>
              </div>
            </div>

            {spellsLoading ? (
              <LoadingSpinner message="Carregando feitiços..." />
            ) : (
              <Spellbook
                character={character}
                spells={characterSpells}
                onCastSpell={handleCastSpell}
                onTogglePrepared={handleTogglePrepared}
                onShortRest={handleShortRest}
                onLongRest={handleLongRest}
                isResting={restMutation.isLoading}
              />
            )}
          </div>
        )}

        {activeTab === 'combat' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-stone-800 mb-4">
                ⚔️ Ataques
              </h3>
              <div className="text-center py-8 text-stone-600">
                Sistema de ataques será implementado aqui
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-stone-800 mb-4">
                🛡️ Defesas
              </h3>
              <div className="text-center py-8 text-stone-600">
                Resistências e imunidades serão mostradas aqui
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'equipment' && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">
              🎒 Equipamentos
            </h3>
            <div className="text-center py-8 text-stone-600">
              Sistema de equipamentos será implementado aqui
            </div>
          </Card>
        )}

        {activeTab === 'notes' && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">
              📝 Anotações
            </h3>
            <div className="text-center py-8 text-stone-600">
              Sistema de anotações será implementado aqui
            </div>
          </Card>
        )}
      </div>

      {/* Modal de Conjuração */}
      <CastSpellModal
        isOpen={showCastModal}
        onClose={() => {
          setShowCastModal(false);
          setSpellToCast(null);
        }}
        spell={spellToCast}
        character={character}
        onCast={handleModalCast}
      />

      {/* Notificações de sucesso/erro */}
      {castSpellMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-green-800">
              ✨ Feitiço conjurado com sucesso!
            </div>
          </Card>
        </div>
      )}

      {(togglePreparedMutation.error || castSpellMutation.error || restMutation.error) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-red-800">
              ❌ {togglePreparedMutation.error?.message || 
                   castSpellMutation.error?.message || 
                   restMutation.error?.message}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}