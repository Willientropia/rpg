// src/components/characters/Spellbook.jsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import  spellsService  from '../../services/spellsService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const SpellCard = ({ spell, onCast, onTogglePrepared, canTogglePrepared, character }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: spellDetails, isLoading } = useQuery({
    queryKey: ['spell', 'detail', spell.spell_slug],
    queryFn: () => spellsService.getSpellDetails(spell.spell_slug),
    enabled: showDetails,
  });

  const isCantrip = spell.spell_level === 0;
  const levelText = isCantrip ? 'Cantrip' : `${spell.spell_level}º nível`;
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-stone-800">{spell.spell_name}</h4>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isCantrip 
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {levelText}
            </span>
            {spell.is_prepared && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Preparado
              </span>
            )}
            {spell.ritual && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                Ritual
              </span>
            )}
            {spell.concentration && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                Concentração
              </span>
            )}
          </div>
          
          {spell.spell_details && (
            <div className="text-sm text-stone-600 space-y-1">
              <div>
                <strong>Tempo:</strong> {spell.spell_details.casting_time} • 
                <strong> Alcance:</strong> {spell.spell_details.range}
              </div>
              <div>
                <strong>Componentes:</strong> {spell.spell_details.components} • 
                <strong> Duração:</strong> {spell.spell_details.duration}
              </div>
              {spell.spell_details.school && (
                <div>
                  <strong>Escola:</strong> {spell.spell_details.school}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          {canTogglePrepared && (
            <Button
              size="sm"
              variant={spell.is_prepared ? "secondary" : "primary"}
              onClick={() => onTogglePrepared(spell)}
              title={spell.is_prepared ? 'Remover da preparação' : 'Preparar feitiço'}
            >
              {spell.is_prepared ? '○' : '●'}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '👁️‍🗨️' : '👁️'}
          </Button>
          
          {(spell.is_prepared || isCantrip) && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onCast(spell)}
              disabled={!isCantrip && spell.spell_level > 0 && !character.spell_slots_current?.[spell.spell_level]}
              title={isCantrip ? 'Conjurar cantrip' : `Conjurar usando espaço nível ${spell.spell_level}`}
            >
              ⚡
            </Button>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-stone-200">
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : spellDetails ? (
            <div className="space-y-3">
              {spellDetails.description && (
                <div>
                  <h5 className="font-semibold text-stone-700 mb-1">Descrição:</h5>
                  <div 
                    className="text-sm text-stone-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: spellDetails.description.replace(/\n/g, '<br>') 
                    }}
                  />
                </div>
              )}

              {spellDetails.higher_level && (
                <div>
                  <h5 className="font-semibold text-stone-700 mb-1">Em Níveis Superiores:</h5>
                  <p className="text-sm text-stone-600">{spellDetails.higher_level}</p>
                </div>
              )}

              {spellDetails.material && (
                <div>
                  <h5 className="font-semibold text-stone-700 mb-1">Componente Material:</h5>
                  <p className="text-sm text-stone-600">{spellDetails.material}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-stone-500">
              Não foi possível carregar os detalhes do feitiço.
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const SpellLevelSection = ({ level, spells, character, onCast, onTogglePrepared, canTogglePrepared }) => {
  const levelTitle = level === 0 ? 'Cantrips' : `${level}º Nível`;
  const prepared = spells.filter(s => s.is_prepared).length;
  const total = spells.length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-stone-800">
          {levelTitle} ({total})
        </h3>
        {level > 0 && (
          <div className="flex items-center space-x-4 text-sm text-stone-600">
            <span>Preparados: {prepared}/{total}</span>
            {character.spell_slots_current?.[level] !== undefined && (
              <span>
                Espaços: {character.spell_slots_current[level]}/{character.spell_slots_max?.[level] || 0}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="grid gap-3">
        {spells.map(spell => (
          <SpellCard
            key={spell.id}
            spell={spell}
            character={character}
            onCast={onCast}
            onTogglePrepared={onTogglePrepared}
            canTogglePrepared={canTogglePrepared}
          />
        ))}
      </div>
    </div>
  );
};

const QuickActions = ({ character, onShortRest, onLongRest, isResting }) => {
  const isWarlock = character?.character_class?.spell_slots_type === 'warlock';
  
  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <h3 className="font-semibold text-amber-800 mb-3">⚡ Ações Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={onShortRest}
          disabled={isResting}
          loading={isResting}
          className="text-sm"
        >
          🌙 Descanso Curto
          {isWarlock && (
            <span className="block text-xs opacity-75">
              Recupera espaços
            </span>
          )}
        </Button>
        
        <Button
          variant="primary"
          onClick={onLongRest}
          disabled={isResting}
          loading={isResting}
          className="text-sm"
        >
          🛌 Descanso Longo
          <span className="block text-xs opacity-75">
            Recupera tudo
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default function Spellbook({ 
  character, 
  spells = [], 
  onCastSpell, 
  onTogglePrepared,
  onShortRest,
  onLongRest,
  isResting = false,
  className = '' 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterPrepared, setFilterPrepared] = useState('all');

  // Determinar se a classe pode preparar feitiços
  const canTogglePrepared = useMemo(() => {
    const preparingClasses = ['wizard', 'cleric', 'druid', 'paladin'];
    return preparingClasses.includes(character?.character_class?.name?.toLowerCase() || '');
  }, [character]);

  // Filtrar feitiços
  const filteredSpells = useMemo(() => {
    let filtered = spells;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(spell => 
        spell.spell_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por nível
    if (filterLevel !== 'all') {
      const level = filterLevel === 'cantrips' ? 0 : parseInt(filterLevel);
      filtered = filtered.filter(spell => spell.spell_level === level);
    }

    // Filtro por preparação
    if (filterPrepared === 'prepared') {
      filtered = filtered.filter(spell => spell.is_prepared);
    } else if (filterPrepared === 'unprepared') {
      filtered = filtered.filter(spell => !spell.is_prepared && spell.spell_level > 0);
    }

    return filtered;
  }, [spells, searchQuery, filterLevel, filterPrepared]);

  // Agrupar feitiços por nível
  const spellsByLevel = useMemo(() => {
    const grouped = {};
    filteredSpells.forEach(spell => {
      const level = spell.spell_level;
      if (!grouped[level]) {
        grouped[level] = [];
      }
      grouped[level].push(spell);
    });

    // Ordenar cada grupo alfabeticamente
    Object.keys(grouped).forEach(level => {
      grouped[level].sort((a, b) => a.spell_name.localeCompare(b.spell_name));
    });

    return grouped;
  }, [filteredSpells]);

  const levelOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (!character?.character_class?.is_spellcaster) {
    return null;
  }

  return (
    <div className={className}>
      {/* Filtros */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar feitiços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border-2 border-stone-300 rounded-md focus:border-amber-400"
          >
            <option value="all">Todos os níveis</option>
            <option value="cantrips">Cantrips</option>
            {[1,2,3,4,5,6,7,8,9].map(level => (
              <option key={level} value={level}>{level}º nível</option>
            ))}
          </select>

          {canTogglePrepared && (
            <select
              value={filterPrepared}
              onChange={(e) => setFilterPrepared(e.target.value)}
              className="px-3 py-2 border-2 border-stone-300 rounded-md focus:border-amber-400"
            >
              <option value="all">Todos</option>
              <option value="prepared">Preparados</option>
              <option value="unprepared">Não preparados</option>
            </select>
          )}
        </div>
      </Card>

      {/* Ações rápidas */}
      <div className="mb-6">
        <QuickActions
          character={character}
          onShortRest={onShortRest}
          onLongRest={onLongRest}
          isResting={isResting}
        />
      </div>

      {/* Lista de feitiços */}
      <div>
        {levelOrder.map(level => {
          const levelSpells = spellsByLevel[level];
          if (!levelSpells || levelSpells.length === 0) return null;

          return (
            <SpellLevelSection
              key={level}
              level={level}
              spells={levelSpells}
              character={character}
              onCast={onCastSpell}
              onTogglePrepared={onTogglePrepared}
              canTogglePrepared={canTogglePrepared && level > 0}
            />
          );
        })}

        {Object.keys(spellsByLevel).length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">
              Nenhum feitiço encontrado
            </h3>
            <p className="text-stone-600">
              {searchQuery || filterLevel !== 'all' || filterPrepared !== 'all'
                ? 'Tente ajustar os filtros para ver mais feitiços.'
                : 'Este personagem ainda não possui feitiços conhecidos.'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}