// src/components/characters/SpellSlots.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import charactersService from '../../services/charactersService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const SpellSlotLevel = ({ level, current, max, onUse, onRecover, isLoading, character }) => {
  const canUse = current > 0;
  const canRecover = current < max;
  
  // Para Warlock, mostrar informação especial
  const isWarlock = character?.character_class?.spell_slots_type === 'warlock';
  
  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < max; i++) {
      slots.push(
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
            i < current
              ? 'bg-blue-500 border-blue-600 shadow-lg'
              : 'bg-gray-200 border-gray-300'
          } ${canUse ? 'hover:bg-blue-400' : ''}`}
          onClick={() => canUse && onUse()}
          title={i < current ? 'Clique para usar' : 'Espaço usado'}
        />
      );
    }
    return slots;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-stone-800 min-w-[80px]">
          {level === 0 ? 'Cantrips' : `Nível ${level}`}
          {isWarlock && level > 0 && ' (Pact)'}
        </span>
        <div className="flex space-x-2">
          {renderSlots()}
        </div>
        <span className="text-sm text-stone-600">
          {current}/{max}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUse()}
          disabled={!canUse || isLoading}
          loading={isLoading}
        >
          Usar
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onRecover()}
          disabled={!canRecover || isLoading}
          loading={isLoading}
        >
          +1
        </Button>
      </div>
    </div>
  );
};

const RestButtons = ({ onShortRest, onLongRest, isLoading, character }) => {
  const isWarlock = character?.character_class?.spell_slots_type === 'warlock';
  
  return (
    <div className="flex space-x-3 mt-4">
      <Button
        variant="secondary"
        onClick={() => onShortRest()}
        disabled={isLoading}
        loading={isLoading}
        className="flex-1"
      >
        🌙 Descanso Curto
        {isWarlock && (
          <span className="block text-xs text-stone-600">
            (Recupera espaços Warlock)
          </span>
        )}
      </Button>
      
      <Button
        variant="primary"
        onClick={() => onLongRest()}
        disabled={isLoading}
        loading={isLoading}
        className="flex-1"
      >
        🛌 Descanso Longo
        <span className="block text-xs">
          (Recupera todos os espaços)
        </span>
      </Button>
    </div>
  );
};

export default function SpellSlots({ character, className = '' }) {
  const queryClient = useQueryClient();
  const [loadingSlot, setLoadingSlot] = useState(null);

  // Mutation para usar espaço de feitiço
  const useSlotMutation = useMutation({
    mutationFn: ({ level }) => charactersService.useSpellSlot(character.id, level),
    onMutate: ({ level }) => {
      setLoadingSlot(level);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['character', character.id]);
    },
    onSettled: () => {
      setLoadingSlot(null);
    },
  });

  // Mutation para recuperar espaços
  const recoverSlotsMutation = useMutation({
    mutationFn: (restType) => charactersService.rest(character.id, restType),
    onSuccess: () => {
      queryClient.invalidateQueries(['character', character.id]);
    },
  });

  // Mutation para recuperar um espaço específico (para testes/ajustes)
  const recoverSingleSlotMutation = useMutation({
    mutationFn: ({ level }) => {
      // Simula recuperar um espaço específico - implementar no backend se necessário
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['character', character.id]);
    },
  });

  if (!character?.character_class?.is_spellcaster) {
    return null;
  }

  const spellSlots = character.spell_slots_current || {};
  const maxSlots = character.spell_slots_max || {};
  const isWarlock = character.character_class.spell_slots_type === 'warlock';

  // Para Warlock, só mostrar os espaços Pact Magic
  const slotsToShow = isWarlock 
    ? Object.entries(maxSlots).filter(([level]) => level !== '0' && maxSlots[level] > 0)
    : Object.entries(maxSlots).filter(([level]) => maxSlots[level] > 0);

  const handleUseSlot = (level) => {
    useSlotMutation.mutate({ level: parseInt(level) });
  };

  const handleRecoverSingleSlot = (level) => {
    // Para implementar: endpoint que adiciona 1 espaço específico
    recoverSingleSlotMutation.mutate({ level: parseInt(level) });
  };

  const handleShortRest = () => {
    recoverSlotsMutation.mutate('short');
  };

  const handleLongRest = () => {
    recoverSlotsMutation.mutate('long');
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-stone-800 font-medieval">
          ⚡ Espaços de Feitiço
        </h3>
        <div className="text-sm text-stone-600">
          {isWarlock ? 'Pact Magic' : 'Spellcasting'}
        </div>
      </div>

      {slotsToShow.length > 0 ? (
        <div className="space-y-3">
          {slotsToShow.map(([level, maxCount]) => (
            <SpellSlotLevel
              key={level}
              level={parseInt(level)}
              current={spellSlots[level] || 0}
              max={maxCount}
              onUse={() => handleUseSlot(level)}
              onRecover={() => handleRecoverSingleSlot(level)}
              isLoading={loadingSlot === parseInt(level)}
              character={character}
            />
          ))}

          <RestButtons
            onShortRest={handleShortRest}
            onLongRest={handleLongRest}
            isLoading={recoverSlotsMutation.isLoading}
            character={character}
          />

          {/* Informações adicionais para Warlock */}
          {isWarlock && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">
                🔮 Pact Magic
              </h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Todos os espaços são do mesmo nível</li>
                <li>• Recupera em descanso curto</li>
                <li>• Poucos espaços, mas mais poderosos</li>
                <li>• Use Mystic Arcanum para feitiços 6º-9º nível</li>
              </ul>
            </div>
          )}

          {/* Informações sobre recuperação */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              💡 Recuperação de Espaços
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Descanso Curto (1 hora):</strong></div>
              <ul className="ml-4 space-y-1">
                <li>• Warlock: Todos os espaços</li>
                <li>• Outras classes: Nenhum espaço (só habilidades específicas)</li>
              </ul>
              <div><strong>Descanso Longo (8 horas):</strong></div>
              <ul className="ml-4 space-y-1">
                <li>• Todas as classes: Todos os espaços</li>
                <li>• Wizard: Arcane Recovery (1x por dia)</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🌟</div>
          <h4 className="text-lg font-semibold text-stone-800 mb-2">
            Nenhum Espaço de Feitiço
          </h4>
          <p className="text-stone-600">
            {character.character_class.name}s neste nível ainda não possuem espaços de feitiço.
            {character.character_class.spell_slots_type === 'half' && character.level < 2 && 
              ' Half-casters começam a conjurar no nível 2.'
            }
            {character.character_class.spell_slots_type === 'third' && character.level < 3 && 
              ' Third-casters começam a conjurar no nível 3.'
            }
          </p>
        </div>
      )}

      {/* Status de carregamento */}
      {(useSlotMutation.isLoading || recoverSlotsMutation.isLoading) && (
        <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded text-center">
          <span className="text-amber-700">Atualizando espaços de feitiço...</span>
        </div>
      )}

      {/* Mensagens de erro */}
      {(useSlotMutation.error || recoverSlotsMutation.error) && (
        <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-center">
          <span className="text-red-700">
            Erro: {useSlotMutation.error?.message || recoverSlotsMutation.error?.message}
          </span>
        </div>
      )}
    </Card>
  );
}