#!/usr/bin/env python
"""
Script para configurar o banco de dados do D&D Character Creator
Execute: python setup_database.py
"""

import os
import sys
import django
from django.core.management import call_command
from django.conf import settings

def setup_database():
    """Configura o banco de dados com dados iniciais"""
    
    print("🎯 D&D Character Creator - Setup do Banco de Dados")
    print("=" * 60)
    
    # Verificar se estamos no ambiente correto
    if not os.path.exists('manage.py'):
        print("❌ Execute este script na pasta backend/")
        sys.exit(1)
    
    # Configurar Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    
    try:
        print("\n📦 1. Fazendo migrações...")
        call_command('makemigrations', verbosity=1)
        call_command('migrate', verbosity=1)
        
        print("\n🏰 2. Populando dados básicos (raças, classes, backgrounds)...")
        call_command('populate_basic_data', verbosity=1)
        
        print("\n📈 3. Populando progressões de todas as classes...")
        call_command('populate_all_class_progressions', verbosity=1)
        
        print("\n🔄 4. Sincronizando com Open5e API (opcional)...")
        try:
            call_command('sync_open5e', verbosity=1)
            print("✅ Sincronização com API concluída")
        except Exception as e:
            print(f"⚠️ Aviso: Falha na sincronização com API: {e}")
            print("   Você pode executar 'python manage.py sync_open5e' depois")
        
        print("\n" + "=" * 60)
        print("✅ SETUP CONCLUÍDO COM SUCESSO!")
        print("=" * 60)
        print("\n📋 Próximos passos:")
        print("1. Criar superuser: python manage.py createsuperuser")
        print("2. Executar servidor: python manage.py runserver")
        print("3. Acessar admin: http://localhost:8000/admin/")
        print("4. Testar API: http://localhost:8000/api/characters/races/")
        
        # Verificar se foi criado algum dado
        from apps.characters.models import Race, CharacterClass, ClassLevelProgression
        
        races_count = Race.objects.count()
        classes_count = CharacterClass.objects.count()
        progressions_count = ClassLevelProgression.objects.count()
        
        print(f"\n📊 Dados criados:")
        print(f"   • Raças: {races_count}")
        print(f"   • Classes: {classes_count}")
        print(f"   • Progressões: {progressions_count}")
        
        if races_count == 0 or classes_count == 0:
            print("\n⚠️ ATENÇÃO: Poucos dados foram criados.")
            print("   Verifique se os comandos de management estão funcionando.")
        
    except Exception as e:
        print(f"\n❌ ERRO durante o setup: {e}")
        print("\nTente executar os comandos manualmente:")
        print("1. python manage.py makemigrations")
        print("2. python manage.py migrate")
        print("3. python manage.py populate_basic_data")
        print("4. python manage.py populate_all_class_progressions")
        sys.exit(1)

def create_test_user():
    """Cria um usuário de teste"""
    print("\n👤 Criando usuário de teste...")
    
    from django.contrib.auth.models import User
    
    if not User.objects.filter(username='testuser').exists():
        User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        print("✅ Usuário de teste criado:")
        print("   Username: testuser")
        print("   Password: testpass123")
    else:
        print("✅ Usuário de teste já existe")

def create_test_character():
    """Cria um personagem de teste"""
    print("\n⚔️ Criando personagem de teste...")
    
    from django.contrib.auth.models import User
    from apps.characters.models import Race, CharacterClass, Background, Character
    
    try:
        user = User.objects.get(username='testuser')
        
        # Buscar dados básicos
        human = Race.objects.filter(slug='human').first()
        wizard = CharacterClass.objects.filter(slug='wizard').first()
        sage = Background.objects.filter(slug='sage').first()
        
        if not human or not wizard:
            print("⚠️ Dados básicos não encontrados, pulando criação de personagem")
            return
        
        if not Character.objects.filter(name='Gandalf Test').exists():
            character = Character.objects.create(
                user=user,
                name='Gandalf Test',
                race=human,
                character_class=wizard,
                background=sage,
                level=1,
                base_strength=8,
                base_dexterity=14,
                base_constitution=13,
                base_intelligence=15,
                base_wisdom=12,
                base_charisma=10,
            )
            print(f"✅ Personagem criado: {character.name}")
            print(f"   HP: {character.current_hp}/{character.max_hp}")
            print(f"   AC: {character.armor_class}")
        else:
            print("✅ Personagem de teste já existe")
            
    except User.DoesNotExist:
        print("⚠️ Usuário de teste não encontrado")

if __name__ == '__main__':
    setup_database()
    
    # Perguntar se quer criar dados de teste
    create_test = input("\n🤔 Criar usuário e personagem de teste? (y/n): ").lower().strip()
    if create_test in ['y', 'yes', 's', 'sim']:
        create_test_user()
        create_test_character()
    
    print("\n🎉 Setup finalizado! O sistema está pronto para uso.")