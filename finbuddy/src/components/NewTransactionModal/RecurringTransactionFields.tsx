import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { TransactionFrequency } from '../../enums/';
import { CreateTransactionType } from '../../schemas/Transactions';

const frequencyMap: Record<string, string> = {
  WEEKLY: "Semanal",
  BIWEEKLY: "Quinzenal",
  MONTHLY: "Mensal",
  BIMONTHLY: "Bimestral",
  QUARTERLY: "Trimestral",
  SEMIANNUALLY: "Semestral",
  ANNUALLY: "Anual",
};

interface RecurringTransactionFieldsProps {
  control: Control<CreateTransactionType>;
  errors: FieldErrors<CreateTransactionType>;
}

export const RecurringTransactionFields: React.FC<RecurringTransactionFieldsProps> = ({ control, errors }) => {

  // Helper para converter o objeto Date do formulário para string YYYY-MM-DD do input
  const formatDateToInput = (date: Date | null | undefined | string) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth margin="dense" error={!!errors.frequency}>
          <InputLabel id="frequency-label">Frequência</InputLabel>
          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              <Select
                labelId="frequency-label"
                id="frequency"
                value={field.value ?? ''}
                label="Frequência"
                onChange={field.onChange}
              >
                {Object.values(TransactionFrequency).map((freq) => (
                  <MenuItem key={freq} value={freq}>
                    {frequencyMap[freq]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.frequency && <FormHelperText>{errors.frequency.message}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <TextField
              {...field}
              id="startDate"
              label="Data Início"
              type="date"
              fullWidth
              margin="dense"
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              // Transforma Date -> String para o input exibir corretamente
              value={formatDateToInput(field.value)}
              // Transforma String -> Date para salvar no formulário corretamente
              onChange={(e) => {
                field.onChange(e.target.value ? new Date(e.target.value) : null);
              }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <TextField
              {...field}
              id="endDate"
              label="Data Fim"
              type="date"
              fullWidth
              margin="dense"
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              value={formatDateToInput(field.value)}
              onChange={(e) => {
                field.onChange(e.target.value ? new Date(e.target.value) : null);
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};