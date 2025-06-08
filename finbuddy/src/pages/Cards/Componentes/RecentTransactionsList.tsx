// src/components/RecentTransactionsList.tsx
import React, { useState, useMemo } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

// --- INTERFACES E DADOS MOCKADOS ---

interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: Date;
  isPaid: boolean;
}

interface RecentTransactionsListProps {
  transactions?: ProcessedTransaction[];
}

const mockRecentTransactions: ProcessedTransaction[] = [
  { id: 'tx-1', name: 'Salário Mensal', category: 'Salário', value: 7500, type: 'income', date: dayjs('2025-06-05').toDate(), isPaid: true },
  { id: 'tx-2', name: 'Aluguel', category: 'Moradia', value: 2200, type: 'expense', date: dayjs('2025-06-05').toDate(), isPaid: true },
  { id: 'tx-3', name: 'Supermercado', category: 'Alimentação', value: 670.45, type: 'expense', date: dayjs('2025-06-03').toDate(), isPaid: true },
  { id: 'tx-4', name: 'Projeto Freelance', category: 'Trabalho Extra', value: 1200, type: 'income', date: dayjs('2025-06-02').toDate(), isPaid: true },
  { id: 'tx-5', name: 'Almoço Restaurante', category: 'Alimentação', value: 45.50, type: 'expense', date: dayjs('2025-05-31').toDate(), isPaid: true },
  { id: 'tx-6', name: 'Conta de Internet', category: 'Contas', value: 109.90, type: 'expense', date: dayjs('2025-05-30').toDate(), isPaid: true },
  { id: 'tx-7', name: 'Cinema', category: 'Lazer', value: 60.00, type: 'expense', date: dayjs('2025-05-28').toDate(), isPaid: false },
  { id: 'tx-8', name: 'Rendimento Investimento', category: 'Investimentos', value: 250.80, type: 'income', date: dayjs('2025-05-27').toDate(), isPaid: true },
  { id: 'tx-9', name: 'Café', category: 'Alimentação', value: 12.00, type: 'expense', date: dayjs('2025-05-26').toDate(), isPaid: true },
  { id: 'tx-10', name: 'Livro Técnico', category: 'Educação', value: 89.90, type: 'expense', date: dayjs('2025-05-25').toDate(), isPaid: true },
  { id: 'tx-11', name: 'Presente Aniversário', category: 'Presentes', value: 150.00, type: 'expense', date: dayjs('2025-05-22').toDate(), isPaid: true },
  { id: 'tx-12', name: 'Adiantamento', category: 'Salário', value: 1000, type: 'income', date: dayjs('2025-07-01').toDate(), isPaid: true },
];

const formatCurrency = (value: number): string => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const TransactionItem: React.FC<{ transaction: ProcessedTransaction }> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const valueColor = isIncome ? 'success.main' : 'error.main';
  const avatarBgColor = isIncome ? 'success.light' : 'error.light';
  const avatarIconColor = isIncome ? 'success.dark' : 'error.dark';
  return (
    <ListItem sx={{ py: 1.5 }} secondaryAction={<Typography sx={{ fontWeight: 'bold', color: valueColor }}>{isIncome ? '+' : '-'} {formatCurrency(transaction.value)}</Typography>}>
      <ListItemIcon sx={{ minWidth: 52 }}><Avatar sx={{ bgcolor: avatarBgColor }}>{isIncome ? <ArrowUpwardIcon sx={{ color: avatarIconColor }} /> : <ArrowDownwardIcon sx={{ color: avatarIconColor }} />}</Avatar></ListItemIcon>
      <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>{transaction.name}</Typography>} secondary={`${transaction.category} • ${dayjs(transaction.date).format('DD/MM/YYYY')}`} />
    </ListItem>
  );
};


// --- COMPONENTE PRINCIPAL ---

const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions: transactionsProp,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const allTransactions = (transactionsProp && transactionsProp.length > 0) ? transactionsProp : mockRecentTransactions;

  const handleNextMonth = () => setSelectedMonth(prev => dayjs(prev).add(1, 'month').toDate());
  const handlePrevMonth = () => setSelectedMonth(prev => dayjs(prev).subtract(1, 'month').toDate());
  const handleToggleExpand = () => setIsExpanded(prev => !prev);

  const displayedTransactions = useMemo(() => {
    if (isExpanded) {
      return [...allTransactions].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    const filteredByMonth = allTransactions.filter(tx => dayjs(tx.date).isSame(selectedMonth, 'month'));
    return filteredByMonth.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);
  }, [allTransactions, isExpanded, selectedMonth]);

  const { firstColumn, secondColumn } = useMemo(() => {
    const splitIndex = Math.ceil(displayedTransactions.length / 2);
    return {
      firstColumn: displayedTransactions.slice(0, splitIndex),
      secondColumn: displayedTransactions.slice(splitIndex),
    };
  }, [displayedTransactions]);

  const canExpand = allTransactions.length > 8;

  if (allTransactions.length === 0) {
    return (
      <Card sx={{ mt: 3, borderRadius: '12px', boxShadow: 1 }}>
        <CardContent sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Nenhuma transação recente para exibir.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <CardContent>
        {/* --- INÍCIO: CABEÇALHO DO CARD COM TÍTULO E FILTRO --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>


          {/* O filtro de mês só aparece se a lista NÃO estiver expandida */}
          {!isExpanded && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handlePrevMonth} size="small" aria-label="mês anterior">
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, width: '100px', textAlign: 'center', textTransform: 'capitalize' }}>
                {dayjs(selectedMonth).format('MMMM')}
              </Typography>
              <IconButton onClick={handleNextMonth} size="small" aria-label="próximo mês">
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        {/* --- FIM: CABEÇALHO DO CARD --- */}

        {displayedTransactions.length > 0 ? (
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <List disablePadding>
                {firstColumn.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <TransactionItem transaction={transaction} />
                    {index < firstColumn.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <List disablePadding>
                {secondColumn.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <TransactionItem transaction={transaction} />
                    {index < secondColumn.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
            <Typography>Nenhuma transação encontrada para {dayjs(selectedMonth).format('MMMM de YYYY')}.</Typography>
          </Box>
        )}
      </CardContent>

      {canExpand && (
        <CardActions sx={{ justifyContent: 'center', p: 1.5, borderTop: '1px solid #f0f0f0' }}>
          <Button
            size="small"
            onClick={handleToggleExpand}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            {isExpanded ? 'Ver menos' : 'Ver todas as transações'}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default RecentTransactionsList;