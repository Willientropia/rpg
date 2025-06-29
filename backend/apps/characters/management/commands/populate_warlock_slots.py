# apps/characters/management/commands/populate_warlock_slots.py
# COMANDO PARA POPULAR SPELL SLOTS DO WARLOCK

from django.core.management.base import BaseCommand
from apps.characters.models import CharacterClass, ClassLevelProgression


class Command(BaseCommand):
    help = 'Popula spell slots para Warlock seguindo as regras do D&D 5e'

    def handle(self, *args, **options):
        try:
            warlock_class = CharacterClass.objects.get(slug='warlock')
            self.stdout.write(f'📜 Configurando spell slots para {warlock_class.name}...')
            
            # Dados dos spell slots do Warlock conforme D&D 5e
            warlock_progression = [
                # Nível: (Espaços, Nível do Espaço, Cantrips, Feitiços Conhecidos)
                (1, 1, 1, 2, 2),   # Nível 1: 1 espaço de 1º nível, 2 cantrips, 2 feitiços
                (2, 2, 1, 2, 3),   # Nível 2: 2 espaços de 1º nível, 2 cantrips, 3 feitiços
                (3, 2, 2, 2, 4),   # Nível 3: 2 espaços de 2º nível, 2 cantrips, 4 feitiços
                (4, 2, 2, 3, 5),   # Nível 4: 2 espaços de 2º nível, 3 cantrips, 5 feitiços
                (5, 2, 3, 3, 6),   # Nível 5: 2 espaços de 3º nível, 3 cantrips, 6 feitiços
                (6, 2, 3, 3, 7),   # Nível 6: 2 espaços de 3º nível, 3 cantrips, 7 feitiços
                (7, 2, 4, 3, 8),   # Nível 7: 2 espaços de 4º nível, 3 cantrips, 8 feitiços
                (8, 2, 4, 3, 9),   # Nível 8: 2 espaços de 4º nível, 3 cantrips, 9 feitiços
                (9, 2, 5, 3, 10),  # Nível 9: 2 espaços de 5º nível, 3 cantrips, 10 feitiços
                (10, 2, 5, 4, 10), # Nível 10: 2 espaços de 5º nível, 4 cantrips, 10 feitiços
                (11, 3, 5, 4, 11), # Nível 11: 3 espaços de 5º nível, 4 cantrips, 11 feitiços
                (12, 3, 5, 4, 11), # Nível 12: 3 espaços de 5º nível, 4 cantrips, 11 feitiços
                (13, 3, 5, 4, 12), # Nível 13: 3 espaços de 5º nível, 4 cantrips, 12 feitiços
                (14, 3, 5, 4, 12), # Nível 14: 3 espaços de 5º nível, 4 cantrips, 12 feitiços
                (15, 3, 5, 4, 13), # Nível 15: 3 espaços de 5º nível, 4 cantrips, 13 feitiços
                (16, 3, 5, 4, 13), # Nível 16: 3 espaços de 5º nível, 4 cantrips, 13 feitiços
                (17, 4, 5, 4, 14), # Nível 17: 4 espaços de 5º nível, 4 cantrips, 14 feitiços
                (18, 4, 5, 4, 14), # Nível 18: 4 espaços de 5º nível, 4 cantrips, 14 feitiços
                (19, 4, 5, 4, 15), # Nível 19: 4 espaços de 5º nível, 4 cantrips, 15 feitiços
                (20, 4, 5, 4, 15), # Nível 20: 4 espaços de 5º nível, 4 cantrips, 15 feitiços
            ]
            
            created_count = 0
            updated_count = 0
            
            for level, slot_count, slot_level, cantrips, spells_known in warlock_progression:
                progression, created = ClassLevelProgression.objects.get_or_create(
                    character_class=warlock_class,
                    level=level,
                    defaults={
                        'proficiency_bonus': 2 + ((level - 1) // 4),  # Bônus de proficiência padrão
                        'cantrips_known': cantrips,
                        'spells_known': spells_known,
                        'features_gained': self.get_warlock_features(level),
                    }
                )
                
                # Limpar todos os spell slots primeiro
                for i in range(1, 10):
                    setattr(progression, f'spell_slots_{i}', 0)
                
                # Definir os spell slots corretos para Warlock
                setattr(progression, f'spell_slots_{slot_level}', slot_count)
                
                # Atualizar campos
                progression.cantrips_known = cantrips
                progression.spells_known = spells_known
                progression.features_gained = self.get_warlock_features(level)
                progression.save()
                
                if created:
                    created_count += 1
                    self.stdout.write(f'  ✅ Criado nível {level}')
                else:
                    updated_count += 1
                    self.stdout.write(f'  🔄 Atualizado nível {level}')
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Warlock configurado! '
                    f'Criados: {created_count}, Atualizados: {updated_count}'
                )
            )
            
        except CharacterClass.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('❌ Classe Warlock não encontrada!')
            )
    
    def get_warlock_features(self, level):
        """Retorna as features do Warlock por nível"""
        features = {
            1: ['Otherworldly Patron', 'Pact Magic'],
            2: ['Eldritch Invocations'],
            3: ['Pact Boon'],
            4: ['Ability Score Improvement'],
            5: [],
            6: ['Otherworldly Patron Feature'],
            7: [],
            8: ['Ability Score Improvement'],
            9: [],
            10: ['Otherworldly Patron Feature'],
            11: ['Mystic Arcanum (6th level)'],
            12: ['Ability Score Improvement'],
            13: ['Mystic Arcanum (7th level)'],
            14: ['Otherworldly Patron Feature'],
            15: ['Mystic Arcanum (8th level)'],
            16: ['Ability Score Improvement'],
            17: ['Mystic Arcanum (9th level)'],
            18: [],
            19: ['Ability Score Improvement'],
            20: ['Eldritch Master'],
        }
        return features.get(level, [])