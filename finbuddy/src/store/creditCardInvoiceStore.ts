import { create } from 'zustand';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';
import { CreditCardInvoiceType, GetAllCardInvoicesResponseType } from '../schemas/CreditCard';

interface CreditCardInvoiceState {
  creditCardInvoices: Record<string, CreditCardInvoiceType[]>;
  message: string;
  isLoading: boolean;
  fetchCreditCardInvoices: (cardId: string) => Promise<void>;
}

export const useCreditCardInvoiceStore = create<CreditCardInvoiceState>((set) => ({
  creditCardInvoices: {},
  message: '',
  isLoading: false,

  fetchCreditCardInvoices: async (cardId: string) => {
    set({ isLoading: true });
    try {
      const getAllCreditCardInvoicesFn = httpsCallable(functions, 'creditCardInvoice-getAll');
      const response = await getAllCreditCardInvoicesFn({ cardId });
      const getAllCreditCardInvoicesResponse = response.data as unknown as GetAllCardInvoicesResponseType;

      set((state) => ({
        creditCardInvoices: {
          ...state.creditCardInvoices,
          [cardId]: getAllCreditCardInvoicesResponse.data.invoices as CreditCardInvoiceType[]
        },
        message: getAllCreditCardInvoicesResponse.message,
      }));
    } catch (error) {
      console.error('Erro ao pegar todas as faturas:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
