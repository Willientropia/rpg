# ========================================
# ATUALIZAR core/urls.py - URLs Principais
# ========================================

# Adicionar estas linhas no core/urls.py:

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # APIs
    path('api/auth/', include('apps.accounts.urls')),
    path('api/characters/', include('apps.characters.urls')),
    path('api/integration/', include('apps.api_integration.urls')),  # Para futuro
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
