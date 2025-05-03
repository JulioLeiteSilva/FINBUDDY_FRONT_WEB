import { httpsCallable } from "firebase/functions";
import { TransactionRequestDTOSchemaType } from "../../schemas/transactions";
import { functions } from "../firebase";
import { useTransactionsStore } from "../../store/transactionStore";

export const CreateTransaction = async (
    data: TransactionRequestDTOSchemaType,
) => {
    try {
        const createTransactionFn = httpsCallable(functions, 'transaction-createTransaction');
        const response = await createTransactionFn(data);
        console.log(response);

        const { fetchTransactions } = useTransactionsStore.getState();
        await fetchTransactions();
    } catch (error) {
        console.error('Erro ao criar transação:', error);
    }
}