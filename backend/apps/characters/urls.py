# apps/characters/urls.py - URLs da API

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para ViewSets
router = DefaultRouter()
router.register(r'races', views.RaceViewSet)
router.register(r'classes', views.CharacterClassViewSet)
router.register(r'backgrounds', views.BackgroundViewSet)
router.register(r'characters', views.CharacterViewSet, basename='character')
router.register(r'spells', views.SpellSearchView, basename='spell')
router.register(r'campaigns', views.CampaignViewSet, basename='campaign')

# URLs
urlpatterns = [
    # URLs do router
    path('', include(router.urls)),
    
    # URLs auxiliares para criação de personagem
    path('creation-data/', views.character_creation_data, name='character-creation-data'),
    path('validate-creation/', views.validate_character_creation, name='validate-character-creation'),
]

# ===================================
# DOCUMENTAÇÃO DAS ROTAS DA API
# ===================================

"""
📋 ENDPOINTS DISPONÍVEIS:

# ========================================
# AUTENTICAÇÃO (implementar em apps.accounts)
# ========================================
POST   /api/auth/login/           # Login
POST   /api/auth/logout/          # Logout
POST   /api/auth/register/        # Registro
GET    /api/auth/user/            # Dados do usuário atual

# ========================================
# RAÇAS
# ========================================
GET    /api/characters/races/                    # Listar raças
GET    /api/characters/races/{id}/               # Detalhes de raça
POST   /api/characters/races/{id}/sync_api_data/ # Sincronizar com API

# ========================================
# CLASSES
# ========================================
GET    /api/characters/classes/                        # Listar classes
GET    /api/characters/classes/{id}/                   # Detalhes de classe
GET    /api/characters/classes/{id}/level_progression/ # Progressão completa
GET    /api/characters/classes/{id}/progression_by_level/?level=5 # Progressão por nível

# Filtros disponíveis:
# ?is_spellcaster=true
# ?spell_slots_type=full
# ?hit_die=8

# ========================================
# BACKGROUNDS
# ========================================
GET    /api/characters/backgrounds/     # Listar backgrounds
GET    /api/characters/backgrounds/{id}/ # Detalhes de background

# ========================================
# PERSONAGENS
# ========================================
GET    /api/characters/characters/              # Listar meus personagens
POST   /api/characters/characters/              # Criar personagem
GET    /api/characters/characters/{id}/         # Detalhes de personagem
PUT    /api/characters/characters/{id}/         # Atualizar personagem
PATCH  /api/characters/characters/{id}/         # Atualização parcial
DELETE /api/characters/characters/{id}/         # Deletar personagem

# Actions especiais para personagens:
POST   /api/characters/characters/{id}/level_up/      # Subir nível
POST   /api/characters/characters/{id}/rest/          # Descanso
POST   /api/characters/characters/{id}/take_damage/   # Aplicar dano
POST   /api/characters/characters/{id}/heal/          # Curar
POST   /api/characters/characters/{id}/use_spell_slot/ # Usar spell slot

# Gestão de feitiços:
GET    /api/characters/characters/{id}/spells/        # Listar feitiços
POST   /api/characters/characters/{id}/add_spell/     # Adicionar feitiço
DELETE /api/characters/characters/{id}/remove_spell/  # Remover feitiço

# Filtros de personagens:
# ?race=1
# ?character_class=2
# ?level=5
# ?search=gandalf

# ========================================
# FEITIÇOS (Open5e API)
# ========================================
GET    /api/characters/spells/search/              # Buscar feitiços
GET    /api/characters/spells/detail/?slug=fireball # Detalhes de feitiço
GET    /api/characters/spells/for_class/?class=wizard # Feitiços por classe

# Parâmetros de busca:
# ?q=fire               # Busca por nome
# ?class=wizard         # Filtrar por classe
# ?level=3              # Filtrar por nível
# ?school=evocation     # Filtrar por escola
# ?limit=50             # Limite de resultados

# ========================================
# CAMPANHAS
# ========================================
GET    /api/characters/campaigns/            # Minhas campanhas
POST   /api/characters/campaigns/            # Criar campanha
GET    /api/characters/campaigns/{id}/       # Detalhes de campanha
PUT    /api/characters/campaigns/{id}/       # Atualizar campanha
DELETE /api/characters/campaigns/{id}/       # Deletar campanha

# Actions de campanha:
POST   /api/characters/campaigns/{id}/join/       # Entrar na campanha
POST   /api/characters/campaigns/{id}/leave/      # Sair da campanha
GET    /api/characters/campaigns/{id}/characters/ # Personagens da campanha

# ========================================
# UTILITÁRIOS
# ========================================
GET    /api/characters/creation-data/     # Dados para criação de personagem
POST   /api/characters/validate-creation/ # Validar criação sem criar

# ========================================
# EXEMPLOS DE USO
# ========================================

# 1. Criar personagem:
POST /api/characters/characters/
{
  "name": "Gandalf",
  "race": 1,
  "character_class": 2,
  "background": 3,
  "base_strength": 8,
  "base_dexterity": 14,
  "base_constitution": 13,
  "base_intelligence": 15,
  "base_wisdom": 12,
  "base_charisma": 10
}

# 2. Subir nível:
POST /api/characters/characters/1/level_up/
{
  "confirm": true
}

# 3. Descanso longo:
POST /api/characters/characters/1/rest/
{
  "rest_type": "long"
}

# 4. Aplicar dano:
POST /api/characters/characters/1/take_damage/
{
  "damage": 8,
  "damage_type": "slashing"
}

# 5. Buscar feitiços:
GET /api/characters/spells/search/?class=wizard&level=1&limit=20

# 6. Adicionar feitiço:
POST /api/characters/characters/1/add_spell/
{
  "spell_slug": "magic-missile",
  "spell_name": "Magic Missile",
  "spell_level": 1,
  "is_prepared": true,
  "is_known": true
}

# ========================================
# CÓDIGOS DE RESPOSTA
# ========================================

# 200 OK               - Sucesso
# 201 Created          - Criado com sucesso
# 400 Bad Request      - Dados inválidos
# 401 Unauthorized     - Não autenticado
# 403 Forbidden        - Sem permissão
# 404 Not Found        - Não encontrado
# 500 Internal Error   - Erro do servidor

# ========================================
# ESTRUTURA DE RESPOSTA PADRÃO
# ========================================

# Sucesso:
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}

# Erro:
{
  "success": false,
  "error": "Descrição do erro",
  "details": { ... }  // Opcional
}

# Lista paginada:
{
  "count": 42,
  "next": "http://api/next-page/",
  "previous": null,
  "results": [ ... ]
}
"""