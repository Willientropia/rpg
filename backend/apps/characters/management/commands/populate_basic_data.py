# apps/characters/management/commands/populate_basic_data.py

from django.core.management.base import BaseCommand
from apps.characters.models import Race, CharacterClass, Background, ClassLevelProgression


class Command(BaseCommand):
    help = 'Popula dados básicos de D&D 5e (raças, classes, backgrounds)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--races',
            action='store_true',
            help='Popular apenas raças',
        )
        parser.add_argument(
            '--classes',
            action='store_true',
            help='Popular apenas classes',
        )
        parser.add_argument(
            '--backgrounds',
            action='store_true',
            help='Popular apenas backgrounds',
        )
        parser.add_argument(
            '--progressions',
            action='store_true',
            help='Popular progressões de classe',
        )

    def handle(self, *args, **options):
        if options['races'] or not any([options['races'], options['classes'], options['backgrounds'], options['progressions']]):
            self.create_races()
        
        if options['classes'] or not any([options['races'], options['classes'], options['backgrounds'], options['progressions']]):
            self.create_classes()
        
        if options['backgrounds'] or not any([options['races'], options['classes'], options['backgrounds'], options['progressions']]):
            self.create_backgrounds()
        
        if options['progressions'] or not any([options['races'], options['classes'], options['backgrounds'], options['progressions']]):
            self.create_class_progressions()

        self.stdout.write(
            self.style.SUCCESS('Dados básicos criados com sucesso!')
        )

    def create_races(self):
        """Cria as raças básicas do SRD"""
        self.stdout.write('Criando raças...')
        
        races_data = [
            {
                'slug': 'dragonborn',
                'name': 'Dragonborn',
                'strength_bonus': 2,
                'charisma_bonus': 1,
            },
            {
                'slug': 'dwarf',
                'name': 'Dwarf',
                'constitution_bonus': 2,
            },
            {
                'slug': 'elf',
                'name': 'Elf',
                'dexterity_bonus': 2,
            },
            {
                'slug': 'gnome',
                'name': 'Gnome',
                'intelligence_bonus': 2,
                'constitution_bonus': 1,
            },
            {
                'slug': 'half-elf',
                'name': 'Half-Elf',
                'charisma_bonus': 2,
                # Half-elf ganha +1 em dois outros atributos à escolha
            },
            {
                'slug': 'half-orc',
                'name': 'Half-Orc',
                'strength_bonus': 2,
                'constitution_bonus': 1,
            },
            {
                'slug': 'halfling',
                'name': 'Halfling',
                'dexterity_bonus': 2,
            },
            {
                'slug': 'human',
                'name': 'Human',
                'strength_bonus': 1,
                'dexterity_bonus': 1,
                'constitution_bonus': 1,
                'intelligence_bonus': 1,
                'wisdom_bonus': 1,
                'charisma_bonus': 1,
            },
            {
                'slug': 'tiefling',
                'name': 'Tiefling',
                'intelligence_bonus': 1,
                'charisma_bonus': 2,
            }
        ]
        
        for race_data in races_data:
            race, created = Race.objects.get_or_create(
                slug=race_data['slug'],
                defaults=race_data
            )
            if created:
                self.stdout.write(f'  ✓ Criada raça: {race.name}')
            else:
                self.stdout.write(f'  - Raça já existe: {race.name}')

    def create_classes(self):
        """Cria as classes básicas do SRD"""
        self.stdout.write('Criando classes...')
        
        classes_data = [
            {
                'slug': 'barbarian',
                'name': 'Barbarian',
                'hit_die': 12,
                'primary_ability': 'strength',
                'saving_throw_proficiencies': ['strength', 'constitution'],
                'is_spellcaster': False,
                'spell_slots_type': 'none'
            },
            {
                'slug': 'bard',
                'name': 'Bard',
                'hit_die': 8,
                'primary_ability': 'charisma',
                'saving_throw_proficiencies': ['dexterity', 'charisma'],
                'is_spellcaster': True,
                'spellcasting_ability': 'charisma',
                'spell_slots_type': 'full'
            },
            {
                'slug': 'cleric',
                'name': 'Cleric',
                'hit_die': 8,
                'primary_ability': 'wisdom',
                'saving_throw_proficiencies': ['wisdom', 'charisma'],
                'is_spellcaster': True,
                'spellcasting_ability': 'wisdom',
                'spell_slots_type': 'full'
            },
            {
                'slug': 'druid',
                'name': 'Druid',
                'hit_die': 8,
                'primary_ability': 'wisdom',
                'saving_throw_proficiencies': ['intelligence', 'wisdom'],
                'is_spellcaster': True,
                'spellcasting_ability': 'wisdom',
                'spell_slots_type': 'full'
            },
            {
                'slug': 'fighter',
                'name': 'Fighter',
                'hit_die': 10,
                'primary_ability': 'strength',
                'saving_throw_proficiencies': ['strength', 'constitution'],
                'is_spellcaster': False,
                'spell_slots_type': 'none'
            },
            {
                'slug': 'monk',
                'name': 'Monk',
                'hit_die': 8,
                'primary_ability': 'dexterity',
                'saving_throw_proficiencies': ['strength', 'dexterity'],
                'is_spellcaster': False,
                'spell_slots_type': 'none'
            },
            {
                'slug': 'paladin',
                'name': 'Paladin',
                'hit_die': 10,
                'primary_ability': 'strength',
                'saving_throw_proficiencies': ['wisdom', 'charisma'],
                'is_spellcaster': True,
                'spellcasting_ability': 'charisma',
                'spell_slots_type': 'half'
            },
            {
                'slug': 'ranger',
                'name': 'Ranger',
                'hit_die': 10,
                'primary_ability': 'dexterity',
                'saving_throw_proficiencies': ['strength', 'dexterity'],
                'is_spellcaster': True,
                'spellcasting_ability': 'wisdom',
                'spell_slots_type': 'half'
            },
            {
                'slug': 'rogue',
                'name': 'Rogue',
                'hit_die': 8,
                'primary_ability': 'dexterity',
                'saving_throw_proficiencies': ['dexterity', 'intelligence'],
                'is_spellcaster': False,
                'spell_slots_type': 'none'
            },
            {
                'slug': 'sorcerer',
                'name': 'Sorcerer',
                'hit_die': 6,
                'primary_ability': 'charisma',
                'saving_throw_proficiencies': ['constitution', 'charisma'],
                'is_spellcaster': True,
                'spellcasting_ability': 'charisma',
                'spell_slots_type': 'full'
            },
            {
                'slug': 'warlock',
                'name': 'Warlock',
                'hit_die': 8,
                'primary_ability': 'charisma',
                'saving_throw_proficiencies': ['wisdom', 'charisma'],
                'is_spellcaster': True,
                'spellcasting_ability': 'charisma',
                'spell_slots_type': 'warlock'
            },
            {
                'slug': 'wizard',
                'name': 'Wizard',
                'hit_die': 6,
                'primary_ability': 'intelligence',
                'saving_throw_proficiencies': ['intelligence', 'wisdom'],
                'is_spellcaster': True,
                'spellcasting_ability': 'intelligence',
                'spell_slots_type': 'full'
            }
        ]
        
        for class_data in classes_data:
            char_class, created = CharacterClass.objects.get_or_create(
                slug=class_data['slug'],
                defaults=class_data
            )
            if created:
                self.stdout.write(f'  ✓ Criada classe: {char_class.name}')
            else:
                self.stdout.write(f'  - Classe já existe: {char_class.name}')

    def create_backgrounds(self):
        """Cria os backgrounds básicos do SRD"""
        self.stdout.write('Criando backgrounds...')
        
        backgrounds_data = [
            {
                'slug': 'acolyte',
                'name': 'Acolyte',
                'skill_proficiencies': ['insight', 'religion'],
                'tool_proficiencies': [],
                'languages': ['two_of_choice']
            },
            {
                'slug': 'criminal',
                'name': 'Criminal',
                'skill_proficiencies': ['deception', 'stealth'],
                'tool_proficiencies': ['thieves_tools', 'gaming_set'],
                'languages': []
            },
            {
                'slug': 'folk-hero',
                'name': 'Folk Hero',
                'skill_proficiencies': ['animal_handling', 'survival'],
                'tool_proficiencies': ['artisan_tools', 'vehicles_land'],
                'languages': []
            },
            {
                'slug': 'noble',
                'name': 'Noble',
                'skill_proficiencies': ['history', 'persuasion'],
                'tool_proficiencies': ['gaming_set'],
                'languages': ['one_of_choice']
            },
            {
                'slug': 'sage',
                'name': 'Sage',
                'skill_proficiencies': ['arcana', 'history'],
                'tool_proficiencies': [],
                'languages': ['two_of_choice']
            },
            {
                'slug': 'soldier',
                'name': 'Soldier',
                'skill_proficiencies': ['athletics', 'intimidation'],
                'tool_proficiencies': ['gaming_set', 'vehicles_land'],
                'languages': []
            }
        ]
        
        for bg_data in backgrounds_data:
            background, created = Background.objects.get_or_create(
                slug=bg_data['slug'],
                defaults=bg_data
            )
            if created:
                self.stdout.write(f'  ✓ Criado background: {background.name}')
            else:
                self.stdout.write(f'  - Background já existe: {background.name}')

    def create_class_progressions(self):
        """Cria progressões básicas para algumas classes (exemplo)"""
        self.stdout.write('Criando progressões de classe...')
        
        # Exemplo: Fighter progression (sem spells)
        try:
            fighter = CharacterClass.objects.get(slug='fighter')
            self.create_fighter_progression(fighter)
        except CharacterClass.DoesNotExist:
            self.stdout.write('  ! Fighter não encontrado, criando classes primeiro')
        
        # Exemplo: Wizard progression (full caster)
        try:
            wizard = CharacterClass.objects.get(slug='wizard')
            self.create_wizard_progression(wizard)
        except CharacterClass.DoesNotExist:
            self.stdout.write('  ! Wizard não encontrado, criando classes primeiro')

    def create_fighter_progression(self, fighter_class):
        """Cria progressão do Fighter"""
        fighter_data = [
            # Level 1
            {
                'level': 1,
                'proficiency_bonus': 2,
                'features_gained': ['Fighting Style', 'Second Wind']
            },
            # Level 2
            {
                'level': 2,
                'proficiency_bonus': 2,
                'features_gained': ['Action Surge (1 use)']
            },
            # Level 3
            {
                'level': 3,
                'proficiency_bonus': 2,
                'features_gained': ['Martial Archetype']
            },
            # Level 4
            {
                'level': 4,
                'proficiency_bonus': 2,
                'features_gained': ['Ability Score Improvement']
            },
            # Level 5
            {
                'level': 5,
                'proficiency_bonus': 3,
                'features_gained': ['Extra Attack']
            }
            # Adicionar mais níveis conforme necessário
        ]
        
        for level_data in fighter_data:
            progression, created = ClassLevelProgression.objects.get_or_create(
                character_class=fighter_class,
                level=level_data['level'],
                defaults=level_data
            )
            if created:
                self.stdout.write(f'  ✓ Fighter nível {level_data["level"]} criado')

    def create_wizard_progression(self, wizard_class):
        """Cria progressão do Wizard"""
        wizard_data = [
            # Level 1
            {
                'level': 1,
                'proficiency_bonus': 2,
                'cantrips_known': 3,
                'spell_slots_1': 2,
                'features_gained': ['Spellcasting', 'Arcane Recovery']
            },
            # Level 2
            {
                'level': 2,
                'proficiency_bonus': 2,
                'cantrips_known': 3,
                'spell_slots_1': 3,
                'features_gained': ['Arcane Tradition']
            },
            # Level 3
            {
                'level': 3,
                'proficiency_bonus': 2,
                'cantrips_known': 3,
                'spell_slots_1': 4,
                'spell_slots_2': 2,
                'features_gained': []
            },
            # Level 4
            {
                'level': 4,
                'proficiency_bonus': 2,
                'cantrips_known': 4,
                'spell_slots_1': 4,
                'spell_slots_2': 3,
                'features_gained': ['Ability Score Improvement']
            },
            # Level 5
            {
                'level': 5,
                'proficiency_bonus': 3,
                'cantrips_known': 4,
                'spell_slots_1': 4,
                'spell_slots_2': 3,
                'spell_slots_3': 2,
                'features_gained': []
            }
        ]
        
        for level_data in wizard_data:
            progression, created = ClassLevelProgression.objects.get_or_create(
                character_class=wizard_class,
                level=level_data['level'],
                defaults=level_data
            )
            if created:
                self.stdout.write(f'  ✓ Wizard nível {level_data["level"]} criado')


# ===================================
# COMANDO SEPARADO PARA SYNC API
# ===================================

# apps/characters/management/commands/sync_open5e.py

from django.core.management.base import BaseCommand
from apps.characters.models import Race, CharacterClass, Background
import requests
import time


class SyncOpen5eCommand(BaseCommand):
    help = 'Sincroniza dados com a Open5e API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--races',
            action='store_true',
            help='Sincronizar apenas raças',
        )
        parser.add_argument(
            '--classes',
            action='store_true',
            help='Sincronizar apenas classes',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forçar atualização mesmo se já tem dados',
        )

    def handle(self, *args, **options):
        if options['races'] or not any([options['races'], options['classes']]):
            self.sync_races(options['force'])
        
        if options['classes'] or not any([options['races'], options['classes']]):
            self.sync_classes(options['force'])

        self.stdout.write(
            self.style.SUCCESS('Sincronização com Open5e API concluída!')
        )

    def sync_races(self, force=False):
        """Sincroniza raças com a API"""
        self.stdout.write('Sincronizando raças...')
        
        races = Race.objects.all()
        if not force:
            races = races.filter(api_data__isnull=True)
        
        for race in races:
            self.stdout.write(f'  Sincronizando {race.name}...')
            try:
                if race.fetch_api_data():
                    self.stdout.write(f'    ✓ {race.name} atualizada')
                else:
                    self.stdout.write(f'    ✗ Falha ao atualizar {race.name}')
            except Exception as e:
                self.stdout.write(f'    ✗ Erro: {e}')
            
            # Delay para não sobrecarregar a API
            time.sleep(0.5)

    def sync_classes(self, force=False):
        """Sincroniza classes com a API"""
        self.stdout.write('Sincronizando classes...')
        
        classes = CharacterClass.objects.all()
        if not force:
            classes = classes.filter(api_data__isnull=True)
        
        for char_class in classes:
            self.stdout.write(f'  Sincronizando {char_class.name}...')
            try:
                if char_class.fetch_api_data():
                    self.stdout.write(f'    ✓ {char_class.name} atualizada')
                else:
                    self.stdout.write(f'    ✗ Falha ao atualizar {char_class.name}')
            except Exception as e:
                self.stdout.write(f'    ✗ Erro: {e}')
            
            time.sleep(0.5)