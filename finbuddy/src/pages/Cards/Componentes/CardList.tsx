// src/components/CardList.tsx
import React, { useState, useMemo } from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';

// Ícones para as setas de navegação
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Importar o componente de cartão individual e os tipos
import CreditCardDisplay from './CreditCardDisplay';
// Seria ideal importar estes tipos de um arquivo compartilhado, ex: import { CardDetails } from '../types';
// Mas, por enquanto, os definimos aqui para clareza se necessário.
interface CardDetails {
  id: string;
  cardName: string;
  bankName: string;
  brand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'OTHER';
  closingDay: number;
  dueDate: Date;
  invoiceTotal: number;
  limitTotal: number;
  amountSpent: number;
}

// Props que o componente CardList espera receber
interface CardListProps {
  cards: CardDetails[]; // Recebe os cartões como prop
  onViewDetailsClick: (card: CardDetails) => void; // Função para quando "Ver fatura" é clicado
  onEditClick: (card: CardDetails) => void; // Função para quando o ícone de editar é clicado
}

const CardList: React.FC<CardListProps> = ({ cards, onViewDetailsClick, onEditClick }) => {
  // Estado para controlar o índice do primeiro cartão visível no carrossel
  const [startIndex, setStartIndex] = useState(0);

  const totalCards = cards.length;

  // Handler para navegar para o próximo cartão no carrossel
  const handleNext = () => {
    if (totalCards === 0) return;
    setStartIndex(prevIndex => (prevIndex + 1) % totalCards);
  };

  // Handler para navegar para o cartão anterior no carrossel
  const handlePrev = () => {
    if (totalCards === 0) return;
    setStartIndex(prevIndex => (prevIndex - 1 + totalCards) % totalCards);
  };

  // Memoiza a lista de cartões visíveis para otimizar a performance
  const visibleCards = useMemo(() => {
    // Se houver 3 ou menos cartões, mostra todos.
    if (totalCards <= 3) {
      return cards;
    }
    
    const cardsToDisplay: CardDetails[] = [];
    for (let i = 0; i < 3; i++) {
      const cardIndex = (startIndex + i) % totalCards;
      cardsToDisplay.push(cards[cardIndex]);
    }
    return cardsToDisplay;
  }, [startIndex, cards, totalCards]);

  // Condição para mostrar ou não os botões de navegação
  const showNavigation = totalCards > 3;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Botão de Voltar (só aparece se a navegação for necessária) */}
        <IconButton onClick={handlePrev} aria-label="cartão anterior" disabled={!showNavigation}>
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* Container dos Cards */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Grid container spacing={3} justifyContent="center">
            {visibleCards.map(card => (
              // Usando a sintaxe 'size' do Grid que funciona no seu projeto
              <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CreditCardDisplay
                  card={card}
                  // Passa as funções para cada card individual, envolvendo-as para passar o objeto 'card'
                  onViewDetailsClick={() => onViewDetailsClick(card)}
                  onEditClick={() => onEditClick(card)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Botão de Avançar (só aparece se a navegação for necessária) */}
        <IconButton onClick={handleNext} aria-label="próximo cartão" disabled={!showNavigation}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CardList;