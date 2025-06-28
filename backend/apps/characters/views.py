# apps/characters/views.py - Django REST Framework Views

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
import requests
from django.db import models
from .models import (
    Race, CharacterClass, ClassLevelProgression, Background,
    Character, CharacterSpell, Campaign
)
from .serializers import (
    RaceSerializer, CharacterClassSerializer, ClassLevelProgressionSerializer,
    BackgroundSerializer, CharacterListSerializer, CharacterDetailSerializer,
    CharacterCreateSerializer, CharacterUpdateSerializer, CharacterSpellSerializer,
    CampaignSerializer, LevelUpSerializer, RestSerializer, TakeDamageSerializer,
    HealSerializer, UseSpellSlotSerializer, SpellSearchSerializer
)


class RaceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para Raças
    Apenas leitura - dados gerenciados via admin
    """
    queryset = Race.objects.all()
    serializer_class = RaceSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'slug']
    ordering_fields = ['name']
    ordering = ['name']
    
    @action(detail=True, methods=['post'])
    def sync_api_data(self, request, pk=None):
        """Sincroniza dados com Open5e API"""
        race = self.get_object()
        
        if race.fetch_api_data():
            serializer = self.get_serializer(race)
            return Response({
                'success': True,
                'message': f'Dados de {race.name} atualizados da API',
                'data': serializer.data
            })
        else:
            return Response({
                'success': False,
                'message': f'Falha ao sincronizar {race.name}'
            }, status=status.HTTP_400_BAD_REQUEST)


class CharacterClassViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para Classes de Personagem
    """
    queryset = CharacterClass.objects.all()
    serializer_class = CharacterClassSerializer
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'slug']
    filterset_fields = ['is_spellcaster', 'spell_slots_type', 'hit_die']
    ordering_fields = ['name', 'hit_die']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def level_progression(self, request, pk=None):
        """Retorna progressão de todos os níveis da classe"""
        character_class = self.get_object()
        progressions = ClassLevelProgression.objects.filter(
            character_class=character_class
        ).order_by('level')
        
        serializer = ClassLevelProgressionSerializer(progressions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def progression_by_level(self, request, pk=None):
        """Retorna progressão de um nível específico"""
        character_class = self.get_object()
        level = request.query_params.get('level', 1)
        
        try:
            level = int(level)
            if level < 1 or level > 20:
                return Response(
                    {'error': 'Nível deve estar entre 1 e 20'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {'error': 'Nível deve ser um número'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            progression = ClassLevelProgression.objects.get(
                character_class=character_class,
                level=level
            )
            serializer = ClassLevelProgressionSerializer(progression)
            return Response(serializer.data)
        except ClassLevelProgression.DoesNotExist:
            return Response(
                {'error': f'Progressão para nível {level} não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )


class BackgroundViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para Backgrounds
    """
    queryset = Background.objects.all()
    serializer_class = BackgroundSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'slug']
    ordering_fields = ['name']
    ordering = ['name']


class CharacterViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal para Personagens
    """
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'race__name', 'character_class__name']
    filterset_fields = ['race', 'character_class', 'background', 'level']
    ordering_fields = ['name', 'level', 'created_at']
    ordering = ['-created_at']
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retorna apenas personagens do usuário atual"""
        return Character.objects.filter(user=self.request.user).select_related(
            'user', 'race', 'character_class', 'background'
        ).prefetch_related('spells')
    
    def get_serializer_class(self):
        """Retorna serializer adequado para cada action"""
        if self.action == 'list':
            return CharacterListSerializer
        elif self.action == 'create':
            return CharacterCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CharacterUpdateSerializer
        else:
            return CharacterDetailSerializer
    
    def perform_create(self, serializer):
        """Adiciona usuário atual ao criar personagem"""
        serializer.save(user=self.request.user)
    
    # ========================================
    # ACTIONS PARA GESTÃO DE PERSONAGEM
    # ========================================
    
    @action(detail=True, methods=['post'])
    def level_up(self, request, pk=None):
        """Sobe nível do personagem"""
        character = self.get_object()
        serializer = LevelUpSerializer(
            data=request.data,
            context={'character': character}
        )
        
        if serializer.is_valid():
            old_level = character.level
            success = character.level_up()
            
            if success:
                # Retornar dados atualizados
                char_serializer = CharacterDetailSerializer(character)
                return Response({
                    'success': True,
                    'message': f'Personagem subiu do nível {old_level} para {character.level}!',
                    'character': char_serializer.data
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Não foi possível subir de nível'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def rest(self, request, pk=None):
        """Descanso (curto ou longo)"""
        character = self.get_object()
        serializer = RestSerializer(data=request.data)
        
        if serializer.is_valid():
            rest_type = serializer.validated_data['rest_type']
            
            if rest_type == 'long':
                character.rest_long()
                message = 'Descanso longo realizado! HP e spell slots restaurados.'
            else:
                character.rest_short()
                message = 'Descanso curto realizado! Alguns recursos restaurados.'
            
            char_serializer = CharacterDetailSerializer(character)
            return Response({
                'success': True,
                'message': message,
                'character': char_serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def take_damage(self, request, pk=None):
        """Aplica dano ao personagem"""
        character = self.get_object()
        serializer = TakeDamageSerializer(data=request.data)
        
        if serializer.is_valid():
            damage = serializer.validated_data['damage']
            damage_applied = character.take_damage(damage)
            
            char_serializer = CharacterDetailSerializer(character)
            return Response({
                'success': True,
                'message': f'{damage_applied} de dano aplicado. HP atual: {character.current_hp}',
                'character': char_serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def heal(self, request, pk=None):
        """Cura o personagem"""
        character = self.get_object()
        serializer = HealSerializer(
            data=request.data,
            context={'character': character}
        )
        
        if serializer.is_valid():
            healing = serializer.validated_data['healing']
            healing_applied = character.heal(healing)
            
            char_serializer = CharacterDetailSerializer(character)
            return Response({
                'success': True,
                'message': f'{healing_applied} HP curado. HP atual: {character.current_hp}',
                'character': char_serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def use_spell_slot(self, request, pk=None):
        """Usa um spell slot"""
        character = self.get_object()
        serializer = UseSpellSlotSerializer(
            data=request.data,
            context={'character': character}
        )
        
        if serializer.is_valid():
            spell_level = serializer.validated_data['spell_level']
            success = character.use_spell_slot(spell_level)
            
            if success:
                current_slots = character.get_current_spell_slots(spell_level)
                max_slots = character.get_max_spell_slots(spell_level)
                
                char_serializer = CharacterDetailSerializer(character)
                return Response({
                    'success': True,
                    'message': f'Spell slot de nível {spell_level} usado. Restam: {current_slots}/{max_slots}',
                    'character': char_serializer.data
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Não foi possível usar o spell slot'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # ========================================
    # ACTIONS PARA FEITIÇOS
    # ========================================
    
    @action(detail=True, methods=['get'])
    def spells(self, request, pk=None):
        """Lista feitiços do personagem"""
        character = self.get_object()
        spells = character.spells.all().order_by('spell_level', 'spell_name')
        
        # Filtros opcionais
        spell_level = request.query_params.get('level')
        is_prepared = request.query_params.get('prepared')
        
        if spell_level:
            try:
                spell_level = int(spell_level)
                spells = spells.filter(spell_level=spell_level)
            except ValueError:
                pass
        
        if is_prepared is not None:
            is_prepared = is_prepared.lower() == 'true'
            spells = spells.filter(is_prepared=is_prepared)
        
        serializer = CharacterSpellSerializer(spells, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_spell(self, request, pk=None):
        """Adiciona feitiço ao personagem"""
        character = self.get_object()
        
        if not character.character_class.is_spellcaster:
            return Response({
                'error': 'Este personagem não é spellcaster'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CharacterSpellSerializer(data=request.data)
        if serializer.is_valid():
            # Verificar se já tem o feitiço
            spell_slug = serializer.validated_data['spell_slug']
            if character.spells.filter(spell_slug=spell_slug).exists():
                return Response({
                    'error': 'Personagem já conhece este feitiço'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar feitiço
            spell = serializer.save(character=character)
            
            # Tentar buscar dados da API
            spell.fetch_spell_data()
            
            spell_serializer = CharacterSpellSerializer(spell)
            return Response({
                'success': True,
                'message': f'Feitiço {spell.spell_name} adicionado',
                'spell': spell_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def remove_spell(self, request, pk=None):
        """Remove feitiço do personagem"""
        character = self.get_object()
        spell_slug = request.data.get('spell_slug')
        
        if not spell_slug:
            return Response({
                'error': 'spell_slug é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            spell = character.spells.get(spell_slug=spell_slug)
            spell_name = spell.spell_name
            spell.delete()
            
            return Response({
                'success': True,
                'message': f'Feitiço {spell_name} removido'
            })
        except CharacterSpell.DoesNotExist:
            return Response({
                'error': 'Feitiço não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)


class SpellSearchView(viewsets.ViewSet):
    """
    ViewSet para busca de feitiços na Open5e API
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Busca feitiços na Open5e API"""
        # Parâmetros de busca
        query = request.query_params.get('q', '')
        spell_class = request.query_params.get('class', '')
        level = request.query_params.get('level', '')
        school = request.query_params.get('school', '')
        limit = request.query_params.get('limit', 20)
        
        try:
            limit = min(int(limit), 100)  # Máximo 100 resultados
        except ValueError:
            limit = 20
        
        # Construir URL da API
        api_url = "https://api.open5e.com/v2/spells/"
        params = {'limit': limit}
        
        if query:
            params['search'] = query
        if spell_class:
            params['dnd_class'] = spell_class
        if level:
            try:
                level = int(level)
                if 0 <= level <= 9:
                    params['level'] = level
            except ValueError:
                pass
        if school:
            params['school'] = school
        
        try:
            response = requests.get(api_url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                # Processar resultados
                spells = []
                for spell_data in data.get('results', []):
                    # Extrair classes do feitiço
                    spell_classes = []
                    if 'dnd_class' in spell_data:
                        spell_classes = [cls.get('name', '') for cls in spell_data['dnd_class']]
                    
                    spell = {
                        'name': spell_data.get('name', ''),
                        'slug': spell_data.get('slug', ''),
                        'level': spell_data.get('level', 0),
                        'school': spell_data.get('school', ''),
                        'classes': spell_classes,
                        'description': spell_data.get('desc', ''),
                        'casting_time': spell_data.get('casting_time', ''),
                        'range': spell_data.get('range', ''),
                        'components': spell_data.get('components', ''),
                        'duration': spell_data.get('duration', ''),
                    }
                    spells.append(spell)
                
                return Response({
                    'count': data.get('count', 0),
                    'next': data.get('next'),
                    'previous': data.get('previous'),
                    'results': spells
                })
            else:
                return Response({
                    'error': 'Erro ao buscar feitiços na API'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except requests.RequestException as e:
            return Response({
                'error': f'Erro de conexão com a API: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def detail(self, request):
        """Busca detalhes de um feitiço específico"""
        spell_slug = request.query_params.get('slug')
        
        if not spell_slug:
            return Response({
                'error': 'Parâmetro slug é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            response = requests.get(
                f"https://api.open5e.com/v2/spells/{spell_slug}/",
                timeout=10
            )
            
            if response.status_code == 200:
                spell_data = response.json()
                
                # Extrair classes do feitiço
                spell_classes = []
                if 'dnd_class' in spell_data:
                    spell_classes = [cls.get('name', '') for cls in spell_data['dnd_class']]
                
                spell = {
                    'name': spell_data.get('name', ''),
                    'slug': spell_data.get('slug', ''),
                    'level': spell_data.get('level', 0),
                    'school': spell_data.get('school', ''),
                    'classes': spell_classes,
                    'description': spell_data.get('desc', ''),
                    'casting_time': spell_data.get('casting_time', ''),
                    'range': spell_data.get('range', ''),
                    'components': spell_data.get('components', ''),
                    'duration': spell_data.get('duration', ''),
                    'concentration': spell_data.get('concentration', False),
                    'ritual': spell_data.get('ritual', False),
                    'higher_level': spell_data.get('higher_level', ''),
                }
                
                return Response(spell)
            elif response.status_code == 404:
                return Response({
                    'error': 'Feitiço não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({
                    'error': 'Erro ao buscar feitiço na API'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except requests.RequestException as e:
            return Response({
                'error': f'Erro de conexão com a API: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def for_class(self, request):
        """Lista feitiços disponíveis para uma classe específica"""
        character_class = request.query_params.get('class')
        level = request.query_params.get('level', '')
        limit = request.query_params.get('limit', 50)
        
        if not character_class:
            return Response({
                'error': 'Parâmetro class é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            limit = min(int(limit), 100)
        except ValueError:
            limit = 50
        
        # Buscar na API
        api_url = "https://api.open5e.com/v2/spells/"
        params = {
            'dnd_class': character_class,
            'limit': limit
        }
        
        if level:
            try:
                level = int(level)
                if 0 <= level <= 9:
                    params['level'] = level
            except ValueError:
                pass
        
        try:
            response = requests.get(api_url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                
                # Processar e agrupar por nível
                spells_by_level = {}
                for spell_data in data.get('results', []):
                    spell_level = spell_data.get('level', 0)
                    
                    if spell_level not in spells_by_level:
                        spells_by_level[spell_level] = []
                    
                    spell = {
                        'name': spell_data.get('name', ''),
                        'slug': spell_data.get('slug', ''),
                        'level': spell_level,
                        'school': spell_data.get('school', ''),
                        'casting_time': spell_data.get('casting_time', ''),
                        'range': spell_data.get('range', ''),
                        'concentration': spell_data.get('concentration', False),
                        'ritual': spell_data.get('ritual', False),
                    }
                    spells_by_level[spell_level].append(spell)
                
                return Response({
                    'class': character_class,
                    'total_count': data.get('count', 0),
                    'spells_by_level': spells_by_level
                })
            else:
                return Response({
                    'error': 'Erro ao buscar feitiços na API'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except requests.RequestException as e:
            return Response({
                'error': f'Erro de conexão com a API: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CampaignViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Campanhas
    """
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Retorna campanhas onde o usuário é DM ou jogador"""
        user = self.request.user
        return Campaign.objects.filter(
            models.Q(dm=user) | models.Q(players=user)
        ).distinct().select_related('dm').prefetch_related('players')
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Entrar em uma campanha"""
        campaign = self.get_object()
        user = request.user
        
        if user == campaign.dm:
            return Response({
                'error': 'Você é o DM desta campanha'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if user in campaign.players.all():
            return Response({
                'error': 'Você já está nesta campanha'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        campaign.players.add(user)
        
        serializer = self.get_serializer(campaign)
        return Response({
            'success': True,
            'message': f'Você entrou na campanha {campaign.name}',
            'campaign': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Sair de uma campanha"""
        campaign = self.get_object()
        user = request.user
        
        if user == campaign.dm:
            return Response({
                'error': 'DM não pode sair da própria campanha'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if user not in campaign.players.all():
            return Response({
                'error': 'Você não está nesta campanha'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        campaign.players.remove(user)
        
        return Response({
            'success': True,
            'message': f'Você saiu da campanha {campaign.name}'
        })
    
    @action(detail=True, methods=['get'])
    def characters(self, request, pk=None):
        """Lista personagens da campanha"""
        campaign = self.get_object()
        
        # Buscar personagens dos jogadores da campanha
        player_ids = campaign.players.values_list('id', flat=True)
        characters = Character.objects.filter(
            user_id__in=player_ids
        ).select_related('user', 'race', 'character_class', 'background')
        
        serializer = CharacterListSerializer(characters, many=True)
        return Response(serializer.data)


# ========================================
# VIEWS AUXILIARES
# ========================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def character_creation_data(request):
    """
    Endpoint para obter todos os dados necessários para criação de personagem
    """
    races = Race.objects.all()
    classes = CharacterClass.objects.all()
    backgrounds = Background.objects.all()
    
    return Response({
        'races': RaceSerializer(races, many=True).data,
        'classes': CharacterClassSerializer(classes, many=True).data,
        'backgrounds': BackgroundSerializer(backgrounds, many=True).data,
        'point_buy_limit': 27,
        'attribute_limits': {
            'min': 8,
            'max': 15
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_character_creation(request):
    """
    Endpoint para validar dados de criação de personagem sem criar
    """
    serializer = CharacterCreateSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        # Calcular estatísticas que o personagem teria
        data = serializer.validated_data
        race = data['race']
        character_class = data['character_class']
        
        # Calcular atributos finais
        final_abilities = {
            'strength': min(20, data['base_strength'] + race.strength_bonus),
            'dexterity': min(20, data['base_dexterity'] + race.dexterity_bonus),
            'constitution': min(20, data['base_constitution'] + race.constitution_bonus),
            'intelligence': min(20, data['base_intelligence'] + race.intelligence_bonus),
            'wisdom': min(20, data['base_wisdom'] + race.wisdom_bonus),
            'charisma': min(20, data['base_charisma'] + race.charisma_bonus)
        }
        
        # Calcular modificadores
        modifiers = {
            ability: (score - 10) // 2 
            for ability, score in final_abilities.items()
        }
        
        # Calcular HP
        con_mod = modifiers['constitution']
        max_hp = character_class.hit_die + con_mod
        
        return Response({
            'valid': True,
            'preview': {
                'final_abilities': final_abilities,
                'modifiers': modifiers,
                'max_hp': max_hp,
                'armor_class': 10 + modifiers['dexterity'],
                'proficiency_bonus': 2,
                'is_spellcaster': character_class.is_spellcaster
            }
        })
    
    return Response({
        'valid': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)