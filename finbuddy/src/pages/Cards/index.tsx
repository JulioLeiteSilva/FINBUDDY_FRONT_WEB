// src/pages/Cards/index.tsx (ou onde seu CreditCardPage está)
/*
import React from 'react';
import { Box, Typography } from '@mui/material'; // Trocamos Container por Box

// ... (outros imports: AddCardFeature, CardList, RecentTransactionsList) ...
import AddCardFeature from './Componentes/AddCardModal'; 
import CardList from './Componentes/CardList';
import RecentTransactionsList from './Componentes/RecentTransactionsList';


const CreditCardPage: React.FC = () => {
  // ... (Sua lógica de dados, se houver, permanece aqui) ...

  return (
    // MUDANÇA: Trocado <Container maxWidth="lg"> por um <Box> com padding (px).
    // O Box ocupa 100% da largura, e 'px' adiciona padding horizontal responsivo.
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, minHeight: '100vh' }}>
      
      
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Meus Cartões
        </Typography>

        <AddCardFeature />
      </Box>

      
      <Box sx={{ mb: 4 }}>
        <CardList />
      </Box>

      
      <Box>
        <RecentTransactionsList />
      </Box>
      
    </Box>
  );
};

export default CreditCardPage;
*/

// src/pages/Cards/CardPage.tsx

import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import AddCardFeature from './Componentes/AddCardModal';
import CardDetailsModal from './Componentes/CardInvoiceModal';
import CardList from './Componentes/CardList';
import RecentTransactionsList from './Componentes/RecentTransactionsList';
import { ProcessedTransaction } from './utils/TransactionItem';
import { CardDetails } from './utils/types';

// Importe os componentes da página de cartões
 // Supondo que você moveu os tipos para um arquivo compartilhado

// --- DADOS MOCKADOS ---
const mockCards: CardDetails[] = [
  {
    id: 'nubank-card-id-01',
    cardName: "Cartão Ultravioleta", bankName: "Nubank", brand: "MASTERCARD",
    closingDay: 28, dueDate: dayjs('2025-06-05').toDate(),
    invoiceTotal: 1250.77, limitTotal: 15000.00, amountSpent: 4300.50,
  },
  {
    id: 'itau-card-id-02',
    cardName: "Click Platinum", bankName: "Itau", brand: "MASTERCARD",
    closingDay: 20, dueDate: dayjs('2025-06-28').toDate(),
    invoiceTotal: 850.45, limitTotal: 8000.00, amountSpent: 2100.30,
  },
   {
    id: 'bb-card-id-03',
    cardName: "Ourocard Fácil", bankName: "Banco do Brasil", brand: "ELO",
    closingDay: 15, dueDate: dayjs('2025-06-25').toDate(),
    invoiceTotal: 430.10, limitTotal: 6000.00, amountSpent: 1250.00,
  },
];

const mockTransactions: ProcessedTransaction[] = [
  // Transações do Nubank (Maio e Junho)
  { id: 'tx-1', name: 'Netflix', category: 'Assinaturas', value: 39.90, type: 'expense', date: dayjs('2025-05-10').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-2', name: 'Supermercado', category: 'Alimentação', value: 350.45, type: 'expense', date: dayjs('2025-05-15').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-3', name: 'Salário', category: 'Salário', value: 7500.00, type: 'income', date: dayjs('2025-06-05').toDate(), isPaid: true, bankAccountId: 'conta-principal' }, // Transação não ligada a um cartão
  { id: 'tx-6', name: 'Conta de Internet', category: 'Contas', value: 109.90, type: 'expense', date: dayjs('2025-04-30').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  
  // Transações do Itaú (Maio)
  { id: 'tx-4', name: 'Cinema', category: 'Lazer', value: 60.00, type: 'expense', date: dayjs('2025-05-12').toDate(), isPaid: true, bankAccountId: 'itau-card-id-02' },
  { id: 'tx-5', name: 'Restaurante', category: 'Alimentação', value: 120.00, type: 'expense', date: dayjs('2025-05-18').toDate(), isPaid: true, bankAccountId: 'itau-card-id-02' },

  // Transações do Banco do Brasil (Junho)
  { id: 'tx-7', name: 'Posto de Gasolina', category: 'Transporte', value: 150.00, type: 'expense', date: dayjs('2025-06-01').toDate(), isPaid: true, bankAccountId: 'bb-card-id-03' },
  
  // Mais transações para garantir que tenhamos mais de 8 no total
  { id: 'tx-8', name: 'Padaria', category: 'Alimentação', value: 25.50, type: 'expense', date: dayjs('2025-06-04').toDate(), isPaid: true, bankAccountId: 'itau-card-id-02' },
  { id: 'tx-9', name: 'Farmácia', category: 'Saúde', value: 75.20, type: 'expense', date: dayjs('2025-06-06').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-10', name: 'Rendimento Poupança', category: 'Investimentos', value: 50.10, type: 'income', date: dayjs('2025-05-31').toDate(), isPaid: true, bankAccountId: 'conta-principal' },
];


const CreditCardPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);

  const handleViewDetailsClick = (card: CardDetails) => setSelectedCard(card);
  const handleCloseModal = () => setSelectedCard(null);
  const handleEditClick = (card: CardDetails) => console.log("Ação para editar o cartão:", card.cardName);
  const handleAddNewTransactionClick = () => console.log("Ação para adicionar nova transação!");

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Meus Cartões
        </Typography>
        <AddCardFeature />
      </Box>

      <Box sx={{ mb: 3 }}>
        <CardList 
          cards={mockCards}
          onViewDetailsClick={handleViewDetailsClick}
          onEditClick={handleEditClick}
        />
      </Box>

      {/* --- BOTÃO DE ADICIONAR NOVA TRANSAÇÃO --- */}
      {/* Container do botão, agora alinhado à direita */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={handleAddNewTransactionClick}
          // Estilos para o botão "gordinho e arredondado"
          sx={{
            textTransform: 'none',
            borderRadius: '20px', // Deixa bem arredondado
            padding: '8px 20px', // Controla o tamanho "gordinho"
            fontSize: '0.9rem',
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)'
          }}
        >
          Nova Transação
        </Button>
      </Box>

      {/* --- SEÇÃO DE TRANSAÇÕES RECENTES --- */}
      <Box>
        <RecentTransactionsList transactions={mockTransactions} />
      </Box>

      <CardDetailsModal
        open={!!selectedCard}
        onClose={handleCloseModal}
        card={selectedCard}
        transactions={mockTransactions}
      />
      
    </Box>
  );
};

export default CreditCardPage;