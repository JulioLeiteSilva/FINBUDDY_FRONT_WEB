import { create } from 'zustand';
import { TransactionSchemaType, TransactionsResponseDTOSchemaType } from '../schemas/Transactions';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';


interface InvoiceTransactionsState {
    invoicesTransactions: TransactionSchemaType[];
    message: string;
    isLoading: boolean;
    fetchInvoiceTransactions: () => Promise<void>;
}

export const useInvoiceTransactionsStore = create<InvoiceTransactionsState>((set) => ({
    invoicesTransactions: [],
    message: '',
    isLoading: false,

    fetchInvoiceTransactions: async () => {
        set({ isLoading: true });
        try {
            const getAllTransactionsFn = httpsCallable(functions, 'transaction-getAllInvoices');
            const response = await getAllTransactionsFn();
            const getAllTransactionsResponse = response.data as unknown as TransactionsResponseDTOSchemaType;

            set({
                invoicesTransactions: getAllTransactionsResponse.transactions as TransactionSchemaType[],
                message: getAllTransactionsResponse.message,
            });
        } catch (error) {
            console.error('Erro ao pegar todas as transações:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
