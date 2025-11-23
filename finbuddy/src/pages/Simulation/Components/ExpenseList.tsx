// src/components/ExpenseList.tsx
import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// (Importe de 'types.ts')
// import { ExpenseItem } from '../types';

// --- Tipos Locais (ou importe de um arquivo global) ---
interface ExpenseItem {
  id: string;
  name: string;
  value: number; 
  isFixed: boolean;
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
// ---------------------------------------------------

interface ExpenseListProps {
  expenses: ExpenseItem[];
  totalFixedValue: number; // O total de gastos *fixos*
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, totalFixedValue, onAddClick, onDeleteClick }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Despesas</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddClick} // <-- Chama a prop
        >
          Cadastrar
        </Button>
      </Box>
      <Divider />
      
      <List sx={{ height: 500, overflowY: 'auto' }}>
        {expenses.map((item) => (
          <ListItem 
            key={item.id} 
            dense
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(item.id)}> {/* <-- Chama a prop */}
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.name}
                  <Chip
                    label={item.isFixed ? "Fixo" : "Pontual"}
                    color={item.isFixed ? "primary" : "default"}
                    size="small"
                  />
                </Box>
              } 
              secondary={formatCurrency(item.value)} 
            />
          </ListItem>
        ))}
        {expenses.length === 0 && <ListItem><ListItemText primary="Nenhuma despesa cadastrada." /></ListItem>}
      </List>
      
      <Divider />
      <Typography variant="h6" sx={{ p: 2, textAlign: 'right' }}>
        Total (Mensal): {formatCurrency(totalFixedValue)} / mês {/* <-- Recebe o total via prop */}
      </Typography>
    </Paper>
  );
};