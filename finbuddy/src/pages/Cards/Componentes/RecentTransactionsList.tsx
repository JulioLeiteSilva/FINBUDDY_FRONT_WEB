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
import { TransactionItem } from '../utils/TransactionItem';
import { ProcessedTransaction } from '../utils/types';

dayjs.locale('pt-br');

// --- INTERFACES ---

interface RecentTransactionsListProps {
  transactions?: ProcessedTransaction[];
}

const formatCurrency = (value: number): string => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- COMPONENTE PRINCIPAL ---

const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions: transactionsProp = [],
}) => {
  console.log(transactionsProp)
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handleNextMonth = () => setSelectedMonth(prev => dayjs(prev).add(1, 'month').toDate());
  const handlePrevMonth = () => setSelectedMonth(prev => dayjs(prev).subtract(1, 'month').toDate());
  const handleToggleExpand = () => setIsExpanded(prev => !prev);

  const displayedTransactions = useMemo(() => {
    if (isExpanded) {
      return [...transactionsProp].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    console.log(selectedMonth.getMonth()+1)
    console.log(selectedMonth.getFullYear())
    console.log(transactionsProp)
    const filteredByMonth = transactionsProp.filter(tx => 
      tx.invoiceMonth === selectedMonth.getMonth() + 1 && 
      tx.invoiceYear === selectedMonth.getFullYear()
    );
    return filteredByMonth.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);
  }, [transactionsProp, isExpanded, selectedMonth]);
  console.log(displayedTransactions)

  const { firstColumn, secondColumn } = useMemo(() => {
    const splitIndex = Math.ceil(displayedTransactions.length / 2);
    return {
      firstColumn: displayedTransactions.slice(0, splitIndex),
      secondColumn: displayedTransactions.slice(splitIndex),
    };
  }, [displayedTransactions]);

  const canExpand = transactionsProp.length > 8;

  if (transactionsProp.length === 0) {
    return (
      <Card sx={{ mt: 3, borderRadius: '12px', boxShadow: 1 }}>
        <CardContent sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
          <Typography>Nenhuma transação encontrada.</Typography>
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