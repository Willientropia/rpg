# apps/characters/management/commands/populate_all_class_progressions.py
# COMANDO COMPLETO PARA POPULAR TODAS AS PROGRESSÕES DE CLASSES

from django.core.management.base import BaseCommand
from apps.characters.models import CharacterClass, ClassLevelProgression


class Command(BaseCommand):
    help = 'Popula spell slots e progressão para todas as classes do D&D 5e'

    def handle(self, *args, **options):
        self.stdout.write('🎯 Populando progressões de todas as classes...')
        
        # Warlock (Pact Magic)
        self.populate_warlock()
        
        # Full Casters
        self.populate_wizard()
        self.populate_sorcerer()
        self.populate_bard()
        self.populate_cleric()
        self.populate_druid()
        
        # Half Casters
        self.populate_paladin()
        self.populate_ranger()
        
        # Third Casters
        self.populate_eldritch_knight()
        self.populate_arcane_trickster()
        
        # Non-casters
        self.populate_non_casters()
        
        self.stdout.write(self.style.SUCCESS('✅ Todas as progressões populadas!'))

    def populate_warlock(self):
        """Warlock - Pact Magic"""
        try:
            warlock = CharacterClass.objects.get(slug='warlock')
            self.stdout.write(f'📜 Configurando {warlock.name}...')
            
            # Progressão do Warlock (Pact Magic)
            progressions = [
                # (Nível, Slots, Nível do Slot, Cantrips, Spells Known, Features)
                (1, 1, 1, 2, 2, ['Otherworldly Patron', 'Pact Magic']),
                (2, 2, 1, 2, 3, ['Eldritch Invocations']),
                (3, 2, 2, 2, 4, ['Pact Boon']),
                (4, 2, 2, 3, 5, ['Ability Score Improvement']),
                (5, 2, 3, 3, 6, []),
                (6, 2, 3, 3, 7, ['Otherworldly Patron Feature']),
                (7, 2, 4, 3, 8, []),
                (8, 2, 4, 3, 9, ['Ability Score Improvement']),
                (9, 2, 5, 3, 10, []),
                (10, 2, 5, 4, 10, ['Otherworldly Patron Feature']),
                (11, 3, 5, 4, 11, ['Mystic Arcanum (6th level)']),
                (12, 3, 5, 4, 11, ['Ability Score Improvement']),
                (13, 3, 5, 4, 12, ['Mystic Arcanum (7th level)']),
                (14, 3, 5, 4, 12, ['Otherworldly Patron Feature']),
                (15, 3, 5, 4, 13, ['Mystic Arcanum (8th level)']),
                (16, 3, 5, 4, 13, ['Ability Score Improvement']),
                (17, 4, 5, 4, 14, ['Mystic Arcanum (9th level)']),
                (18, 4, 5, 4, 14, []),
                (19, 4, 5, 4, 15, ['Ability Score Improvement']),
                (20, 4, 5, 4, 15, ['Eldritch Master']),
            ]
            
            self._create_warlock_progressions(warlock, progressions)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Warlock não encontrado')

    def populate_wizard(self):
        """Wizard - Full Caster"""
        try:
            wizard = CharacterClass.objects.get(slug='wizard')
            self.stdout.write(f'🧙‍♂️ Configurando {wizard.name}...')
            
            # Wizard específico - Cantrips conhecidos (não prepara cantrips)
            wizard_cantrips = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
            wizard_data = [(cantrips, 0) for cantrips in wizard_cantrips]  # 0 = prepara feitiços
            
            self._create_full_caster_progression(wizard, wizard_data, self._get_wizard_features)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Wizard não encontrado')

    def populate_sorcerer(self):
        """Sorcerer - Full Caster (Conhece feitiços)"""
        try:
            sorcerer = CharacterClass.objects.get(slug='sorcerer')
            self.stdout.write(f'🔥 Configurando {sorcerer.name}...')
            
            # Sorcerer - Feitiços conhecidos e cantrips
            sorcerer_data = [
                # (Cantrips, Spells Known)
                (4, 2), (4, 3), (4, 4), (5, 5), (5, 6),   # 1-5
                (5, 7), (5, 8), (5, 9), (5, 10), (6, 11), # 6-10
                (6, 12), (6, 12), (6, 13), (6, 13), (6, 14), # 11-15
                (6, 14), (6, 15), (6, 15), (6, 15), (6, 15), # 16-20
            ]
            
            self._create_full_caster_progression(sorcerer, sorcerer_data, self._get_sorcerer_features)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Sorcerer não encontrado')

    def populate_bard(self):
        """Bard - Full Caster (Conhece feitiços)"""
        try:
            bard = CharacterClass.objects.get(slug='bard')
            self.stdout.write(f'🎵 Configurando {bard.name}...')
            
            # Bard - Feitiços conhecidos e cantrips
            bard_data = [
                # (Cantrips, Spells Known)
                (2, 4), (2, 5), (2, 6), (3, 7), (3, 8),   # 1-5
                (3, 9), (3, 10), (3, 11), (3, 12), (4, 14), # 6-10
                (4, 15), (4, 15), (4, 16), (4, 18), (4, 19), # 11-15
                (4, 19), (4, 20), (4, 22), (4, 22), (4, 22), # 16-20
            ]
            
            self._create_full_caster_progression(bard, bard_data, self._get_bard_features)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Bard não encontrado')

    def populate_cleric(self):
        """Cleric - Full Caster (Prepara feitiços)"""
        try:
            cleric = CharacterClass.objects.get(slug='cleric')
            self.stdout.write(f'✨ Configurando {cleric.name}...')
            
            # Cleric - Cantrips conhecidos (prepara feitiços)
            cleric_cantrips = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
            cleric_data = [(cantrips, 0) for cantrips in cleric_cantrips]  # 0 = prepara feitiços
            
            self._create_full_caster_progression(cleric, cleric_data, self._get_cleric_features)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Cleric não encontrado')

    def populate_druid(self):
        """Druid - Full Caster (Prepara feitiços)"""
        try:
            druid = CharacterClass.objects.get(slug='druid')
            self.stdout.write(f'🌿 Configurando {druid.name}...')
            
            # Druid - Cantrips conhecidos (prepara feitiços)
            druid_cantrips = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            druid_data = [(cantrips, 0) for cantrips in druid_cantrips]  # 0 = prepara feitiços
            
            self._create_full_caster_progression(druid, druid_data, self._get_druid_features)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Druid não encontrado')

    def populate_paladin(self):
        """Paladin - Half Caster"""
        try:
            paladin = CharacterClass.objects.get(slug='paladin')
            self.stdout.write(f'🛡️ Configurando {paladin.name}...')
            
            # Half Caster spell slots (Paladin, Ranger)
            half_caster_slots = [
                # [1º, 2º, 3º, 4º, 5º]
                [0, 0, 0, 0, 0],  # Nível 1
                [2, 0, 0, 0, 0],  # Nível 2
                [3, 0, 0, 0, 0],  # Nível 3
                [3, 0, 0, 0, 0],  # Nível 4
                [4, 2, 0, 0, 0],  # Nível 5
                [4, 2, 0, 0, 0],  # Nível 6
                [4, 3, 0, 0, 0],  # Nível 7
                [4, 3, 0, 0, 0],  # Nível 8
                [4, 3, 2, 0, 0],  # Nível 9
                [4, 3, 2, 0, 0],  # Nível 10
                [4, 3, 3, 0, 0],  # Nível 11
                [4, 3, 3, 0, 0],  # Nível 12
                [4, 3, 3, 1, 0],  # Nível 13
                [4, 3, 3, 1, 0],  # Nível 14
                [4, 3, 3, 2, 0],  # Nível 15
                [4, 3, 3, 2, 0],  # Nível 16
                [4, 3, 3, 3, 1],  # Nível 17
                [4, 3, 3, 3, 1],  # Nível 18
                [4, 3, 3, 3, 2],  # Nível 19
                [4, 3, 3, 3, 2],  # Nível 20
            ]
            
            self._create_half_caster_progression(paladin, half_caster_slots, self._get_paladin_features)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Paladin não encontrado')

    def populate_ranger(self):
        """Ranger - Half Caster"""
        try:
            ranger = CharacterClass.objects.get(slug='ranger')
            self.stdout.write(f'🏹 Configurando {ranger.name}...')
            
            # Usar mesma estrutura do Paladin para half-casters
            half_caster_slots = [
                [0, 0, 0, 0, 0],  # Nível 1
                [2, 0, 0, 0, 0],  # Nível 2
                [3, 0, 0, 0, 0],  # Nível 3
                [3, 0, 0, 0, 0],  # Nível 4
                [4, 2, 0, 0, 0],  # Nível 5
                [4, 2, 0, 0, 0],  # Nível 6
                [4, 3, 0, 0, 0],  # Nível 7
                [4, 3, 0, 0, 0],  # Nível 8
                [4, 3, 2, 0, 0],  # Nível 9
                [4, 3, 2, 0, 0],  # Nível 10
                [4, 3, 3, 0, 0],  # Nível 11
                [4, 3, 3, 0, 0],  # Nível 12
                [4, 3, 3, 1, 0],  # Nível 13
                [4, 3, 3, 1, 0],  # Nível 14
                [4, 3, 3, 2, 0],  # Nível 15
                [4, 3, 3, 2, 0],  # Nível 16
                [4, 3, 3, 3, 1],  # Nível 17
                [4, 3, 3, 3, 1],  # Nível 18
                [4, 3, 3, 3, 2],  # Nível 19
                [4, 3, 3, 3, 2],  # Nível 20
            ]
            
            # Ranger - Feitiços conhecidos
            ranger_spells_known = [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11]
            
            self._create_half_caster_progression(
                ranger, 
                half_caster_slots, 
                self._get_ranger_features,
                ranger_spells_known
            )
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Ranger não encontrado')

    def populate_eldritch_knight(self):
        """Eldritch Knight (Fighter subclass) - Third Caster"""
        try:
            fighter = CharacterClass.objects.get(slug='fighter')
            self.stdout.write(f'⚔️ Configurando {fighter.name} (incluindo Eldritch Knight)...')
            
            # Third Caster spell slots (EK, AT) - começam no nível 3
            third_caster_slots = [
                [0, 0, 0, 0],  # Nível 1
                [0, 0, 0, 0],  # Nível 2
                [2, 0, 0, 0],  # Nível 3
                [3, 0, 0, 0],  # Nível 4
                [3, 0, 0, 0],  # Nível 5
                [3, 0, 0, 0],  # Nível 6
                [4, 2, 0, 0],  # Nível 7
                [4, 2, 0, 0],  # Nível 8
                [4, 2, 0, 0],  # Nível 9
                [4, 3, 0, 0],  # Nível 10
                [4, 3, 0, 0],  # Nível 11
                [4, 3, 0, 0],  # Nível 12
                [4, 3, 2, 0],  # Nível 13
                [4, 3, 2, 0],  # Nível 14
                [4, 3, 2, 0],  # Nível 15
                [4, 3, 3, 0],  # Nível 16
                [4, 3, 3, 0],  # Nível 17
                [4, 3, 3, 0],  # Nível 18
                [4, 3, 3, 1],  # Nível 19
                [4, 3, 3, 1],  # Nível 20
            ]
            
            # Fighter/EK - Cantrips e feitiços conhecidos
            ek_cantrips = [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
            ek_spells = [0, 0, 2, 3, 3, 3, 4, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9]
            
            self._create_fighter_progression(fighter, third_caster_slots, ek_cantrips, ek_spells)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Fighter não encontrado')

    def populate_arcane_trickster(self):
        """Arcane Trickster (Rogue subclass) - Third Caster"""
        try:
            rogue = CharacterClass.objects.get(slug='rogue')
            self.stdout.write(f'🗡️ Configurando {rogue.name} (incluindo Arcane Trickster)...')
            
            # Mesmos slots do EK
            third_caster_slots = [
                [0, 0, 0, 0],  # Nível 1
                [0, 0, 0, 0],  # Nível 2
                [2, 0, 0, 0],  # Nível 3
                [3, 0, 0, 0],  # Nível 4
                [3, 0, 0, 0],  # Nível 5
                [3, 0, 0, 0],  # Nível 6
                [4, 2, 0, 0],  # Nível 7
                [4, 2, 0, 0],  # Nível 8
                [4, 2, 0, 0],  # Nível 9
                [4, 3, 0, 0],  # Nível 10
                [4, 3, 0, 0],  # Nível 11
                [4, 3, 0, 0],  # Nível 12
                [4, 3, 2, 0],  # Nível 13
                [4, 3, 2, 0],  # Nível 14
                [4, 3, 2, 0],  # Nível 15
                [4, 3, 3, 0],  # Nível 16
                [4, 3, 3, 0],  # Nível 17
                [4, 3, 3, 0],  # Nível 18
                [4, 3, 3, 1],  # Nível 19
                [4, 3, 3, 1],  # Nível 20
            ]
            
            # Rogue/AT - Cantrips e feitiços conhecidos (igual ao EK)
            at_cantrips = [0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            at_spells = [0, 0, 2, 3, 3, 3, 4, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9]
            
            self._create_rogue_progression(rogue, third_caster_slots, at_cantrips, at_spells)
            
        except CharacterClass.DoesNotExist:
            self.stdout.write('❌ Rogue não encontrado')

    def populate_non_casters(self):
        """Classes não-mágicas"""
        non_caster_classes = ['barbarian', 'monk']
        
        for class_slug in non_caster_classes:
            try:
                char_class = CharacterClass.objects.get(slug=class_slug)
                self.stdout.write(f'⚔️ Configurando {char_class.name}...')
                
                for level in range(1, 21):
                    try:
                        progression, created = ClassLevelProgression.objects.get_or_create(
                            character_class=char_class,
                            level=level,
                            defaults={
                                'proficiency_bonus': 2 + ((level - 1) // 4),
                                'cantrips_known': 0,
                                'spells_known': 0,
                                'features_gained': self._get_martial_features(class_slug, level),
                            }
                        )
                        # Zerar todos os spell slots
                        for i in range(1, 10):
                            setattr(progression, f'spell_slots_{i}', 0)
                        progression.save()
                        if created:
                            self.stdout.write(f'  ✅ {char_class.name} nível {level}')
                    except Exception as e:
                        self.stdout.write(f'❌ Erro ao criar progressão para {char_class.name} nível {level}: {e}')
            except CharacterClass.DoesNotExist:
                self.stdout.write(f'❌ {class_slug} não encontrado')

    def _create_rogue_progression(self, char_class, slot_table, cantrips_table, spells_table):
        """Cria progressão específica do Rogue (com Arcane Trickster)"""
        for level in range(1, 21):
            slots = slot_table[level - 1] if level <= len(slot_table) else [0, 0, 0, 0]
            cantrips = cantrips_table[level - 1]
            spells_known = spells_table[level - 1]
            
            progression, created = ClassLevelProgression.objects.get_or_create(
                character_class=char_class,
                level=level,
                defaults={
                    'proficiency_bonus': 2 + ((level - 1) // 4),
                    'cantrips_known': cantrips,
                    'spells_known': spells_known,
                    'features_gained': self._get_rogue_features(level),
                }
            )
            
            # Zerar todos os spell slots
            for i in range(1, 10):
                setattr(progression, f'spell_slots_{i}', 0)
            
            # Definir spell slots (só até 4º nível para third casters)
            if level >= 3:  # Third casters só ganham magia no nível 3
                for i in range(4):
                    setattr(progression, f'spell_slots_{i + 1}', slots[i])
            
            progression.cantrips_known = cantrips
            progression.spells_known = spells_known
            progression.features_gained = self._get_rogue_features(level)
            progression.save()
            
            if created:
                self.stdout.write(f'  ✅ {char_class.name} nível {level}')

    # ========================================
    # FEATURES POR CLASSE
    # ========================================

    def _get_wizard_features(self, level):
        features = {
            1: ['Spellcasting', 'Arcane Recovery'],
            2: ['Arcane Tradition'],
            3: ['Arcane Tradition Feature'],
            4: ['Ability Score Improvement'],
            5: [],
            6: ['Arcane Tradition Feature'],
            7: [],
            8: ['Ability Score Improvement'],
            9: [],
            10: ['Arcane Tradition Feature'],
            11: [],
            12: ['Ability Score Improvement'],
            13: [],
            14: ['Arcane Tradition Feature'],
            15: [],
            16: ['Ability Score Improvement'],
            17: [],
            18: ['Spell Mastery'],
            19: ['Ability Score Improvement'],
            20: ['Signature Spell'],
        }
        return features.get(level, [])

    def _get_sorcerer_features(self, level):
        features = {
            1: ['Spellcasting', 'Sorcerous Origin'],
            2: ['Font of Magic'],
            3: ['Metamagic'],
            4: ['Ability Score Improvement'],
            5: [],
            6: ['Sorcerous Origin Feature'],
            7: [],
            8: ['Ability Score Improvement'],
            9: [],
            10: ['Metamagic', 'Sorcerous Origin Feature'],
            11: [],
            12: ['Ability Score Improvement'],
            13: [],
            14: ['Sorcerous Origin Feature'],
            15: [],
            16: ['Ability Score Improvement'],
            17: ['Metamagic'],
            18: ['Sorcerous Origin Feature'],
            19: ['Ability Score Improvement'],
            20: ['Sorcerous Restoration'],
        }
        return features.get(level, [])

    def _get_bard_features(self, level):
        features = {
            1: ['Spellcasting', 'Bardic Inspiration'],
            2: ['Jack of All Trades', 'Song of Rest'],
            3: ['Bard College', 'Expertise'],
            4: ['Ability Score Improvement'],
            5: ['Bardic Inspiration (d8)', 'Font of Inspiration'],
            6: ['Countercharm', 'Bard College Feature'],
            7: [],
            8: ['Ability Score Improvement'],
            9: ['Song of Rest (d8)'],
            10: ['Bardic Inspiration (d10)', 'Expertise', 'Magical Secrets'],
            11: [],
            12: ['Ability Score Improvement'],
            13: ['Song of Rest (d10)'],
            14: ['Magical Secrets', 'Bard College Feature'],
            15: ['Bardic Inspiration (d12)'],
            16: ['Ability Score Improvement'],
            17: ['Song of Rest (d12)'],
            18: ['Magical Secrets'],
            19: ['Ability Score Improvement'],
            20: ['Superior Inspiration'],
        }
        return features.get(level, [])

    def _get_cleric_features(self, level):
        features = {
            1: ['Spellcasting', 'Divine Domain'],
            2: ['Channel Divinity', 'Divine Domain Feature'],
            3: [],
            4: ['Ability Score Improvement'],
            5: ['Destroy Undead (CR 1/2)'],
            6: ['Channel Divinity (2/rest)', 'Divine Domain Feature'],
            7: [],
            8: ['Ability Score Improvement', 'Destroy Undead (CR 1)', 'Divine Domain Feature'],
            9: [],
            10: ['Divine Intervention'],
            11: ['Destroy Undead (CR 2)'],
            12: ['Ability Score Improvement'],
            13: [],
            14: ['Destroy Undead (CR 3)'],
            15: [],
            16: ['Ability Score Improvement'],
            17: ['Destroy Undead (CR 4)', 'Divine Domain Feature'],
            18: ['Channel Divinity (3/rest)'],
            19: ['Ability Score Improvement'],
            20: ['Divine Intervention Improvement'],
        }
        return features.get(level, [])

    def _get_druid_features(self, level):
        features = {
            1: ['Spellcasting', 'Druidcraft'],
            2: ['Wild Shape', 'Druid Circle'],
            3: [],
            4: ['Wild Shape Improvement', 'Ability Score Improvement'],
            5: [],
            6: ['Druid Circle Feature'],
            7: [],
            8: ['Wild Shape Improvement', 'Ability Score Improvement'],
            9: [],
            10: ['Druid Circle Feature'],
            11: [],
            12: ['Ability Score Improvement'],
            13: [],
            14: ['Druid Circle Feature'],
            15: [],
            16: ['Ability Score Improvement'],
            17: [],
            18: ['Timeless Body', 'Beast Spells'],
            19: ['Ability Score Improvement'],
            20: ['Archdruid'],
        }
        return features.get(level, [])

    def _get_paladin_features(self, level):
        features = {
            1: ['Divine Sense', 'Lay on Hands'],
            2: ['Fighting Style', 'Spellcasting', 'Divine Smite'],
            3: ['Divine Health', 'Sacred Oath'],
            4: ['Ability Score Improvement'],
            5: ['Extra Attack'],
            6: ['Aura of Protection'],
            7: ['Sacred Oath Feature'],
            8: ['Ability Score Improvement'],
            9: [],
            10: ['Aura of Courage'],
            11: ['Improved Divine Smite'],
            12: ['Ability Score Improvement'],
            13: [],
            14: ['Cleansing Touch'],
            15: ['Sacred Oath Feature'],
            16: ['Ability Score Improvement'],
            17: [],
            18: ['Aura Improvements'],
            19: ['Ability Score Improvement'],
            20: ['Sacred Oath Feature'],
        }
        return features.get(level, [])

    def _get_ranger_features(self, level):
        features = {
            1: ['Favored Enemy', 'Natural Explorer'],
            2: ['Fighting Style', 'Spellcasting'],
            3: ['Ranger Archetype', 'Primeval Awareness'],
            4: ['Ability Score Improvement'],
            5: ['Extra Attack'],
            6: ['Favored Enemy and Natural Explorer improvements'],
            7: ['Ranger Archetype Feature'],
            8: ['Ability Score Improvement', 'Lands Stride'],
            9: [],
            10: ['Natural Explorer improvement', 'Hide in Plain Sight'],
            11: ['Ranger Archetype Feature'],
            12: ['Ability Score Improvement'],
            13: [],
            14: ['Favored Enemy improvement', 'Vanish'],
            15: ['Ranger Archetype Feature'],
            16: ['Ability Score Improvement'],
            17: [],
            18: ['Feral Senses'],
            19: ['Ability Score Improvement'],
            20: ['Foe Slayer'],
        }
        return features.get(level, [])

    def _get_fighter_features(self, level):
        features = {
            1: ['Fighting Style', 'Second Wind'],
            2: ['Action Surge'],
            3: ['Martial Archetype'],
            4: ['Ability Score Improvement'],
            5: ['Extra Attack'],
            6: ['Ability Score Improvement'],
            7: ['Martial Archetype Feature'],
            8: ['Ability Score Improvement'],
            9: ['Indomitable'],
            10: ['Martial Archetype Feature'],
            11: ['Extra Attack (2)'],
            12: ['Ability Score Improvement'],
            13: ['Indomitable (2/rest)'],
            14: ['Ability Score Improvement'],
            15: ['Martial Archetype Feature'],
            16: ['Ability Score Improvement'],
            17: ['Action Surge (2/rest)', 'Indomitable (3/rest)'],
            18: ['Martial Archetype Feature'],
            19: ['Ability Score Improvement'],
            20: ['Extra Attack (3)'],
        }
        return features.get(level, [])

    def _get_rogue_features(self, level):
        features = {
            1: ['Expertise', 'Sneak Attack', 'Thieves Cant'],
            2: ['Cunning Action'],
            3: ['Roguish Archetype'],
            4: ['Ability Score Improvement'],
            5: ['Uncanny Dodge'],
            6: ['Expertise'],
            7: ['Evasion'],
            8: ['Ability Score Improvement'],
            9: ['Roguish Archetype Feature'],
            10: ['Ability Score Improvement'],
            11: ['Reliable Talent'],
            12: ['Ability Score Improvement'],
            13: ['Roguish Archetype Feature'],
            14: ['Blindsense'],
            15: ['Slippery Mind'],
            16: ['Ability Score Improvement'],
            17: ['Roguish Archetype Feature'],
            18: ['Elusive'],
            19: ['Ability Score Improvement'],
            20: ['Stroke of Luck'],
        }
        return features.get(level, [])

    def _get_martial_features(self, class_slug, level):
        """Features para classes não-mágicas"""
        if class_slug == 'barbarian':
            features = {
                1: ['Rage', 'Unarmored Defense'],
                2: ['Reckless Attack', 'Danger Sense'],
                3: ['Primal Path'],
                4: ['Ability Score Improvement'],
                5: ['Extra Attack', 'Fast Movement'],
                6: ['Path Feature'],
                7: ['Feral Instinct'],
                8: ['Ability Score Improvement'],
                9: ['Brutal Critical (1 die)'],
                10: ['Path Feature'],
                11: ['Relentless Rage'],
                12: ['Ability Score Improvement'],
                13: ['Brutal Critical (2 dice)'],
                14: ['Path Feature'],
                15: ['Persistent Rage'],
                16: ['Ability Score Improvement'],
                17: ['Brutal Critical (3 dice)'],
                18: ['Indomitable Might'],
                19: ['Ability Score Improvement'],
                20: ['Primal Champion'],
            }
        elif class_slug == 'monk':
            features = {
                1: ['Unarmored Defense', 'Martial Arts'],
                2: ['Ki', 'Unarmored Movement'],
                3: ['Monastic Tradition', 'Deflect Missiles'],
                4: ['Ability Score Improvement', 'Slow Fall'],
                5: ['Extra Attack', 'Stunning Strike'],
                6: ['Ki-Empowered Strikes', 'Monastic Tradition Feature'],
                7: ['Evasion', 'Stillness of Mind'],
                8: ['Ability Score Improvement'],
                9: ['Unarmored Movement Improvement'],
                10: ['Purity of Body'],
                11: ['Monastic Tradition Feature'],
                12: ['Ability Score Improvement'],
                13: ['Tongue of the Sun and Moon'],
                14: ['Diamond Soul'],
                15: ['Timeless Body'],
                16: ['Ability Score Improvement'],
                17: ['Monastic Tradition Feature'],
                18: ['Empty Body'],
                19: ['Ability Score Improvement'],
                20: ['Perfect Self'],
            }
        else:
            features = {level: []}
        
        return features.get(level, [])

    # ========================================
    # MÉTODOS AUXILIARES
    # ========================================

    def _create_warlock_progressions(self, char_class, progressions):
        """Cria progressões específicas do Warlock"""
        for level, slot_count, slot_level, cantrips, spells_known, features in progressions:
            progression, created = ClassLevelProgression.objects.get_or_create(
                character_class=char_class,
                level=level,
                defaults={
                    'proficiency_bonus': 2 + ((level - 1) // 4),
                    'cantrips_known': cantrips,
                    'spells_known': spells_known,
                    'features_gained': features,
                }
            )
            
            # Limpar todos os spell slots
            for i in range(1, 10):
                setattr(progression, f'spell_slots_{i}', 0)
            
            # Definir spell slots específicos para Warlock
            if slot_count > 0:
                setattr(progression, f'spell_slots_{slot_level}', slot_count)
            
            progression.cantrips_known = cantrips
            progression.spells_known = spells_known
            progression.features_gained = features
            progression.save()
            
            if created:
                self.stdout.write(f'  ✅ {char_class.name} nível {level}')

    def _create_full_caster_progression(self, char_class, class_data, features_func):
        """Cria progressão para full casters"""
        # Spell slots para Full Casters
        full_caster_slots = [
            [2, 0, 0, 0, 0, 0, 0, 0, 0],  # Nível 1
            [3, 0, 0, 0, 0, 0, 0, 0, 0],  # Nível 2
            [4, 2, 0, 0, 0, 0, 0, 0, 0],  # Nível 3
            [4, 3, 0, 0, 0, 0, 0, 0, 0],  # Nível 4
            [4, 3, 2, 0, 0, 0, 0, 0, 0],  # Nível 5
            [4, 3, 3, 0, 0, 0, 0, 0, 0],  # Nível 6
            [4, 3, 3, 1, 0, 0, 0, 0, 0],  # Nível 7
            [4, 3, 3, 2, 0, 0, 0, 0, 0],  # Nível 8
            [4, 3, 3, 3, 1, 0, 0, 0, 0],  # Nível 9
            [4, 3, 3, 3, 2, 0, 0, 0, 0],  # Nível 10
            [4, 3, 3, 3, 2, 1, 0, 0, 0],  # Nível 11
            [4, 3, 3, 3, 2, 1, 0, 0, 0],  # Nível 12
            [4, 3, 3, 3, 2, 1, 1, 0, 0],  # Nível 13
            [4, 3, 3, 3, 2, 1, 1, 0, 0],  # Nível 14
            [4, 3, 3, 3, 2, 1, 1, 1, 0],  # Nível 15
            [4, 3, 3, 3, 2, 1, 1, 1, 0],  # Nível 16
            [4, 3, 3, 3, 2, 1, 1, 1, 1],  # Nível 17
            [4, 3, 3, 3, 3, 1, 1, 1, 1],  # Nível 18
            [4, 3, 3, 3, 3, 2, 1, 1, 1],  # Nível 19
            [4, 3, 3, 3, 3, 2, 2, 1, 1],  # Nível 20
        ]
        
        for level in range(1, 21):
            cantrips, spells_known = class_data[level - 1]
            
            progression, created = ClassLevelProgression.objects.get_or_create(
                character_class=char_class,
                level=level,
                defaults={
                    'proficiency_bonus': 2 + ((level - 1) // 4),
                    'cantrips_known': cantrips,
                    'spells_known': spells_known,
                    'features_gained': features_func(level),
                }
            )
            
            # Definir spell slots
            slots = full_caster_slots[level - 1]
            for i in range(9):
                setattr(progression, f'spell_slots_{i + 1}', slots[i])
            
            progression.cantrips_known = cantrips
            progression.spells_known = spells_known
            progression.features_gained = features_func(level)
            progression.save()
            
            if created:
                self.stdout.write(f'  ✅ {char_class.name} nível {level}')

    def _create_half_caster_progression(self, char_class, slot_table, features_func, spells_known_table=None):
        """Cria progressão para half casters"""
        for level in range(1, 21):
            # Spell slots (só até 5º nível para half casters)
            slots = slot_table[level - 1] if level <= len(slot_table) else [0, 0, 0, 0, 0]
            
            # Spells known (se fornecido)
            spells_known = spells_known_table[level - 1] if spells_known_table else 0
            
            progression, created = ClassLevelProgression.objects.get_or_create(
                character_class=char_class,
                level=level,
                defaults={
                    'proficiency_bonus': 2 + ((level - 1) // 4),
                    'cantrips_known': 0,  # Half casters não têm cantrips
                    'spells_known': spells_known,
                    'features_gained': features_func(level),
                }
            )
            
            # Zerar todos os spell slots primeiro
            for i in range(1, 10):
                setattr(progression, f'spell_slots_{i}', 0)
            
            # Definir spell slots (só até 5º nível)
            if level >= 2:  # Half casters só ganham magia no nível 2
                for i in range(5):
                    setattr(progression, f'spell_slots_{i + 1}', slots[i])
            
            progression.spells_known = spells_known
            progression.features_gained = features_func(level)
            progression.save()
            
            if created:
                self.stdout.write(f'  ✅ {char_class.name} nível {level}')

    def _create_fighter_progression(self, char_class, slot_table, cantrips_table, spells_table):
            """Cria progressão específica do Fighter (com Eldritch Knight)"""
            for level in range(1, 21):
                slots = slot_table[level - 1] if level <= len(slot_table) else [0, 0, 0, 0]
                cantrips = cantrips_table[level - 1]
                spells_known = spells_table[level - 1]

                progression, created = ClassLevelProgression.objects.get_or_create(
                    character_class=char_class,
                    level=level,
                    defaults={
                        'proficiency_bonus': 2 + ((level - 1) // 4),
                        'cantrips_known': cantrips,
                        'spells_known': spells_known,
                        'features_gained': self._get_fighter_features(level),
                    }
                )

                # Zerar todos os spell slots
                for i in range(1, 10):
                    setattr(progression, f'spell_slots_{i}', 0)

                # Definir spell slots (só até 4º nível para third casters)
                if level >= 3:  # Third casters só ganham magia no nível 3
                    for i in range(4):
                        setattr(progression, f'spell_slots_{i + 1}', slots[i])

                progression.cantrips_known = cantrips
                progression.spells_known = spells_known
                progression.features_gained = self._get_fighter_features(level)
                progression.save()

                if created:
                    self.stdout.write(f'  ✅ {char_class.name} nível {level}')