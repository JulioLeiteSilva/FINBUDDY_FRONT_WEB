import { CreditCardFlag } from '../../../enums/CreditCardFlag';
import { CardDetails } from './types';
import { Bank } from '../../../hooks/useBanks';
import { firestoreTimestampToDate } from '../../Transactions/components/TransactionDetailsModal/utils/transactionUtils';
import { BankAccountType } from '../../../schemas/BankAccount';
import { CreditCardInvoiceType, CreditCardType } from '../../../schemas/CreditCard';
import { TransactionType } from '../../../schemas/Transactions';

const flagMap: Record<CreditCardFlag, CardDetails['brand']> = {
  [CreditCardFlag.VISA]: 'VISA',
  [CreditCardFlag.MASTERCARD]: 'MASTERCARD',
  [CreditCardFlag.ELO]: 'ELO',
  [CreditCardFlag.AMEX]: 'AMEX',
  [CreditCardFlag.OUTRO]: 'OTHER'
};

export const mapToCardDetails = (
  card: CreditCardType,
  invoices: CreditCardInvoiceType[],
  bankAccounts: BankAccountType[],
  banks: Bank[],
  transactions: TransactionType[]
): CardDetails => {
  const bankAccount = bankAccounts.find(acc => acc.id === card.bankAccountId);
  const bank = banks.find(b => b.code === bankAccount?.bank);

  // Get all transactions for this card
  console.log('All transactions:', transactions);
  const cardTransactions = transactions.filter(t => t.creditCardId === card.id);

  // Map invoices with their transactions
  const mappedInvoices = invoices.map(invoice => {
    // Filter transactions for this invoice
    const invoiceTransactions = cardTransactions.filter(t => t.invoiceId === invoice.id);
    
    // Calculate total from transactions
    const totalFromTransactions = invoiceTransactions.reduce((sum, t) => {
      return sum + t.value;
    }, 0);

    return {
      id: invoice.id,
      month: invoice.month,
      year: invoice.year,
      status: invoice.status,
      total: totalFromTransactions,
      transactions: invoiceTransactions.map(t => ({
        ...t,
        date: firestoreTimestampToDate(t.date) || new Date()
      }))
    };
  });

  // Calculate total amount spent from all invoices
  const amountSpent = mappedInvoices.reduce((total, invoice) => total + invoice.total, 0);

  return {
    id: card.id,
    cardName: card.name,
    bankName: bank?.name || '',
    brand: flagMap[card.flag],
    closingDay: card.closingDay,
    dueDate: card.dueDate, // This will be set by the backend
    limitTotal: card.limit,
    amountSpent,
    invoices: mappedInvoices
  };
}; 