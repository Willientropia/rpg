# apps/characters/admin.py - Configuração do Django Admin

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    Race, CharacterClass, ClassLevelProgression, Background, 
    Character, CharacterSpell, Equipment, CharacterEquipment,
    Campaign, CampaignCharacter
)


@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'get_ability_bonuses', 'has_api_data', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'slug']
    readonly_fields = ['created_at', 'updated_at', 'api_data']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug')
        }),
        ('Ability Score Bonuses', {
            'fields': (
                ('strength_bonus', 'dexterity_bonus'),
                ('constitution_bonus', 'intelligence_bonus'),
                ('wisdom_bonus', 'charisma_bonus')
            )
        }),
        ('API Integration', {
            'fields': ('api_data',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_ability_bonuses(self, obj):
        bonuses = []
        attrs = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
        for attr in attrs:
            bonus = getattr(obj, f'{attr}_bonus', 0)
            if bonus != 0:
                bonuses.append(f"{attr.title()[:3]} {bonus:+d}")
        return ", ".join(bonuses) if bonuses else "None"
    get_ability_bonuses.short_description = "Ability Bonuses"
    
    def has_api_data(self, obj):
        return "✅" if obj.api_data else "❌"
    has_api_data.short_description = "API Data"
    
    actions = ['fetch_api_data']
    
    def fetch_api_data(self, request, queryset):
        updated = 0
        for race in queryset:
            if race.fetch_api_data():
                updated += 1
        self.message_user(request, f"{updated} races updated from API")
    fetch_api_data.short_description = "Fetch data from Open5e API"


@admin.register(CharacterClass)
class CharacterClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'hit_die', 'is_spellcaster', 'spell_slots_type', 'has_api_data']
    list_filter = ['is_spellcaster', 'spell_slots_type', 'hit_die']
    search_fields = ['name', 'slug']
    readonly_fields = ['created_at', 'updated_at', 'api_data']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'hit_die', 'primary_ability')
        }),
        ('Spellcasting', {
            'fields': ('is_spellcaster', 'spellcasting_ability', 'spell_slots_type')
        }),
        ('Proficiencies', {
            'fields': ('saving_throw_proficiencies',)
        }),
        ('API Integration', {
            'fields': ('api_data',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def has_api_data(self, obj):
        return "✅" if obj.api_data else "❌"
    has_api_data.short_description = "API Data"
    
    actions = ['fetch_api_data']
    
    def fetch_api_data(self, request, queryset):
        updated = 0
        for char_class in queryset:
            if char_class.fetch_api_data():
                updated += 1
        self.message_user(request, f"{updated} classes updated from API")
    fetch_api_data.short_description = "Fetch data from Open5e API"


class ClassLevelProgressionInline(admin.TabularInline):
    model = ClassLevelProgression
    extra = 0
    fields = [
        'level', 'proficiency_bonus', 'cantrips_known', 'spells_known',
        'spell_slots_1', 'spell_slots_2', 'spell_slots_3', 'spell_slots_4', 'spell_slots_5'
    ]
    readonly_fields = ['proficiency_bonus']


@admin.register(ClassLevelProgression)
class ClassLevelProgressionAdmin(admin.ModelAdmin):
    list_display = ['character_class', 'level', 'proficiency_bonus', 'cantrips_known', 'get_spell_slots']
    list_filter = ['character_class', 'level']
    search_fields = ['character_class__name']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('character_class', 'level', 'proficiency_bonus')
        }),
        ('Spellcasting', {
            'fields': ('cantrips_known', 'spells_known')
        }),
        ('Spell Slots', {
            'fields': (
                ('spell_slots_1', 'spell_slots_2', 'spell_slots_3'),
                ('spell_slots_4', 'spell_slots_5', 'spell_slots_6'),
                ('spell_slots_7', 'spell_slots_8', 'spell_slots_9')
            )
        }),
        ('Features', {
            'fields': ('features_gained',)
        })
    )
    
    def get_spell_slots(self, obj):
        slots = []
        for i in range(1, 10):
            slot_count = getattr(obj, f'spell_slots_{i}', 0)
            if slot_count > 0:
                slots.append(f"{i}º:{slot_count}")
        return " | ".join(slots) if slots else "None"
    get_spell_slots.short_description = "Spell Slots"


@admin.register(Background)
class BackgroundAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'get_skills', 'has_api_data']
    search_fields = ['name', 'slug']
    readonly_fields = ['created_at', 'updated_at', 'api_data']
    
    def get_skills(self, obj):
        return ", ".join(obj.skill_proficiencies) if obj.skill_proficiencies else "None"
    get_skills.short_description = "Skill Proficiencies"
    
    def has_api_data(self, obj):
        return "✅" if obj.api_data else "❌"
    has_api_data.short_description = "API Data"


class CharacterSpellInline(admin.TabularInline):
    model = CharacterSpell
    extra = 0
    fields = ['spell_name', 'spell_level', 'is_prepared', 'is_known']
    readonly_fields = ['spell_name', 'spell_level']


class CharacterEquipmentInline(admin.TabularInline):
    model = CharacterEquipment
    extra = 0
    fields = ['equipment', 'quantity', 'is_equipped', 'is_attuned']


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'user', 'get_class_level', 'get_race', 'get_hp_status', 
        'get_ac', 'is_spellcaster', 'created_at'
    ]
    list_filter = [
        'character_class', 'race', 'level', 'character_class__is_spellcaster'
    ]
    search_fields = ['name', 'user__username', 'character_class__name', 'race__name']
    readonly_fields = [
        'created_at', 'updated_at', 'get_calculated_stats', 'get_modifiers',
        'max_hp', 'proficiency_bonus', 'armor_class', 'spell_save_dc'
    ]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'name', 'race', 'character_class', 'background')
        }),
        ('Level & Experience', {
            'fields': ('level', 'experience_points')
        }),
        ('Base Ability Scores', {
            'fields': (
                ('base_strength', 'base_dexterity'),
                ('base_constitution', 'base_intelligence'),
                ('base_wisdom', 'base_charisma')
            )
        }),
        ('Health & Resources', {
            'fields': (
                ('current_hp', 'max_hp', 'temporary_hp'),
            )
        }),
        ('Current Spell Slots', {
            'fields': (
                ('current_spell_slots_1', 'current_spell_slots_2', 'current_spell_slots_3'),
                ('current_spell_slots_4', 'current_spell_slots_5', 'current_spell_slots_6'),
                ('current_spell_slots_7', 'current_spell_slots_8', 'current_spell_slots_9')
            ),
            'classes': ('collapse',)
        }),
        ('Custom Proficiencies', {
            'fields': ('custom_skill_proficiencies', 'custom_saving_throw_proficiencies'),
            'classes': ('collapse',)
        }),
        ('Calculated Stats', {
            'fields': ('get_calculated_stats', 'get_modifiers'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [CharacterSpellInline, CharacterEquipmentInline]
    
    def get_class_level(self, obj):
        return f"{obj.character_class.name} {obj.level}"
    get_class_level.short_description = "Class & Level"
    
    def get_race(self, obj):
        return obj.race.name
    get_race.short_description = "Race"
    
    def get_hp_status(self, obj):
        percentage = (obj.current_hp / obj.max_hp) * 100 if obj.max_hp > 0 else 0
        color = "green" if percentage > 75 else "orange" if percentage > 25 else "red"
        return format_html(
            '<span style="color: {};">{}/{}</span>',
            color, obj.current_hp, obj.max_hp
        )
    get_hp_status.short_description = "HP"
    
    def get_ac(self, obj):
        return obj.armor_class
    get_ac.short_description = "AC"
    
    def is_spellcaster(self, obj):
        return "✅" if obj.character_class.is_spellcaster else "❌"
    is_spellcaster.short_description = "Spellcaster"
    
    def get_calculated_stats(self, obj):
        return format_html(
            "<strong>Final Abilities:</strong><br>"
            "STR: {} | DEX: {} | CON: {}<br>"
            "INT: {} | WIS: {} | CHA: {}<br><br>"
            "<strong>Combat Stats:</strong><br>"
            "AC: {} | Initiative: {:+d}<br>"
            "Proficiency Bonus: {:+d}<br>"
            "{}",
            obj.strength, obj.dexterity, obj.constitution,
            obj.intelligence, obj.wisdom, obj.charisma,
            obj.armor_class, obj.initiative_bonus,
            obj.proficiency_bonus,
            f"Spell Save DC: {obj.spell_save_dc} | Spell Attack: {obj.spell_attack_bonus:+d}" 
            if obj.character_class.is_spellcaster else ""
        )
    get_calculated_stats.short_description = "Calculated Stats"
    
    def get_modifiers(self, obj):
        return format_html(
            "STR: {:+d} | DEX: {:+d} | CON: {:+d}<br>"
            "INT: {:+d} | WIS: {:+d} | CHA: {:+d}",
            obj.strength_modifier, obj.dexterity_modifier, obj.constitution_modifier,
            obj.intelligence_modifier, obj.wisdom_modifier, obj.charisma_modifier
        )
    get_modifiers.short_description = "Ability Modifiers"
    
    actions = ['level_up_characters', 'long_rest', 'short_rest']
    
    def level_up_characters(self, request, queryset):
        leveled_up = 0
        for character in queryset:
            if character.level_up():
                leveled_up += 1
        self.message_user(request, f"{leveled_up} characters leveled up")
    level_up_characters.short_description = "Level up selected characters"
    
    def long_rest(self, request, queryset):
        for character in queryset:
            character.rest_long()
        self.message_user(request, f"{queryset.count()} characters took a long rest")
    long_rest.short_description = "Long rest for selected characters"
    
    def short_rest(self, request, queryset):
        for character in queryset:
            character.rest_short()
        self.message_user(request, f"{queryset.count()} characters took a short rest")
    short_rest.short_description = "Short rest for selected characters"


@admin.register(CharacterSpell)
class CharacterSpellAdmin(admin.ModelAdmin):
    list_display = ['character', 'spell_name', 'spell_level', 'is_prepared', 'is_known']
    list_filter = ['spell_level', 'is_prepared', 'is_known', 'character__character_class']
    search_fields = ['spell_name', 'spell_slug', 'character__name']
    readonly_fields = ['created_at', 'api_data']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('character', 'spell_slug', 'spell_name', 'spell_level')
        }),
        ('Status', {
            'fields': ('is_prepared', 'is_known')
        }),
        ('API Data', {
            'fields': ('api_data',),
            'classes': ('collapse',)
        })
    )
    
    actions = ['fetch_spell_data']
    
    def fetch_spell_data(self, request, queryset):
        updated = 0
        for spell in queryset:
            if spell.fetch_spell_data():
                updated += 1
        self.message_user(request, f"{updated} spells updated from API")
    fetch_spell_data.short_description = "Fetch spell data from Open5e API"


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'equipment_type', 'cost', 'weight']
    list_filter = ['equipment_type']
    search_fields = ['name', 'slug']


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'dm', 'get_player_count', 'starting_level', 'created_at']
    list_filter = ['starting_level', 'max_level', 'allow_multiclass']
    search_fields = ['name', 'dm__username']
    filter_horizontal = ['players']
    
    def get_player_count(self, obj):
        return obj.players.count()
    get_player_count.short_description = "Players"


# Configuração personalizada do Admin Site
admin.site.site_header = "D&D Character Creator Admin"
admin.site.site_title = "D&D Admin"
admin.site.index_title = "D&D Character Creator Administration"