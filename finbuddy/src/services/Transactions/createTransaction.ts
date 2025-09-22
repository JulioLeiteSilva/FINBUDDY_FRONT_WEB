/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { CreateIncomeOrExpenseRequestType } from "../../schemas/Transactions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const CreateTransaction = async (
  data: CreateIncomeOrExpenseRequestType
) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const createTransactionFn = httpsCallable(functions, 'transaction-createIncomeOrExpense');
    const response = await createTransactionFn(data);
    console.log('Transação criada:', response.data);

    const { fetchTransactions } = useTransactionsStore.getState();
    await fetchTransactions();

    showSnackbar('Transação criada com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao criar transação:', error);
  }
};
