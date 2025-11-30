/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useCreditCardStore } from "../../store/creditCardStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { CreateCreditCardRequestType } from "../../schemas/CreditCard";

export const CreateCreditCard = async (data: CreateCreditCardRequestType) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const createCreditCardFn = httpsCallable(functions, 'creditCard-create');
    const response = await createCreditCardFn(data);
    console.log('Cartão de crédito criado:', response.data);

    const { fetchCreditCards } = useCreditCardStore.getState();
    await fetchCreditCards();

    showSnackbar('Cartão de crédito criado com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao criar cartão de crédito:', error);
  }
}; 