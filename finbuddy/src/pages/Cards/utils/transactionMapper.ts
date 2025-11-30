import { ProcessedTransaction } from './types';
import { firestoreTimestampToDate } from '../../Transactions/components/TransactionDetailsModal/utils/transactionUtils';
import { CreditCardInvoiceType } from '../../../schemas/CreditCard';
import { TransactionType } from '../../../schemas/Transactions';

export const mapToProcessedTransactions = (
  transactions: TransactionType[],
  invoices: Record<string, CreditCardInvoiceType[]>
): ProcessedTransaction[] => {
  return transactions.map(transaction => {
    console.log('Transaction date object:', transaction.date);
    console.log('Transaction date type:', typeof transaction.date);
    console.log('Transaction date keys:', Object.keys(transaction.date));
    const transactionDate = firestoreTimestampToDate(transaction.date) || new Date();
    console.log('Converted date:', transactionDate);
    const cardInvoices = transaction.creditCardId ? invoices[transaction.creditCardId] || [] : [];
    
    // Find the matching invoice for this transaction
    const matchingInvoice = cardInvoices.find(invoice => 
      invoice.id === transaction.invoiceId
    );
    
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
      invoiceMonth: matchingInvoice?.month || transactionDate.getMonth() + 1,
      invoiceYear: matchingInvoice?.year || transactionDate.getFullYear()
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