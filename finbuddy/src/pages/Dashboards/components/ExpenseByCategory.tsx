import React, { useState, useMemo, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useCategoriesStore } from '../../../store/categoriesStore';
import dayjs from 'dayjs';
import { firestoreTimestampToDate } from '../../../pages/Transactions/components/TransactionDetailsModal/utils/transactionUtils';

// Interface para os dados da categoria que o gráfico de rosca espera (saída da agregação)
interface ChartCategoryData {
  name: string;    // Nome da categoria
  value: number;   // Valor total da categoria
  color: string;   // Cor para o gráfico
  type: 'income' | 'expense' | 'all'; // Tipo para tooltip e lógica, 'all' se não filtrado por tipo específico
}

// Interface para as transações individuais recebidas como prop
// (Esta deve ser a mesma 'ProcessedTransaction' do DashboardPage.tsx)
interface ProcessedTransaction {
  id: string;
  // name: string; // Nome da transação individual, não usado diretamente para agrupar aqui, mas 'category' sim
  category: string;
  value: number;
  type: 'income' | 'expense'; // Vem do DashboardPage já em minúsculas
  date: any; // Firestore timestamp
  isPaid?: boolean;
}

// Interface para as props do componente
interface ExpenseByCategoryProps {
  transactions?: ProcessedTransaction[]; // Transações recebidas do DashboardPage
  chartTitle?: string;
  selectedMonth: dayjs.Dayjs;
}

// Cores padrão para as categorias
const DEFAULT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#FF6699', '#33CCFF', '#FFD700'];


const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload as ChartCategoryData;
    let typeLabel = '';
    if (dataItem.type === 'income') typeLabel = 'Receita';
    else if (dataItem.type === 'expense') typeLabel = 'Despesa';

    return (
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0px 3px 12px rgba(0,0,0,0.15)' }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: dataItem.color, paddingBottom: '4px', borderBottom: `1px solid ${dataItem.color}` }}>
          {dataItem.name}
        </p>
        <p style={{ margin: '8px 0 0', color: '#333', fontSize: '0.9em' }}>
          Valor:
          {/* A cor do valor pode ser baseada no tipo da categoria se o filtro for 'all' e uma categoria tiver ambos */}
          {/* Por simplicidade, vamos manter a cor baseada no tipo geral do filtro aplicado ou da categoria */}
          <strong style={{ color: dataItem.type === 'income' ? 'green' : dataItem.type === 'expense' ? 'red' : dataItem.color }}>
            {` R$ ${dataItem.value.toFixed(2)}`}
          </strong>
        </p>
        {typeLabel && ( // Só mostra o tipo se não for 'all' (ou se a categoria tiver um tipo definido)
          <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.8em' }}>
            Tipo: {typeLabel}
          </p>
        )}
      </div>
    );
  }
  return null;
};

type TransactionTypeFilter = 'all' | 'income' | 'expense';

const ExpenseByCategory: React.FC<ExpenseByCategoryProps> = ({
  transactions: initialTransactions, // Recebe as transações processadas
  chartTitle = "Transações por Categoria",
  selectedMonth,
}) => {
  // Usa as transações recebidas ou um array vazio como fallback
  // Não usaremos mais 'sampleCategoryData' interno para o gráfico principal.
  const transactionsToProcess = initialTransactions || [];
  const [selectedType, setSelectedType] = useState<TransactionTypeFilter>('all');
  const { categories: storeCategories, defaultCategories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    // Busca as categorias ao montar o componente, caso ainda não tenham sido carregadas
    fetchCategories();
  }, [fetchCategories]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value as TransactionTypeFilter);
  };

  const chartData = useMemo((): ChartCategoryData[] => {
    if (!transactionsToProcess.length) return [];

    const monthStart = selectedMonth.startOf('month');
    const monthEnd = selectedMonth.endOf('month');

    // 1. Filtra as transações pelo mês selecionado e pelo 'selectedType'
    const filteredTransactions = transactionsToProcess.filter(t => {
      const transactionDate = t.date instanceof Date ? t.date : new Date(t.date);
      if (!transactionDate || isNaN(transactionDate.getTime())) return;
      const txDate = dayjs(transactionDate);

      const matchesMonth = txDate.isBetween(monthStart, monthEnd, 'day', '[]');
      const matchesType = selectedType === 'all' || t.type === selectedType;

      return matchesMonth && matchesType;
    });

    // 2. Agrega os valores por categoria
    const aggregated: { [categoryIcon: string]: { value: number; typeCount: { [key: string]: number } } } = {};

    filteredTransactions.forEach(transaction => {
      const categoryIcon = transaction.category; // transaction.category é o ícone
      if (!aggregated[categoryIcon]) {
        aggregated[categoryIcon] = { value: 0, typeCount: { income: 0, expense: 0 } };
      }
      aggregated[categoryIcon].value += transaction.value;
      aggregated[categoryIcon].typeCount[transaction.type]++;
    });

    const allCategoriesFromStore = [...storeCategories, ...defaultCategories];

    // 3. Formata para o gráfico de rosca e atribui cores
    return Object.entries(aggregated).map(([categoryIcon, data], index) => {
      let itemType: 'income' | 'expense' | 'all' = selectedType;
      if (selectedType === 'all') {
        // Se o filtro for 'all', determina o tipo predominante na categoria ou marca como 'all'
        if (data.typeCount.income > 0 && data.typeCount.expense === 0) itemType = 'income';
        else if (data.typeCount.expense > 0 && data.typeCount.income === 0) itemType = 'expense';
        // else, continua 'all' (significa misto ou não determinado unicamente)
      }
      const foundCategory = allCategoriesFromStore.find(cat => cat.icon === categoryIcon);
      const displayName = foundCategory ? foundCategory.name : categoryIcon;

      return {
        name: displayName,
        value: data.value,
        color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        type: itemType,
      };
    }).sort((a, b) => b.value - a.value); // Opcional: ordenar por valor descendente
  }, [transactionsToProcess, selectedType, selectedMonth, storeCategories, defaultCategories]);

  return (
    <div style={{ width: '100%', marginTop: '30px' /* Espaçamento se vier abaixo de outros */ }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
        <h3 style={{ margin: 0, color: '#333' }}>{chartTitle}</h3>
        <select
          value={selectedType}
          onChange={handleTypeChange}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white', fontSize: '14px', cursor: 'pointer' }}
        >
          <option value="all">Todos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              fill="#8884d8"
              paddingAngle={chartData.length > 1 ? 5 : 0}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Exemplo de label na fatia
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}-${entry.type}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry) => {
                const originalPayload = entry.payload as ChartCategoryData | undefined;
                const color = originalPayload?.color || '#8884d8';
                return <span style={{ color }}>{value}</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', color: '#777', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Nenhuma transação para exibir com os filtros atuais.</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseByCategory;