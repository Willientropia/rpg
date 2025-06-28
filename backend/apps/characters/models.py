from django.db import models
from django.contrib.auth.models import User

class Character(models.Model):
    """Modelo básico de personagem para testar"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='characters')
    name = models.CharField(max_length=100)
    level = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} (Level {self.level})"
    
    class Meta:
        app_label = 'characters'