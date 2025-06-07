// src/hooks/useDashboardData.ts
import { useState, useEffect, useMemo } from 'react';
import { useTransactionsStore } from '../store/transactionStore'; // Ajuste o caminho se necessário

// Defina ou importe estas interfaces de um arquivo de tipos compartilhado
// (São as mesmas que usávamos em DashboardPage.tsx)
interface TransactionFromStore {
  id: string;
  name: string;
  category: string;
  value: number;
  type: "INCOME" | "EXPENSE";
  date: Date; // Assumindo que a store já fornece como objeto Date
}

export interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: Date;
}

export interface MonthlyData {
  date: string; // Formato "AAAA-MM"
  receitas: number;
  despesas: number;
}
// Fim das interfaces

export const useDashboardData = () => {
  const {
    transactions: storeTransactions,
    isLoading: storeIsLoading, // Renomeado para evitar conflito se tivermos um isLoading local
    fetchTransactions
  } = useTransactionsStore();

  // Datas para o filtro de período (serão controladas pelo DateRangeSelector no futuro)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // TODO: Expor setStartDate e setEndDate se o DateRangeSelector for gerenciado aqui ou no componente que usa o hook

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const rawTransactions = useMemo((): ProcessedTransaction[] => {
    if (!storeTransactions || storeTransactions.length === 0) return [];
    return storeTransactions.map(t_from_store => {
      let jsDateObject: Date;
      if (t_from_store.date instanceof Date) {
        jsDateObject = t_from_store.date;
      } else if (t_from_store.date && typeof t_from_store.date === 'object' && '_seconds' in t_from_store.date) {
        const timestamp = t_from_store.date as any; // { _seconds: number; _nanoseconds: number };
        jsDateObject = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      } else {
        console.warn("Formato de data inesperado para a transação na store:", t_from_store);
        jsDateObject = new Date(); // Fallback, idealmente tratar como inválido
      }
      return {
        id: t_from_store.id,
        name: t_from_store.name,
        category: t_from_store.category,
        value: t_from_store.value,
        type: t_from_store.type.toLowerCase() as ('income' | 'expense'),
        isPaid: t_from_store.isPaid,
        date: jsDateObject,
      };
    });
  }, [storeTransactions]);

  const filteredTransactionsByDate = useMemo(() => {
    if (!startDate || !endDate) {
      return rawTransactions;
    }
    const inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setHours(23, 59, 59, 999);
    return rawTransactions.filter(t => {
        // Certifique-se que t.date é um objeto Date válido antes de comparar
        if (!(t.date instanceof Date) || isNaN(t.date.getTime())) return false;
        return t.date >= startDate && t.date <= inclusiveEndDate;
    });
  }, [rawTransactions, startDate, endDate]);

  // Preparar dados para MonthlyComparisonBarChart
  const dataForMonthlyBarChart = useMemo((): MonthlyData[] => {
    if (!filteredTransactionsByDate.length) return [];
    const monthlyMap = new Map<string, { receitas: number; despesas: number }>();
    filteredTransactionsByDate.forEach(transaction => {
      const year = transaction.date.getFullYear();
      const month = (transaction.date.getMonth() + 1).toString().padStart(2, '0');
      const monthKey = `${year}-${month}`;
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { receitas: 0, despesas: 0 });
      }
      const currentMonthData = monthlyMap.get(monthKey)!;
      if (transaction.type === 'income') {
        currentMonthData.receitas += transaction.value;
      } else if (transaction.type === 'expense') {
        currentMonthData.despesas += transaction.value;
      }
    });
    return Array.from(monthlyMap.entries())
      .map(([date, data]) => ({ date, receitas: data.receitas, despesas: data.despesas }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactionsByDate]);

  // Retornar todos os dados e estados necessários para a UI
  return {
    isLoading: storeIsLoading,
    // Se sua store tiver um 'error', retorne-o aqui também.
    // error: storeError,
    
    // Dados para os componentes:
    // SummaryCards, ExpenseByCategory, RevenueFlowTrendChart usam ProcessedTransaction[]
    transactionsForCharts: filteredTransactionsByDate,
    dataForMonthlyBarChart,

    // Se o DateRangeSelector for gerenciado externamente e este hook precisar dele:
    // setDateRange: (start: Date | null, end: Date | null) => {
    //   setStartDate(start);
    //   setEndDate(end);
    // }
  };
};