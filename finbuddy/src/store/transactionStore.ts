import { create } from 'zustand';
import { TransactionSchemaType } from '../schemas/transactions';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';


interface TransactionsState {
  transactions: TransactionSchemaType[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const getAllTransactionsFn = httpsCallable(functions, 'transaction-getAllTransactions');
      const response = await getAllTransactionsFn();
      console.log(response);

      set({
        transactions: response.data as TransactionSchemaType[],
      });
    } catch (error) {
      console.error('Erro ao pegar todas as transações:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
