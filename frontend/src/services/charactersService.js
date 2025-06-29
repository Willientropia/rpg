// src/services/charactersService.js - Serviço para operações com personagens
import api from './api';

export const charactersService = {
  // Listar personagens do usuário
  async getCharacters() {
    try {
      const response = await api.get('/characters/characters/');
      return response.data.results || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar personagens');
    }
  },

  // Buscar personagem específico
  async getCharacter(id) {
    try {
      const response = await api.get(`/characters/characters/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar personagem');
    }
  },

  // Criar novo personagem
  async createCharacter(characterData) {
    try {
      const response = await api.post('/characters/characters/', characterData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erro ao criar personagem',
      };
    }
  },

  // Atualizar personagem
  async updateCharacter(id, characterData) {
    try {
      const response = await api.put(`/characters/characters/${id}/`, characterData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Erro ao atualizar personagem',
      };
    }
  },

  // Deletar personagem
  async deleteCharacter(id) {
    try {
      await api.delete(`/characters/characters/${id}/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao deletar personagem',
      };
    }
  },

  // Actions de personagem
  async levelUp(id) {
    try {
      const response = await api.post(`/characters/characters/${id}/level_up/`, {
        confirm: true,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao subir nível',
      };
    }
  },

  async rest(id, restType = 'long') {
    try {
      const response = await api.post(`/characters/characters/${id}/rest/`, {
        rest_type: restType,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao descansar',
      };
    }
  },

  async takeDamage(id, damage, damageType = '') {
    try {
      const response = await api.post(`/characters/characters/${id}/take_damage/`, {
        damage,
        damage_type: damageType,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao aplicar dano',
      };
    }
  },

  async heal(id, healing) {
    try {
      const response = await api.post(`/characters/characters/${id}/heal/`, {
        healing,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao curar',
      };
    }
  },

  // Feitiços
  async getCharacterSpells(id) {
    try {
      const response = await api.get(`/characters/characters/${id}/spells/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar feitiços');
    }
  },

  async addSpell(id, spellData) {
    try {
      const response = await api.post(`/characters/characters/${id}/add_spell/`, spellData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao adicionar feitiço',
      };
    }
  },

  async removeSpell(id, spellSlug) {
    try {
      await api.delete(`/characters/characters/${id}/remove_spell/`, {
        data: { spell_slug: spellSlug },
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao remover feitiço',
      };
    }
  },

  // Buscar dados para criação de personagem
  async getCreationData() {
    try {
      const response = await api.get('/characters/creation-data/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados de criação');
    }
  },

  // Validar criação de personagem
  async validateCreation(characterData) {
    try {
      const response = await api.post('/characters/validate-creation/', characterData);
      return { success: true, data: response.data };
    } catch (error) {
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
      const params = new URLSearchParams({
        q: query,
        limit: filters.limit || 20,
        ...filters,
      });

      const response = await api.get(`/characters/spells/search/?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar feitiços');
    }
  },

  // Buscar detalhes de um feitiço
  async getSpellDetails(slug) {
    try {
      const response = await api.get(`/characters/spells/detail/?slug=${slug}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes do feitiço');
    }
  },

  // Buscar feitiços por classe
  async getSpellsForClass(className, level = '') {
    try {
      const params = new URLSearchParams({
        class: className,
        ...(level && { level }),
      });

      const response = await api.get(`/characters/spells/for_class/?${params}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar feitiços da classe');
    }
  },
};

// Serviço para raças, classes e backgrounds
export const gameDataService = {
  // Raças
  async getRaces() {
    try {
      const response = await api.get('/characters/races/');
      return response.data.results || response.data;
    } catch (error) {
      throw new Error('Erro ao buscar raças');
    }
  },

  // Classes
  async getClasses() {
    try {
      const response = await api.get('/characters/classes/');
      return response.data.results || response.data;
    } catch (error) {
      throw new Error('Erro ao buscar classes');
    }
  },

  // Progressão de classe
  async getClassProgression(classId) {
    try {
      const response = await api.get(`/characters/classes/${classId}/level_progression/`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar progressão da classe');
    }
  },

  // Backgrounds
  async getBackgrounds() {
    try {
      const response = await api.get('/characters/backgrounds/');
      return response.data.results || response.data;
    } catch (error) {
      throw new Error('Erro ao buscar backgrounds');
    }
  },
};