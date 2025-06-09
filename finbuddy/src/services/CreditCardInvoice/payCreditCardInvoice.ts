import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useCreditCardInvoiceStore } from "../../store/creditCardInvoiceStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

interface PayCreditCardInvoiceParams {
  cardId: string;
  invoiceId: string;
  bankAccountId: string;
}

export const PayCreditCardInvoice = async (data: PayCreditCardInvoiceParams) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    console.log(data)
    const payInvoiceFn = httpsCallable(functions, 'creditCardInvoice-payInvoice');
    const response = await payInvoiceFn(data);
    console.log('Fatura paga:', response.data);

    const { fetchCreditCardInvoices } = useCreditCardInvoiceStore.getState();
    await fetchCreditCardInvoices(data.cardId);

    showSnackbar('Fatura paga com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao pagar fatura:', error);
  }
}; 