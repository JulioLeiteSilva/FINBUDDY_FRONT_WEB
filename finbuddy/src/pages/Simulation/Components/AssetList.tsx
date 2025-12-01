// src/components/AssetList.tsx
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

// (Estamos assumindo que a interface AssetItem está em um arquivo 'types.ts' compartilhado)
// import { AssetItem } from '../types'; 

// --- Tipos Locais (ou importe de um arquivo global) ---
interface AssetItem {
  id: string;
  name: string;
  value: number;
  isMonthly?: boolean;
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
// ---------------------------------------------------

interface AssetListProps {
  assets: AssetItem[];
  totalValue: number;
  onAddClick: () => void;      // Função para abrir o modal
  onDeleteClick: (id: string) => void; // Função para deletar o item
}

export const AssetList: React.FC<AssetListProps> = ({ assets, totalValue, onAddClick, onDeleteClick }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Patrimônios (Ativos)</Typography>
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
        {assets.map((item) => (
          <ListItem key={item.id} dense>
            <ListItemText
             primary={
              <Box sx={{ display : 'flex', alignItems: 'center', gap: 1}}>
                {item.name}
                <Chip
                  label={item.isMonthly ? "Mensal" : "Patrimônio"}
                  color={item.isMonthly ? "success" : "default"}
                  variant={item.isMonthly ? "filled" : "outlined"}
                  size="small"
                />
              </Box>
             }
               
            secondary={formatCurrency(item.value)} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(item.id)}> {/* <-- Chama a prop */}
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {assets.length === 0 && <ListItem><ListItemText primary="Nenhum patrimônio cadastrado." /></ListItem>}
      </List>
      
      <Divider />
      <Typography variant="h6" sx={{ p: 2, textAlign: 'right' }}>
        Total: {formatCurrency(totalValue)} {/* <-- Recebe o total via prop */}
      </Typography>
    </Paper>
  );
};