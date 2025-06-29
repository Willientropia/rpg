#!/bin/bash
# backend/docker-entrypoint.sh

set -e

echo "🚀 Iniciando entrypoint do Django..."

# Aguardar banco de dados (se usando PostgreSQL)
if [ "$DATABASE_URL" ]; then
    echo "⏳ Aguardando banco de dados..."
    while ! nc -z db 5432; do
        sleep 0.1
    done
    echo "✅ Banco de dados conectado!"
fi

# Executar migrações
echo "🔄 Executando migrações..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Coletar arquivos estáticos
echo "📦 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput || true

# Criar superuser se não existir
echo "👤 Verificando superuser..."
python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('✅ Superuser criado: admin/admin123')
else:
    print('👤 Superuser já existe')
EOF

# Executar comando passado como argumento
echo "🎯 Executando comando: $@"
exec "$@"