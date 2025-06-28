# apps/characters/models.py - Models completos para D&D Character Creator

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from functools import cached_property
import requests
import json


class Race(models.Model):
    """
    Raças de D&D - integra com Open5e API
    """
    slug = models.SlugField(unique=True, help_text="Slug para buscar na Open5e API")
    name = models.CharField(max_length=100)
    
    # Cache dos dados da API
    api_data = models.JSONField(blank=True, null=True, help_text="Cache dos dados da Open5e API")
    
    # Bônus de atributos base
    strength_bonus = models.IntegerField(default=0)
    dexterity_bonus = models.IntegerField(default=0)
    constitution_bonus = models.IntegerField(default=0)
    intelligence_bonus = models.IntegerField(default=0)
    wisdom_bonus = models.IntegerField(default=0)
    charisma_bonus = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Race'
        verbose_name_plural = 'Races'
    
    def __str__(self):
        return self.name
    
    def fetch_api_data(self):
        """Busca dados da Open5e API e atualiza o model"""
        try:
            response = requests.get(f"https://api.open5e.com/v2/races/{self.slug}/", timeout=10)
            if response.status_code == 200:
                self.api_data = response.json()
                
                # Atualiza bônus de atributos se disponível na API
                if 'asi' in self.api_data:
                    for asi in self.api_data['asi']:
                        if 'attributes' in asi and asi['attributes']:
                            attr_name = f"{asi['attributes'][0].lower()}_bonus"
                            if hasattr(self, attr_name):
                                setattr(self, attr_name, asi.get('value', 0))
                
                self.save()
                return True
        except Exception as e:
            print(f"Erro ao buscar dados da API para raça {self.name}: {e}")
        return False
    
    @property
    def traits(self):
        """Retorna traits raciais da API"""
        if self.api_data and 'traits' in self.api_data:
            return self.api_data['traits']
        return []


class CharacterClass(models.Model):
    """
    Classes de D&D - integra com Open5e API
    """
    SPELL_SLOTS_CHOICES = [
        ('none', 'Non-Caster'),
        ('full', 'Full Caster'),
        ('half', 'Half Caster'), 
        ('third', 'Third Caster'),
        ('warlock', 'Warlock (Pact Magic)'),
    ]
    
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    
    # Cache dos dados da API
    api_data = models.JSONField(blank=True, null=True)
    
    # Dados básicos da classe
    hit_die = models.IntegerField(default=6, help_text="Tipo do dado de vida (6, 8, 10, 12)")
    primary_ability = models.CharField(max_length=50, default="", help_text="Atributo primário")
    saving_throw_proficiencies = models.JSONField(default=list, help_text="Lista de saving throws")
    
    # Sistema de spellcasting
    is_spellcaster = models.BooleanField(default=False)
    spellcasting_ability = models.CharField(max_length=20, blank=True, help_text="Atributo para spellcasting")
    spell_slots_type = models.CharField(max_length=20, choices=SPELL_SLOTS_CHOICES, default='none')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Character Class'
        verbose_name_plural = 'Character Classes'
    
    def __str__(self):
        return self.name
    
    def fetch_api_data(self):
        """Busca dados da Open5e API"""
        try:
            response = requests.get(f"https://api.open5e.com/v1/classes/{self.slug}/", timeout=10)
            if response.status_code == 200:
                self.api_data = response.json()
                
                # Extrai informações básicas
                if 'hit_die' in self.api_data:
                    self.hit_die = self.api_data['hit_die']
                
                # Verifica spellcasting
                if 'spellcasting' in self.api_data:
                    self.is_spellcaster = True
                    spellcasting = self.api_data['spellcasting']
                    if 'spellcasting_ability' in spellcasting:
                        ability = spellcasting['spellcasting_ability']
                        if isinstance(ability, dict) and 'index' in ability:
                            self.spellcasting_ability = ability['index']
                
                self.save()
                return True
        except Exception as e:
            print(f"Erro ao buscar dados da API para classe {self.name}: {e}")
        return False


class ClassLevelProgression(models.Model):
    """
    Progressão por nível de cada classe
    """
    character_class = models.ForeignKey(CharacterClass, on_delete=models.CASCADE, related_name='level_progression')
    level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    
    # Progressão básica
    proficiency_bonus = models.IntegerField(default=2)
    
    # Spell slots para cada nível de magia (0-9)
    spell_slots_0 = models.IntegerField(default=0, help_text="Cantrips conhecidos")
    spell_slots_1 = models.IntegerField(default=0)
    spell_slots_2 = models.IntegerField(default=0)
    spell_slots_3 = models.IntegerField(default=0)
    spell_slots_4 = models.IntegerField(default=0)
    spell_slots_5 = models.IntegerField(default=0)
    spell_slots_6 = models.IntegerField(default=0)
    spell_slots_7 = models.IntegerField(default=0)
    spell_slots_8 = models.IntegerField(default=0)
    spell_slots_9 = models.IntegerField(default=0)
    
    # Cantrips e spells conhecidos
    cantrips_known = models.IntegerField(default=0)
    spells_known = models.IntegerField(default=0, help_text="Para classes que 'conhecem' feitiços")
    
    # Features ganhas neste nível
    features_gained = models.JSONField(default=list, help_text="Lista de features/habilidades")
    
    class Meta:
        unique_together = ['character_class', 'level']
        ordering = ['character_class', 'level']
        verbose_name = 'Class Level Progression'
        verbose_name_plural = 'Class Level Progressions'
    
    def __str__(self):
        return f"{self.character_class.name} - Level {self.level}"


class Background(models.Model):
    """
    Backgrounds de personagem - integra com Open5e API
    """
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    
    # Cache dos dados da API
    api_data = models.JSONField(blank=True, null=True)
    
    # Proficiências base
    skill_proficiencies = models.JSONField(default=list, help_text="Lista de skills")
    tool_proficiencies = models.JSONField(default=list, help_text="Lista de tools")
    languages = models.JSONField(default=list, help_text="Lista de idiomas")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Character(models.Model):
    """
    Personagem principal com todos os cálculos
    """
    # Relações
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='characters')
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    character_class = models.ForeignKey(CharacterClass, on_delete=models.CASCADE)
    background = models.ForeignKey(Background, on_delete=models.CASCADE, null=True, blank=True)
    
    # Informações básicas
    name = models.CharField(max_length=100)
    level = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(20)])
    experience_points = models.IntegerField(default=0)
    
    # Atributos base (antes de modificadores raciais)
    base_strength = models.IntegerField(default=10, validators=[MinValueValidator(3), MaxValueValidator(18)])
    base_dexterity = models.IntegerField(default=10, validators=[MinValueValidator(3), MaxValueValidator(18)])
    base_constitution = models.IntegerField(default=10, validators=[MinValueValidator(3), MaxValueValidator(18)])
    base_intelligence = models.IntegerField(default=10, validators=[MinValueValidator(3), MaxValueValidator(18)])
    base_wisdom = models.IntegerField(default=10, validators=[MinValueValidator(3), MaxValueValidator(18)])
    base_charisma = models.IntegerField(default=10, validators=[MinValueValidator(3), MaxValueValidator(18)])
    
    # HP e recursos
    current_hp = models.IntegerField(default=0)
    max_hp = models.IntegerField(default=0)
    temporary_hp = models.IntegerField(default=0)
    
    # Proficiências customizadas
    custom_skill_proficiencies = models.JSONField(default=list)
    custom_saving_throw_proficiencies = models.JSONField(default=list)
    
    # Spell slots atuais (para spellcasters)
    current_spell_slots_1 = models.IntegerField(default=0)
    current_spell_slots_2 = models.IntegerField(default=0)
    current_spell_slots_3 = models.IntegerField(default=0)
    current_spell_slots_4 = models.IntegerField(default=0)
    current_spell_slots_5 = models.IntegerField(default=0)
    current_spell_slots_6 = models.IntegerField(default=0)
    current_spell_slots_7 = models.IntegerField(default=0)
    current_spell_slots_8 = models.IntegerField(default=0)
    current_spell_slots_9 = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Character'
        verbose_name_plural = 'Characters'
    
    def __str__(self):
        return f"{self.name} ({self.character_class.name} {self.level})"
    
    # ========================================
    # PROPRIEDADES CALCULADAS - ATRIBUTOS
    # ========================================
    
    @cached_property
    def strength(self):
        """Força final (base + racial)"""
        return min(20, self.base_strength + self.race.strength_bonus)
    
    @cached_property
    def dexterity(self):
        """Destreza final (base + racial)"""
        return min(20, self.base_dexterity + self.race.dexterity_bonus)
    
    @cached_property
    def constitution(self):
        """Constituição final (base + racial)"""
        return min(20, self.base_constitution + self.race.constitution_bonus)
    
    @cached_property
    def intelligence(self):
        """Inteligência final (base + racial)"""
        return min(20, self.base_intelligence + self.race.intelligence_bonus)
    
    @cached_property
    def wisdom(self):
        """Sabedoria final (base + racial)"""
        return min(20, self.base_wisdom + self.race.wisdom_bonus)
    
    @cached_property
    def charisma(self):
        """Carisma final (base + racial)"""
        return min(20, self.base_charisma + self.race.charisma_bonus)
    
    # ========================================
    # MODIFICADORES DE ATRIBUTOS
    # ========================================
    
    @cached_property
    def strength_modifier(self):
        return (self.strength - 10) // 2
    
    @cached_property
    def dexterity_modifier(self):
        return (self.dexterity - 10) // 2
    
    @cached_property
    def constitution_modifier(self):
        return (self.constitution - 10) // 2
    
    @cached_property
    def intelligence_modifier(self):
        return (self.intelligence - 10) // 2
    
    @cached_property
    def wisdom_modifier(self):
        return (self.wisdom - 10) // 2
    
    @cached_property
    def charisma_modifier(self):
        return (self.charisma - 10) // 2
    
    # ========================================
    # ESTATÍSTICAS DE COMBATE
    # ========================================
    
    @cached_property
    def proficiency_bonus(self):
        """Bônus de proficiência baseado no nível"""
        return 2 + ((self.level - 1) // 4)
    
    @cached_property
    def armor_class(self):
        """AC base (10 + Dex modifier) - pode ser sobrescrito por equipamentos"""
        return 10 + self.dexterity_modifier
    
    @cached_property
    def initiative_bonus(self):
        """Bônus de iniciativa"""
        return self.dexterity_modifier
    
    @cached_property
    def spell_save_dc(self):
        """DC para salvar contra feitiços do personagem"""
        if not self.character_class.is_spellcaster:
            return None
        
        ability_modifier = getattr(self, f"{self.character_class.spellcasting_ability}_modifier", 0)
        return 8 + self.proficiency_bonus + ability_modifier
    
    @cached_property
    def spell_attack_bonus(self):
        """Bônus para ataques com feitiços"""
        if not self.character_class.is_spellcaster:
            return None
        
        ability_modifier = getattr(self, f"{self.character_class.spellcasting_ability}_modifier", 0)
        return self.proficiency_bonus + ability_modifier
    
    # ========================================
    # SPELL SLOTS
    # ========================================
    
    def get_max_spell_slots(self, spell_level):
        """Retorna o máximo de spell slots para um nível específico"""
        try:
            progression = ClassLevelProgression.objects.get(
                character_class=self.character_class,
                level=self.level
            )
            return getattr(progression, f'spell_slots_{spell_level}', 0)
        except ClassLevelProgression.DoesNotExist:
            return 0
    
    def get_current_spell_slots(self, spell_level):
        """Retorna spell slots atuais para um nível específico"""
        if spell_level == 0:  # Cantrips são ilimitados
            return self.get_max_spell_slots(0)
        return getattr(self, f'current_spell_slots_{spell_level}', 0)
    
    def use_spell_slot(self, spell_level):
        """Usa um spell slot do nível especificado"""
        if spell_level == 0:  # Cantrips não consomem slots
            return True
        
        current = self.get_current_spell_slots(spell_level)
        if current > 0:
            setattr(self, f'current_spell_slots_{spell_level}', current - 1)
            self.save()
            return True
        return False
    
    # ========================================
    # SISTEMA DE HP
    # ========================================
    
    def calculate_max_hp(self):
        """Calcula HP máximo baseado na classe e nível"""
        # HP do primeiro nível: máximo do hit die + CON mod
        base_hp = self.character_class.hit_die + self.constitution_modifier
        
        # HP dos níveis subsequentes: média do hit die + CON mod
        if self.level > 1:
            avg_hp_per_level = (self.character_class.hit_die // 2 + 1) + self.constitution_modifier
            additional_hp = (self.level - 1) * avg_hp_per_level
            base_hp += additional_hp
        
        return max(1, base_hp)  # Mínimo 1 HP
    
    def take_damage(self, damage):
        """Aplica dano ao personagem"""
        damage = max(0, damage)  # Não pode ser negativo
        
        # Primeiro, reduz temporary HP
        if self.temporary_hp > 0:
            temp_damage = min(damage, self.temporary_hp)
            self.temporary_hp -= temp_damage
            damage -= temp_damage
        
        # Depois, reduz HP atual
        self.current_hp = max(0, self.current_hp - damage)
        self.save()
        
        return damage
    
    def heal(self, amount):
        """Cura o personagem"""
        amount = max(0, amount)
        old_hp = self.current_hp
        self.current_hp = min(self.max_hp, self.current_hp + amount)
        self.save()
        
        return self.current_hp - old_hp  # Retorna HP efetivamente curado
    
    # ========================================
    # SISTEMA DE PROGRESSÃO
    # ========================================
    
    def level_up(self):
        """Sobe um nível e atualiza todas as estatísticas"""
        if self.level >= 20:
            return False
        
        old_level = self.level
        old_max_hp = self.max_hp
        
        # Aumenta o nível
        self.level += 1
        
        # Recalcula HP máximo
        self.max_hp = self.calculate_max_hp()
        
        # Aumenta HP atual pela diferença
        hp_gained = self.max_hp - old_max_hp
        self.current_hp += hp_gained
        
        # Restaura spell slots para o novo nível
        for spell_level in range(1, 10):
            max_slots = self.get_max_spell_slots(spell_level)
            setattr(self, f'current_spell_slots_{spell_level}', max_slots)
        
        self.save()
        
        # Limpar cache de propriedades calculadas
        if hasattr(self, '_state'):
            for attr in ['proficiency_bonus', 'spell_save_dc', 'spell_attack_bonus']:
                if hasattr(self, f'_{attr}'):
                    delattr(self, f'_{attr}')
        
        return True
    
    def rest_long(self):
        """Descanso longo - restaura HP e spell slots"""
        self.current_hp = self.max_hp
        self.temporary_hp = 0
        
        # Restaura todos os spell slots
        for spell_level in range(1, 10):
            max_slots = self.get_max_spell_slots(spell_level)
            setattr(self, f'current_spell_slots_{spell_level}', max_slots)
        
        self.save()
    
    def rest_short(self):
        """Descanso curto - algumas classes podem recuperar recursos"""
        # Por enquanto, apenas algumas classes específicas se beneficiam
        # Warlock recupera spell slots, por exemplo
        if self.character_class.spell_slots_type == 'warlock':
            for spell_level in range(1, 6):  # Warlock slots até 5º nível
                max_slots = self.get_max_spell_slots(spell_level)
                if max_slots > 0:
                    setattr(self, f'current_spell_slots_{spell_level}', max_slots)
        
        self.save()
    
    # ========================================
    # MÉTODOS DE INICIALIZAÇÃO
    # ========================================
    
    def save(self, *args, **kwargs):
        """Override save para calcular HP inicial e spell slots"""
        # Primeira vez sendo salvo
        if not self.pk:
            if not self.max_hp:
                self.max_hp = self.calculate_max_hp()
                self.current_hp = self.max_hp
            
            # Inicializa spell slots se for spellcaster
            if self.character_class.is_spellcaster:
                for spell_level in range(1, 10):
                    max_slots = self.get_max_spell_slots(spell_level)
                    setattr(self, f'current_spell_slots_{spell_level}', max_slots)
        
        super().save(*args, **kwargs)


class CharacterSpell(models.Model):
    """
    Feitiços conhecidos/preparados por um personagem
    """
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='spells')
    spell_slug = models.CharField(max_length=100, help_text="Slug do feitiço na Open5e API")
    spell_name = models.CharField(max_length=100)
    spell_level = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(9)])
    
    # Estado do feitiço
    is_prepared = models.BooleanField(default=True, help_text="False para conhecidos mas não preparados")
    is_known = models.BooleanField(default=True, help_text="Se o personagem conhece este feitiço")
    
    # Cache de dados da API
    api_data = models.JSONField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['character', 'spell_slug']
        ordering = ['spell_level', 'spell_name']
    
    def __str__(self):
        return f"{self.character.name} - {self.spell_name}"
    
    def fetch_spell_data(self):
        """Busca dados do feitiço da Open5e API"""
        try:
            response = requests.get(f"https://api.open5e.com/v2/spells/{self.spell_slug}/", timeout=10)
            if response.status_code == 200:
                self.api_data = response.json()
                self.spell_name = self.api_data.get('name', self.spell_name)
                self.spell_level = self.api_data.get('level', self.spell_level)
                self.save()
                return True
        except Exception as e:
            print(f"Erro ao buscar dados do feitiço {self.spell_slug}: {e}")
        return False
    
    @property
    def description(self):
        """Retorna a descrição do feitiço"""
        if self.api_data and 'desc' in self.api_data:
            return self.api_data['desc']
        return ""
    
    @property
    def casting_time(self):
        """Retorna o tempo de conjuração"""
        if self.api_data and 'casting_time' in self.api_data:
            return self.api_data['casting_time']
        return ""
    
    @property
    def range_area(self):
        """Retorna o alcance do feitiço"""
        if self.api_data and 'range' in self.api_data:
            return self.api_data['range']
        return ""
    
    @property
    def components(self):
        """Retorna os componentes do feitiço"""
        if self.api_data and 'components' in self.api_data:
            return self.api_data['components']
        return ""
    
    @property
    def duration(self):
        """Retorna a duração do feitiço"""
        if self.api_data and 'duration' in self.api_data:
            return self.api_data['duration']
        return ""
    
    @property
    def school(self):
        """Retorna a escola de magia"""
        if self.api_data and 'school' in self.api_data:
            return self.api_data['school']
        return ""


# ========================================
# MODELS AUXILIARES
# ========================================

class Equipment(models.Model):
    """
    Equipamentos e itens
    """
    EQUIPMENT_TYPES = [
        ('weapon', 'Weapon'),
        ('armor', 'Armor'), 
        ('shield', 'Shield'),
        ('tool', 'Tool'),
        ('gear', 'Adventuring Gear'),
        ('magic_item', 'Magic Item'),
    ]
    
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    equipment_type = models.CharField(max_length=20, choices=EQUIPMENT_TYPES)
    
    # Cache da API
    api_data = models.JSONField(blank=True, null=True)
    
    # Dados básicos
    cost = models.CharField(max_length=50, blank=True)
    weight = models.FloatField(default=0)
    description = models.TextField(blank=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class CharacterEquipment(models.Model):
    """
    Equipamentos de um personagem
    """
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name='equipment')
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    
    quantity = models.IntegerField(default=1)
    is_equipped = models.BooleanField(default=False)
    is_attuned = models.BooleanField(default=False)  # Para itens mágicos
    
    class Meta:
        unique_together = ['character', 'equipment']
    
    def __str__(self):
        return f"{self.character.name} - {self.equipment.name}"


class Campaign(models.Model):
    """
    Campanhas de D&D
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    dm = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dm_campaigns')
    players = models.ManyToManyField(User, related_name='player_campaigns', blank=True)
    
    # Configurações da campanha
    starting_level = models.IntegerField(default=1)
    max_level = models.IntegerField(default=20)
    allow_multiclass = models.BooleanField(default=True)
    point_buy_points = models.IntegerField(default=27)
    
    # Regras homebrew
    homebrew_rules = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class CampaignCharacter(models.Model):
    """
    Personagens em campanhas específicas
    """
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    
    # Status na campanha
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['campaign', 'character']
    
    def __str__(self):
        return f"{self.character.name} in {self.campaign.name}"


# ========================================
# SIGNALS E UTILIDADES
# ========================================

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Character)
def initialize_character_stats(sender, instance, created, **kwargs):
    """
    Inicializa estatísticas do personagem após criação
    """
    if created:
        # Já é feito no método save(), mas garante que tudo está correto
        if not instance.max_hp:
            instance.max_hp = instance.calculate_max_hp()
            instance.current_hp = instance.max_hp
            instance.save()


# ========================================
# VALIDADORES CUSTOMIZADOS
# ========================================

from django.core.exceptions import ValidationError

def validate_ability_scores(character):
    """
    Valida se os atributos seguem as regras do Point Buy
    """
    scores = [
        character.base_strength,
        character.base_dexterity, 
        character.base_constitution,
        character.base_intelligence,
        character.base_wisdom,
        character.base_charisma
    ]
    
    # Verificar limites individuais
    for score in scores:
        if score < 8 or score > 15:
            raise ValidationError("Atributos devem estar entre 8 e 15 no Point Buy")
    
    # Calcular custo total
    cost_table = {8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9}
    total_cost = sum(cost_table.get(score, 0) for score in scores)
    
    if total_cost > 27:
        raise ValidationError(f"Total de pontos excede 27. Atual: {total_cost}")
    
    return True


def validate_spell_for_class(spell_slug, character_class):
    """
    Valida se um feitiço pode ser aprendido por uma classe
    """
    try:
        # Buscar dados do feitiço na API
        response = requests.get(f"https://api.open5e.com/v2/spells/{spell_slug}/", timeout=10)
        if response.status_code == 200:
            spell_data = response.json()
            
            # Verificar se a classe está na lista
            if 'dnd_class' in spell_data:
                class_names = [cls.get('name', '').lower() for cls in spell_data['dnd_class']]
                if character_class.name.lower() not in class_names:
                    raise ValidationError(f"Feitiço não disponível para {character_class.name}")
            
            return True
    except requests.RequestException:
        # Se não conseguir validar pela API, permite por enquanto
        return True
    
    return False


# ========================================
# MANAGERS CUSTOMIZADOS
# ========================================

class CharacterManager(models.Manager):
    """
    Manager customizado para Character
    """
    
    def active(self):
        """Retorna apenas personagens ativos (com HP > 0)"""
        return self.filter(current_hp__gt=0)
    
    def by_level_range(self, min_level=1, max_level=20):
        """Retorna personagens em uma faixa de nível"""
        return self.filter(level__gte=min_level, level__lte=max_level)
    
    def spellcasters(self):
        """Retorna apenas personagens que podem usar magia"""
        return self.filter(character_class__is_spellcaster=True)
    
    def by_class(self, class_name):
        """Retorna personagens de uma classe específica"""
        return self.filter(character_class__name__icontains=class_name)


# Adicionar o manager customizado ao model Character
Character.add_to_class('objects', CharacterManager())


# ========================================
# MÉTODOS DE UTILIDADE
# ========================================

class CharacterUtils:
    """
    Métodos utilitários para personagens
    """
    
    @staticmethod
    def calculate_point_buy_cost(ability_scores):
        """
        Calcula o custo total no sistema Point Buy
        """
        cost_table = {8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9}
        return sum(cost_table.get(score, 0) for score in ability_scores.values())
    
    @staticmethod
    def get_experience_for_level(level):
        """
        Retorna XP necessário para um nível específico
        """
        xp_table = {
            1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500,
            6: 14000, 7: 23000, 8: 34000, 9: 48000, 10: 64000,
            11: 85000, 12: 100000, 13: 120000, 14: 140000, 15: 165000,
            16: 195000, 17: 225000, 18: 265000, 19: 305000, 20: 355000
        }
        return xp_table.get(level, 0)
    
    @staticmethod
    def get_proficiency_bonus_for_level(level):
        """
        Retorna bônus de proficiência para um nível
        """
        return 2 + ((level - 1) // 4)
    
    @staticmethod
    def get_ability_modifier(score):
        """
        Calcula modificador de atributo
        """
        return (score - 10) // 2