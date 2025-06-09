import { ProcessedTransaction } from './types';
import { TransactionSchemaType } from '../../../schemas/Transactions';
import { firestoreTimestampToDate } from '../../Transactions/components/TransactionDetailsModal/utils/transactionUtils';

export const mapToProcessedTransactions = (
  invoiceTransactions: TransactionSchemaType[]
): ProcessedTransaction[] => {
  return invoiceTransactions.map(transaction => ({
    id: transaction.id,
    name: transaction.name,
    category: transaction.category,
    value: transaction.value,
    type: 'expense', // All invoice transactions are expenses
    date: firestoreTimestampToDate(transaction.date) || new Date(),
    isPaid: transaction.isPaid,
    bankAccountId: transaction.bankAccountId,
    invoiceId: transaction.invoiceId,
    cardId: transaction.creditCardId
  }));
};

export const filterTransactionsByCardId = (
  transactions: ProcessedTransaction[],
  cardId: string
): ProcessedTransaction[] => {
  console.log(cardId)
  console.log(transactions)
  return transactions.filter(transaction => transaction.cardId === cardId);
}; 