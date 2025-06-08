// src/components/CardFormModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import dayjs from 'dayjs';

// Importe a interface CardDetails do seu arquivo de tipos
import { CardDetails } from '../utils/types'; // Ajuste o caminho conforme sua estrutura

// Tipos para o formulário
interface CardFormData {
  name: string;
  brand: string;
  closingDay: string;
  dueDay: string;
  limit: string;
  bankName: string;
}

// Estado inicial para o formulário (quando adicionando um novo cartão)
const initialFormData: CardFormData = {
  name: '',
  brand: '',
  closingDay: '',
  dueDay: '',
  limit: '',
  bankName: '',
};

// Opções para o dropdown de bandeira
const cardBrandOptions = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'ELO', label: 'Elo' },
  { value: 'AMEX', label: 'Amex' },
  { value: 'OTHER', label: 'Outro' },
];

// Opções para os dropdowns de dia (1-31)
const dayOptions = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { value: day.toString(), label: day.toString() };
});

// Props que o componente espera
interface CardFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (cardData: CardFormData, cardId: string | null) => void;
  initialData?: CardDetails | null; // Dados do cartão para o modo de edição
}

const CardFormModal: React.FC<CardFormModalProps> = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<CardFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CardFormData, string>>>({});

  const isEditMode = !!initialData;

  // Efeito para popular o formulário quando o modal abre no modo de edição
  useEffect(() => {
    if (initialData && open) {
      setFormData({
        name: initialData.cardName,
        brand: initialData.brand,
        closingDay: String(initialData.closingDay),
        dueDay: String(dayjs(initialData.dueDate).date()),
        limit: String(initialData.limitTotal),
        bankName: initialData.bankName,
      });
    } else if (!initialData && open) {
      // Garante que o formulário esteja limpo ao abrir no modo de adição
      setFormData(initialFormData);
    }
    // Limpa os erros sempre que o modal abre ou os dados mudam
    setFormErrors({});
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CardFormData]) {
        setFormErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validateForm = (): boolean => {
    // ... sua lógica de validação completa aqui ...
    return true; // Simplificado para o exemplo, mantenha sua validação
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData, initialData ? initialData.id : null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ pb: 1 }}>
        {isEditMode ? 'Editar Cartão' : 'Adicionar Novo Cartão'}
      </DialogTitle>
      {/* O CONTEÚDO DO FORMULÁRIO ESTÁ AQUI */}
      <DialogContent>
        <Grid container spacing={2} sx={{pt:1}}>
          {/* Linha 1: Nome, Banco, Bandeira */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField autoFocus margin="dense" name="name" label="Nome do Cartão" type="text" fullWidth variant="outlined"
              value={formData.name} onChange={handleChange} error={!!formErrors.name} helperText={formErrors.name} required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField margin="dense" name="bankName" label="Banco" type="text" fullWidth variant="outlined"
              value={formData.bankName} onChange={handleChange} error={!!formErrors.bankName} helperText={formErrors.bankName} required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth margin="dense" variant="outlined" required error={!!formErrors.brand}>
              <InputLabel id="card-brand-label">Bandeira</InputLabel>
              <Select labelId="card-brand-label" name="brand" value={formData.brand} onChange={handleChange} label="Bandeira">
                {cardBrandOptions.map((option) => ( <MenuItem key={option.value} value={option.value}> {option.label} </MenuItem> ))}
              </Select>
              {formErrors.brand && <Typography color="error" variant="caption" sx={{ml:1.5, mt:0.5}}>{formErrors.brand}</Typography>}
            </FormControl>
          </Grid>

          {/* Linha 2: Dia de Fechamento, Dia de Vencimento */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense" variant="outlined" required error={!!formErrors.closingDay}>
              <InputLabel id="closing-day-label">Dia de Fechamento</InputLabel>
              <Select labelId="closing-day-label" name="closingDay" value={formData.closingDay} onChange={handleChange} label="Dia de Fechamento">
                {dayOptions.map((option) => ( <MenuItem key={option.value} value={option.value}> {option.label} </MenuItem> ))}
              </Select>
              {formErrors.closingDay && <Typography color="error" variant="caption" sx={{ml:1.5, mt:0.5}}>{formErrors.closingDay}</Typography>}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth margin="dense" variant="outlined" required error={!!formErrors.dueDay}>
              <InputLabel id="due-day-label">Dia de Vencimento</InputLabel>
              <Select labelId="due-day-label" name="dueDay" value={formData.dueDay} onChange={handleChange} label="Dia de Vencimento">
                {dayOptions.map((option) => ( <MenuItem key={option.value} value={option.value}> {option.label} </MenuItem> ))}
              </Select>
              {formErrors.dueDay && <Typography color="error" variant="caption" sx={{ml:1.5, mt:0.5}}>{formErrors.dueDay}</Typography>}
            </FormControl>
          </Grid>

          {/* Linha 3: Limite */}
          <Grid size={{ xs: 12 }}>
            <TextField margin="dense" name="limit" label="Limite do Cartão (R$)" type="number" fullWidth variant="outlined"
              value={formData.limit} onChange={handleChange} InputProps={{ inputProps: { min: 0 } }}
              error={!!formErrors.limit} helperText={formErrors.limit} required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{p: '16px 24px'}}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? 'Salvar Alterações' : 'Registrar Cartão'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardFormModal;