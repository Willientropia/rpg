# apps/characters/serializers.py - Django REST Framework Serializers

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Race, CharacterClass, ClassLevelProgression, Background,
    Character, CharacterSpell, Equipment, Campaign
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer básico para User"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class RaceSerializer(serializers.ModelSerializer):
    """Serializer para Race com dados da API"""
    ability_bonuses = serializers.SerializerMethodField()
    traits = serializers.SerializerMethodField()
    
    class Meta:
        model = Race
        fields = [
            'id', 'slug', 'name', 'ability_bonuses', 'traits',
            'strength_bonus', 'dexterity_bonus', 'constitution_bonus',
            'intelligence_bonus', 'wisdom_bonus', 'charisma_bonus',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_ability_bonuses(self, obj):
        """Retorna um dict com todos os bônus de atributos"""
        return {
            'strength': obj.strength_bonus,
            'dexterity': obj.dexterity_bonus,
            'constitution': obj.constitution_bonus,
            'intelligence': obj.intelligence_bonus,
            'wisdom': obj.wisdom_bonus,
            'charisma': obj.charisma_bonus
        }
    
    def get_traits(self, obj):
        """Retorna traits da API se disponível"""
        return obj.traits if hasattr(obj, 'traits') else []


class CharacterClassSerializer(serializers.ModelSerializer):
    """Serializer para CharacterClass"""
    spell_slots_type_display = serializers.CharField(source='get_spell_slots_type_display', read_only=True)
    
    class Meta:
        model = CharacterClass
        fields = [
            'id', 'slug', 'name', 'hit_die', 'primary_ability',
            'saving_throw_proficiencies', 'is_spellcaster',
            'spellcasting_ability', 'spell_slots_type', 'spell_slots_type_display',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassLevelProgressionSerializer(serializers.ModelSerializer):
    """Serializer para progressão de nível"""
    character_class_name = serializers.CharField(source='character_class.name', read_only=True)
    spell_slots = serializers.SerializerMethodField()
    
    class Meta:
        model = ClassLevelProgression
        fields = [
            'id', 'character_class', 'character_class_name', 'level',
            'proficiency_bonus', 'cantrips_known', 'spells_known',
            'spell_slots', 'features_gained'
        ]
        read_only_fields = ['id']
    
    def get_spell_slots(self, obj):
        """Retorna spell slots organizados por nível"""
        slots = {}
        for i in range(1, 10):
            slot_count = getattr(obj, f'spell_slots_{i}', 0)
            if slot_count > 0:
                slots[str(i)] = slot_count
        return slots


class BackgroundSerializer(serializers.ModelSerializer):
    """Serializer para Background"""
    class Meta:
        model = Background
        fields = [
            'id', 'slug', 'name', 'skill_proficiencies',
            'tool_proficiencies', 'languages', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CharacterSpellSerializer(serializers.ModelSerializer):
    """Serializer para feitiços do personagem"""
    spell_details = serializers.SerializerMethodField()
    
    class Meta:
        model = CharacterSpell
        fields = [
            'id', 'spell_slug', 'spell_name', 'spell_level',
            'is_prepared', 'is_known', 'spell_details', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_spell_details(self, obj):
        """Retorna detalhes do feitiço da API se disponível"""
        if obj.api_data:
            return {
                'description': obj.description,
                'casting_time': obj.casting_time,
                'range': obj.range_area,
                'components': obj.components,
                'duration': obj.duration,
                'school': obj.school
            }
        return None


class CharacterListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para lista de personagens"""
    user = UserSerializer(read_only=True)
    race = RaceSerializer(read_only=True)
    character_class = CharacterClassSerializer(read_only=True)
    background = BackgroundSerializer(read_only=True)
    
    class Meta:
        model = Character
        fields = [
            'id', 'name', 'user', 'race', 'character_class', 'background',
            'level', 'current_hp', 'max_hp', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CharacterDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalhes do personagem"""
    user = UserSerializer(read_only=True)
    race = RaceSerializer(read_only=True)
    character_class = CharacterClassSerializer(read_only=True)
    background = BackgroundSerializer(read_only=True)
    spells = CharacterSpellSerializer(many=True, read_only=True)
    
    # Campos calculados
    final_abilities = serializers.SerializerMethodField()
    ability_modifiers = serializers.SerializerMethodField()
    combat_stats = serializers.SerializerMethodField()
    spell_slots_current = serializers.SerializerMethodField()
    spell_slots_max = serializers.SerializerMethodField()
    
    class Meta:
        model = Character
        fields = [
            'id', 'name', 'user', 'race', 'character_class', 'background',
            'level', 'experience_points',
            # Atributos base
            'base_strength', 'base_dexterity', 'base_constitution',
            'base_intelligence', 'base_wisdom', 'base_charisma',
            # Atributos finais e modificadores
            'final_abilities', 'ability_modifiers',
            # HP e recursos
            'current_hp', 'max_hp', 'temporary_hp',
            # Combat stats
            'combat_stats',
            # Spell slots
            'spell_slots_current', 'spell_slots_max',
            # Proficiências customizadas
            'custom_skill_proficiencies', 'custom_saving_throw_proficiencies',
            # Feitiços
            'spells',
            # Metadata
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'final_abilities', 'ability_modifiers', 'combat_stats',
            'spell_slots_current', 'spell_slots_max', 'max_hp',
            'created_at', 'updated_at'
        ]
    
    def get_final_abilities(self, obj):
        """Retorna atributos finais (base + racial)"""
        return {
            'strength': obj.strength,
            'dexterity': obj.dexterity,
            'constitution': obj.constitution,
            'intelligence': obj.intelligence,
            'wisdom': obj.wisdom,
            'charisma': obj.charisma
        }
    
    def get_ability_modifiers(self, obj):
        """Retorna modificadores de atributos"""
        return {
            'strength': obj.strength_modifier,
            'dexterity': obj.dexterity_modifier,
            'constitution': obj.constitution_modifier,
            'intelligence': obj.intelligence_modifier,
            'wisdom': obj.wisdom_modifier,
            'charisma': obj.charisma_modifier
        }
    
    def get_combat_stats(self, obj):
        """Retorna estatísticas de combate"""
        stats = {
            'armor_class': obj.armor_class,
            'initiative_bonus': obj.initiative_bonus,
            'proficiency_bonus': obj.proficiency_bonus
        }
        
        # Adicionar stats de spellcasting se aplicável
        if obj.character_class.is_spellcaster:
            stats.update({
                'spell_save_dc': obj.spell_save_dc,
                'spell_attack_bonus': obj.spell_attack_bonus
            })
        
        return stats
    
    def get_spell_slots_current(self, obj):
        """Retorna spell slots atuais"""
        slots = {}
        for i in range(1, 10):
            current = obj.get_current_spell_slots(i)
            if current > 0 or obj.get_max_spell_slots(i) > 0:
                slots[str(i)] = current
        return slots
    
    def get_spell_slots_max(self, obj):
        """Retorna spell slots máximos"""
        slots = {}
        for i in range(1, 10):
            maximum = obj.get_max_spell_slots(i)
            if maximum > 0:
                slots[str(i)] = maximum
        return slots


class CharacterCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de personagem com validações"""
    
    class Meta:
        model = Character
        fields = [
            'name', 'race', 'character_class', 'background',
            'base_strength', 'base_dexterity', 'base_constitution',
            'base_intelligence', 'base_wisdom', 'base_charisma'
        ]
    
    def validate(self, data):
        """Validações personalizadas"""
        # Validar Point Buy System
        ability_scores = [
            data.get('base_strength', 10),
            data.get('base_dexterity', 10),
            data.get('base_constitution', 10),
            data.get('base_intelligence', 10),
            data.get('base_wisdom', 10),
            data.get('base_charisma', 10)
        ]
        
        # Verificar limites individuais
        for score in ability_scores:
            if score < 8 or score > 15:
                raise serializers.ValidationError(
                    "Atributos devem estar entre 8 e 15 no Point Buy System"
                )
        
        # Calcular custo total
        cost_table = {8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9}
        total_cost = sum(cost_table.get(score, 0) for score in ability_scores)
        
        if total_cost > 27:
            raise serializers.ValidationError(
                f"Total de pontos excede 27 (Point Buy). Custo atual: {total_cost}"
            )
        
        return data
    
    def create(self, validated_data):
        """Cria personagem com user atual"""
        validated_data['user'] = self.context['request'].user
        validated_data['level'] = 1
        return super().create(validated_data)


class CharacterUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de personagem"""
    
    class Meta:
        model = Character
        fields = [
            'name', 'level', 'experience_points',
            'current_hp', 'temporary_hp',
            'custom_skill_proficiencies', 'custom_saving_throw_proficiencies'
        ]
    
    def validate_level(self, value):
        """Valida level"""
        if value < 1 or value > 20:
            raise serializers.ValidationError("Nível deve estar entre 1 e 20")
        return value
    
    def validate_current_hp(self, value):
        """Valida HP atual"""
        if value < 0:
            raise serializers.ValidationError("HP não pode ser negativo")
        return value


class SpellSearchSerializer(serializers.Serializer):
    """Serializer para busca de feitiços na Open5e API"""
    name = serializers.CharField()
    slug = serializers.CharField()
    level = serializers.IntegerField()
    school = serializers.CharField()
    classes = serializers.ListField(child=serializers.CharField())
    description = serializers.CharField()
    casting_time = serializers.CharField()
    range = serializers.CharField()
    components = serializers.CharField()
    duration = serializers.CharField()


class CampaignSerializer(serializers.ModelSerializer):
    """Serializer para Campaign"""
    dm = UserSerializer(read_only=True)
    players = UserSerializer(many=True, read_only=True)
    player_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'description', 'dm', 'players', 'player_count',
            'starting_level', 'max_level', 'allow_multiclass', 'point_buy_points',
            'homebrew_rules', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_player_count(self, obj):
        """Retorna número de jogadores"""
        return obj.players.count()
    
    def create(self, validated_data):
        """Cria campanha com DM atual"""
        validated_data['dm'] = self.context['request'].user
        return super().create(validated_data)


# ========================================
# SERIALIZERS PARA ACTIONS ESPECÍFICAS
# ========================================

class LevelUpSerializer(serializers.Serializer):
    """Serializer para level up"""
    confirm = serializers.BooleanField(default=True)
    
    def validate(self, data):
        character = self.context['character']
        if character.level >= 20:
            raise serializers.ValidationError("Personagem já está no nível máximo")
        return data


class RestSerializer(serializers.Serializer):
    """Serializer para descansos"""
    REST_CHOICES = [
        ('short', 'Short Rest'),
        ('long', 'Long Rest')
    ]
    
    rest_type = serializers.ChoiceField(choices=REST_CHOICES)


class TakeDamageSerializer(serializers.Serializer):
    """Serializer para aplicar dano"""
    damage = serializers.IntegerField(min_value=0)
    damage_type = serializers.CharField(required=False, allow_blank=True)


class HealSerializer(serializers.Serializer):
    """Serializer para cura"""
    healing = serializers.IntegerField(min_value=0)
    
    def validate_healing(self, value):
        character = self.context['character']
        if character.current_hp >= character.max_hp:
            raise serializers.ValidationError("Personagem já está com HP máximo")
        return value


class UseSpellSlotSerializer(serializers.Serializer):
    """Serializer para usar spell slot"""
    spell_level = serializers.IntegerField(min_value=1, max_value=9)
    
    def validate_spell_level(self, value):
        character = self.context['character']
        if not character.character_class.is_spellcaster:
            raise serializers.ValidationError("Este personagem não é spellcaster")
        
        current_slots = character.get_current_spell_slots(value)
        if current_slots <= 0:
            raise serializers.ValidationError(f"Sem spell slots de nível {value} disponíveis")
        
        return value    