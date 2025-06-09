import { CreditCardSchemaType, CreditCardInvoiceSchemaType } from '../../../schemas/CreditCard';
import { CardDetails } from './types';
import { CreditCardFlag } from '../../../enums/CreditCardFlag';
import { BankAccountSchemaType } from '../../../schemas/BankAccount';
import { Bank } from '../../../hooks/useBanks';
import dayjs from 'dayjs';

export const mapToCardDetails = (
  card: CreditCardSchemaType,
  invoices: CreditCardInvoiceSchemaType[],
  bankAccounts: BankAccountSchemaType[],
  banks: Bank[]
): CardDetails => {

  console.log(invoices)
  // Get current date
  const currentDate = dayjs();
  const currentMonth = currentDate.month() + 1; // JavaScript months are 0-based
  const currentYear = currentDate.year();
  console.log(currentMonth)
  console.log(currentYear)

  // Find the current month's invoice
  const currentInvoice = invoices.find(
    invoice => invoice.month === currentMonth && invoice.year === currentYear
  );
  console.log(currentInvoice)

  // If no current invoice is found, find the most recent invoice
  const mostRecentInvoice = !currentInvoice && invoices.length > 0
    ? invoices.reduce((latest, current) => {
        const latestDate = dayjs(`${latest.year}-${latest.month}-01`);
        const currentDate = dayjs(`${current.year}-${current.month}-01`);
        return currentDate.isAfter(latestDate) ? current : latest;
      })
    : null;

  // Use current invoice if available, otherwise use most recent
  const activeInvoice = currentInvoice || mostRecentInvoice;
  const amountSpent = activeInvoice?.total || 0;
  const limitTotal = card.limit;
  const invoiceTotal = activeInvoice ? limitTotal - amountSpent : 0;

  // Find the bank account associated with this card
  const bankAccount = bankAccounts.find(account => account.id === card.bankAccountId);
  const bank = bankAccount ? banks.find(b => b.code === bankAccount.bank) : null;

  // Map the credit card flag to the brand type
  const brandMap: Record<CreditCardFlag, CardDetails['brand']> = {
    [CreditCardFlag.VISA]: 'VISA',
    [CreditCardFlag.MASTERCARD]: 'MASTERCARD',
    [CreditCardFlag.ELO]: 'ELO',
    [CreditCardFlag.AMEX]: 'AMEX',
    [CreditCardFlag.OUTRO]: 'OTHER'
  };

  return {
    id: card.id,
    cardName: card.name,
    bankName: bank?.name || '',
    brand: brandMap[card.flag],
    closingDay: card.closingDay,
    dueDate: new Date(currentDate.year(), currentDate.month(), card.dueDate),
    invoiceTotal,
    limitTotal,
    amountSpent
  };
}; 