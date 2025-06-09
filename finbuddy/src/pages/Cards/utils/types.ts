import dayjs from 'dayjs'; // Importe dayjs se precisar dele para valores padrão
import { InvoiceStatus } from '../../../enums/InvoiceStatus';
import { TransactionSchemaType } from '../../../schemas/Transactions';

// Tipo para uma transação já processada (com Date object, etc.)
export interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: Date;
  isPaid: boolean;
  cardId: string;
  invoiceId: string;
  invoiceMonth: number;
  invoiceYear: number;
}

// Tipo para os detalhes de um cartão
export interface CardDetails {
  id: string;
  cardName: string;
  bankName: string;
  brand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'OTHER';
  closingDay: number;
  dueDate: Date;
  limitTotal: number;
  amountSpent: number;
  invoices: InvoiceDetails[];
  transactions: TransactionSchemaType[];
}

export interface InvoiceDetails {
  id: string;
  month: number;
  year: number;
  status: InvoiceStatus;
  total: number;
}