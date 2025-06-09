// src/components/TransactionDetailsModal/utils/transactionUtils.ts
import dayjs from 'dayjs';

// Tipo para o formato de data do Firestore Timestamp
export type FirestoreTimestamp = {
    _seconds: number;
    _nanoseconds: number;
};

/**
 * Converte um objeto de timestamp do Firestore para um objeto Date do JavaScript.
 * Retorna null se a entrada for inválida.
 */
export const firestoreTimestampToDate = (timestamp: unknown): Date | null => {
    // Se já for um objeto Date, retorna ele mesmo
    if (timestamp instanceof Date) {
        return timestamp;
    }

    // Tenta converter de Firestore Timestamp
    const ts = timestamp as FirestoreTimestamp;
    if (ts && typeof ts._seconds === 'number') {
        return new Date(ts._seconds * 1000);
    }
    return null;
};

/**
 * Formata um objeto Date ou um timestamp do Firestore para uma string 'DD/MM/YYYY'.
 */
export const formatDate = (date: unknown): string => {
    const dateObj = firestoreTimestampToDate(date);
    return dateObj ? dayjs(dateObj).format('DD/MM/YYYY') : '-';
};

/**
 * Formata um objeto Date ou um timestamp do Firestore para uma string 'YYYY-MM-DD' para inputs de data.
 */
export const formatDateForInput = (date: unknown): string => {
    const dateObj = firestoreTimestampToDate(date);
    return dateObj ? dayjs(dateObj).format('YYYY-MM-DD') : '';
}

// Mapas de constantes para exibição
export const frequencyMap: Record<string, string> = {
    WEEKLY: "Semanal",
    BIWEEKLY: "Quinzenal",
    MONTHLY: "Mensal",
    BIMONTHLY: "Bimestral",
    QUARTERLY: "Trimestral",
    SEMIANNUALLY: "Semestral",
    ANNUALLY: "Anual",
};

export const typeMap: Record<string, string> = {
    INCOME: "Receita",
    EXPENSE: "Despesa",
};
