import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import GetMuiIcon from '../../../utils/getMuiIcon';
import { useCategoriesStore } from '../../../store/categoriesStore';
import { formatCurrency } from '../utils/formatters';
import { ProcessedTransaction } from './types';

// É ideal que esta interface venha de um arquivo de tipos compartilhado (ex: src/types/index.ts)
// Mas, por enquanto, a definimos aqui para que o componente seja autocontido.

interface TransactionItemProps {
  transaction: ProcessedTransaction;
}

// Exportamos o componente para que ele possa ser importado em outros lugares
export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const valueColor = isIncome ? 'success.main' : 'error.main';
  const avatarBgColor = isIncome ? 'success.light' : 'error.light';
  const { categories, defaultCategories } = useCategoriesStore();

  const getCategoryInfo = (categoryIcon: string) => {
    const category = categories.find(cat => cat.icon === categoryIcon);
    const defaultCategory = defaultCategories.find(cat => cat.icon === categoryIcon);
    const categoryInfo = category || defaultCategory;
    
    return {
      icon: categoryInfo?.icon || categoryIcon,
      name: categoryInfo?.name || categoryIcon
    };
  };

  const categoryInfo = getCategoryInfo(transaction.category);

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
          <GetMuiIcon iconName={categoryInfo.icon} sx={{ color: 'white' }} />
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
            {transaction.name}
          </Typography>
        }
        secondary={`${categoryInfo.name} • ${dayjs(transaction.date).format('DD/MM/YYYY')}`}
      />
    </ListItem>
  );
};