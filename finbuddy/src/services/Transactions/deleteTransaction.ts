import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";

export const DeleteTransaction = async (id: string) => {
    try {
        const deleteTransactionFn = httpsCallable(functions, 'transaction-deleteTransaction');
        const response = await deleteTransactionFn({ id });  // 👈 enviando { id }
        console.log('Transação deletada:', response);

        const { fetchTransactions } = useTransactionsStore.getState();
        await fetchTransactions();  // 👈 atualiza a store após deletar
    } catch (error) {
        console.error('Erro ao deletar transação:', error);
    }
}
