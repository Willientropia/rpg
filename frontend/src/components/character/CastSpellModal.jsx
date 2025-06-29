// src/components/characters/CastSpellModal.jsx
import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spellsService } from '../../services/spellsService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const SpellSlotOption = ({ level, available, max, isSelected, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || available === 0}
      className={`p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : available > 0
          ? 'border-stone-300 hover:border-blue-300 bg-white'
          : 'border-stone-200 bg-stone-100 cursor-not-allowed'
      }`}
    >
      <div className="text-center">
        <div className="font-semibold text-stone-800">
          Nível {level}
        </div>
        <div className="text-sm text-stone-600">
          {available}/{max} disponíveis
        </div>
        {available === 0 && (
          <div className="text-xs text-red-600 mt-1">
            Sem espaços
          </div>
        )}
      </div>
    </button>
  );
};

const SpellDescription = ({ spell, castingLevel }) => {
  const isCantrip = spell.spell_level === 0;
  const isUpcast = castingLevel > spell.spell_level;

  return (
    <div className="space-y-4">
      {/* Informações básicas */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 rounded-lg">
        <div>
          <span className="font-semibold">Nível:</span> {isCantrip ? 'Cantrip' : spell.spell_level}
        </div>
        <div>
          <span className="font-semibold">Escola:</span> {spell.spell_details?.school || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Tempo:</span> {spell.spell_details?.casting_time || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Alcance:</span> {spell.spell_details?.range || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Componentes:</span> {spell.spell_details?.components || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Duração:</span> {spell.spell_details?.duration || 'N/A'}
        </div>
      </div>

      {/* Aviso de upcast */}
      {isUpcast && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-amber-600">⬆️</span>
            <span className="font-semibold text-amber-800">
              Conjurando em nível superior ({castingLevel})
            </span>
          </div>
          {spell.spell_details?.higher_level && (
            <div className="text-sm text-amber-700 mt-2">
              <strong>Efeito:</strong> {spell.spell_details.higher_level}
            </div>
          )}
        </div>
      )}

      {/* Concentração */}
      {spell.concentration && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">🎯</span>
            <span className="font-semibold text-red-800">
              Requer Concentração
            </span>
          </div>
          <div className="text-sm text-red-700 mt-1">
            Você deve manter foco para sustentar este feitiço. Sofrer dano pode quebrar a concentração.
          </div>
        </div>
      )}

      {/* Ritual */}
      {spell.ritual && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">🕯️</span>
            <span className="font-semibold text-purple-800">
              Pode ser conjurado como Ritual
            </span>
          </div>
          <div className="text-sm text-purple-700 mt-1">
            +10 minutos de conjuração, mas não consome espaço de feitiço.
          </div>
        </div>
      )}

      {/* Descrição */}
      {spell.spell_details?.description && (
        <div>
          <h4 className="font-semibold text-stone-800 mb-2">Descrição:</h4>
          <div 
            className="text-stone-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: spell.spell_details.description.replace(/\n/g, '<br>') 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function CastSpellModal({ 
  isOpen, 
  onClose, 
  spell, 
  character, 
  onCast 
}) {
  const [selectedSlotLevel, setSelectedSlotLevel] = useState(null);
  const [isRitual, setIsRitual] = useState(false);
  const queryClient = useQueryClient();

  // Mutation para conjurar feitiço
  const castSpellMutation = useMutation({
    mutationFn: ({ spellSlug, slotLevel, asRitual }) => {
      return spellsService.useSpellSlot(character.id, asRitual ? 0 : slotLevel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['character', character.id]);
      if (onCast) {
        onCast(spell, selectedSlotLevel, isRitual);
      }
      onClose();
    },
  });

  // Determinar espaços disponíveis
  const availableSlots = useMemo(() => {
    if (!character?.spell_slots_current || !character?.spell_slots_max) {
      return {};
    }

    const slots = {};
    const minLevel = spell?.spell_level || 1;

    // Para cantrips, não precisa de espaços
    if (minLevel === 0) {
      return {};
    }

    // Verificar espaços do nível do feitiço em diante
    for (let level = minLevel; level <= 9; level++) {
      const current = character.spell_slots_current[level] || 0;
      const max = character.spell_slots_max[level] || 0;
      
      if (max > 0) {
        slots[level] = { current, max };
      }
    }

    return slots;
  }, [character, spell]);

  // Auto-selecionar o menor nível disponível
  React.useEffect(() => {
    if (isOpen && spell && !selectedSlotLevel) {
      const availableLevels = Object.keys(availableSlots)
        .map(Number)
        .filter(level => availableSlots[level].current > 0);
      
      if (availableLevels.length > 0) {
        setSelectedSlotLevel(Math.min(...availableLevels));
      }
    }
  }, [isOpen, spell, availableSlots, selectedSlotLevel]);

  // Reset ao fechar
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedSlotLevel(null);
      setIsRitual(false);
    }
  }, [isOpen]);

  if (!isOpen || !spell) return null;

  const isCantrip = spell.spell_level === 0;
  const canCastAsRitual = spell.ritual && !isCantrip;
  const hasAvailableSlots = Object.values(availableSlots).some(slot => slot.current > 0);
  const canCast = isCantrip || isRitual || (selectedSlotLevel && availableSlots[selectedSlotLevel]?.current > 0);

  const handleCast = () => {
    if (isCantrip) {
      // Cantrips não consomem espaços
      if (onCast) {
        onCast(spell, 0, false);
      }
      onClose();
    } else if (isRitual) {
      // Rituais não consomem espaços
      if (onCast) {
        onCast(spell, 0, true);
      }
      onClose();
    } else if (selectedSlotLevel) {
      castSpellMutation.mutate({
        spellSlug: spell.spell_slug,
        slotLevel: selectedSlotLevel,
        asRitual: false
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-stone-800">
            ⚡ Conjurar {spell.spell_name}
          </h3>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna esquerda - Seleção de espaço */}
          <div>
            {!isCantrip && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-stone-800 mb-4">
                  Escolha o nível de conjuração:
                </h4>

                {/* Opção de ritual */}
                {canCastAsRitual && (
                  <div className="mb-4">
                    <label className="flex items-center p-3 border-2 border-purple-300 rounded-lg bg-purple-50 cursor-pointer">
                      <input
                        type="radio"
                        name="castingOption"
                        checked={isRitual}
                        onChange={() => {
                          setIsRitual(true);
                          setSelectedSlotLevel(null);
                        }}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold text-purple-800">
                          🕯️ Conjurar como Ritual
                        </div>
                        <div className="text-sm text-purple-700">
                          +10 minutos, não consome espaço de feitiço
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Espaços de feitiço */}
                <div className="space-y-3">
                  {Object.entries(availableSlots).map(([level, slot]) => (
                    <SpellSlotOption
                      key={level}
                      level={parseInt(level)}
                      available={slot.current}
                      max={slot.max}
                      isSelected={selectedSlotLevel === parseInt(level) && !isRitual}
                      onClick={() => {
                        setSelectedSlotLevel(parseInt(level));
                        setIsRitual(false);
                      }}
                      disabled={castSpellMutation.isLoading}
                    />
                  ))}
                </div>

                {!hasAvailableSlots && !canCastAsRitual && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">😴</div>
                    <h4 className="text-lg font-semibold text-stone-800 mb-2">
                      Sem espaços disponíveis
                    </h4>
                    <p className="text-stone-600">
                      Você precisa descansar para recuperar espaços de feitiço.
                    </p>
                  </div>
                )}
              </div>
            )}

            {isCantrip && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">
                  ✨ Cantrip
                </h4>
                <p className="text-purple-700">
                  Cantrips podem ser conjurados ilimitadamente e não consomem espaços de feitiço.
                </p>
              </div>
            )}
          </div>

          {/* Coluna direita - Descrição do feitiço */}
          <div>
            <SpellDescription 
              spell={spell} 
              castingLevel={isRitual ? spell.spell_level : (selectedSlotLevel || spell.spell_level)}
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={handleCast}
            disabled={!canCast || castSpellMutation.isLoading}
            loading={castSpellMutation.isLoading}
            className="flex-1"
          >
            ⚡ Conjurar {spell.spell_name}
            {isRitual && ' (Ritual)'}
            {selectedSlotLevel && !isRitual && ` (Nível ${selectedSlotLevel})`}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            disabled={castSpellMutation.isLoading}
          >
            Cancelar
          </Button>
        </div>

        {/* Mensagem de erro */}
        {castSpellMutation.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-700">
              Erro ao conjurar feitiço: {castSpellMutation.error.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}