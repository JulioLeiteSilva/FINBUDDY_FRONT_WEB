import { create } from "zustand";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";
import { CreditCardType } from "../schemas/CreditCard";
import { GetAllCardsResponseType } from "../schemas/CreditCard/Functions/GetAllCards/GetAllCardsResponse";

interface CreditCardState {
  creditCards: CreditCardType[];
  message: string;
  isLoading: boolean;
  fetchCreditCards: () => Promise<void>;
}

export const useCreditCardStore = create<CreditCardState>((set) => ({
  creditCards: [],
  message: "",
  isLoading: false,

  fetchCreditCards: async () => {
    set({ isLoading: true });
    try {
      const getAllCreditCardsFn = httpsCallable(functions, "creditCard-getAll");
      const response = await getAllCreditCardsFn();
      const getAllCreditCardsResponse =
        response.data as unknown as GetAllCardsResponseType;

      set({
        creditCards: getAllCreditCardsResponse.data as CreditCardType[],
        message: getAllCreditCardsResponse.message,
      });
    } catch (error) {
      console.error("Erro ao pegar todos os cartões de crédito:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
