
import React, { useMemo } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';

interface TransactionData {
  value: number;
  type: 'income' | 'expense';
}


const defaultSummaryData: TransactionData[] = [
  { type: 'income', value: 20400 }, 
  { type: 'expense', value: 1416.60 }, 
  
  
  { type: 'income', value: 0 }, { type: 'income', value: 0 }, { type: 'income', value: 0 },
  { type: 'income', value: 0 }, { type: 'income', value: 0 }, { type: 'income', value: 0 }, { type: 'income', value: 0 },
  
  { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 },
  { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 },
  { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 },
  { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 }, { type: 'expense', value: 0 },
  { type: 'expense', value: 0 }, { type: 'expense', value: 0 },
];


interface SummaryCardsProps {
  data?: TransactionData[];
}

const formatCurrency = (value: number): string => {
  
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const dataToUse = data || defaultSummaryData;

  const {
    totalIncome,
    totalExpenses,
    totalBalance,
    incomeCount,
    expenseCount,
  } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let iCount = 0;
    let eCount = 0;

    dataToUse.forEach(item => {
      if (item.type === 'income') {
        income += item.value;
        iCount++;
      } else {
        expenses += item.value;
        eCount++;
      }
    });
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
      incomeCount: iCount,
      expenseCount: eCount,
    };
  }, [dataToUse]);

  const getSaldoSubtitle = (balance: number): string => {
    if (balance > 0) return "Seu saldo está positivo. Continue assim!";
    if (balance < 0) return "Seu saldo está negativo. Atenção às despesas!";
    return "Seu saldo está zerado.";
  };

  const cardBaseStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '20px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    flex: 1,
    minWidth: '280px', 
    maxWidth: '320px', 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '15px',
  };

  const cardContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0,
    fontWeight: 400,
  };

  const valueStyleBase: React.CSSProperties = {
    fontSize: '26px', 
    fontWeight: 700, 
    margin: '4px 0 8px 0', 
    letterSpacing: '-0.5px',
  };

  const smallTextStyle: React.CSSProperties = {
    fontSize: '13px', 
    color: '#868e96', 
    margin: 0,
  };

  const iconContainerBaseStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const iconSize = '24px'; 

  const theme = useTheme();
  const greenColorValue = '#28a745'; 
  const lightGreenBgIcon = 'rgba(40, 167, 69, 0.1)'; 
  const redColorValue = '#dc3545';   
  const lightRedBgIcon = 'rgba(220, 53, 69, 0.1)';   
  const primaryColor = theme.palette.primary.main;

  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', 
        flexWrap: 'wrap',
        gap: '24px', 
        padding: '20px', 
        fontFamily: "'Inter', sans-serif", 
      }}
    >
    
      <div style={cardBaseStyle}>
        <div style={cardContentStyle}>
          <h3 style={titleStyle}>Saldo Total</h3>
          <p style={{ ...valueStyleBase, color: totalBalance >= 0 ? primaryColor : redColorValue }}>
            {formatCurrency(totalBalance)}
          </p>
          <p style={smallTextStyle}>{getSaldoSubtitle(totalBalance)}</p>
        </div>
        <div style={{ ...iconContainerBaseStyle, backgroundColor: lightGreenBgIcon }}>
          <AttachMoneyIcon sx={{ color: greenColorValue, fontSize: iconSize }} />
        </div>
      </div>

      
      <div style={cardBaseStyle}>
        <div style={cardContentStyle}>
          <h3 style={titleStyle}>Total de Receitas</h3>
          <p style={{ ...valueStyleBase, color: greenColorValue }}>
            {formatCurrency(totalIncome)}
          </p>
          <p style={smallTextStyle}>{incomeCount} transaç{incomeCount === 1 ? 'ão' : 'ões'} de receita</p>
        </div>
        <div style={{ ...iconContainerBaseStyle, backgroundColor: lightGreenBgIcon }}>
          <ArrowUpwardIcon sx={{ color: greenColorValue, fontSize: iconSize }} />
        </div>
      </div>

      
      <div style={cardBaseStyle}>
        <div style={cardContentStyle}>
          <h3 style={titleStyle}>Total de Despesas</h3>
          <p style={{ ...valueStyleBase, color: redColorValue }}>
            {formatCurrency(totalExpenses)}
          </p>
          <p style={smallTextStyle}>{expenseCount} transaç{expenseCount === 1 ? 'ão' : 'ões'} de despesa</p>
        </div>
        <div style={{ ...iconContainerBaseStyle, backgroundColor: lightRedBgIcon }}>
          <ArrowDownwardIcon sx={{ color: redColorValue, fontSize: iconSize }} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;