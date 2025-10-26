/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { CreateInvoiceRequestType } from "../../schemas/Transactions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { useCreditCardInvoiceStore } from "../../store/creditCardInvoiceStore";
import { useInvoiceTransactionsStore } from "../../store/invoiceTransactionStore";

export const CreateInvoiceTransaction = async (
  data: CreateInvoiceRequestType
) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const createTransactionFn = httpsCallable(functions, 'transaction-createInvoice');
    const response = await createTransactionFn(data);
    console.log('Transação criada:', response.data);

    const { fetchTransactions } = useTransactionsStore.getState();
    const { fetchCreditCardInvoices } = useCreditCardInvoiceStore.getState();
    const { fetchInvoiceTransactions } = useInvoiceTransactionsStore.getState();
    await fetchTransactions();
    await fetchCreditCardInvoices(data.creditCardId as string);
    await fetchInvoiceTransactions();

    showSnackbar('Transação criada com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao criar transação:', error);
  }
};
