import dayjs from 'dayjs'; // Importe dayjs se precisar dele para valores padrão

// Tipo para uma transação já processada (com Date object, etc.)
export interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: Date;
  isPaid: boolean;
  bankAccountId: string;
  invoiceId: string | null;
  cardId: string | null;
}

// Tipo para os detalhes de um cartão
export interface CardDetails {
  id: string;
  cardName: string;
  bankName: string;
  brand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'OTHER';
  closingDay: number;
  dueDate: Date;
  invoiceTotal: number;
  limitTotal: number;
  amountSpent: number;
}