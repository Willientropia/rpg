// frontend/src/utils/spellUtils.js

/**
 * Contém a lógica de negócio e as regras de D&D para validações
 * de feitiços no lado do cliente (frontend).
 */
export const spellUtils = {
  // Métodos auxiliares para calcular cantrips e feitiços conhecidos
  getWarlockCantrips(level) {
    if (level >= 10) return 4;
    if (level >= 4) return 3;
    return 2;
  },

  getWarlockSpellsKnown(level) {
    const spellsByLevel = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 13, 13, 14, 15, 15, 15, 15, 15];
    return spellsByLevel[level] || 1;
  },

  getFullCasterCantrips(level) {
    if (level >= 10) return 5;
    if (level >= 4) return 4;
    return 3;
  },

  getFullCasterSpellsKnown(className, level) {
    if (className === 'bard') {
      const spellsByLevel = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 19, 20, 22, 22, 22, 22, 22];
      return spellsByLevel[level] || 4;
    }
    if (className === 'sorcerer') {
        const spellsByLevel = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 14, 14, 15, 15, 15, 15, 15];
        return spellsByLevel[level] || 2;
    }
    // Para Wizard, Cleric, Druid, o número de feitiços conhecidos é diferente (preparação)
    return 'Baseado na tabela da classe';
  },

  getHalfCasterSpellsKnown(className, level) {
    if (className === 'ranger') {
      const spellsByLevel = [0, 0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11];
      return spellsByLevel[level] || 0;
    }
    // Para Paladin, a lógica é de preparação, não de "conhecidos"
    return 'Baseado na tabela da classe';
  },

  getThirdCasterCantrips(level) {
    if (level >= 10) return 4;
    if (level >= 4) return 3;
    if (level >= 3) return 2; // Eldritch Knight e Arcane Trickster ganham cantrips no nível 3
    return 0;
  },

  getThirdCasterSpellsKnown(level) {
    const spellsByLevel = [0, 0, 0, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13];
    return spellsByLevel[level] || 0;
  },
  
  // Função principal para calcular limites de feitiços
  getSpellLimits(characterClass, level, abilityModifiers) {
    const classType = characterClass.spell_slots_type;
    const classNameLower = characterClass.name.toLowerCase();

    switch (classType) {
      case 'warlock':
        return {
          cantrips: this.getWarlockCantrips(level),
          spells: this.getWarlockSpellsKnown(level),
          prepared: 'Todos conhecidos são preparados',
          notes: 'Warlock: Feitiços conhecidos são sempre preparados'
        };
        
      case 'full':
        if (classNameLower === 'wizard') {
          return {
            cantrips: this.getFullCasterCantrips(level),
            spells: 'Ilimitado (no livro de feitiços)',
            prepared: Math.max(1, (abilityModifiers?.intelligence || 0) + level),
            notes: 'Wizard: Prepara feitiços do grimório'
          };
        } else if (['cleric', 'druid'].includes(classNameLower)) {
            return {
                cantrips: this.getFullCasterCantrips(level),
                spells: 'Acesso a todos os feitiços da classe',
                prepared: Math.max(1, (abilityModifiers?.[characterClass.spellcasting_ability] || 0) + level),
                notes: `${characterClass.name}: Prepara feitiços da lista da classe`
            };
        } else { // Bard, Sorcerer
          return {
            cantrips: this.getFullCasterCantrips(level),
            spells: this.getFullCasterSpellsKnown(classNameLower, level),
            prepared: 'Todos conhecidos são preparados',
            notes: 'Feitiços conhecidos são sempre preparados'
          };
        }
        
      case 'half':
        if (classNameLower === 'paladin') {
            return {
                cantrips: 0,
                spells: 'Acesso a todos os feitiços da classe',
                prepared: Math.max(1, (abilityModifiers?.charisma || 0) + Math.floor(level / 2)),
                notes: 'Paladin: Prepara feitiços da lista da classe'
            };
        } else { // Ranger
            return {
                cantrips: 0,
                spells: this.getHalfCasterSpellsKnown(classNameLower, level),
                prepared: 'Todos conhecidos são preparados',
                notes: 'Ranger: Feitiços conhecidos são sempre preparados'
            };
        }
        
      case 'third':
        return {
          cantrips: this.getThirdCasterCantrips(level),
          spells: this.getThirdCasterSpellsKnown(level),
          prepared: 'Todos conhecidos são preparados',
          notes: 'Feitiços conhecidos são sempre preparados'
        };
        
      default:
        return {
          cantrips: 0,
          spells: 0,
          prepared: 0,
          notes: 'Esta classe não conjura feitiços'
        };
    }
  },

  // Funções de validação
  canLearnSpell(character, spell, currentSpells) {
    const limits = this.getSpellLimits(
      character.character_class, 
      character.level, 
      character.ability_modifiers
    );
    
    if (limits.spells === 'Ilimitado (no livro de feitiços)' || limits.spells === 'Acesso a todos os feitiços da classe') {
        return true;
    }

    if (spell.level === 0) {
      const currentCantrips = currentSpells.filter(s => s.spell_level === 0).length;
      return currentCantrips < limits.cantrips;
    }
    
    const currentSpellsKnown = currentSpells.filter(s => s.spell_level > 0).length;
    return currentSpellsKnown < limits.spells;
  },

  canPrepareSpell(character, currentSpells) {
    const limits = this.getSpellLimits(
      character.character_class, 
      character.level, 
      character.ability_modifiers
    );
    
    const nonPreparingClasses = ['sorcerer', 'bard', 'warlock', 'ranger', 'eldritch-knight', 'arcane-trickster'];
    if (nonPreparingClasses.includes(character.character_class.name.toLowerCase())) {
      return false; // Essas classes não preparam, apenas conhecem.
    }
    
    const currentPrepared = currentSpells.filter(s => s.is_prepared && s.spell_level > 0).length;
    return currentPrepared < limits.prepared;
  }
};