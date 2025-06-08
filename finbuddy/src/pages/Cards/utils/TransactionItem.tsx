import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import dayjs from 'dayjs';

// Importa a função de formatação do nosso novo arquivo de utils
import { formatCurrency } from '../utils/formatters'; // Ajuste o caminho se necessário

// É ideal que esta interface venha de um arquivo de tipos compartilhado (ex: src/types/index.ts)
// Mas, por enquanto, a definimos aqui para que o componente seja autocontido.
export interface ProcessedTransaction {
  id: string;
  name: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  date: Date;
  isPaid: boolean;
  bankAccountId: string;
}

interface TransactionItemProps {
  transaction: ProcessedTransaction;
}

// Exportamos o componente para que ele possa ser importado em outros lugares
export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const valueColor = isIncome ? 'success.main' : 'error.main';
  const avatarBgColor = isIncome ? 'success.light' : 'error.light';
  const avatarIconColor = isIncome ? 'success.dark' : 'error.dark';

  return (
    <ListItem
      sx={{ py: 1.5 }}
      secondaryAction={
        <Typography sx={{ fontWeight: 'bold', color: valueColor }}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.value)}
        </Typography>
      }
    >
      <ListItemIcon sx={{ minWidth: 52 }}>
        <Avatar sx={{ bgcolor: avatarBgColor }}>
          {isIncome ? <ArrowUpwardIcon sx={{ color: avatarIconColor }} /> : <ArrowDownwardIcon sx={{ color: avatarIconColor }} />}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
            {transaction.name}
          </Typography>
        }
        secondary={`${transaction.category} • ${dayjs(transaction.date).format('DD/MM/YYYY')}`}
      />
    </ListItem>
  );
};