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
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { TransactionRequestDTOSchemaType } from '../../schemas/Transactions';
import { TransactionFrequency } from '../../enums/';

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
    control: Control<TransactionRequestDTOSchemaType>;
    register: UseFormRegister<TransactionRequestDTOSchemaType>;
    errors: FieldErrors<TransactionRequestDTOSchemaType>;
}

export const RecurringTransactionFields: React.FC<RecurringTransactionFieldsProps> = ({ control, register, errors }) => {
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
                <TextField
                    id="startDate"
                    label="Data Início"
                    type="date"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('startDate', {
                        setValueAs: (value) => (value ? new Date(value) : null),
                    })}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    id="endDate"
                    label="Data Fim"
                    type="date"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('endDate', {
                        setValueAs: (value) => (value ? new Date(value) : null),
                    })}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                />
            </Grid>
        </Grid>
    );
};