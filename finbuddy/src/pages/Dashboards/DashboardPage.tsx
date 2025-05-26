// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useMemo } from 'react';


import { useTransactionsStore } from '../../store/transactionStore'; // Verifique o caminho
import ExpenseByCategory from './components/ExpenseByCategory';
import MonthlyComparisonBarChart from './components/MonthylComparisonChart';
import SummaryCards from './components/SummaryCards';
import RevenueFlowTrendChart from './components/RevenueFlowTrendChart';

// Interface para a transação como ela está na store (já com 'date' como objeto Date)
interface TransactionFromStore {
  id: string;
  name: string;
  category: string;
  value: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  // Adicione outros campos se existirem na sua store e forem úteis
}

// Interface para a transação processada internamente no DashboardPage (type em minúsculas)
interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: Date;
}

// Interface para os dados que o MonthlyComparisonBarChart espera
interface MonthlyData {
  date: string; // Formato "AAAA-MM"
  receitas: number;
  despesas: number;
}

interface TransactionFromStorePotentiallyWithTimestamp {
  id: string;
  name: string;
  category: string;
  value: number;
  type: "INCOME" | "EXPENSE";
  date: Date | { _seconds: number; _nanoseconds: number }; // Pode ser Date ou Timestamp object
  // ... outros campos ...
}

const DashboardPage: React.FC = () => {
  const { transactions: storeTransactions, isLoading, fetchTransactions } = useTransactionsStore();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const rawTransactions = useMemo((): ProcessedTransaction[] => {
    console.log("DashboardPage: storeTransactions recebidas:", storeTransactions);
    if (!storeTransactions || storeTransactions.length === 0) {
      return [];
    }
    return storeTransactions.map(t_from_store => {
      // A 't_from_store' é do tipo TransactionFromStorePotentiallyWithTimestamp
      // Vamos garantir a conversão da data aqui
      let jsDateObject: Date;

      if (t_from_store.date instanceof Date) {
        // Se já for um objeto Date (ótimo, a store já converteu)
        jsDateObject = t_from_store.date;
      } else if (t_from_store.date && typeof t_from_store.date === 'object' && '_seconds' in t_from_store.date) {
        // Se for um objeto com _seconds (formato Timestamp do Firebase)
        const timestamp = t_from_store.date as { _seconds: number; _nanoseconds: number };
        jsDateObject = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      } else {
        // Fallback para um formato de data inesperado ou nulo
        console.warn("Formato de data inesperado para a transação:", t_from_store);
        jsDateObject = new Date(); // Ou trate como data inválida, dependendo da sua lógica
      }

      return {
        id: t_from_store.id,
        name: t_from_store.name,
        category: t_from_store.category,
        value: t_from_store.value,
        type: t_from_store.type.toLowerCase() as ('income' | 'expense'),
        date: jsDateObject, // Agora temos certeza que é um objeto Date do JavaScript
      };
    });
  }, [storeTransactions]);

  const filteredTransactionsByDate = useMemo(() => {
    if (!startDate || !endDate) {
      return rawTransactions;
    }
    const inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setHours(23, 59, 59, 999);
    return rawTransactions.filter(t => t.date >= startDate && t.date <= inclusiveEndDate);
  }, [rawTransactions, startDate, endDate]);

  
  const dataForMonthlyBarChart = useMemo((): MonthlyData[] => {
    if (!filteredTransactionsByDate.length) return [];

    const monthlyMap = new Map<string, { receitas: number; despesas: number }>();

    filteredTransactionsByDate.forEach(transaction => {
      const year = transaction.date.getFullYear();
      const month = (transaction.date.getMonth() + 1).toString().padStart(2, '0');
      const monthKey = `${year}-${month}`; // Formato "AAAA-MM"

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
      .map(([date, data]) => ({
        date,
        receitas: data.receitas,
        despesas: data.despesas,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactionsByDate]);
  // FIM DA LÓGICA ADICIONADA

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Carregando dados do dashboard...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meu Dashboard Financeiro</h1>
      
      <hr style={{ margin: '20px 0' }} />
      <MonthlyComparisonBarChart data={dataForMonthlyBarChart} /> {/* Usando os dados agregados mensalmente */}
      <RevenueFlowTrendChart transactions={filteredTransactionsByDate} />
    </div>
  );
};

export default DashboardPage;

/**/ 