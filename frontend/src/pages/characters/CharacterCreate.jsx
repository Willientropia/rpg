// src/pages/characters/CharacterCreate.jsx - CORRIGIDO
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { charactersService, gameDataService } from '../../services/charactersService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Componente para seleção de opções
const SelectOption = ({ 
  label, 
  options, 
  selected, 
  onSelect, 
  renderOption, 
  loading = false,
  error = null 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-stone-700 font-medieval">
      {label}
    </label>
    {loading ? (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400 mx-auto" />
      </div>
    ) : error ? (
      <Alert variant="error">{error}</Alert>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map(option => (
          <div
            key={option.id}
            onClick={() => onSelect(option)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selected?.id === option.id
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-stone-300 bg-stone-50 hover:border-amber-300 hover:bg-amber-25'
            }`}
          >
            {renderOption(option)}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function CharacterCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Estados do formulário
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    race: null,
    character_class: null,
    background: null,
    base_strength: 8,
    base_dexterity: 8,
    base_constitution: 8,
    base_intelligence: 8,
    base_wisdom: 8,
    base_charisma: 8,
  });
  const [formErrors, setFormErrors] = useState({});

  // Buscar dados necessários
  const { data: races = [], isLoading: racesLoading, error: racesError } = useQuery({
    queryKey: ['races'],
    queryFn: gameDataService.getRaces,
  });

  const { data: classes = [], isLoading: classesLoading, error: classesError } = useQuery({
    queryKey: ['classes'],
    queryFn: gameDataService.getClasses,
  });

  const { data: backgrounds = [], isLoading: backgroundsLoading, error: backgroundsError } = useQuery({
    queryKey: ['backgrounds'],
    queryFn: gameDataService.getBackgrounds,
  });

  // Mutation para criar personagem - CORRIGIDA
  const createCharacterMutation = useMutation({
    mutationFn: charactersService.createCharacter,
    onSuccess: (result) => {
      console.log('✅ Personagem criado com sucesso:', result);
      
      if (result.success && result.data) {
        // Invalidar cache de personagens para atualizar listas
        queryClient.invalidateQueries(['characters']);
        
        // Navegar para o personagem criado usando o ID correto
        const characterId = result.data.id;
        console.log('📍 Navegando para personagem ID:', characterId);
        
        navigate(`/characters/${characterId}`);
      } else {
        console.error('❌ Resposta inesperada do servidor:', result);
        setFormErrors({ submit: 'Erro inesperado ao criar personagem' });
      }
    },
    onError: (error) => {
      console.error('❌ Erro na mutation:', error);
      setFormErrors({ submit: error.message || 'Erro ao criar personagem' });
    }
  });

  // Point Buy System
  const pointBuyTable = {
    8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
  };

  const calculatePointsUsed = () => {
    const abilities = ['base_strength', 'base_dexterity', 'base_constitution', 
                     'base_intelligence', 'base_wisdom', 'base_charisma'];
    return abilities.reduce((total, ability) => {
      return total + (pointBuyTable[formData[ability]] || 0);
    }, 0);
  };

  const pointsUsed = calculatePointsUsed();
  const pointsRemaining = 27 - pointsUsed;

  // Atualizar atributo com validação
  const updateAbility = (ability, value) => {
    const newValue = Math.max(8, Math.min(15, value));
    const newFormData = { ...formData, [ability]: newValue };
    
    // Verificar se não excede os pontos
    const abilities = ['base_strength', 'base_dexterity', 'base_constitution', 
                      'base_intelligence', 'base_wisdom', 'base_charisma'];
    const newPointsUsed = abilities.reduce((total, abilityName) => {
      const key = abilityName;
      if (key === ability) {
        return total + (pointBuyTable[newValue] || 0);
      }
      return total + (pointBuyTable[newFormData[key]] || 0);
    }, 0);

    if (newPointsUsed <= 27) {
      setFormData(newFormData);
    }
  };

  // Calcular atributos finais (com bônus raciais)
  const getFinalAbility = (ability) => {
    const base = formData[`base_${ability}`] || 8;
    const racialBonus = formData.race?.[`${ability}_bonus`] || 0;
    return Math.min(20, base + racialBonus);
  };

  const getAbilityModifier = (ability) => {
    return Math.floor((getFinalAbility(ability) - 10) / 2);
  };

  // Validação por step
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          errors.name = 'Nome é obrigatório';
        }
        break;
      case 2:
        if (!formData.race) {
          errors.race = 'Selecione uma raça';
        }
        break;
      case 3:
        if (!formData.character_class) {
          errors.character_class = 'Selecione uma classe';
        }
        break;
      case 4:
        if (!formData.background) {
          errors.background = 'Selecione um background';
        }
        break;
      case 5:
        if (pointsUsed > 27) {
          errors.abilities = 'Pontos de atributos excedem o limite';
        }
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navegação entre steps
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(6, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Submit final - CORRIGIDO
  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    console.log('🚀 Iniciando criação de personagem...', formData);

    // Preparar dados para envio
    const characterData = {
      name: formData.name,
      race: formData.race.id,
      character_class: formData.character_class.id,
      background: formData.background.id,
      base_strength: formData.base_strength,
      base_dexterity: formData.base_dexterity,
      base_constitution: formData.base_constitution,
      base_intelligence: formData.base_intelligence,
      base_wisdom: formData.base_wisdom,
      base_charisma: formData.base_charisma,
    };

    console.log('📦 Dados sendo enviados:', characterData);

    try {
      await createCharacterMutation.mutateAsync(characterData);
    } catch (error) {
      console.error('❌ Erro no submit:', error);
      setFormErrors({ submit: error.message || 'Erro ao criar personagem' });
    }
  };

  const steps = [
    { number: 1, title: 'Nome', description: 'Escolha o nome do seu herói' },
    { number: 2, title: 'Raça', description: 'Selecione a raça do personagem' },
    { number: 3, title: 'Classe', description: 'Escolha a classe aventureira' },
    { number: 4, title: 'Background', description: 'Defina o passado do herói' },
    { number: 5, title: 'Atributos', description: 'Distribua os pontos de habilidade' },
    { number: 6, title: 'Confirmação', description: 'Revise e finalize seu herói' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400 mb-2 font-medieval">
          ⚔️ Forjar Novo Herói
        </h1>
        <p className="text-stone-300">
          Crie seu próximo personagem épico para suas aventuras
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${currentStep >= step.number 
                  ? 'bg-amber-400 text-amber-900' 
                  : 'bg-stone-600 text-stone-300'
                }
              `}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-amber-400' : 'bg-stone-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold text-amber-400 font-medieval">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-stone-300">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      <Card className="p-8">
        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Nome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Input
                label="Nome do Personagem"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formErrors.name}
                placeholder="Digite o nome do seu herói"
                autoFocus
              />
              
              <div className="text-center text-stone-600">
                <p>💡 Dica: Escolha um nome que reflita a personalidade e origem do seu personagem!</p>
              </div>
            </div>
          )}

          {/* Step 2: Raça */}
          {currentStep === 2 && (
            <SelectOption
              label="Escolha uma Raça"
              options={races}
              selected={formData.race}
              onSelect={(race) => setFormData({ ...formData, race })}
              loading={racesLoading}
              error={racesError?.message}
              renderOption={(race) => (
                <div>
                  <h3 className="font-bold text-stone-800">{race.name}</h3>
                  <div className="text-sm text-stone-600 mt-1">
                    {race.strength_bonus !== 0 && <span>FOR: +{race.strength_bonus} </span>}
                    {race.dexterity_bonus !== 0 && <span>DES: +{race.dexterity_bonus} </span>}
                    {race.constitution_bonus !== 0 && <span>CON: +{race.constitution_bonus} </span>}
                    {race.intelligence_bonus !== 0 && <span>INT: +{race.intelligence_bonus} </span>}
                    {race.wisdom_bonus !== 0 && <span>SAB: +{race.wisdom_bonus} </span>}
                    {race.charisma_bonus !== 0 && <span>CAR: +{race.charisma_bonus} </span>}
                  </div>
                </div>
              )}
            />
          )}

          {/* Step 3: Classe */}
          {currentStep === 3 && (
            <SelectOption
              label="Escolha uma Classe"
              options={classes}
              selected={formData.character_class}
              onSelect={(characterClass) => setFormData({ ...formData, character_class: characterClass })}
              loading={classesLoading}
              error={classesError?.message}
              renderOption={(characterClass) => (
                <div>
                  <h3 className="font-bold text-stone-800">{characterClass.name}</h3>
                  <div className="text-sm text-stone-600 mt-1">
                    <div>Dado de Vida: d{characterClass.hit_die}</div>
                    <div>Atributo Principal: {characterClass.primary_ability}</div>
                    {characterClass.is_spellcaster && (
                      <div className="text-amber-600 font-medium">✨ Conjurador</div>
                    )}
                  </div>
                </div>
              )}
            />
          )}

          {/* Step 4: Background */}
          {currentStep === 4 && (
            <SelectOption
              label="Escolha um Background"
              options={backgrounds}
              selected={formData.background}
              onSelect={(background) => setFormData({ ...formData, background })}
              loading={backgroundsLoading}
              error={backgroundsError?.message}
              renderOption={(background) => (
                <div>
                  <h3 className="font-bold text-stone-800">{background.name}</h3>
                  <div className="text-sm text-stone-600 mt-1">
                    {background.skill_proficiencies?.length > 0 && (
                      <div>Proficiências: {background.skill_proficiencies.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
            />
          )}

          {/* Step 5: Atributos */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-stone-800 font-medieval">
                  Sistema Point Buy
                </h3>
                <p className="text-stone-600">
                  Distribua 27 pontos entre os atributos (8-15 cada)
                </p>
                <div className={`text-lg font-bold mt-2 ${
                  pointsRemaining < 0 ? 'text-red-600' : 'text-amber-600'
                }`}>
                  Pontos restantes: {pointsRemaining}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'strength', name: 'Força', abbr: 'FOR' },
                  { key: 'dexterity', name: 'Destreza', abbr: 'DES' },
                  { key: 'constitution', name: 'Constituição', abbr: 'CON' },
                  { key: 'intelligence', name: 'Inteligência', abbr: 'INT' },
                  { key: 'wisdom', name: 'Sabedoria', abbr: 'SAB' },
                  { key: 'charisma', name: 'Carisma', abbr: 'CAR' },
                ].map(ability => {
                  const baseValue = formData[`base_${ability.key}`];
                  const finalValue = getFinalAbility(ability.key);
                  const modifier = getAbilityModifier(ability.key);
                  const racialBonus = formData.race?.[`${ability.key}_bonus`] || 0;
                  
                  return (
                    <Card key={ability.key} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-stone-800">{ability.name}</h4>
                        <span className="text-sm text-stone-600">{ability.abbr}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAbility(`base_${ability.key}`, baseValue - 1)}
                          disabled={baseValue <= 8}
                        >
                          -
                        </Button>
                        
                        <div className="text-center min-w-[60px]">
                          <div className="text-lg font-bold">{baseValue}</div>
                          <div className="text-xs text-stone-600">
                            Custo: {pointBuyTable[baseValue]}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAbility(`base_${ability.key}`, baseValue + 1)}
                          disabled={baseValue >= 15 || pointsRemaining <= 0}
                        >
                          +
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-stone-600">
                        {racialBonus !== 0 && (
                          <div>Bônus Racial: +{racialBonus}</div>
                        )}
                        <div className="font-bold">
                          Final: {finalValue} ({modifier >= 0 ? '+' : ''}{modifier})
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {formErrors.abilities && (
                <Alert variant="error">{formErrors.abilities}</Alert>
              )}
            </div>
          )}

          {/* Step 6: Confirmação */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-stone-800 font-medieval">
                  Confirme seu Herói
                </h3>
                <p className="text-stone-600">
                  Revise os dados antes de finalizar a criação
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-bold text-stone-800 mb-2">Informações Básicas</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Nome:</strong> {formData.name}</div>
                    <div><strong>Raça:</strong> {formData.race?.name}</div>
                    <div><strong>Classe:</strong> {formData.character_class?.name}</div>
                    <div><strong>Background:</strong> {formData.background?.name}</div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-bold text-stone-800 mb-2">Atributos Finais</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div>FOR: {getFinalAbility('strength')} ({getAbilityModifier('strength') >= 0 ? '+' : ''}{getAbilityModifier('strength')})</div>
                    <div>DES: {getFinalAbility('dexterity')} ({getAbilityModifier('dexterity') >= 0 ? '+' : ''}{getAbilityModifier('dexterity')})</div>
                    <div>CON: {getFinalAbility('constitution')} ({getAbilityModifier('constitution') >= 0 ? '+' : ''}{getAbilityModifier('constitution')})</div>
                    <div>INT: {getFinalAbility('intelligence')} ({getAbilityModifier('intelligence') >= 0 ? '+' : ''}{getAbilityModifier('intelligence')})</div>
                    <div>SAB: {getFinalAbility('wisdom')} ({getAbilityModifier('wisdom') >= 0 ? '+' : ''}{getAbilityModifier('wisdom')})</div>
                    <div>CAR: {getFinalAbility('charisma')} ({getAbilityModifier('charisma') >= 0 ? '+' : ''}{getAbilityModifier('charisma')})</div>
                  </div>
                </Card>
              </div>

              {formErrors.submit && (
                <Alert variant="error">
                  {typeof formErrors.submit === 'string' 
                    ? formErrors.submit 
                    : 'Erro ao criar personagem'
                  }
                </Alert>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            ← Anterior
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/characters')}
            >
              Cancelar
            </Button>

            {currentStep < 6 ? (
              <Button onClick={nextStep}>
                Próximo →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={createCharacterMutation.isLoading}
                disabled={createCharacterMutation.isLoading}
              >
                ⚔️ Forjar Herói
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}