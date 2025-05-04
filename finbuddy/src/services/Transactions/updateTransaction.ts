import { httpsCallable } from "firebase/functions";
import { TransactionRequestDTOSchemaType } from "../../schemas/transactions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";

export const UpdateTransaction = async (
    data: TransactionRequestDTOSchemaType & { id: string }  // 👈 precisa conter o id embutido
) => {
    try {
        const updateTransactionFn = httpsCallable(functions, 'transaction-updateTransaction');
        const response = await updateTransactionFn(data); // 👈 enviando tudo como `data`
        console.log('Transação atualizada:', response);

        const { fetchTransactions } = useTransactionsStore.getState();
        await fetchTransactions();
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
    }
}
