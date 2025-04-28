import { create } from 'zustand';
import { NewTransaction } from '../components/newTransactionModal';
import mockTransactions from '../mock/mockTransactions.json';

interface TransactionsState {
    transactions: NewTransaction[];
    addTransaction: (transaction: Omit<NewTransaction, 'id'>) => void;
    // Adicione outras ações relacionadas a transações aqui, se necessário (filtrar, remover, etc.)
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
    transactions: mockTransactions,
    addTransaction: (newTransaction) =>
        set((state) => ({
            transactions: [
                ...state.transactions,
                { id: String(Date.now()), ...newTransaction },
            ],
        })),
}));