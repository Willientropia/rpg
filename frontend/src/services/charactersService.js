// src/services/charactersService.js - ACTIONS FUNCIONAIS CORRIGIDAS
import api from './api';

export const charactersService = {
  // Listar personagens do usuário
  async getCharacters() {
    try {
      console.log('📋 Buscando lista de personagens...');
      const response = await api.get('/characters/characters/');
      const characters = response.data.results || response.data;
      console.log('✅ Personagens encontrados:', characters.length);
      return characters;
    } catch (error) {
      console.error('❌ Erro ao buscar personagens:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar personagens');
    }
  },

  // Buscar personagem específico
  async getCharacter(id) {
    try {
      console.log('👤 Buscando personagem ID:', id);
      
      if (!id || id === 'undefined' || id === 'null') {
        throw new Error('ID do personagem inválido');
      }
      
      const response = await api.get(`/characters/characters/${id}/`);
      console.log('✅ Personagem encontrado:', response.data.name);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar personagem:', error);
      console.error('🔍 ID usado:', id);
      throw new Error(error.response?.data?.message || 'Erro ao buscar personagem');
    }
  },

  // Criar novo personagem
  async createCharacter(characterData) {
    try {
      console.log('⚔️ Criando personagem...', characterData);
      
      const response = await api.post('/characters/characters/', characterData);
      console.log('✅ Resposta da criação:', response.data);
      
      if (response.data && response.data.id) {
        return { 
          success: true, 
          data: response.data 
        };
      } else {
        console.error('❌ Resposta inesperada:', response.data);
        return {
          success: false,
          error: 'Resposta inválida do servidor',
        };
      }
    } catch (error) {
      console.error('❌ Erro ao criar personagem:', error);
      console.error('📨 Response data:', error.response?.data);
      
      return {
        success: false,
        error: error.response?.data || 'Erro ao criar personagem',
      };
    }
  },

  // Atualizar personagem
  async updateCharacter(id, characterData) {
    try {
      console.log('📝 Atualizando personagem ID:', id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      const response = await api.put(`/characters/characters/${id}/`, characterData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erro ao atualizar personagem:', error);
      return {
        success: false,
        error: error.response?.data || 'Erro ao atualizar personagem',
      };
    }
  },

  // Deletar personagem
  async deleteCharacter(id) {
    try {
      console.log('🗑️ Deletando personagem ID:', id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      await api.delete(`/characters/characters/${id}/`);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao deletar personagem:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao deletar personagem',
      };
    }
  },

  // ========================================
  // ACTIONS DE PERSONAGEM - FUNCIONAIS
  // ========================================

  // Level Up
  async levelUp(id) {
    try {
      console.log('⬆️ Subindo nível do personagem ID:', id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      const response = await api.post(`/characters/characters/${id}/level_up/`, {
        confirm: true,
      });
      
      console.log('✅ Level up bem-sucedido:', response.data);
      
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || 'Nível aumentado com sucesso!'
      };
    } catch (error) {
      console.error('❌ Erro ao subir nível:', error);
      
      let errorMessage = 'Erro ao subir nível';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Descansos
  async rest(id, restType = 'long') {
    try {
      console.log(`😴 ${restType} rest para personagem ID:`, id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      const response = await api.post(`/characters/characters/${id}/rest/`, {
        rest_type: restType,
      });
      
      console.log('✅ Descanso bem-sucedido:', response.data);
      
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || `${restType === 'long' ? 'Descanso longo' : 'Descanso curto'} realizado com sucesso!`
      };
    } catch (error) {
      console.error('❌ Erro ao descansar:', error);
      
      let errorMessage = 'Erro ao descansar';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Aplicar Dano
  async takeDamage(id, damage, damageType = '') {
    try {
      console.log(`💥 Aplicando ${damage} de dano (${damageType || 'genérico'}) ao personagem ID:`, id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      if (!damage || damage <= 0) {
        throw new Error('Quantidade de dano deve ser maior que zero');
      }
      
      const response = await api.post(`/characters/characters/${id}/take_damage/`, {
        damage: parseInt(damage),
        damage_type: damageType,
      });
      
      console.log('✅ Dano aplicado com sucesso:', response.data);
      
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || `${damage} de dano aplicado!`
      };
    } catch (error) {
      console.error('❌ Erro ao aplicar dano:', error);
      
      let errorMessage = 'Erro ao aplicar dano';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Curar
  async heal(id, healing) {
    try {
      console.log(`💚 Curando ${healing} HP do personagem ID:`, id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      if (!healing || healing <= 0) {
        throw new Error('Quantidade de cura deve ser maior que zero');
      }
      
      const response = await api.post(`/characters/characters/${id}/heal/`, {
        healing: parseInt(healing),
      });
      
      console.log('✅ Cura aplicada com sucesso:', response.data);
      
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || `${healing} HP curado!`
      };
    } catch (error) {
      console.error('❌ Erro ao curar:', error);
      
      let errorMessage = 'Erro ao curar';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Usar Spell Slot
  async useSpellSlot(id, spellLevel) {
    try {
      console.log(`✨ Usando spell slot nível ${spellLevel} do personagem ID:`, id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      if (!spellLevel || spellLevel < 1 || spellLevel > 9) {
        throw new Error('Nível de feitiço deve estar entre 1 e 9');
      }
      
      const response = await api.post(`/characters/characters/${id}/use_spell_slot/`, {
        spell_level: parseInt(spellLevel),
      });
      
      console.log('✅ Spell slot usado com sucesso:', response.data);
      
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || `Espaço de magia nível ${spellLevel} usado!`
      };
    } catch (error) {
      console.error('❌ Erro ao usar spell slot:', error);
      
      let errorMessage = 'Erro ao usar espaço de magia';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // ========================================
  // FEITIÇOS
  // ========================================

  // Buscar feitiços do personagem
  async getCharacterSpells(id) {
    try {
      console.log('📜 Buscando feitiços do personagem ID:', id);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      const response = await api.get(`/characters/characters/${id}/spells/`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar feitiços:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar feitiços');
    }
  },

  // Adicionar feitiço
  async addSpell(id, spellData) {
    try {
      console.log('➕ Adicionando feitiço ao personagem ID:', id, spellData);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      const response = await api.post(`/characters/characters/${id}/add_spell/`, spellData);
      
      return { 
        success: true, 
        data: response.data,
        message: response.data.message || 'Feitiço adicionado com sucesso!'
      };
    } catch (error) {
      console.error('❌ Erro ao adicionar feitiço:', error);
      
      let errorMessage = 'Erro ao adicionar feitiço';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Remover feitiço
  async removeSpell(id, spellSlug) {
    try {
      console.log('➖ Removendo feitiço do personagem ID:', id, 'Spell:', spellSlug);
      
      if (!id || id === 'undefined') {
        throw new Error('ID do personagem inválido');
      }
      
      await api.delete(`/characters/characters/${id}/remove_spell/`, {
        data: { spell_slug: spellSlug },
      });
      
      return { 
        success: true,
        message: 'Feitiço removido com sucesso!'
      };
    } catch (error) {
      console.error('❌ Erro ao remover feitiço:', error);
      
      let errorMessage = 'Erro ao remover feitiço';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // ========================================
  // UTILITÁRIOS
  // ========================================

  // Buscar dados para criação de personagem
  async getCreationData() {
    try {
      console.log('🎲 Buscando dados para criação de personagem...');
      const response = await api.get('/characters/creation-data/');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar dados de criação:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados de criação');
    }
  },

  // Validar criação de personagem
  async validateCreation(characterData) {
    try {
      console.log('✅ Validando criação de personagem...');
      const response = await api.post('/characters/validate-creation/', characterData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      return {
        success: false,
        error: error.response?.data || 'Erro na validação',
      };
    }
  },
};

// Serviço para feitiços
export const spellsService = {
  // Buscar feitiços
  async searchSpells(query = '', filters = {}) {
    try {
      console.log('🔍 Buscando feitiços:', query, filters);
      
      const params = new URLSearchParams({
        q: query,
        limit: filters.limit || 20,
        ...filters,
      });

      const response = await api.get(`/characters/spells/search/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar feitiços:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar feitiços');
    }
  },

  // Buscar detalhes de um feitiço
  async getSpellDetails(slug) {
    try {
      console.log('📖 Buscando detalhes do feitiço:', slug);
      
      const response = await api.get(`/characters/spells/detail/?slug=${slug}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes do feitiço:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes do feitiço');
    }
  },

  // Buscar feitiços por classe
  async getSpellsForClass(className, level = '') {
    try {
      console.log('🎓 Buscando feitiços para classe:', className, 'nível:', level);
      
      const params = new URLSearchParams({
        class: className,
        ...(level && { level }),
      });

      const response = await api.get(`/characters/spells/for_class/?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar feitiços da classe:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar feitiços da classe');
    }
  },
};

// Serviço para raças, classes e backgrounds
export const gameDataService = {
  // Raças
  async getRaces() {
    try {
      console.log('🏰 Buscando raças...');
      const response = await api.get('/characters/races/');
      const races = response.data.results || response.data;
      console.log('✅ Raças encontradas:', races.length);
      return races;
    } catch (error) {
      console.error('❌ Erro ao buscar raças:', error);
      throw new Error('Erro ao buscar raças');
    }
  },

  // Classes
  async getClasses() {
    try {
      console.log('⚔️ Buscando classes...');
      const response = await api.get('/characters/classes/');
      const classes = response.data.results || response.data;
      console.log('✅ Classes encontradas:', classes.length);
      return classes;
    } catch (error) {
      console.error('❌ Erro ao buscar classes:', error);
      throw new Error('Erro ao buscar classes');
    }
  },

  // Progressão de classe
  async getClassProgression(classId) {
    try {
      console.log('📈 Buscando progressão da classe ID:', classId);
      
      if (!classId || classId === 'undefined') {
        throw new Error('ID da classe inválido');
      }
      
      const response = await api.get(`/characters/classes/${classId}/level_progression/`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar progressão da classe:', error);
      throw new Error('Erro ao buscar progressão da classe');
    }
  },

  // Backgrounds
  async getBackgrounds() {
    try {
      console.log('📚 Buscando backgrounds...');
      const response = await api.get('/characters/backgrounds/');
      const backgrounds = response.data.results || response.data;
      console.log('✅ Backgrounds encontrados:', backgrounds.length);
      return backgrounds;
    } catch (error) {
      console.error('❌ Erro ao buscar backgrounds:', error);
      throw new Error('Erro ao buscar backgrounds');
    }
  },
};