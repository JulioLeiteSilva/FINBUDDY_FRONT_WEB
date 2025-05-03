import { create } from 'zustand';
import { BankAccountSchemaType } from '../schemas/BankAccount'; // Ajuste o path conforme sua estrutura
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

interface BankAccountState {
  bankAccounts: BankAccountSchemaType[];
  isLoading: boolean;
  fetchBankAccounts: () => Promise<void>;
}

export const useBankAccountStore = create<BankAccountState>((set) => ({
  bankAccounts: [],
  isLoading: false,

  fetchBankAccounts: async () => {
    set({ isLoading: true });
    try {
      const getAllBankAccountsFn = httpsCallable(functions, 'bank-getAllBankAccounts');
      const response = await getAllBankAccountsFn();
      console.log(response);

      set({
        bankAccounts: response.data as BankAccountSchemaType[],
      });
    } catch (error) {
      console.error('Erro ao pegar todas as contas bancárias:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
