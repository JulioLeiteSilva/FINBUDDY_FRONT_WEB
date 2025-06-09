import { ProcessedTransaction } from './types';
import { TransactionSchemaType } from '../../../schemas/Transactions';
import { firestoreTimestampToDate } from '../../Transactions/components/TransactionDetailsModal/utils/transactionUtils';
import { CreditCardInvoiceSchemaType } from '../../../schemas/CreditCard';

export const mapToProcessedTransactions = (
  transactions: TransactionSchemaType[],
  invoices: Record<string, CreditCardInvoiceSchemaType[]>
): ProcessedTransaction[] => {
  return transactions.map(transaction => {
    const invoice = transaction.creditCardId ? invoices[transaction.creditCardId]?.[0] : null;
    const transactionDate = firestoreTimestampToDate(transaction.date) || new Date();
    
    return {
      id: transaction.id,
      name: transaction.name,
      category: transaction.category,
      value: transaction.value,
      type: transaction.type === 'INCOME' ? 'income' : 'expense',
      date: transactionDate,
      isPaid: transaction.isPaid,
      cardId: transaction.creditCardId || '',
      invoiceId: transaction.invoiceId || '',
      invoiceMonth: invoice?.month || transactionDate.getMonth() + 1,
      invoiceYear: invoice?.year || transactionDate.getFullYear()
    };
  });
};

export const filterTransactionsByCardId = (
  transactions: ProcessedTransaction[],
  cardId: string
): ProcessedTransaction[] => {
  console.log(cardId)
  console.log(transactions)
  return transactions.filter(transaction => transaction.cardId === cardId);
}; 