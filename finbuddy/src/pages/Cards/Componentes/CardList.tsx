// src/components/CardList.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';

// Ícones para as setas de navegação
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Importar o componente de cartão individual e os tipos
import CreditCardDisplay from './CreditCardDisplay';
import { CardDetails } from '../utils/types';

// Props que o componente CardList espera receber
interface CardListProps {
  cards: CardDetails[]; // Recebe os cartões como prop
  onViewDetailsClick: (card: CardDetails) => void; // Função para quando "Ver fatura" é clicado
  onEditClick: (card: CardDetails) => void; // Função para quando o ícone de editar é clicado
}

const CardList: React.FC<CardListProps> = ({ cards, onViewDetailsClick, onEditClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  if (cards.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Nenhum cartão cadastrado.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={handlePrev} disabled={cards.length <= 1}>
          <ArrowBackIosNewIcon />
        </IconButton>
        </Box>
        <Box sx={{ width: '80%' }}>
                <CreditCardDisplay
            card={cards[currentIndex]}
            onViewDetailsClick={() => onViewDetailsClick(cards[currentIndex])}
            onEditClick={() => onEditClick(cards[currentIndex])}
                />
        </Box>
        <Box sx={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={handleNext} disabled={cards.length <= 1}>
          <ArrowForwardIosIcon />
        </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CardList;