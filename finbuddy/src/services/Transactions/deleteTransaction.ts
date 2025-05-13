/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const DeleteTransaction = async (id: string) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const deleteTransactionFn = httpsCallable(functions, 'transaction-deleteTransaction');
        const response = await deleteTransactionFn({ id });
        console.log('Transação deletada:', response.data);

        const { fetchTransactions } = useTransactionsStore.getState();
        await fetchTransactions();

        showSnackbar('Transação deletada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao deletar transação:', error);
    }
};
