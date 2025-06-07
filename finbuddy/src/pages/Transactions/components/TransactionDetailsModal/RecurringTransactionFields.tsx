import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { TransactionFrequency } from '../../../../enums';
import { frequencyMap } from './utils/transactionUtils';

export const RecurringTransactionFields = () => {
    const { control, register, formState: { errors } } = useFormContext(); // Acessa o contexto do formulário

    return (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }} >
                <FormControl fullWidth margin="dense" error={!!errors.frequency}>
                    <InputLabel id="frequency-label">Frequência</InputLabel>
                    <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                            <Select labelId="frequency-label" label="Frequência" {...field} disabled>
                                {Object.values(TransactionFrequency).map((freq) => (
                                    <MenuItem key={freq} value={freq}>{frequencyMap[freq]}</MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.frequency && <FormHelperText>{typeof errors.frequency.message === 'string' ? errors.frequency.message : ''}</FormHelperText>}
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    id="startDate"
                    label="Data Início"
                    type="date"
                    disabled
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('startDate', { setValueAs: (v) => v ? new Date(v) : null })}
                    error={!!errors.startDate}
                    helperText={typeof errors.startDate?.message === 'string' ? errors.startDate.message : ''}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                    id="endDate"
                    label="Data Fim"
                    type="date"
                    disabled
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('endDate', { setValueAs: (v) => v ? new Date(v) : null })}
                    error={!!errors.endDate}
                    helperText={typeof errors.endDate?.message === 'string' ? errors.endDate.message : ''}
                />
            </Grid>
        </Grid>
    );
};
