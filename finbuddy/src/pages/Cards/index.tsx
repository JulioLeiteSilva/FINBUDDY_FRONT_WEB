// src/pages/Cards/CardPage.tsx (ou o caminho do seu arquivo)
import React, { useEffect, useState } from 'react';
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
import { useCreditCardStore } from '../../store/creditCardStore';
import { useCreditCardInvoiceStore } from '../../store/creditCardInvoiceStore';
import { useBankAccountStore } from '../../store/bankAccountStore';
import { useBanks } from '../../hooks/useBanks';
import { mapToCardDetails } from './utils/cardDetailsMapper';
import { filterTransactionsByCardId, mapToProcessedTransactions } from './utils/transactionMapper';
import { useInvoiceTransactionsStore } from '../../store/invoiceTransactionStore';

const CardPage: React.FC = () => {
  const [detailsCard, setDetailsCard] = useState<CardDetails | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<CardDetails | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const { creditCards, isLoading, fetchCreditCards } = useCreditCardStore();
  const { creditCardInvoices, isLoading: isLoadingCreditCardInvoices, fetchCreditCardInvoices } = useCreditCardInvoiceStore();
  const { bankAccounts, fetchBankAccounts } = useBankAccountStore();
  const { banks } = useBanks();
  const { invoicesTransactions, fetchInvoiceTransactions } = useInvoiceTransactionsStore();

  useEffect(() => {
    fetchCreditCards();
    fetchBankAccounts();
  }, [fetchCreditCards, fetchBankAccounts]);

  useEffect(() => {
    if (creditCards.length > 0) {
      // Fetch invoices for all credit cards
      const fetchAllInvoices = async () => {
        const invoicePromises = creditCards.map(card => fetchCreditCardInvoices(card.id));
        await Promise.all(invoicePromises);
        fetchInvoiceTransactions();
      };
      fetchAllInvoices();
    }
  }, [creditCards, fetchCreditCardInvoices, fetchInvoiceTransactions]);

  // Map credit cards to CardDetails format
  const mappedCards = creditCards.map(card => {
    const cardInvoices = creditCardInvoices[card.id] || [];
    return mapToCardDetails(card, cardInvoices, bankAccounts, banks, invoicesTransactions);
  });

  // Get all transactions from mapped cards' invoices and convert them to ProcessedTransaction format
  const allTransactions = mappedCards.flatMap(card => 
    card.invoices.flatMap(invoice => invoice.transactions)
  );
  const processedTransactions = mapToProcessedTransactions(allTransactions, creditCardInvoices);

  // Filter transactions by selected card ID if one is selected
  const filteredTransactions = selectedCardId 
    ? filterTransactionsByCardId(processedTransactions, selectedCardId)
    : processedTransactions;

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
  const handleSaveCard = (formData: any) => {
    console.log('Criando/Editando cartão com os dados:', formData);
    handleCloseFormModal();
  };

  // --- Handlers para o Modal de Detalhes do Cartão ---
  const handleViewDetailsClick = (card: CardDetails) => {
    setDetailsCard(card);
    setSelectedCardId(card.id);
  };
  const handleCloseDetailsModal = () => {
    setDetailsCard(null);
    setSelectedCardId(null);
  };

  // --- Handlers para o Modal de Adicionar Transação ---
  const handleOpenTransactionModal = () => setIsTransactionModalOpen(true);
  const handleCloseTransactionModal = () => setIsTransactionModalOpen(false);
  const handleSaveTransaction = (transactionData: any) => {
    console.log("Salvando nova transação:", transactionData);
    // Aqui você adicionaria a nova transação à sua lista de mockTransactions (para ver o resultado na tela)
    // ou chamaria sua store Zustand para adicionar de verdade
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, minHeight: '100vh'}}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1">
          Meus Cartões
        </Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenAddCardModal} sx={{ borderRadius: '20px', padding: '10px 20px', textTransform: 'none', fontSize:'1rem' }}>
          Novo Cartão
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <CardList 
          cards={mappedCards}
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
        <RecentTransactionsList transactions={filteredTransactions} />
      </Box>

      {/* MODAL 1: Detalhes do Cartão */}
      <CardDetailsModal
        open={!!detailsCard}
        onClose={handleCloseDetailsModal}
        card={detailsCard}
        transactions={filteredTransactions}
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
        cards={creditCards}
      />
      
    </Box>
  );
};

export default CardPage;