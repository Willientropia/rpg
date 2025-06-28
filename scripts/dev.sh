#!/bin/bash

start_backend() {
    echo "🐍 Iniciando Django..."
    cd backend
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    python manage.py runserver 8000
}

start_frontend() {
    echo "⚛️ Iniciando React..."
    cd frontend
    npm run dev
}

if [ "$1" = "backend" ]; then
    start_backend
elif [ "$1" = "frontend" ]; then
    start_frontend
else
    echo "🚀 Iniciando ambos os servidores..."
    start_backend &
    start_frontend &
    wait
fi