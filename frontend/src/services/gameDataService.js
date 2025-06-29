// frontend/src/services/gameDataService.js

import api from './api';

/**
 * Serviço para buscar dados estáticos do jogo, como raças, classes e antecedentes.
 * Centraliza as chamadas de API para os dados essenciais de criação de personagem.
 */
const gameDataService = {
  /**
   * Busca a lista de todas as raças disponíveis.
   * @returns {Promise<Array>} Uma lista de objetos de raça.
   */
  async getRaces() {
    try {
      const response = await api.get('/game-data/races/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar raças:', error);
      throw error;
    }
  },

  /**
   * Busca a lista de todas as classes disponíveis.
   * @returns {Promise<Array>} Uma lista de objetos de classe.
   */
  async getClasses() {
    try {
      const response = await api.get('/game-data/classes/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar classes:', error);
      throw error;
    }
  },

  /**
   * Busca a lista de todos os antecedentes (backgrounds) disponíveis.
   * @returns {Promise<Array>} Uma lista de objetos de antecedente.
   */
  async getBackgrounds() {
    try {
      const response = await api.get('/game-data/backgrounds/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar antecedentes:', error);
      throw error;
    }
  },
};

export default gameDataService;