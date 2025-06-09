import { create } from 'zustand';
import { CreditCardInvoiceSchemaType, CreditCardInvoiceResponseDTOSchemaType } from '../schemas/CreditCard';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

interface CreditCardInvoiceState {
  creditCardInvoices: Record<string, CreditCardInvoiceSchemaType[]>;
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
      const getAllCreditCardInvoicesResponse = response.data as unknown as CreditCardInvoiceResponseDTOSchemaType;

      set((state) => ({
        creditCardInvoices: {
          ...state.creditCardInvoices,
          [cardId]: getAllCreditCardInvoicesResponse.invoices as CreditCardInvoiceSchemaType[]
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
