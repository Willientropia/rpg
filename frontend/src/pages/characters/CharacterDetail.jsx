// src/pages/characters/CharacterDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { charactersService } from '../../services/charactersService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: character, isLoading, error } = useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersService.getCharacter(id),
  });

  if (isLoading) {
    return <LoadingSpinner message="Carregando personagem..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Erro ao carregar personagem
          </h2>
          <Button onClick={() => navigate('/characters')}>
            Voltar à Lista
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-400">
          {character?.name}
        </h1>
        <div className="space-x-2">
          <Button 
            variant="secondary"
            onClick={() => navigate('/characters')}
          >
            ← Voltar
          </Button>
          <Button onClick={() => navigate(`/characters/${id}/edit`)}>
            Editar
          </Button>
        </div>
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-4">
          Detalhes do Personagem
        </h2>
        <p className="text-stone-600">
          Página de detalhes em desenvolvimento...
        </p>
      </Card>
    </div>
  );
}