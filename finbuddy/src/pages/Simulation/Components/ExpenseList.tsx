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
  IconButton,
  Chip,
  ListItemAvatar, // Importar
  Avatar          // Importar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import GetMuiIcon from '../../../utils/getMuiIcon';
import { formatCurrency } from '../../Home/utils/formatUtils';
import { ExpenseItem } from '../ImpactSimulationPage';

// ... (formatCurrency e interfaces mantidas)

interface ExpenseListProps {
  expenses: ExpenseItem[];
  totalFixedValue: number;
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, totalFixedValue, onAddClick, onDeleteClick }) => {
  return (
    <Paper sx={{ p: 2 }}>
      {/* ... Header mantido igual ... */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Despesas</Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddClick}>
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
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(item.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {/* --- ADIÇÃO DO ÍCONE --- */}
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: item.isFixed ? 'primary.light' : 'grey.300', color: 'primary.contrastText' }}>
                {/* Se tiver iconName, usa o GetMuiIcon, senão usa um fallback visual simples */}
                <GetMuiIcon iconName={item.iconName} fallbackIconName="MoneyOffIcon" style={{ fontSize: 20 }} />
              </Avatar>
            </ListItemAvatar>
            {/* ----------------------- */}

            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.name}
                  {/* Chip mantido, mas agora o ícone já ajuda a identificar visualmente */}
                  <Chip
                    label={item.isFixed ? "Fixo" : "Pontual"}
                    color={item.isFixed ? "primary" : "default"}
                    size="small"
                    variant="outlined"
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
        Total (Mensal): {formatCurrency(totalFixedValue)} / mês
      </Typography>
    </Paper>
  );
};