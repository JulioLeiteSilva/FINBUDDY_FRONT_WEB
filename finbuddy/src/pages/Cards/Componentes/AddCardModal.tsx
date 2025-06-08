// src/components/AddCardFeature.tsx
import React, { useState } from 'react';
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
  Box,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface CardFormData {
  name: string;
  brand: string;
  closingDay: string;
  dueDay: string;
  limit: string;
  bankName: string;
}

const initialFormData: CardFormData = {
  name: '',
  brand: '',
  closingDay: '',
  dueDay: '',
  limit: '',
  bankName: '',
};

const cardBrandOptions = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTERCARD', label: 'Mastercard' },
  { value: 'ELO', label: 'Elo' },
  { value: 'AMEX', label: 'Amex' },
  { value: 'OTHER', label: 'Outro' },
];

const dayOptions = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return { value: day.toString(), label: day.toString() };
});

const AddCardFeature: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<CardFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CardFormData, string>>>({});

  const handleClickOpen = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CardFormData]) {
        setFormErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CardFormData, string>> = {};
    if (formData.name.trim().length < 3) errors.name = "Mínimo 3 caracteres.";
    if (formData.name.trim().length > 100) errors.name = "Máximo 100 caracteres.";
    if (!formData.brand) errors.brand = "Selecione uma bandeira.";
    if (!formData.closingDay) errors.closingDay = "Dia obrigatório.";
    if (!formData.dueDay) errors.dueDay = "Dia obrigatório.";
    
    const closingDayNum = parseInt(formData.closingDay, 10);
    const dueDayNum = parseInt(formData.dueDay, 10);
    if (formData.closingDay && (isNaN(closingDayNum) || closingDayNum < 1 || closingDayNum > 31)) {
        errors.closingDay = "Dia inválido (1-31).";
    }
    if (formData.dueDay && (isNaN(dueDayNum) || dueDayNum < 1 || dueDayNum > 31)) {
        errors.dueDay = "Dia inválido (1-31).";
    }

    if (formData.limit === '') errors.limit = "Limite é obrigatório.";
    else if (Number(formData.limit) < 0) errors.limit = "Não pode ser negativo.";
    
    if (formData.bankName.trim().length < 1) errors.bankName = "Banco obrigatório.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const submissionData = {
      name: formData.name,
      flag: formData.brand,
      closingDay: parseInt(formData.closingDay, 10),
      dueDate: parseInt(formData.dueDay, 10),
      limit: parseFloat(formData.limit) || 0,
      bankAccountId: formData.bankName,
    };
    console.log("Dados do Cartão para Salvar (simulando envio):", submissionData);
    handleCloseModal(); 
  };

  // Estilos para remover spinners do input number
  const numberInputStyles = {
    // Para Firefox
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    // Para Chrome, Safari, Edge, Opera
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  };

  // Props para o menu do Select, para controlar altura
  const selectMenuProps = {
    PaperProps: {
      sx: {
        maxHeight: 224, // Altura máxima para o menu dropdown (aprox. 5-6 itens visíveis)
        // width: 250, // Você pode definir uma largura se necessário
      },
    },
  };

  return (
    <>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleClickOpen}
          sx={{ borderRadius: '20px', padding: '10px 20px', textTransform: 'none', fontSize:'1rem' }}
        >
          Novo Cartão +
        </Button>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ pb: 1 }}>Adicionar Novo Cartão</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{pt:1}}>
            {/* Linha 1 */}
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

            {/* Linha 2 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="dense" variant="outlined" required error={!!formErrors.closingDay}>
                <InputLabel id="closing-day-label">Dia de Fechamento</InputLabel>
                <Select
                  labelId="closing-day-label"
                  name="closingDay"
                  value={formData.closingDay}
                  onChange={handleChange}
                  label="Dia de Fechamento"
                  MenuProps={selectMenuProps} // << Aplicando props ao menu
                >
                  {dayOptions.map((option) => ( <MenuItem key={option.value} value={option.value}> {option.label} </MenuItem> ))}
                </Select>
                {formErrors.closingDay && <Typography color="error" variant="caption" sx={{ml:1.5, mt:0.5}}>{formErrors.closingDay}</Typography>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="dense" variant="outlined" required error={!!formErrors.dueDay}>
                <InputLabel id="due-day-label">Dia de Vencimento</InputLabel>
                <Select
                  labelId="due-day-label"
                  name="dueDay"
                  value={formData.dueDay}
                  onChange={handleChange}
                  label="Dia de Vencimento"
                  MenuProps={selectMenuProps} // << Aplicando props ao menu
                >
                  {dayOptions.map((option) => ( <MenuItem key={option.value} value={option.value}> {option.label} </MenuItem> ))}
                </Select>
                {formErrors.dueDay && <Typography color="error" variant="caption" sx={{ml:1.5, mt:0.5}}>{formErrors.dueDay}</Typography>}
              </FormControl>
            </Grid>

            {/* Linha 3 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                margin="dense"
                name="limit"
                label="Limite do Cartão (R$)"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.limit}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
                error={!!formErrors.limit}
                helperText={formErrors.limit}
                required
                sx={numberInputStyles} // << Aplicando estilos para remover spinners
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{p: '16px 24px'}}>
          <Button onClick={handleCloseModal} color="inherit">Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Registrar Cartão</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCardFeature;