# apps/characters/management/commands/sync_open5e.py

from django.core.management.base import BaseCommand
from apps.characters.models import Race, CharacterClass, Background
import requests
import time


class Command(BaseCommand):
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