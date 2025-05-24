import { create } from 'zustand';
import { BankAccountSchemaType, BankAccountResponseDTOSchemaType } from '../schemas/BankAccount'; // Ajuste o path conforme sua estrutura
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

interface BankAccountState {
  bankAccounts: BankAccountSchemaType[];
  message: string;
  isLoading: boolean;
  fetchBankAccounts: () => Promise<void>;
}

export const useBankAccountStore = create<BankAccountState>((set) => ({
  message: '',
  bankAccounts: [],
  isLoading: false,

  fetchBankAccounts: async () => {
    set({ isLoading: true });
    try {
      const getAllBankAccountsFn = httpsCallable(functions, 'bank-getAllBankAccounts');
      const response = await getAllBankAccountsFn();
      const getAllBankAccountsResponse = response.data as unknown as BankAccountResponseDTOSchemaType;

      set({
        bankAccounts: getAllBankAccountsResponse.accounts as BankAccountSchemaType[],
        message: getAllBankAccountsResponse.message,
      });
    } catch (error) {
      console.error('Erro ao pegar todas as contas bancárias:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
