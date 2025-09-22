/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { UpdateTransactionRequestType } from "../../schemas/Transactions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const UpdateTransaction = async (
    data: UpdateTransactionRequestType
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const updateTransactionFn = httpsCallable(functions, 'transaction-updateTransaction');
        const response = await updateTransactionFn(data);
        console.log('Transação atualizada:', response.data);

        const { fetchTransactions } = useTransactionsStore.getState();
        await fetchTransactions();

        showSnackbar('Transação atualizada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao atualizar transação:', error);
    }
};
