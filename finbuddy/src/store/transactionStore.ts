import { create } from "zustand";
import {
  GetAllIncomeOrExpenseResponseType,
  TransactionType,
} from "../schemas/Transactions";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

interface TransactionsState {
  transactions: TransactionType[];
  message: string;
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  message: "",
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const getAllTransactionsFn = httpsCallable(
        functions,
        "transaction-getAllIncomeOrExpense"
      );
      const response = await getAllTransactionsFn();
      const getAllTransactionsResponse =
        response.data as unknown as GetAllIncomeOrExpenseResponseType;
        console.log(getAllTransactionsResponse.data)

      set({
        transactions: getAllTransactionsResponse.data as unknown as TransactionType[],
        message: getAllTransactionsResponse.message,
      });
    } catch (error) {
      console.error("Erro ao pegar todas as transações:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
