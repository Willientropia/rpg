from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # Comentar as rotas dos apps por enquanto
    # path('api/auth/', include('apps.accounts.urls')),
    # path('api/characters/', include('apps.characters.urls')),
    # path('api/integration/', include('apps.api_integration.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
