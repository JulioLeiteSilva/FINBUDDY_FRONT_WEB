import { create } from 'zustand';
import { BankAccountSchemaType, BankAccountResponseDTOSchemaType, GetBalancesByMonthRequestSchemaType, BankAccountBalancesByMonthSchemaType } from '../schemas/BankAccount'; // Ajuste o path conforme sua estrutura
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { GetBalancesByMonth } from '../services/BankAccount/GetBalancesByMonth';

interface BankAccountState {
  bankAccounts: BankAccountSchemaType[];
  bankAccountBalancesByMonth: BankAccountBalancesByMonthSchemaType;
  message: string;
  isLoading: boolean;
  fetchBankAccounts: () => Promise<void>;
  fetchBankAccountsBalancesByMonth(data: GetBalancesByMonthRequestSchemaType): Promise<void>;
}

export const useBankAccountStore = create<BankAccountState>((set) => ({
  message: '',
  bankAccounts: [],
  bankAccountBalancesByMonth: { accounts: [], totalBalance: 0, forecastTotalBalance: 0 },
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
  fetchBankAccountsBalancesByMonth: async (data: GetBalancesByMonthRequestSchemaType) => {
    set({ isLoading: true });
    try {
      const response = await GetBalancesByMonth(data);

      if (!response) return;
      console.log(response)

      set({
        bankAccountBalancesByMonth: response.data as BankAccountBalancesByMonthSchemaType,
        message: response.message,
      })
    } catch (error) {
      console.error('Erro ao pegar todas as contas bancárias:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
