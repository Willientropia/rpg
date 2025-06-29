// src/pages/characters/CharacterSheet.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function CharacterSheet() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-400">
          Ficha do Personagem
        </h1>
        <Button 
          variant="secondary"
          onClick={() => navigate(`/characters/${id}`)}
        >
          ← Voltar
        </Button>
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-4">
          Ficha de Personagem D&D 5e
        </h2>
        <p className="text-stone-600">
          Ficha interativa em desenvolvimento...
        </p>
      </Card>
    </div>
  );
}