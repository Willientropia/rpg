// src/constants/spellConstants.js

export const SPELL_SCHOOLS = {
  ABJURATION: 'abjuration',
  CONJURATION: 'conjuration',
  DIVINATION: 'divination',
  ENCHANTMENT: 'enchantment',
  EVOCATION: 'evocation',
  ILLUSION: 'illusion',
  NECROMANCY: 'necromancy',
  TRANSMUTATION: 'transmutation',
};

export const SPELL_SCHOOL_LABELS = {
  [SPELL_SCHOOLS.ABJURATION]: 'Abjuração',
  [SPELL_SCHOOLS.CONJURATION]: 'Conjuração',
  [SPELL_SCHOOLS.DIVINATION]: 'Adivinhação',
  [SPELL_SCHOOLS.ENCHANTMENT]: 'Encantamento',
  [SPELL_SCHOOLS.EVOCATION]: 'Evocação',
  [SPELL_SCHOOLS.ILLUSION]: 'Ilusão',
  [SPELL_SCHOOLS.NECROMANCY]: 'Necromancia',
  [SPELL_SCHOOLS.TRANSMUTATION]: 'Transmutação',
};

export const SPELL_SCHOOL_COLORS = {
  [SPELL_SCHOOLS.ABJURATION]: 'blue',
  [SPELL_SCHOOLS.CONJURATION]: 'yellow',
  [SPELL_SCHOOLS.DIVINATION]: 'purple',
  [SPELL_SCHOOLS.ENCHANTMENT]: 'pink',
  [SPELL_SCHOOLS.EVOCATION]: 'red',
  [SPELL_SCHOOLS.ILLUSION]: 'indigo',
  [SPELL_SCHOOLS.NECROMANCY]: 'gray',
  [SPELL_SCHOOLS.TRANSMUTATION]: 'green',
};

export const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const SPELL_LEVEL_NAMES = {
  0: 'Cantrip',
  1: '1º Nível',
  2: '2º Nível',
  3: '3º Nível',
  4: '4º Nível',
  5: '5º Nível',
  6: '6º Nível',
  7: '7º Nível',
  8: '8º Nível',
  9: '9º Nível',
};

export const CASTING_TIMES = {
  ACTION: 'action',
  BONUS_ACTION: 'bonus_action',
  REACTION: 'reaction',
  MINUTE: 'minute',
  MINUTES_10: '10_minutes',
  HOUR: 'hour',
  HOURS_8: '8_hours',
  HOURS_12: '12_hours',
  HOURS_24: '24_hours',
};

export const CASTING_TIME_LABELS = {
  [CASTING_TIMES.ACTION]: '1 ação',
  [CASTING_TIMES.BONUS_ACTION]: '1 ação bônus',
  [CASTING_TIMES.REACTION]: '1 reação',
  [CASTING_TIMES.MINUTE]: '1 minuto',
  [CASTING_TIMES.MINUTES_10]: '10 minutos',
  [CASTING_TIMES.HOUR]: '1 hora',
  [CASTING_TIMES.HOURS_8]: '8 horas',
  [CASTING_TIMES.HOURS_12]: '12 horas',
  [CASTING_TIMES.HOURS_24]: '24 horas',
};

export const SPELL_RANGES = {
  SELF: 'self',
  TOUCH: 'touch',
  FEET_5: '5_feet',
  FEET_10: '10_feet',
  FEET_15: '15_feet',
  FEET_30: '30_feet',
  FEET_60: '60_feet',
  FEET_90: '90_feet',
  FEET_120: '120_feet',
  FEET_150: '150_feet',
  FEET_300: '300_feet',
  FEET_500: '500_feet',
  FEET_1000: '1000_feet',
  MILE_1: '1_mile',
  MILES_5: '5_miles',
  UNLIMITED: 'unlimited',
  SIGHT: 'sight',
  SPECIAL: 'special',
};

export const SPELL_RANGE_LABELS = {
  [SPELL_RANGES.SELF]: 'Pessoal',
  [SPELL_RANGES.TOUCH]: 'Toque',
  [SPELL_RANGES.FEET_5]: '1,5 metros',
  [SPELL_RANGES.FEET_10]: '3 metros',
  [SPELL_RANGES.FEET_15]: '4,5 metros',
  [SPELL_RANGES.FEET_30]: '9 metros',
  [SPELL_RANGES.FEET_60]: '18 metros',
  [SPELL_RANGES.FEET_90]: '27 metros',
  [SPELL_RANGES.FEET_120]: '36 metros',
  [SPELL_RANGES.FEET_150]: '45 metros',
  [SPELL_RANGES.FEET_300]: '90 metros',
  [SPELL_RANGES.FEET_500]: '150 metros',
  [SPELL_RANGES.FEET_1000]: '300 metros',
  [SPELL_RANGES.MILE_1]: '1,6 km',
  [SPELL_RANGES.MILES_5]: '8 km',
  [SPELL_RANGES.UNLIMITED]: 'Ilimitado',
  [SPELL_RANGES.SIGHT]: 'Campo de visão',
  [SPELL_RANGES.SPECIAL]: 'Especial',
};

export const SPELL_DURATIONS = {
  INSTANTANEOUS: 'instantaneous',
  ROUND_1: '1_round',
  ROUNDS_6: '6_rounds',
  MINUTE_1: '1_minute',
  MINUTES_10: '10_minutes',
  HOUR_1: '1_hour',
  HOURS_2: '2_hours',
  HOURS_8: '8_hours',
  HOURS_24: '24_hours',
  DAYS_7: '7_days',
  DAYS_10: '10_days',
  DAYS_30: '30_days',
  UNTIL_DISPELLED: 'until_dispelled',
  SPECIAL: 'special',
  CONCENTRATION: 'concentration',
};

export const SPELL_DURATION_LABELS = {
  [SPELL_DURATIONS.INSTANTANEOUS]: 'Instantâneo',
  [SPELL_DURATIONS.ROUND_1]: '1 rodada',
  [SPELL_DURATIONS.ROUNDS_6]: '6 rodadas',
  [SPELL_DURATIONS.MINUTE_1]: '1 minuto',
  [SPELL_DURATIONS.MINUTES_10]: '10 minutos',
  [SPELL_DURATIONS.HOUR_1]: '1 hora',
  [SPELL_DURATIONS.HOURS_2]: '2 horas',
  [SPELL_DURATIONS.HOURS_8]: '8 horas',
  [SPELL_DURATIONS.HOURS_24]: '24 horas',
  [SPELL_DURATIONS.DAYS_7]: '7 dias',
  [SPELL_DURATIONS.DAYS_10]: '10 dias',
  [SPELL_DURATIONS.DAYS_30]: '30 dias',
  [SPELL_DURATIONS.UNTIL_DISPELLED]: 'Até ser dissipado',
  [SPELL_DURATIONS.SPECIAL]: 'Especial',
  [SPELL_DURATIONS.CONCENTRATION]: 'Concentração',
};

export const SPELL_COMPONENTS = {
  VERBAL: 'V',
  SOMATIC: 'S',
  MATERIAL: 'M',
};

export const SPELL_COMPONENT_LABELS = {
  [SPELL_COMPONENTS.VERBAL]: 'Verbal',
  [SPELL_COMPONENTS.SOMATIC]: 'Somático',
  [SPELL_COMPONENTS.MATERIAL]: 'Material',
};

export const SPELLCASTING_TYPES = {
  FULL: 'full',
  HALF: 'half',
  THIRD: 'third',
  WARLOCK: 'warlock',
  NONE: 'none',
};

export const SPELLCASTING_TYPE_LABELS = {
  [SPELLCASTING_TYPES.FULL]: 'Conjurador Completo',
  [SPELLCASTING_TYPES.HALF]: 'Meio Conjurador',
  [SPELLCASTING_TYPES.THIRD]: 'Terço Conjurador',
  [SPELLCASTING_TYPES.WARLOCK]: 'Pact Magic',
  [SPELLCASTING_TYPES.NONE]: 'Não Conjurador',
};

export const SPELLCASTING_ABILITIES = {
  INTELLIGENCE: 'intelligence',
  WISDOM: 'wisdom',
  CHARISMA: 'charisma',
};

export const CLASS_SPELLCASTING_INFO = {
  artificer: {
    type: SPELLCASTING_TYPES.HALF,
    ability: SPELLCASTING_ABILITIES.INTELLIGENCE,
    prepares: false,
    ritual_casting: true,
    spellcasting_focus: 'Foco de Conjuração (instrumento de artífice)',
    notes: 'Infunde magia em itens mundanos'
  },
  barbarian: {
    type: SPELLCASTING_TYPES.NONE,
    ability: null,
    prepares: false,
    ritual_casting: false,
    spellcasting_focus: null,
    notes: 'Não possui habilidades mágicas tradicionais'
  },
  bard: {
    type: SPELLCASTING_TYPES.FULL,
    ability: SPELLCASTING_ABILITIES.CHARISMA,
    prepares: false,
    ritual_casting: true,
    spellcasting_focus: 'Foco de Conjuração',
    notes: 'Feitiços conhecidos são sempre preparados'
  },
  cleric: {
    type: SPELLCASTING_TYPES.FULL,
    ability: SPELLCASTING_ABILITIES.WISDOM,
    prepares: true,
    ritual_casting: true,
    spellcasting_focus: 'Símbolo Sagrado',
    notes: 'Prepara feitiços diariamente de toda a lista'
  },
  druid: {
    type: SPELLCASTING_TYPES.FULL,
    ability: SPELLCASTING_ABILITIES.WISDOM,
    prepares: true,
    ritual_casting: true,
    spellcasting_focus: 'Foco Druídico',
    notes: 'Prepara feitiços diariamente de toda a lista'
  },
  fighter: {
    type: SPELLCASTING_TYPES.THIRD, // Apenas Eldritch Knight
    ability: SPELLCASTING_ABILITIES.INTELLIGENCE,
    prepares: false,
    ritual_casting: false,
    spellcasting_focus: 'Foco de Conjuração',
    notes: 'Apenas subclasse Eldritch Knight'
  },
  monk: {
    type: SPELLCASTING_TYPES.NONE,
    ability: null,
    prepares: false,
    ritual_casting: false,
    spellcasting_focus: null,
    notes: 'Ki não é considerado magia tradicional'
  },
  paladin: {
    type: SPELLCASTING_TYPES.HALF,
    ability: SPELLCASTING_ABILITIES.CHARISMA,
    prepares: true,
    ritual_casting: false,
    spellcasting_focus: 'Símbolo Sagrado',
    notes: 'Prepara feitiços diariamente'
  },
  ranger: {
    type: SPELLCASTING_TYPES.HALF,
    ability: SPELLCASTING_ABILITIES.WISDOM,
    prepares: false,
    ritual_casting: true,
    spellcasting_focus: 'Foco Druídico',
    notes: 'Feitiços conhecidos são sempre preparados'
  },
  rogue: {
    type: SPELLCASTING_TYPES.THIRD, // Apenas Arcane Trickster
    ability: SPELLCASTING_ABILITIES.INTELLIGENCE,
    prepares: false,
    ritual_casting: false,
    spellcasting_focus: 'Foco de Conjuração',
    notes: 'Apenas subclasse Arcane Trickster'
  },
  sorcerer: {
    type: SPELLCASTING_TYPES.FULL,
    ability: SPELLCASTING_ABILITIES.CHARISMA,
    prepares: false,
    ritual_casting: false,
    spellcasting_focus: 'Foco de Conjuração',
    notes: 'Magia inata, usa Pontos de Feitiçaria'
  },
  warlock: {
    type: SPELLCASTING_TYPES.WARLOCK,
    ability: SPELLCASTING_ABILITIES.CHARISMA,
    prepares: false,
    ritual_casting: false,
    spellcasting_focus: 'Foco de Conjuração',
    notes: 'Pact Magic - poucos espaços, mas do maior nível'
  },
  wizard: {
    type: SPELLCASTING_TYPES.FULL,
    ability: SPELLCASTING_ABILITIES.INTELLIGENCE,
    prepares: true,
    ritual_casting: true,
    spellcasting_focus: 'Foco de Conjuração',
    notes: 'Aprende feitiços no livro, prepara alguns diariamente'
  },
};

// Tabelas de progressão de espaços de feitiço
export const FULL_CASTER_SPELL_SLOTS = {
  1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

export const HALF_CASTER_SPELL_SLOTS = {
  1: [0, 0, 0, 0, 0],
  2: [2, 0, 0, 0, 0],
  3: [3, 0, 0, 0, 0],
  4: [3, 0, 0, 0, 0],
  5: [4, 2, 0, 0, 0],
  6: [4, 2, 0, 0, 0],
  7: [4, 3, 0, 0, 0],
  8: [4, 3, 0, 0, 0],
  9: [4, 3, 2, 0, 0],
  10: [4, 3, 2, 0, 0],
  11: [4, 3, 3, 0, 0],
  12: [4, 3, 3, 0, 0],
  13: [4, 3, 3, 1, 0],
  14: [4, 3, 3, 1, 0],
  15: [4, 3, 3, 2, 0],
  16: [4, 3, 3, 2, 0],
  17: [4, 3, 3, 3, 1],
  18: [4, 3, 3, 3, 1],
  19: [4, 3, 3, 3, 2],
  20: [4, 3, 3, 3, 2],
};

export const THIRD_CASTER_SPELL_SLOTS = {
  1: [0, 0, 0, 0],
  2: [0, 0, 0, 0],
  3: [2, 0, 0, 0],
  4: [3, 0, 0, 0],
  5: [3, 0, 0, 0],
  6: [3, 0, 0, 0],
  7: [4, 2, 0, 0],
  8: [4, 2, 0, 0],
  9: [4, 2, 0, 0],
  10: [4, 3, 0, 0],
  11: [4, 3, 0, 0],
  12: [4, 3, 0, 0],
  13: [4, 3, 2, 0],
  14: [4, 3, 2, 0],
  15: [4, 3, 2, 0],
  16: [4, 3, 3, 0],
  17: [4, 3, 3, 0],
  18: [4, 3, 3, 0],
  19: [4, 3, 3, 1],
  20: [4, 3, 3, 1],
};

export const WARLOCK_SPELL_SLOTS = {
  1: { slots: 1, level: 1 },
  2: { slots: 2, level: 1 },
  3: { slots: 2, level: 2 },
  4: { slots: 2, level: 2 },
  5: { slots: 2, level: 3 },
  6: { slots: 2, level: 3 },
  7: { slots: 2, level: 4 },
  8: { slots: 2, level: 4 },
  9: { slots: 2, level: 5 },
  10: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  12: { slots: 3, level: 5 },
  13: { slots: 3, level: 5 },
  14: { slots: 3, level: 5 },
  15: { slots: 3, level: 5 },
  16: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 },
  18: { slots: 4, level: 5 },
  19: { slots: 4, level: 5 },
  20: { slots: 4, level: 5 },
};

// Cantrips conhecidos por classe e nível
export const CANTRIPS_KNOWN = {
  artificer: {
    1: 2, 6: 3, 10: 4, 14: 4
  },
  bard: {
    1: 2, 4: 3, 10: 4
  },
  cleric: {
    1: 3, 4: 4, 10: 5
  },
  druid: {
    1: 2, 4: 3, 10: 4
  },
  sorcerer: {
    1: 4, 4: 5, 10: 6
  },
  warlock: {
    1: 2, 4: 3, 10: 4
  },
  wizard: {
    1: 3, 4: 4, 10: 5
  },
  // Third casters
  'eldritch_knight': {
    3: 2, 10: 3
  },
  'arcane_trickster': {
    3: 2, 10: 3
  }
};

// Utilitários
export const getSpellLevelName = (level) => {
  return SPELL_LEVEL_NAMES[level] || `${level}º Nível`;
};

export const getSchoolColor = (school) => {
  return SPELL_SCHOOL_COLORS[school] || 'gray';
};

export const getSchoolLabel = (school) => {
  return SPELL_SCHOOL_LABELS[school] || school;
};

export const getClassSpellcastingInfo = (className) => {
  return CLASS_SPELLCASTING_INFO[className?.toLowerCase()] || CLASS_SPELLCASTING_INFO.barbarian;
};

export const getSpellSlotsForLevel = (className, characterLevel) => {
  const info = getClassSpellcastingInfo(className);
  
  switch (info.type) {
    case SPELLCASTING_TYPES.FULL:
      return FULL_CASTER_SPELL_SLOTS[characterLevel] || [];
    case SPELLCASTING_TYPES.HALF:
      return HALF_CASTER_SPELL_SLOTS[characterLevel] || [];
    case SPELLCASTING_TYPES.THIRD:
      return THIRD_CASTER_SPELL_SLOTS[characterLevel] || [];
    case SPELLCASTING_TYPES.WARLOCK:
      return WARLOCK_SPELL_SLOTS[characterLevel] || { slots: 0, level: 1 };
    default:
      return [];
  }
};

export const getCantripsKnown = (className, characterLevel) => {
  const classCantrips = CANTRIPS_KNOWN[className?.toLowerCase()];
  if (!classCantrips) return 0;
  
  // Encontrar o maior nível ≤ characterLevel
  const levels = Object.keys(classCantrips).map(Number).sort((a, b) => b - a);
  for (const level of levels) {
    if (characterLevel >= level) {
      return classCantrips[level];
    }
  }
  
  return 0;
};

export default {
  SPELL_SCHOOLS,
  SPELL_SCHOOL_LABELS,
  SPELL_SCHOOL_COLORS,
  SPELL_LEVELS,
  SPELL_LEVEL_NAMES,
  SPELLCASTING_TYPES,
  CLASS_SPELLCASTING_INFO,
  getSpellLevelName,
  getSchoolColor,
  getSchoolLabel,
  getClassSpellcastingInfo,
  getSpellSlotsForLevel,
  getCantripsKnown,
};