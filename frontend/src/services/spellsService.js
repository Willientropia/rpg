// frontend/src/services/spellsService.js

import api from './api';

const spellsService = {
  /**
   * Busca feitiços com base em um conjunto de filtros.
   * @param {object} filters - Ex: { search, level, school, classes, ritual, concentration }
   * @returns {Promise}
   */
  async searchSpells(filters = {}) {
    try {
      const params = new URLSearchParams();
      // Adiciona apenas os filtros que não são nulos ou indefinidos
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/spells/search/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feitiços:', error);
      throw error;
    }
  },

  /**
   * Busca detalhes de um feitiço específico pelo seu slug.
   * @param {string} spellSlug 
   * @returns {Promise}
   */
  async getSpellDetails(spellSlug) {
    try {
      const response = await api.get(`/spells/detail/?slug=${spellSlug}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do feitiço:', error);
      throw error;
    }
  },

  /**
   * Busca a lista de escolas de magia.
   * @returns {Promise}
   */
  async getSchools() {
    try {
      const response = await api.get('/spells/schools/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar escolas de magia:', error);
      // Retorna um fallback caso a API falhe
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

  /**
   * Busca feitiços disponíveis para uma classe e nível específicos.
   * @param {string} className 
   * @param {string|number} level 
   * @returns {Promise}
   */
  async getSpellsForClass(className, level = '') {
    try {
      const params = new URLSearchParams({ class: className.toLowerCase() });
      if (level && level !== 'all') {
        params.append('level', level);
      }
      const response = await api.get(`/spells/for_class/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar feitiços para classe:', error);
      throw error;
    }
  },
};

export default spellsService;