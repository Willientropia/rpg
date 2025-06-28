from django.contrib import admin
from .models import Character

@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'level', 'created_at']
    list_filter = ['level', 'created_at']
    search_fields = ['name', 'user__username']