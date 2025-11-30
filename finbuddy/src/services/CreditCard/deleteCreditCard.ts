/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useCreditCardStore } from "../../store/creditCardStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const DeleteCreditCard = async (id: string) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const deleteCreditCardFn = httpsCallable(functions, 'creditCard-delete');
    const response = await deleteCreditCardFn({ id });
    console.log('Cartão de crédito deletado:', response.data);

    const { fetchCreditCards } = useCreditCardStore.getState();
    await fetchCreditCards();

    showSnackbar('Cartão de crédito deletado com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao deletar cartão de crédito:', error);
  }
}; 