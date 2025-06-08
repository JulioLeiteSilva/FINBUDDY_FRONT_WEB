import { httpsCallable } from "firebase/functions";
import { CreditCardInvoiceRequestDTOSchemaType } from "../../schemas/CreditCard";
import { functions } from "../firebase";
import { useCreditCardInvoiceStore } from "../../store/creditCardInvoiceStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const UpdateCreditCardInvoice = async (
  data: CreditCardInvoiceRequestDTOSchemaType & { id: string }
) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const updateCreditCardInvoiceFn = httpsCallable(functions, 'creditCardInvoice-update');
    const response = await updateCreditCardInvoiceFn(data);
    console.log('Fatura atualizada:', response.data);

    const { fetchCreditCardInvoices } = useCreditCardInvoiceStore.getState();
    await fetchCreditCardInvoices();

    showSnackbar('Fatura atualizada com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao atualizar fatura:', error);
  }
}; 