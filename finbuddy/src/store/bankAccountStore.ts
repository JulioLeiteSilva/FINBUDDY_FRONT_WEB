import { create } from 'zustand';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { GetBalancesByMonth } from '../services/BankAccount/GetBalancesByMonth';
import { BalancesByMonthType, BankAccountType, GetAllBankAccountsResponseType, GetBalancesByMonthRequestType } from '../schemas/BankAccount';

interface BankAccountState {
  bankAccounts: BankAccountType[];
  bankAccountsBalancesByMonth: BalancesByMonthType;
  message: string;
  isLoading: boolean;
  fetchBankAccounts: () => Promise<void>;
  fetchBankAccountsBalancesByMonth(data: GetBalancesByMonthRequestType): Promise<void>;
}

export const useBankAccountStore = create<BankAccountState>((set) => ({
  message: '',
  bankAccounts: [],
  bankAccountsBalancesByMonth: { data: { accounts: [], totalBalance: 0, forecastTotalBalance: 0, pastMonthTotalBalance: 0 } },
  isLoading: false,

  fetchBankAccounts: async () => {
    set({ isLoading: true });
    try {
      const getAllBankAccountsFn = httpsCallable(functions, 'bank-getAllBankAccounts');
      const response = await getAllBankAccountsFn();
      const getAllBankAccountsResponse = response.data as unknown as GetAllBankAccountsResponseType;

      set({
        bankAccounts: getAllBankAccountsResponse.data.accounts as BankAccountType[],
        message: getAllBankAccountsResponse.message,
      });
    } catch (error) {
      console.error('Erro ao pegar todas as contas bancárias:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchBankAccountsBalancesByMonth: async (body: GetBalancesByMonthRequestType) => {
    set({ isLoading: true });
    try {
      const response = await GetBalancesByMonth(body);

      if (!response) return;
      const { message, ...rest } = response;
      const data = rest as BalancesByMonthType;

      set({
        bankAccountsBalancesByMonth: data,
        message: message,
      })
    } catch (error) {
      console.error('Erro ao pegar todas as contas bancárias:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
