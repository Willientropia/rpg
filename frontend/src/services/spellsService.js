// src/services/spellsService.js
import { api } from './api';

export const spellsService = {
  // Buscar feitiços disponíveis para uma classe
  async getSpellsForClass(className, level = '') {
    try {
      const params = new URLSearchParams();
      if (level && level !== 'all') {
        params.append('level', level);
      }
      
      const url = `/spells/class/${className.toLowerCase()}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feitiços para classe:', error);
      throw error;
    }
  },

  // Buscar detalhes de um feitiço específico
  async getSpellDetails(spellSlug) {
    try {
      const response = await api.get(`/spells/${spellSlug}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do feitiço:', error);
      throw error;
    }
  },

  // Buscar todos os feitiços com filtros
  async searchSpells(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.level !== undefined && filters.level !== 'all') {
        params.append('level', filters.level);
      }
      if (filters.school) {
        params.append('school', filters.school);
      }
      if (filters.classes) {
        params.append('classes', filters.classes);
      }
      if (filters.ritual !== undefined) {
        params.append('ritual', filters.ritual);
      }
      if (filters.concentration !== undefined) {
        params.append('concentration', filters.concentration);
      }
      
      const response = await api.get(`/spells/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feitiços:', error);
      throw error;
    }
  },

  // Buscar escolas de magia
  async getSchools() {
    try {
      const response = await api.get('/spells/schools/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar escolas de magia:', error);
      return [
        { value: 'abjuration', label: 'Abjuração' },
        { value: 'conjuration', label: 'Conjuração' },
        { value: 'divination', label: 'Adivinhação' },
        { value: 'enchantment', label: 'Encantamento' },
        { value: 'evocation', label: 'Evocação' },
        { value: 'illusion', label: 'Ilusão' },
        { value: 'necromancy', label: 'Necromancia' },
        { value: 'transmutation', label: 'Transmutação' },
      ];
    }
  },

  // Adicionar feitiço ao personagem
  async addSpellToCharacter(characterId, spellData) {
    try {
      const response = await api.post(`/characters/${characterId}/spells/`, spellData);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar feitiço ao personagem:', error);
      throw error;
    }
  },

  // Remover feitiço do personagem
  async removeSpellFromCharacter(characterId, spellSlug) {
    try {
      const response = await api.delete(`/characters/${characterId}/spells/${spellSlug}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover feitiço do personagem:', error);
      throw error;
    }
  },

  // Alternar status de preparação de feitiço
  async toggleSpellPrepared(characterId, spellId, isPrepared) {
    try {
      const response = await api.patch(`/characters/${characterId}/spells/${spellId}/`, {
        is_prepared: isPrepared
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar preparação do feitiço:', error);
      throw error;
    }
  },

  // Buscar feitiços do personagem
  async getCharacterSpells(characterId) {
    try {
      const response = await api.get(`/characters/${characterId}/spells/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feitiços do personagem:', error);
      throw error;
    }
  },

  // Usar espaço de feitiço
  async useSpellSlot(characterId, level) {
    try {
      const response = await api.post(`/characters/${characterId}/spell-slots/use/`, {
        level: level
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao usar espaço de feitiço:', error);
      throw error;
    }
  },

  // Recuperar espaços de feitiço (descanso)
  async recoverSpellSlots(characterId, restType = 'long') {
    try {
      const response = await api.post(`/characters/${characterId}/spell-slots/recover/`, {
        rest_type: restType
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao recuperar espaços de feitiço:', error);
      throw error;
    }
  },

  // Buscar estatísticas de magia do personagem
  async getSpellcastingStats(characterId) {
    try {
      const response = await api.get(`/characters/${characterId}/spellcasting-stats/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de magia:', error);
      throw error;
    }
  },

  // Calcular limites de feitiços para uma classe/nível
  getSpellLimits(characterClass, level, abilityModifiers) {
    const classType = characterClass.spell_slots_type;
    
    switch (classType) {
      case 'warlock':
        return {
          cantrips: this.getWarlockCantrips(level),
          spells: this.getWarlockSpellsKnown(level),
          prepared: 'Todos conhecidos são preparados',
          notes: 'Warlock: Feitiços conhecidos são sempre preparados'
        };
        
      case 'full':
        if (characterClass.name.toLowerCase() === 'wizard') {
          return {
            cantrips: this.getFullCasterCantrips(level),
            spells: 'Ilimitado (no livro de feitiços)',
            prepared: Math.max(1, (abilityModifiers?.intelligence || 0) + level),
            notes: 'Wizard: Prepara feitiços do livro'
          };
        } else {
          return {
            cantrips: this.getFullCasterCantrips(level),
            spells: this.getFullCasterSpellsKnown(characterClass.name.toLowerCase(), level),
            prepared: 'Todos conhecidos são preparados',
            notes: 'Sorcerer/Bard: Feitiços conhecidos são sempre preparados'
          };
        }
        
      case 'half':
        return {
          cantrips: 0,
          spells: this.getHalfCasterSpellsKnown(characterClass.name.toLowerCase(), level),
          prepared: characterClass.name.toLowerCase() === 'paladin' 
            ? Math.max(1, (abilityModifiers?.charisma || 0) + Math.floor(level / 2))
            : 'Todos conhecidos são preparados',
          notes: characterClass.name.toLowerCase() === 'paladin' 
            ? 'Paladin: Prepara feitiços'
            : 'Ranger: Feitiços conhecidos são sempre preparados'
        };
        
      case 'third':
        return {
          cantrips: this.getThirdCasterCantrips(level),
          spells: this.getThirdCasterSpellsKnown(level),
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
  },

  // Métodos auxiliares para calcular cantrips e feitiços conhecidos
  getWarlockCantrips(level) {
    if (level >= 10) return 4;
    if (level >= 4) return 3;
    return 2;
  },

  getWarlockSpellsKnown(level) {
    if (level >= 19) return 15;
    if (level >= 17) return 14;
    if (level >= 13) return 12;
    if (level >= 11) return 10;
    if (level >= 9) return 9;
    if (level >= 8) return 8;
    if (level >= 7) return 7;
    if (level >= 6) return 6;
    if (level >= 5) return 5;
    if (level >= 4) return 4;
    if (level >= 3) return 3;
    if (level >= 2) return 2;
    return 1;
  },

  getFullCasterCantrips(level) {
    if (level >= 10) return 4;
    if (level >= 4) return 3;
    return 2;
  },

  getFullCasterSpellsKnown(className, level) {
    if (className === 'bard') {
      if (level >= 18) return 22;
      if (level >= 14) return 18;
      if (level >= 10) return 14;
      if (level >= 9) return 12;
      if (level >= 8) return 11;
      if (level >= 7) return 10;
      if (level >= 6) return 9;
      if (level >= 5) return 8;
      if (level >= 4) return 7;
      if (level >= 3) return 6;
      if (level >= 2) return 5;
      return 4;
    }
    
    if (className === 'sorcerer') {
      if (level >= 17) return 15;
      if (level >= 13) return 13;
      if (level >= 11) return 12;
      if (level >= 9) return 10;
      if (level >= 8) return 9;
      if (level >= 7) return 8;
      if (level >= 6) return 7;
      if (level >= 5) return 6;
      if (level >= 4) return 5;
      if (level >= 3) return 4;
      if (level >= 2) return 3;
      return 2;
    }
    
    return 'Baseado na tabela da classe';
  },

  getHalfCasterSpellsKnown(className, level) {
    if (className === 'ranger') {
      if (level >= 19) return 11;
      if (level >= 17) return 10;
      if (level >= 15) return 9;
      if (level >= 13) return 8;
      if (level >= 11) return 7;
      if (level >= 9) return 6;
      if (level >= 7) return 5;
      if (level >= 5) return 4;
      if (level >= 3) return 3;
      if (level >= 2) return 2;
      return 0;
    }
    
    return 'Baseado na tabela da classe';
  },

  getThirdCasterCantrips(level) {
    if (level >= 10) return 4;
    if (level >= 4) return 3;
    if (level >= 3) return 2;
    return 0;
  },

  getThirdCasterSpellsKnown(level) {
    if (level >= 19) return 4;
    if (level >= 13) return 3;
    if (level >= 7) return 2;
    if (level >= 3) return 1;
    return 0;
  },

  // Validações
  canLearnSpell(character, spell, currentSpells) {
    const limits = this.getSpellLimits(
      character.character_class, 
      character.level, 
      character.ability_modifiers
    );
    
    // Verifica se é cantrip
    if (spell.level === 0) {
      const currentCantrips = currentSpells.filter(s => s.spell_level === 0).length;
      return currentCantrips < limits.cantrips;
    }
    
    // Verifica feitiços conhecidos
    const currentSpellsKnown = currentSpells.filter(s => s.spell_level > 0).length;
    return currentSpellsKnown < (limits.spells === 'Ilimitado (no livro de feitiços)' ? 999 : limits.spells);
  },

  canPrepareSpell(character, spell, currentSpells) {
    const limits = this.getSpellLimits(
      character.character_class, 
      character.level, 
      character.ability_modifiers
    );
    
    // Classes que não preparam feitiços
    const nonPreparingClasses = ['sorcerer', 'bard', 'warlock', 'ranger'];
    if (nonPreparingClasses.includes(character.character_class.name.toLowerCase())) {
      return false;
    }
    
    const currentPrepared = currentSpells.filter(s => s.is_prepared && s.spell_level > 0).length;
    return currentPrepared < limits.prepared;
  }
};

export default spellsService;