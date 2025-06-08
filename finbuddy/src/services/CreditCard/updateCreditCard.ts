import { httpsCallable } from "firebase/functions";
import { CreditCardRequestDTOSchemaType } from "../../schemas/CreditCard";
import { functions } from "../firebase";
import { useCreditCardStore } from "../../store/creditCardStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const UpdateCreditCard = async (
  data: CreditCardRequestDTOSchemaType & { id: string }
) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const updateCreditCardFn = httpsCallable(functions, 'creditCard-update');
    const response = await updateCreditCardFn(data);
    console.log('Cartão de crédito atualizado:', response.data);

    const { fetchCreditCards } = useCreditCardStore.getState();
    await fetchCreditCards();

    showSnackbar('Cartão de crédito atualizado com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao atualizar cartão de crédito:', error);
  }
}; 