import { create } from 'zustand';
import { TransactionSchemaType, TransactionsResponseDTOSchemaType } from '../schemas/Transactions';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';


interface TransactionsState {
  transactions: TransactionSchemaType[];
  message: string;
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  message: '',
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const getAllTransactionsFn = httpsCallable(functions, 'transaction-getAllIncomeOrExpense');
      const response = await getAllTransactionsFn();
      const getAllTransactionsResponse = response.data as unknown as TransactionsResponseDTOSchemaType;

      set({
        transactions: getAllTransactionsResponse.transactions as TransactionSchemaType[],
        message: getAllTransactionsResponse.message,
      });
    } catch (error) {
      console.error('Erro ao pegar todas as transações:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
