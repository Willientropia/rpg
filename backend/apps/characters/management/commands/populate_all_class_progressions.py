from django.core.management.base import BaseCommand
from django.db import transaction
from apps.characters.models import CharacterClass, ClassProgression


class Command(BaseCommand):
    """
    Este comando popula o banco de dados com as progressões de nível para todas as
    classes padrão de Dungeons & Dragons 5ª Edição.
    """
    help = 'Popula progressões para todas as classes de D&D 5e'

    def add_arguments(self, parser):
        """
        Adiciona um argumento opcional para sobrescrever os dados existentes.
        """
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='Sobrescreve as progressões de classe existentes no banco de dados.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        """
        Lógica principal do comando. Itera sobre cada classe e popula sua progressão.
        """
        overwrite = options['overwrite']

        progressions_data = {
            'artificer': self.get_artificer_progression(),
            'barbarian': self.get_barbarian_progression(),
            'bard': self.get_bard_progression(),
            'cleric': self.get_cleric_progression(),
            'druid': self.get_druid_progression(),
            'fighter': self.get_fighter_progression(),
            'monk': self.get_monk_progression(),
            'paladin': self.get_paladin_progression(),
            'ranger': self.get_ranger_progression(),
            'rogue': self.get_rogue_progression(),
            'sorcerer': self.get_sorcerer_progression(),
            'warlock': self.get_warlock_progression(),
            'wizard': self.get_wizard_progression(),
        }

        self.stdout.write(self.style.SUCCESS("Iniciando a população das progressões de classe..."))

        for class_slug, progression_list in progressions_data.items():
            try:
                character_class = CharacterClass.objects.get(name__iexact=class_slug)
                
                if overwrite:
                    # Remove progressões existentes para esta classe
                    count, _ = ClassProgression.objects.filter(character_class=character_class).delete()
                    if count > 0:
                        self.stdout.write(f'  - Removidas {count} progressões existentes para {character_class.name}')

                # Cria novas progressões
                for level_data in progression_list:
                    progression, created = ClassProgression.objects.get_or_create(
                        character_class=character_class,
                        level=level_data['level'],
                        defaults=level_data
                    )
                    
                    if created:
                        self.stdout.write(f'  - Criada progressão nível {level_data["level"]} para {character_class.name}')
                    elif overwrite:
                        # Se não foi criado mas overwrite é true, significa que atualizamos
                         self.stdout.write(f'  - Sobrescrita progressão nível {level_data["level"]} para {character_class.name}')
                    else:
                        self.stdout.write(f'  - Progressão nível {level_data["level"]} para {character_class.name} já existe. Pulando.')

            except CharacterClass.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'CLASSE NÃO ENCONTRADA: A classe "{class_slug}" não foi encontrada no banco de dados.')
                )

        self.stdout.write(
            self.style.SUCCESS('✨ Processo de população concluído com sucesso!')
        )

    # =================================================================================
    # DADOS DE PROGRESSÃO POR CLASSE
    # =================================================================================

    def get_artificer_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Magical Tinkering', 'Spellcasting'], 'cantrips_known': 2, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Infuse Item'], 'cantrips_known': 2, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 4, 'infused_items': 2},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Artificer Specialist', 'The Right Tool for the Job'], 'cantrips_known': 2, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 4, 'infused_items': 2},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'cantrips_known': 2, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 4, 'infused_items': 2},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Artificer Specialist feature'], 'cantrips_known': 2, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 4, 'infused_items': 2},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Tool Expertise'], 'cantrips_known': 2, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 6, 'infused_items': 3},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Flash of Genius'], 'cantrips_known': 2, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 6, 'infused_items': 3},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'cantrips_known': 2, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 6, 'infused_items': 3},
            {'level': 9, 'proficiency_bonus': 4, 'features': ['Artificer Specialist feature'], 'cantrips_known': 2, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 6, 'infused_items': 3},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Magic Item Adept'], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 8, 'infused_items': 4},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Spell-Storing Item'], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 8, 'infused_items': 4},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'infusions_known': 8, 'infused_items': 4},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'infusions_known': 8, 'infused_items': 4},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Magic Item Savant'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'infusions_known': 10, 'infused_items': 5},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Artificer Specialist feature'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'infusions_known': 10, 'infused_items': 5},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'infusions_known': 10, 'infused_items': 5},
            {'level': 17, 'proficiency_bonus': 6, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'infusions_known': 10, 'infused_items': 5},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Magic Item Master'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'infusions_known': 12, 'infused_items': 6},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'infusions_known': 12, 'infused_items': 6},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Soul of Artifice'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'infusions_known': 12, 'infused_items': 6},
        ]

    def get_barbarian_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Rage', 'Unarmored Defense'], 'rages': 2, 'rage_damage': 2},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Reckless Attack', 'Danger Sense'], 'rages': 2, 'rage_damage': 2},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Primal Path'], 'rages': 3, 'rage_damage': 2},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'rages': 3, 'rage_damage': 2},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Extra Attack', 'Fast Movement'], 'rages': 3, 'rage_damage': 2},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Primal Path feature'], 'rages': 4, 'rage_damage': 2},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Feral Instinct'], 'rages': 4, 'rage_damage': 2},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'rages': 4, 'rage_damage': 2},
            {'level': 9, 'proficiency_bonus': 4, 'features': ['Brutal Critical (1 die)'], 'rages': 4, 'rage_damage': 3},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Primal Path feature'], 'rages': 4, 'rage_damage': 3},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Relentless Rage'], 'rages': 4, 'rage_damage': 3},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'rages': 5, 'rage_damage': 3},
            {'level': 13, 'proficiency_bonus': 5, 'features': ['Brutal Critical (2 dice)'], 'rages': 5, 'rage_damage': 3},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Primal Path feature'], 'rages': 5, 'rage_damage': 3},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Persistent Rage'], 'rages': 5, 'rage_damage': 3},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'rages': 5, 'rage_damage': 4},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Brutal Critical (3 dice)'], 'rages': 6, 'rage_damage': 4},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Indomitable Might'], 'rages': 6, 'rage_damage': 4},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'rages': 6, 'rage_damage': 4},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Primal Champion'], 'rages': 'Unlimited', 'rage_damage': 4},
        ]

    def get_bard_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Spellcasting', 'Bardic Inspiration (d6)'], 'cantrips_known': 2, 'spells_known': 4, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Jack of All Trades', 'Song of Rest (d6)'], 'cantrips_known': 2, 'spells_known': 5, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Bard College', 'Expertise'], 'cantrips_known': 2, 'spells_known': 6, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'cantrips_known': 3, 'spells_known': 7, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Bardic Inspiration (d8)', 'Font of Inspiration'], 'cantrips_known': 3, 'spells_known': 8, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Countercharm', 'Bard College feature'], 'cantrips_known': 3, 'spells_known': 9, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 3, 'spells_known': 10, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'cantrips_known': 3, 'spells_known': 11, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': ['Song of Rest (d8)'], 'cantrips_known': 3, 'spells_known': 12, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Bardic Inspiration (d10)', 'Expertise', 'Magical Secrets'], 'cantrips_known': 4, 'spells_known': 14, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 4, 'spells_known': 15, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spells_known': 15, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': ['Song of Rest (d10)'], 'cantrips_known': 4, 'spells_known': 16, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Magical Secrets', 'Bard College feature'], 'cantrips_known': 4, 'spells_known': 18, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Bardic Inspiration (d12)'], 'cantrips_known': 4, 'spells_known': 19, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spells_known': 19, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Song of Rest (d12)'], 'cantrips_known': 4, 'spells_known': 20, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Magical Secrets'], 'cantrips_known': 4, 'spells_known': 22, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spells_known': 22, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Superior Inspiration'], 'cantrips_known': 4, 'spells_known': 22, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 2, 'spell_slots_8': 1, 'spell_slots_9': 1},
        ]

    def get_cleric_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Spellcasting', 'Divine Domain'], 'cantrips_known': 3, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Channel Divinity (1/rest)', 'Divine Domain feature'], 'cantrips_known': 3, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': [], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Destroy Undead (CR 1/2)'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Channel Divinity (2/rest)', 'Divine Domain feature'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement', 'Destroy Undead (CR 1)', 'Divine Domain feature'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Divine Intervention'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Destroy Undead (CR 2)'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Destroy Undead (CR 3)'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Destroy Undead (CR 4)', 'Divine Domain feature'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Channel Divinity (3/rest)'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Divine Intervention Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 2, 'spell_slots_8': 1, 'spell_slots_9': 1},
        ]

    def get_druid_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Druidic', 'Spellcasting'], 'cantrips_known': 2, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Wild Shape', 'Druid Circle'], 'cantrips_known': 2, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': [], 'cantrips_known': 2, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Wild Shape Improvement', 'Ability Score Improvement'], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Druid Circle feature'], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Wild Shape Improvement', 'Ability Score Improvement'], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Druid Circle feature'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Druid Circle feature'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Timeless Body', 'Beast Spells'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Archdruid'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 2, 'spell_slots_8': 1, 'spell_slots_9': 1},
        ]

    def get_fighter_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Fighting Style', 'Second Wind']},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Action Surge (one use)']},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Martial Archetype']},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement']},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Extra Attack']},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement']},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Martial Archetype feature']},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement']},
            {'level': 9, 'proficiency_bonus': 4, 'features': ['Indomitable (one use)']},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Martial Archetype feature']},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Extra Attack (2)']},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement']},
            {'level': 13, 'proficiency_bonus': 5, 'features': ['Indomitable (two uses)']},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement']},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Martial Archetype feature']},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement']},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Action Surge (two uses)', 'Indomitable (three uses)']},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Martial Archetype feature']},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement']},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Extra Attack (3)']},
        ]

    def get_monk_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Unarmored Defense', 'Martial Arts'], 'martial_arts': '1d4', 'ki_points': 0, 'unarmored_movement': '+0 ft.'},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Ki', 'Unarmored Movement'], 'martial_arts': '1d4', 'ki_points': 2, 'unarmored_movement': '+10 ft.'},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Monastic Tradition', 'Deflect Missiles'], 'martial_arts': '1d4', 'ki_points': 3, 'unarmored_movement': '+10 ft.'},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement', 'Slow Fall'], 'martial_arts': '1d4', 'ki_points': 4, 'unarmored_movement': '+10 ft.'},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Extra Attack', 'Stunning Strike'], 'martial_arts': '1d6', 'ki_points': 5, 'unarmored_movement': '+10 ft.'},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Ki-Empowered Strikes', 'Monastic Tradition feature'], 'martial_arts': '1d6', 'ki_points': 6, 'unarmored_movement': '+15 ft.'},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Evasion', 'Stillness of Mind'], 'martial_arts': '1d6', 'ki_points': 7, 'unarmored_movement': '+15 ft.'},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'martial_arts': '1d6', 'ki_points': 8, 'unarmored_movement': '+15 ft.'},
            {'level': 9, 'proficiency_bonus': 4, 'features': ['Unarmored Movement improvement'], 'martial_arts': '1d6', 'ki_points': 9, 'unarmored_movement': '+15 ft.'},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Purity of Body'], 'martial_arts': '1d6', 'ki_points': 10, 'unarmored_movement': '+20 ft.'},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Monastic Tradition feature'], 'martial_arts': '1d8', 'ki_points': 11, 'unarmored_movement': '+20 ft.'},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'martial_arts': '1d8', 'ki_points': 12, 'unarmored_movement': '+20 ft.'},
            {'level': 13, 'proficiency_bonus': 5, 'features': ['Tongue of the Sun and Moon'], 'martial_arts': '1d8', 'ki_points': 13, 'unarmored_movement': '+20 ft.'},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Diamond Soul'], 'martial_arts': '1d8', 'ki_points': 14, 'unarmored_movement': '+25 ft.'},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Timeless Body'], 'martial_arts': '1d8', 'ki_points': 15, 'unarmored_movement': '+25 ft.'},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'martial_arts': '1d8', 'ki_points': 16, 'unarmored_movement': '+25 ft.'},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Monastic Tradition feature'], 'martial_arts': '1d10', 'ki_points': 17, 'unarmored_movement': '+25 ft.'},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Empty Body'], 'martial_arts': '1d10', 'ki_points': 18, 'unarmored_movement': '+30 ft.'},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'martial_arts': '1d10', 'ki_points': 19, 'unarmored_movement': '+30 ft.'},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Perfect Self'], 'martial_arts': '1d10', 'ki_points': 20, 'unarmored_movement': '+30 ft.'},
        ]

    def get_paladin_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Divine Sense', 'Lay on Hands'], 'spell_slots_1': 0, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Fighting Style', 'Spellcasting', 'Divine Smite'], 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Divine Health', 'Sacred Oath'], 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Extra Attack'], 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Aura of Protection'], 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Sacred Oath feature'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Aura of Courage'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Improved Divine Smite'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Cleansing Touch'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Sacred Oath feature'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': [], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Aura improvements'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Sacred Oath feature'], 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2},
        ]

    def get_ranger_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Favored Enemy', 'Natural Explorer'], 'spells_known': 0, 'spell_slots_1': 0, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Fighting Style', 'Spellcasting'], 'spells_known': 2, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Ranger Archetype', 'Primeval Awareness'], 'spells_known': 3, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'spells_known': 3, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Extra Attack'], 'spells_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Favored Enemy and Natural Explorer improvements'], 'spells_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Ranger Archetype feature'], 'spells_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement', 'Land\'s Stride'], 'spells_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'spells_known': 6, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Natural Explorer improvement', 'Hide in Plain Sight'], 'spells_known': 6, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Ranger Archetype feature'], 'spells_known': 7, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'spells_known': 7, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'spells_known': 8, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Favored Enemy improvement', 'Vanish'], 'spells_known': 8, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Ranger Archetype feature'], 'spells_known': 9, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'spells_known': 9, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': [], 'spells_known': 10, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Feral Senses'], 'spells_known': 10, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'spells_known': 11, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Foe Slayer'], 'spells_known': 11, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2},
        ]

    def get_rogue_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Expertise', 'Sneak Attack (1d6)', 'Thieves\' Cant'], 'sneak_attack': '1d6'},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Cunning Action'], 'sneak_attack': '1d6'},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Roguish Archetype', 'Sneak Attack (2d6)'], 'sneak_attack': '2d6'},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'sneak_attack': '2d6'},
            {'level': 5, 'proficiency_bonus': 3, 'features': ['Uncanny Dodge', 'Sneak Attack (3d6)'], 'sneak_attack': '3d6'},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Expertise'], 'sneak_attack': '3d6'},
            {'level': 7, 'proficiency_bonus': 3, 'features': ['Evasion', 'Sneak Attack (4d6)'], 'sneak_attack': '4d6'},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'sneak_attack': '4d6'},
            {'level': 9, 'proficiency_bonus': 4, 'features': ['Roguish Archetype feature', 'Sneak Attack (5d6)'], 'sneak_attack': '5d6'},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'sneak_attack': '5d6'},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Reliable Talent', 'Sneak Attack (6d6)'], 'sneak_attack': '6d6'},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'sneak_attack': '6d6'},
            {'level': 13, 'proficiency_bonus': 5, 'features': ['Roguish Archetype feature', 'Sneak Attack (7d6)'], 'sneak_attack': '7d6'},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Blindsense'], 'sneak_attack': '7d6'},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Slippery Mind', 'Sneak Attack (8d6)'], 'sneak_attack': '8d6'},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'sneak_attack': '8d6'},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Roguish Archetype feature', 'Sneak Attack (9d6)'], 'sneak_attack': '9d6'},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Elusive'], 'sneak_attack': '9d6'},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement', 'Sneak Attack (10d6)'], 'sneak_attack': '10d6'},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Stroke of Luck'], 'sneak_attack': '10d6'},
        ]

    def get_sorcerer_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Spellcasting', 'Sorcerous Origin'], 'sorcery_points': 0, 'cantrips_known': 4, 'spells_known': 2, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Font of Magic'], 'sorcery_points': 2, 'cantrips_known': 4, 'spells_known': 3, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Metamagic'], 'sorcery_points': 3, 'cantrips_known': 4, 'spells_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'sorcery_points': 4, 'cantrips_known': 5, 'spells_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': [], 'sorcery_points': 5, 'cantrips_known': 5, 'spells_known': 6, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Sorcerous Origin feature'], 'sorcery_points': 6, 'cantrips_known': 5, 'spells_known': 7, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': [], 'sorcery_points': 7, 'cantrips_known': 5, 'spells_known': 8, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'sorcery_points': 8, 'cantrips_known': 5, 'spells_known': 9, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'sorcery_points': 9, 'cantrips_known': 5, 'spells_known': 10, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Metamagic'], 'sorcery_points': 10, 'cantrips_known': 6, 'spells_known': 11, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': [], 'sorcery_points': 11, 'cantrips_known': 6, 'spells_known': 12, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'sorcery_points': 12, 'cantrips_known': 6, 'spells_known': 12, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'sorcery_points': 13, 'cantrips_known': 6, 'spells_known': 13, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Sorcerous Origin feature'], 'sorcery_points': 14, 'cantrips_known': 6, 'spells_known': 13, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': [], 'sorcery_points': 15, 'cantrips_known': 6, 'spells_known': 14, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'sorcery_points': 16, 'cantrips_known': 6, 'spells_known': 14, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Metamagic'], 'sorcery_points': 17, 'cantrips_known': 6, 'spells_known': 15, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Sorcerous Origin feature'], 'sorcery_points': 18, 'cantrips_known': 6, 'spells_known': 15, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'sorcery_points': 19, 'cantrips_known': 6, 'spells_known': 15, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Sorcerous Restoration'], 'sorcery_points': 20, 'cantrips_known': 6, 'spells_known': 15, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 2, 'spell_slots_8': 1, 'spell_slots_9': 1},
        ]

    def get_warlock_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Otherworldly Patron', 'Pact Magic'], 'cantrips_known': 2, 'spells_known': 2, 'spell_slots': 1, 'slot_level': 1, 'invocations_known': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Eldritch Invocations'], 'cantrips_known': 2, 'spells_known': 3, 'spell_slots': 2, 'slot_level': 1, 'invocations_known': 2},
            {'level': 3, 'proficiency_bonus': 2, 'features': ['Pact Boon'], 'cantrips_known': 2, 'spells_known': 4, 'spell_slots': 2, 'slot_level': 2, 'invocations_known': 2},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement', 'Eldritch Versatility'], 'cantrips_known': 3, 'spells_known': 5, 'spell_slots': 2, 'slot_level': 2, 'invocations_known': 2},
            {'level': 5, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 3, 'spells_known': 6, 'spell_slots': 2, 'slot_level': 3, 'invocations_known': 3},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Otherworldly Patron feature'], 'cantrips_known': 3, 'spells_known': 7, 'spell_slots': 2, 'slot_level': 3, 'invocations_known': 3},
            {'level': 7, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 3, 'spells_known': 8, 'spell_slots': 2, 'slot_level': 4, 'invocations_known': 4},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'cantrips_known': 3, 'spells_known': 9, 'spell_slots': 2, 'slot_level': 4, 'invocations_known': 4},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 3, 'spells_known': 10, 'spell_slots': 2, 'slot_level': 5, 'invocations_known': 5},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Otherworldly Patron feature'], 'cantrips_known': 4, 'spells_known': 10, 'spell_slots': 2, 'slot_level': 5, 'invocations_known': 5},
            {'level': 11, 'proficiency_bonus': 4, 'features': ['Mystic Arcanum (6th level)'], 'cantrips_known': 4, 'spells_known': 11, 'spell_slots': 3, 'slot_level': 5, 'invocations_known': 5},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spells_known': 11, 'spell_slots': 3, 'slot_level': 5, 'invocations_known': 6},
            {'level': 13, 'proficiency_bonus': 5, 'features': ['Mystic Arcanum (7th level)'], 'cantrips_known': 4, 'spells_known': 12, 'spell_slots': 3, 'slot_level': 5, 'invocations_known': 6},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Otherworldly Patron feature'], 'cantrips_known': 4, 'spells_known': 12, 'spell_slots': 3, 'slot_level': 5, 'invocations_known': 6},
            {'level': 15, 'proficiency_bonus': 5, 'features': ['Mystic Arcanum (8th level)'], 'cantrips_known': 4, 'spells_known': 13, 'spell_slots': 3, 'slot_level': 5, 'invocations_known': 7},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spells_known': 13, 'spell_slots': 3, 'slot_level': 5, 'invocations_known': 7},
            {'level': 17, 'proficiency_bonus': 6, 'features': ['Mystic Arcanum (9th level)'], 'cantrips_known': 4, 'spells_known': 14, 'spell_slots': 4, 'slot_level': 5, 'invocations_known': 7},
            {'level': 18, 'proficiency_bonus': 6, 'features': [], 'cantrips_known': 4, 'spells_known': 14, 'spell_slots': 4, 'slot_level': 5, 'invocations_known': 8},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spells_known': 15, 'spell_slots': 4, 'slot_level': 5, 'invocations_known': 8},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Eldritch Master'], 'cantrips_known': 4, 'spells_known': 15, 'spell_slots': 4, 'slot_level': 5, 'invocations_known': 8},
        ]

    def get_wizard_progression(self):
        return [
            {'level': 1, 'proficiency_bonus': 2, 'features': ['Spellcasting', 'Arcane Recovery'], 'cantrips_known': 3, 'spell_slots_1': 2, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 2, 'proficiency_bonus': 2, 'features': ['Arcane Tradition'], 'cantrips_known': 3, 'spell_slots_1': 3, 'spell_slots_2': 0, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 3, 'proficiency_bonus': 2, 'features': [], 'cantrips_known': 3, 'spell_slots_1': 4, 'spell_slots_2': 2, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 4, 'proficiency_bonus': 2, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 0, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 5, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 2, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 6, 'proficiency_bonus': 3, 'features': ['Arcane Tradition feature'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 0, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 7, 'proficiency_bonus': 3, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 1, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 8, 'proficiency_bonus': 3, 'features': ['Ability Score Improvement'], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 2, 'spell_slots_5': 0, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 9, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 4, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 1, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 10, 'proficiency_bonus': 4, 'features': ['Arcane Tradition feature'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 0, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 11, 'proficiency_bonus': 4, 'features': [], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 12, 'proficiency_bonus': 4, 'features': ['Ability Score Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 0, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 13, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 14, 'proficiency_bonus': 5, 'features': ['Arcane Tradition feature'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 0, 'spell_slots_9': 0},
            {'level': 15, 'proficiency_bonus': 5, 'features': [], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 16, 'proficiency_bonus': 5, 'features': ['Ability Score Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 0},
            {'level': 17, 'proficiency_bonus': 6, 'features': [], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 2, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 18, 'proficiency_bonus': 6, 'features': ['Spell Mastery'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 1, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 19, 'proficiency_bonus': 6, 'features': ['Ability Score Improvement'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 1, 'spell_slots_8': 1, 'spell_slots_9': 1},
            {'level': 20, 'proficiency_bonus': 6, 'features': ['Signature Spells'], 'cantrips_known': 5, 'spell_slots_1': 4, 'spell_slots_2': 3, 'spell_slots_3': 3, 'spell_slots_4': 3, 'spell_slots_5': 3, 'spell_slots_6': 2, 'spell_slots_7': 2, 'spell_slots_8': 1, 'spell_slots_9': 1},
        ]