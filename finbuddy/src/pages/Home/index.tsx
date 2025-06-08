import React, { useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { useBankAccountStore } from '../../store/bankAccountStore';
import { useTransactionsStore } from '../../store/transactionStore';
import dayjs from 'dayjs';
import { firestoreTimestampToDate } from '../Transactions/components/TransactionDetailsModal/utils/transactionUtils';
import { useBanks } from '../../hooks/useBanks';
import SummaryCards from './components/SummaryCards';
import BankAccountsList from './components/BankAccountsList';
import RecentTransactions from './components/RecentTransactions';
import { formatCurrency } from './utils/formatUtils';

const Home: React.FC = () => {
  const { bankAccounts, fetchBankAccounts } = useBankAccountStore();
  const { transactions, fetchTransactions } = useTransactionsStore();
  const { banks } = useBanks();

  useEffect(() => {
    fetchBankAccounts();
    fetchTransactions();
  }, [fetchBankAccounts, fetchTransactions]);

  // Filtra transações da última semana
  const recentTransactions = transactions.filter(transaction => {
    const transactionDate = firestoreTimestampToDate(transaction.date);
    if (!transactionDate) return false;
    const txDate = dayjs(transactionDate);
    const oneWeekAgo = dayjs().subtract(7, 'day');
    return txDate.isAfter(oneWeekAgo);
  }).sort((a, b) => {
    const dateA = firestoreTimestampToDate(a.date);
    const dateB = firestoreTimestampToDate(b.date);
    return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0);
  }).slice(0, 5); // Pega apenas as 5 transações mais recentes

  // Calcula totais para os cards
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = transactions
    .filter(tx => {
      const txDate = firestoreTimestampToDate(tx.date);
      return txDate && dayjs(txDate).isSame(dayjs(), 'month') && tx.type === 'INCOME' && tx.isPaid;
    })
    .reduce((sum, tx) => sum + tx.value, 0);
  const monthlyExpenses = transactions
    .filter(tx => {
      const txDate = firestoreTimestampToDate(tx.date);
      return txDate && dayjs(txDate).isSame(dayjs(), 'month') && tx.type === 'EXPENSE' && tx.isPaid;
    })
    .reduce((sum, tx) => sum + tx.value, 0);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <SummaryCards
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
        formatCurrency={formatCurrency}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <BankAccountsList
            bankAccounts={bankAccounts}
            banks={banks}
            formatCurrency={formatCurrency}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <RecentTransactions
            transactions={recentTransactions}
            formatCurrency={formatCurrency}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
