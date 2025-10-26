import { useEffect, useState } from 'react';

import { CardDetails } from './utils/types';
import { useCreditCardStore } from '../../store/creditCardStore';
import { useCreditCardInvoiceStore } from '../../store/creditCardInvoiceStore';
import { useBankAccountStore } from '../../store/bankAccountStore';
import { useBanks } from '../../hooks/useBanks';
import { mapToCardDetails } from './utils/cardDetailsMapper';
import { filterTransactionsByCardId, mapToProcessedTransactions } from './utils/transactionMapper';
import { useInvoiceTransactionsStore } from '../../store/invoiceTransactionStore';

export const useCardsViewModel = () => {
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
    const handleSaveCard = (formData: unknown) => {
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
    const handleSaveTransaction = (transactionData: unknown) => {
        console.log("Salvando nova transação:", transactionData);
        // Aqui você adicionaria a nova transação à sua lista de mockTransactions (para ver o resultado na tela)
        // ou chamaria sua store Zustand para adicionar de verdade
    };

    return {
        mappedCards,
        filteredTransactions,
        isFormModalOpen,
        isTransactionModalOpen,
        detailsCard,
        cardToEdit,
        handleOpenAddCardModal,
        handleOpenEditCardModal,
        handleCloseFormModal,
        handleSaveCard,
        handleViewDetailsClick,
        handleCloseDetailsModal,
        handleOpenTransactionModal,
        handleCloseTransactionModal,
        handleSaveTransaction,
        isLoading,
        isLoadingCreditCardInvoices,
        creditCards
    }
}