import { create } from 'zustand';
import { CreditCardSchemaType, CreditCardResponseDTOSchemaType } from '../schemas/CreditCard';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

interface CreditCardState {
  creditCards: CreditCardSchemaType[];
  message: string;
  isLoading: boolean;
  fetchCreditCards: () => Promise<void>;
}

export const useCreditCardStore = create<CreditCardState>((set) => ({
  creditCards: [],
  message: '',
  isLoading: false,

  fetchCreditCards: async () => {
    set({ isLoading: true });
    try {
      const getAllCreditCardsFn = httpsCallable(functions, 'creditCard-getAll');
      const response = await getAllCreditCardsFn();
      const getAllCreditCardsResponse = response.data as unknown as CreditCardResponseDTOSchemaType;

      set({
        creditCards: getAllCreditCardsResponse.cards as CreditCardSchemaType[],
        message: getAllCreditCardsResponse.message,
      });
    } catch (error) {
      console.error('Erro ao pegar todos os cartões de crédito:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
