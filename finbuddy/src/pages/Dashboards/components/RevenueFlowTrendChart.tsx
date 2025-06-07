// src/components/RevenueFlowTrendChart.tsx
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { firestoreTimestampToDate } from '../../../pages/Transactions/components/TransactionDetailsModal/utils/transactionUtils';

interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: any; // Firestore timestamp
  isPaid?: boolean;
}

interface RevenueFlowTrendChartProps {
  transactions: ProcessedTransaction[];
  selectedMonth: dayjs.Dayjs;
}

const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0px 3px 12px rgba(0,0,0,0.15)' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333', paddingBottom: '4px', borderBottom: '1px solid #ccc' }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '8px 0 0', color: '#333', fontSize: '0.9em' }}>
            {entry.name}:
            <strong style={{ color: entry.color }}>
              {` ${formatCurrency(entry.value)}`}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueFlowTrendChart: React.FC<RevenueFlowTrendChartProps> = ({ transactions, selectedMonth }) => {
  const currentMonth = dayjs();
  const isCurrentMonth = selectedMonth.isSame(currentMonth, 'month');
  const isFutureMonth = selectedMonth.isAfter(currentMonth, 'month');
  const isPastMonth = selectedMonth.isBefore(currentMonth, 'month');

  const chartData = useMemo(() => {
    const monthStart = selectedMonth.startOf('month');
    const monthEnd = selectedMonth.endOf('month');
    const daysInMonth = monthEnd.date();
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      income: 0,
      expense: 0,
      balance: 0,
    }));
    console.log(transactions);
    transactions.forEach(transaction => {
      const transactionDate = transaction.date instanceof Date ? transaction.date : new Date(transaction.date);
      if (!transactionDate || isNaN(transactionDate.getTime())) return;
      const txDate = dayjs(transactionDate);

      if (!txDate.isBetween(monthStart, monthEnd, 'day', '[]')) {
        return;
      }

      if (isCurrentMonth && !transaction.isPaid) return;
      if (isFutureMonth) return;

      const dayIndex = txDate.date() - 1;
      if (transaction.type === 'income') {
        dailyData[dayIndex].income += transaction.value;
        dailyData[dayIndex].balance += transaction.value;
      } else {
        dailyData[dayIndex].expense += transaction.value;
        dailyData[dayIndex].balance -= transaction.value;
      }
    });

    // Calculate cumulative balance
    let runningBalance = 0;
    return dailyData.map(day => {
      runningBalance += day.balance;
      return {
        ...day,
        balance: runningBalance,
      };
    });
  }, [transactions, selectedMonth, isCurrentMonth, isFutureMonth]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
        Fluxo de Receitas e Despesas
        {isCurrentMonth && ' (Mês Atual)'}
        {isFutureMonth && ' (Mês Futuro)'}
        {isPastMonth && ' (Mês Anterior)'}
      </h3>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="income" name="Receitas" stroke="#28a745" />
          <Line type="monotone" dataKey="expense" name="Despesas" stroke="#dc3545" />
          <Line type="monotone" dataKey="balance" name="Saldo" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueFlowTrendChart;