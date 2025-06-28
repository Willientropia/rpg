#!/bin/bash

echo "🚀 Configurando ambiente D&D Character Creator..."

# Backend setup
echo "📦 Configurando Backend..."
cd backend

# Criar e ativar ambiente virtual
python -m venv venv

# Ativar venv baseado no OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Instalar dependências
pip install -r requirements.txt

# Fazer migrações
python manage.py makemigrations
python manage.py migrate

# Criar superuser (opcional)
echo "Criar superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

cd ..

# Frontend setup  
echo "⚛️ Configurando Frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup completo!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  Backend:  cd backend && python manage.py runserver"
echo "  Frontend: cd frontend && npm run dev"
echo "  Ou usar:  docker-compose up"