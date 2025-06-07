import React, { useEffect, useMemo } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useBankAccountStore } from '../../../store/bankAccountStore';
import { firestoreTimestampToDate } from '../../../pages/Transactions/components/TransactionDetailsModal/utils/transactionUtils';

dayjs.extend(isBetween);

interface TransactionData {
  value: number;
  type: 'income' | 'expense';
  date: any; // Firestore timestamp
  isPaid?: boolean;
}

interface SummaryCardsProps {
  data?: TransactionData[];
  selectedMonth: dayjs.Dayjs;
}

const formatCurrency = (value: number): string => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ data = [], selectedMonth }) => {
  console.log(data);
  const { bankAccounts, fetchBankAccounts } = useBankAccountStore();
  const currentMonth = dayjs();
  const isCurrentMonth = selectedMonth.isSame(currentMonth, 'month');
  const isFutureMonth = selectedMonth.isAfter(currentMonth, 'month');
  const isPastMonth = selectedMonth.isBefore(currentMonth, 'month');
  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const {
    totalIncome,
    totalExpenses,
    totalBalance,
    incomeCount,
    expenseCount,
    balanceTitle,
  } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let iCount = 0;
    let eCount = 0;

    const monthStart = selectedMonth.startOf('month');
    const monthEnd = selectedMonth.endOf('month');

    // Calculate total bank account balance
    const currentTotalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
    console.log(bankAccounts);

    data.forEach(item => {
      const transactionDate = item.date instanceof Date ? item.date : new Date(item.date);
      if (!transactionDate || isNaN(transactionDate.getTime())) return;
      const txDate = dayjs(transactionDate);

      if (!txDate.isBetween(monthStart, monthEnd, 'day', '[]')) {
        console.log("Não está entre o mês");
        return;
      }

      if (item.type === 'income') {
        income += item.value;
        iCount++;
      } else {
        expenses += item.value;
        eCount++;
      }
    });

    let finalBalance;
    let title;

    if (isCurrentMonth) {
      console.log("É o mês atual");
      console.log(currentTotalBalance);
      finalBalance = currentTotalBalance;
      title = "Saldo Total";
    } else if (isFutureMonth) {
      finalBalance = currentTotalBalance + (income - expenses);
      title = "Saldo no final do mês";
    } else {
      finalBalance = income - expenses;
      title = "Possível saldo no final do mês";
    }
    console.log(income, expenses);  
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: finalBalance,
      incomeCount: iCount,
      expenseCount: eCount,
      balanceTitle: title,
    };
  }, [data, selectedMonth, bankAccounts, isCurrentMonth, isFutureMonth, isPastMonth]);

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
          <h3 style={titleStyle}>{balanceTitle}</h3>
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