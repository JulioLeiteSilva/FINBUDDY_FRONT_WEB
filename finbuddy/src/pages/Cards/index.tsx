// src/pages/Cards/CardPage.tsx (ou o caminho do seu arquivo)
import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

// Importe todos os componentes que a página utiliza
import CardList from './Componentes/CardList';
 // O modal para Adicionar/Editar Cartão

// Importe seus tipos (idealmente de um arquivo compartilhado)
import { ProcessedTransaction } from './utils/types';
import { CardDetails } from './utils/types';
import AddTransactionModal from './Componentes/AddTransactionModal';
import CardFormModal from './Componentes/CardFormModal';
import CardDetailsModal from './Componentes/CardInvoiceModal';
import RecentTransactionsList from './Componentes/RecentTransactionsList';

// --- DADOS MOCKADOS (definidos na página para desenvolvimento) ---
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
  { id: 'tx-1', name: 'Netflix', category: 'Assinaturas', value: 39.90, type: 'expense', date: dayjs('2025-05-10').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-2', name: 'Supermercado', category: 'Alimentação', value: 350.45, type: 'expense', date: dayjs('2025-05-15').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-6', name: 'Conta de Internet', category: 'Contas', value: 109.90, type: 'expense', date: dayjs('2025-04-30').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-4', name: 'Cinema', category: 'Lazer', value: 60.00, type: 'expense', date: dayjs('2025-05-12').toDate(), isPaid: true, bankAccountId: 'itau-card-id-02' },
  { id: 'tx-5', name: 'Restaurante', category: 'Alimentação', value: 120.00, type: 'expense', date: dayjs('2025-05-18').toDate(), isPaid: true, bankAccountId: 'itau-card-id-02' },
  { id: 'tx-7', name: 'Posto de Gasolina', category: 'Transporte', value: 150.00, type: 'expense', date: dayjs('2025-06-01').toDate(), isPaid: true, bankAccountId: 'bb-card-id-03' },
  { id: 'tx-8', name: 'Padaria', category: 'Alimentação', value: 25.50, type: 'expense', date: dayjs('2025-06-04').toDate(), isPaid: true, bankAccountId: 'itau-card-id-02' },
  { id: 'tx-9', name: 'Farmácia', category: 'Saúde', value: 75.20, type: 'expense', date: dayjs('2025-06-06').toDate(), isPaid: true, bankAccountId: 'nubank-card-id-01' },
  { id: 'tx-10', name: 'Rendimento Poupança', category: 'Investimentos', value: 50.10, type: 'income', date: dayjs('2025-05-31').toDate(), isPaid: true, bankAccountId: 'conta-principal' },
];


const CardPage: React.FC = () => {
  // Estado para o modal de detalhes do cartão
  const [detailsCard, setDetailsCard] = useState<CardDetails | null>(null);
  
  // Estado para o modal de formulário (Adicionar/Editar Cartão)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CardDetails | null>(null);

  // NOVO: Estado para o modal de adicionar transação
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // --- Handlers para o Modal de Formulário de Cartão ---
  const handleOpenAddCardModal = () => {
    setCardToEdit(null);
    setIsFormModalOpen(true);
  };
  const handleOpenEditCardModal = (card: CardDetails) => {
    setCardToEdit(card);
    setIsFormModalOpen(true);
  };
  const handleCloseFormModal = () => setIsFormModalOpen(false);
  const handleSaveCard = (formData: any, cardId: string | null) => {
    if (cardId) console.log('Salvando alterações para o cartão ID:', cardId, 'Dados:', formData);
    else console.log('Criando novo cartão com os dados:', formData);
    handleCloseFormModal();
  };

  // --- Handlers para o Modal de Detalhes do Cartão ---
  const handleViewDetailsClick = (card: CardDetails) => setDetailsCard(card);
  const handleCloseDetailsModal = () => setDetailsCard(null);

  // --- Handlers para o Modal de Adicionar Transação ---
  const handleOpenTransactionModal = () => setIsTransactionModalOpen(true);
  const handleCloseTransactionModal = () => setIsTransactionModalOpen(false);
  const handleSaveTransaction = (transactionData: any) => {
    console.log("Salvando nova transação:", transactionData);
    // Aqui você adicionaria a nova transação à sua lista de mockTransactions (para ver o resultado na tela)
    // ou chamaria sua store Zustand para adicionar de verdade
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Meus Cartões
        </Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenAddCardModal} sx={{ borderRadius: '20px', padding: '10px 20px', textTransform: 'none', fontSize:'1rem' }}>
          Novo Cartão +
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <CardList 
          cards={mockCards}
          onViewDetailsClick={handleViewDetailsClick}
          onEditClick={handleOpenEditCardModal}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
        <Button variant="contained" size="medium" startIcon={<AddIcon />} onClick={handleOpenTransactionModal} sx={{ textTransform: 'none', borderRadius: '20px', padding: '8px 20px', fontSize: '0.9rem', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)' }}>
          Adicionar Nova Transação
        </Button>
      </Box>

      <Box>
        <RecentTransactionsList transactions={mockTransactions} />
      </Box>

      {/* MODAL 1: Detalhes do Cartão */}
      <CardDetailsModal
        open={!!detailsCard}
        onClose={handleCloseDetailsModal}
        card={detailsCard}
        transactions={mockTransactions}
      />
      
      {/* MODAL 2: Formulário de Adicionar/Editar Cartão */}
      <CardFormModal
        open={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveCard}
        initialData={cardToEdit}
      />

      {/* MODAL 3: Formulário de Adicionar Transação */}
      <AddTransactionModal
        open={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSave={handleSaveTransaction}
        cards={mockCards}
      />
      
    </Box>
  );
};

export default CardPage;