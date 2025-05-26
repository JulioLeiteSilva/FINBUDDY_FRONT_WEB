// src/components/MonthlyComparisonBarChart.tsx
import React, { useMemo } from 'react'; // Removido useState se não for mais usado aqui
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Interface para os dados mensais que este componente espera (já está definida no DashboardPage)
interface MonthlyData {
  date: string; // Formato "AAAA-MM"
  receitas: number;
  despesas: number;
}

interface MonthlyBarChartProps {
  data?: MonthlyData[]; // Recebe os dados já agregados mensalmente
  chartTitle?: string;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDateToMMYY = (dateStringAAAA_MM: string): string => { // Renomeada para clareza
  // dateStringAAAA_MM é no formato "AAAA-MM"
  if (dateStringAAAA_MM && dateStringAAAA_MM.length === 7 && dateStringAAAA_MM.includes('-')) {
     const [year, month] = dateStringAAAA_MM.split('-');
     return `${month}/${year.slice(-2)}`; // Formato "MM/AA"
  }
  return dateStringAAAA_MM; // Retorna original se não estiver no formato esperado
};

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    // 'label' agora é a string "AAAA-MM"
    const displayLabel = formatDateToMMYY(label as string);

    let receitasValue = 0;
    let despesasValue = 0;

    payload.forEach(pld => {
      if (pld.dataKey === 'receitas') {
        receitasValue = pld.value as number;
      } else if (pld.dataKey === 'despesas') {
        despesasValue = pld.value as number;
      }
    });
    const saldoMensal = receitasValue - despesasValue;
    const saldoColor = saldoMensal >= 0 ? '#28a745' : '#dc3545';

    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
          Mês: {displayLabel}
        </p>
        {payload.map((pld) => (
          <p key={String(pld.dataKey)} style={{ margin: '4px 0 0', color: pld.fill }}>
            {`${pld.name}: ${formatCurrency(pld.value as number)}`}
          </p>
        ))}
        <hr style={{margin: '8px 0', border: 'none', borderTop: '1px solid #eee'}} />
        <p style={{margin: '4px 0 0', fontWeight: 'bold'}}>
          Saldo do Mês:
          <span style={{ color: saldoColor, marginLeft: '5px' }}>
            {formatCurrency(saldoMensal)}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const MonthlyComparisonBarChart: React.FC<MonthlyBarChartProps> = ({
  data: initialChartData, // Renomeado para clareza
  chartTitle = "Receitas vs Despesas por Mês", // Título mais específico
}) => {
  // Usa os dados recebidos diretamente, ou um array vazio se nada for passado
  // A ordenação já é feita no DashboardPage.tsx
  const chartData = initialChartData || [];

  const yAxisLabelStyle = {
    fontSize: 12,
    fill: '#666',
    textAnchor: 'middle' as const,
  };

  return (
    <div style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginTop: '30px' }}>
      {chartTitle && (
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontWeight: '500' }}>
          {chartTitle}
        </h3>
      )}

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData} // Usa os dados diretamente
            margin={{ top: 35, right: 30, left: 30, bottom: 5 }}
            barGap={4}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date" // Usa o campo 'date' que é "AAAA-MM"
              tickLine={false}
              axisLine={{ stroke: '#ccc' }}
              tickFormatter={formatDateToMMYY} // Formata "AAAA-MM" para "MM/AA"
              type="category" // O eixo X é categórico com os meses
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value as number)}
              axisLine={{ stroke: '#ccc' }}
              tickLine={false}
              label={{
                value: "Valor (R$)",
                angle: 0,
                position: 'top',
                dy: -25,
                style: yAxisLabelStyle,
              }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(204,204,204,0.2)' }}/>
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="receitas" name="Receitas" fill="#28a745" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesas" name="Despesas" fill="#dc3545" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyComparisonBarChart;