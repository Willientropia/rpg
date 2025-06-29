// frontend/src/services/charactersService.js

import api from './api';

const charactersService = {
  // --- GERENCIAMENTO BÁSICO DE PERSONAGEM ---
  getCharacters: () => api.get('/characters/'),
  getCharacterDetails: (characterId) => api.get(`/characters/${characterId}/`),
  createCharacter: (characterData) => api.post('/characters/', characterData),
  updateCharacter: (characterId, characterData) => api.put(`/characters/${characterId}/`, characterData),
  deleteCharacter: (characterId) => api.delete(`/characters/${characterId}/`),

  // --- AÇÕES DE COMBATE E RECURSOS ---
  levelUp: (characterId, payload) => api.post(`/characters/${characterId}/level_up/`, payload),
  takeDamage: (characterId, amount) => api.post(`/characters/${characterId}/take_damage/`, { amount }),
  heal: (characterId, amount) => api.post(`/characters/${characterId}/heal/`, { amount }),
  
  /**
   * Inicia um descanso para o personagem (curto ou longo).
   * @param {string} characterId 
   * @param {string} restType - 'short' ou 'long'
   * @returns {Promise}
   */
  rest: (characterId, restType = 'long') => api.post(`/characters/${characterId}/rest/`, { rest_type: restType }),
  
  // --- AÇÕES DE FEITIÇOS DO PERSONAGEM ---
  
  /**
   * Busca os feitiços que um personagem conhece ou tem em seu grimório.
   * @param {string} characterId 
   * @returns {Promise}
   */
  getCharacterSpells: (characterId) => api.get(`/characters/${characterId}/spells/`),

  /**
   * Busca as estatísticas de conjuração do personagem (CD, bônus de ataque, etc.).
   * @param {string} characterId 
   * @returns {Promise}
   */
  getSpellcastingStats: (characterId) => api.get(`/characters/${characterId}/spellcasting_stats/`),

  /**
   * Adiciona um feitiço ao personagem (aprender ou adicionar ao grimório).
   * @param {string} characterId 
   * @param {object} spellData - Ex: { spell_slug: 'fireball' }
   * @returns {Promise}
   */
  addSpell: (characterId, spellData) => api.post(`/characters/${characterId}/add_spell/`, spellData),

  /**
   * Remove um feitiço do personagem.
   * @param {string} characterId 
   * @param {string} spellSlug 
   * @returns {Promise}
   */
  removeSpell: (characterId, spellSlug) => api.delete(`/characters/${characterId}/remove_spell/`, { data: { spell_slug: spellSlug } }),

  /**
   * Alterna o estado de preparação de um feitiço.
   * @param {string} characterId 
   * @param {string} spellId 
   * @param {boolean} isPrepared 
   * @returns {Promise}
   */
  toggleSpellPrepared: (characterId, spellId, isPrepared) => api.patch(`/characters/${characterId}/spells/${spellId}/toggle_prepared/`, { is_prepared: isPrepared }),
  
  /**
   * Usa um espaço de feitiço para conjuração.
   * @param {string} characterId 
   * @param {number} level - O nível do espaço de feitiço a ser gasto.
   * @returns {Promise}
   */
  useSpellSlot: (characterId, level) => api.post(`/characters/${characterId}/use_spell_slot/`, { spell_level: level }),

  /**
   * Conjura um feitiço (lógica combinada de gastar espaço e registrar o uso).
   * @param {string} characterId
   * @param {string} spellId
   * @param {number} level
   * @returns {Promise}
   */
  castSpell: (characterId, spellId, level) => api.post(`/characters/${characterId}/spells/cast/`, { spell_id: spellId, level: level }),
};

export default charactersService;