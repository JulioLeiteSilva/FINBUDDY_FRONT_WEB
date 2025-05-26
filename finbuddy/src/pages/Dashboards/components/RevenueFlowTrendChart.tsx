// src/components/RevenueFlowTrendChart.tsx
import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Importações do Day.js
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importar locale pt-br
import weekOfYear from 'dayjs/plugin/weekOfYear'; // Para .week() ou .isoWeek() se necessário
import isoWeek from 'dayjs/plugin/isoWeek';     // Para .startOf('isoWeek') etc.
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Configurar Day.js
dayjs.locale('pt-br');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Interface para as transações individuais recebidas como prop
interface ProcessedTransaction {
  value: number;
  type: 'income' | 'expense';
  date: Date; // Objeto Date do JavaScript
}

// Interface para os dados agregados que o gráfico de linha realmente usa
interface AggregatedDataPoint {
  periodKey: string;      // Chave canônica do período (ex: "AAAA-MM-DD" para início)
  displayLabel: string; // Rótulo formatado para o eixo X (pode usar "/")
  receita: number;
  despesa: number;
}

// Tipos de granularidade
type Granularity = 'week' | 'month' | 'year';

interface RevenueFlowTrendChartProps {
  transactions?: ProcessedTransaction[];
  chartTitle?: string;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// CustomTooltip espera o 'label' já formatado pelo labelFormatter do Tooltip
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#333', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #eee' }}>
          Período: {label} {/* 'label' é a string já formatada */}
        </p>
        {payload.map((pld, index) => (
          <p key={index} style={{ margin: '4px 0 0', color: pld.stroke || pld.fill }}>
            {`${pld.name}: ${formatCurrency(pld.value as number)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueFlowTrendChart: React.FC<RevenueFlowTrendChartProps> = ({
  transactions: initialTransactions,
  chartTitle = "Receitas e Despesas ao Longo do Tempo",
}) => {
  const [granularity, setGranularity] = useState<Granularity>('week');
  const transactionsToProcess = initialTransactions || [];

  const aggregatedData = useMemo((): AggregatedDataPoint[] => {
    if (!transactionsToProcess.length) return [];
    const sortedTransactions = [...transactionsToProcess].sort((a,b) => a.date.getTime() - b.date.getTime());
    if (!sortedTransactions.length || !dayjs(sortedTransactions[0].date).isValid()) return [];

    const firstTransactionDayjs = dayjs(sortedTransactions[0].date);
    const lastTransactionDayjs = dayjs(sortedTransactions[sortedTransactions.length - 1].date);
    const aggregationMap = new Map<string, { receita: number; despesa: number }>();
    let periodKeysAndLabels: { periodKey: string, displayLabel: string }[] = [];

    // Lógica de Agregação
    if (granularity === 'week') {
        // Usa startOf('week') que considera o locale 'pt-br' (Domingo como início)
        let currentPeriodStart = firstTransactionDayjs.startOf('week');
        const overallEndOfWeek = lastTransactionDayjs.endOf('week');
        while(currentPeriodStart.isSameOrBefore(overallEndOfWeek)){
            const periodEnd = currentPeriodStart.endOf('week');
            const periodKey = currentPeriodStart.format('YYYY-MM-DD');
            const displayLabelForXAxis = `${currentPeriodStart.format('DD/MM/YY')} - ${periodEnd.format('DD/MM/YY')}`;
            periodKeysAndLabels.push({periodKey, displayLabel: displayLabelForXAxis});
            aggregationMap.set(periodKey, {receita: 0, despesa: 0});
            currentPeriodStart = currentPeriodStart.add(1, 'week');
        }
        sortedTransactions.forEach(item => {
            const itemDateDayjs = dayjs(item.date);
            const weekKey = itemDateDayjs.startOf('week').format('YYYY-MM-DD');
            if (aggregationMap.has(weekKey)) {
                const current = aggregationMap.get(weekKey)!;
                if (item.type === 'income') current.receita += item.value;
                else if (item.type === 'expense') current.despesa += item.value;
            }
        });
    } else if (granularity === 'month') {
        let currentPeriodStart = firstTransactionDayjs.startOf('month');
        const overallEndOfMonth = lastTransactionDayjs.endOf('month');
        while(currentPeriodStart.isSameOrBefore(overallEndOfMonth)){
            const periodKey = currentPeriodStart.format('YYYY-MM-DD'); // Chave: início do mês
            const displayLabelForXAxis = currentPeriodStart.format('MM/YY');
            periodKeysAndLabels.push({periodKey, displayLabel: displayLabelForXAxis});
            aggregationMap.set(periodKey, {receita: 0, despesa: 0});
            currentPeriodStart = currentPeriodStart.add(1, 'month');
        }
         sortedTransactions.forEach(item => {
            const itemDateDayjs = dayjs(item.date);
            const monthKey = itemDateDayjs.startOf('month').format('YYYY-MM-DD');
            if (aggregationMap.has(monthKey)) {
                const current = aggregationMap.get(monthKey)!;
                if (item.type === 'income') current.receita += item.value;
                else if (item.type === 'expense') current.despesa += item.value;
            }
        });
    } else if (granularity === 'year') {
        let currentPeriodStart = firstTransactionDayjs.startOf('year');
        const overallEndOfYear = lastTransactionDayjs.endOf('year');
         while(currentPeriodStart.isSameOrBefore(overallEndOfYear)){
            const periodKey = currentPeriodStart.format('YYYY-MM-DD'); // Chave: início do ano
            const displayLabelForXAxis = currentPeriodStart.format('YYYY');
            periodKeysAndLabels.push({periodKey, displayLabel: displayLabelForXAxis});
            aggregationMap.set(periodKey, {receita: 0, despesa: 0});
            currentPeriodStart = currentPeriodStart.add(1, 'year');
        }
        sortedTransactions.forEach(item => {
            const itemDateDayjs = dayjs(item.date);
            const yearKey = itemDateDayjs.startOf('year').format('YYYY-MM-DD');
            if (aggregationMap.has(yearKey)) {
                const current = aggregationMap.get(yearKey)!;
                if (item.type === 'income') current.receita += item.value;
                else if (item.type === 'expense') current.despesa += item.value;
            }
        });
    }
    return periodKeysAndLabels.map(p => {
      const data = aggregationMap.get(p.periodKey) || { receita: 0, despesa: 0 };
      return { periodKey: p.periodKey, displayLabel: p.displayLabel, receita: data.receita, despesa: data.despesa };
    });
  }, [transactionsToProcess, granularity]);

  const yAxisLabelStyle = { fontSize: 12, fill: '#666', textAnchor: 'middle' as const };

  return (
    <div style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        {chartTitle && <h3 style={{ margin: 0, color: '#333', fontWeight: '500', flexGrow: 1, textAlign:'center' }}>{chartTitle}</h3>}
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as Granularity)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', cursor: 'pointer', minWidth: '120px' }}
        >
          <option value="week">Semanal</option>
          <option value="month">Mensal</option>
          <option value="year">Anual</option>
        </select>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregatedData} margin={{ top: 35, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              type="category"
              dataKey="periodKey"
              tickFormatter={(tickValue) => {
                const point = aggregatedData.find(p => p.periodKey === tickValue);
                return point ? point.displayLabel : tickValue;
              }}
              stroke="#777"
              tick={{ fontSize: 12 }}
              interval={aggregatedData.length > 15 ? 'preserveStartEnd' : 0}
            />
            <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value as number)} stroke="#17a2b8" tick={{ fontSize: 12 }} label={{ value: "Receita (R$)", angle: 0, position: 'top', dy: -25, style: yAxisLabelStyle, fill: '#17a2b8' }} width={80} />
            <YAxis yAxisId="right" orientation="right" stroke="#dc3545" tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value as number)} label={{ value: "Despesa (R$)", angle: 0, position: 'top', dy: -25, style: yAxisLabelStyle, fill: '#dc3545' }} width={80} />
            <Tooltip
              content={<CustomTooltip />}
              labelFormatter={(periodKeyFromData) => {
                const dateObj = dayjs(periodKeyFromData);
                if (!dateObj.isValid()) return periodKeyFromData;

                if (granularity === 'week') {
                  const weekStart = dateObj.startOf('week');
                  const weekEnd = dateObj.endOf('week');
                  return `${weekStart.format('DD-MM-YY')} - ${weekEnd.format('DD-MM-YY')}`;
                } else if (granularity === 'month') {
                  return dateObj.format('MM-YY');
                } else if (granularity === 'year') {
                  return dateObj.format('YYYY');
                }
                return periodKeyFromData;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line yAxisId="left" type="monotone" dataKey="receita" name="Receita" stroke="#17a2b8" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 1, fill: '#fff' }}/>
            <Line yAxisId="right" type="monotone" dataKey="despesa" name="Despesa" stroke="#dc3545" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 1, fill: '#fff' }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueFlowTrendChart;