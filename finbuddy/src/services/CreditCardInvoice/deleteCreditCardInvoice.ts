import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useCreditCardInvoiceStore } from "../../store/creditCardInvoiceStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const DeleteCreditCardInvoice = async (id: string) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const deleteCreditCardInvoiceFn = httpsCallable(functions, 'creditCardInvoice-delete');
    const response = await deleteCreditCardInvoiceFn({ id });
    console.log('Fatura deletada:', response.data);

    const { fetchCreditCardInvoices } = useCreditCardInvoiceStore.getState();
    await fetchCreditCardInvoices();

    showSnackbar('Fatura deletada com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao deletar fatura:', error);
  }
}; 