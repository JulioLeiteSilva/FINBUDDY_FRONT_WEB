/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/MonthlyComparisonBarChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

interface MonthlyData {
  date: string;
  receitas: number;
  despesas: number;
}

interface MonthlyBarChartProps {
  data: MonthlyData[];
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

const MonthlyComparisonBarChart: React.FC<MonthlyBarChartProps> = ({ data, selectedMonth }) => {
  const currentMonth = dayjs();
  const isCurrentMonth = selectedMonth.isSame(currentMonth, 'month');
  const isFutureMonth = selectedMonth.isAfter(currentMonth, 'month');
  const isPastMonth = selectedMonth.isBefore(currentMonth, 'month');

  const filteredData = data.filter(item => {
    const itemMonth = dayjs(item.date, 'YYYY-MM');
    return itemMonth.isSame(selectedMonth, 'month');
  });

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
        Comparação de Receitas e Despesas
        {isCurrentMonth && ' (Mês Atual)'}
        {isFutureMonth && ' (Mês Futuro)'}
        {isPastMonth && ' (Mês Anterior)'}
      </h3>
      <ResponsiveContainer>
        <BarChart
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="receitas" name="Receitas" fill="#28a745" />
          <Bar dataKey="despesas" name="Despesas" fill="#dc3545" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyComparisonBarChart;