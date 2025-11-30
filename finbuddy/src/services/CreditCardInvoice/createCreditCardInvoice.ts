/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useCreditCardInvoiceStore } from "../../store/creditCardInvoiceStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { CreateInvoiceRequestType } from "../../schemas/Transactions";

export const CreateCreditCardInvoice = async (data: CreateInvoiceRequestType) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const createCreditCardInvoiceFn = httpsCallable(functions, 'creditCardInvoice-create');
    const response = await createCreditCardInvoiceFn(data);
    console.log('Fatura criada:', response.data);

    const { fetchCreditCardInvoices } = useCreditCardInvoiceStore.getState();
    await fetchCreditCardInvoices(data.creditCardId!);

    showSnackbar('Fatura criada com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao criar fatura:', error);
  }
}; 