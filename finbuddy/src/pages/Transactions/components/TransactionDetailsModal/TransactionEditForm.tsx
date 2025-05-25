import {
    TextField, ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox,
    Select, MenuItem, InputLabel, FormControl,
    Typography,
} from '@mui/material';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useBankAccountStore } from '../../../../store/bankAccountStore';
import { RecurringTransactionFields } from './RecurringTransactionFields';

export const TransactionEditForm = () => {
    const { control, register, formState: { errors } } = useFormContext();
    const { bankAccounts } = useBankAccountStore();

    const isRecurring = useWatch({ control, name: 'isRecurring' });

    return (
        <>
            <TextField
                autoFocus margin="dense" id="name" label="Descrição" type="text" fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message as string}
            />
            <TextField
                margin="dense" id="value" label="Valor" type="number" fullWidth
                {...register('value', { valueAsNumber: true })}
                error={!!errors.value}
                helperText={errors.value?.message as string}
            />
            <TextField
                margin="dense" id="category" label="Categoria" type="text" fullWidth
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message as string}
            />
            <Controller
                name="type" control={control}
                render={({ field }) => (
                    <FormControl fullWidth margin="dense" error={!!errors.type}>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>Tipo</Typography>
                        <ToggleButtonGroup {...field} exclusive fullWidth
                            onChange={(_, value) => value !== null && field.onChange(value)}
                        >
                            <ToggleButton value="EXPENSE">Despesa</ToggleButton>
                            <ToggleButton value="INCOME">Receita</ToggleButton>
                        </ToggleButtonGroup>
                    </FormControl>
                )}
            />
            <TextField
                id="date" label="Data" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }}
                {...register('date', { setValueAs: (v) => new Date(v) })}
                error={!!errors.date}
                helperText={errors.date?.message as string}
            />
            <FormControl fullWidth margin="dense" error={!!errors.bankAccountId}>
                <InputLabel id="bankAccountId-label">Conta Bancária</InputLabel>
                <Controller
                    name="bankAccountId" control={control}
                    render={({ field }) => (
                        <Select labelId="bankAccountId-label" label="Conta Bancária" {...field}>
                            {bankAccounts.map((acc) => <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>)}
                        </Select>
                    )}
                />
            </FormControl>
            <Controller name="isPaid" control={control}
                render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Pago?" />
                )}
            />
            <Controller name="isRecurring" control={control}
                render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Recorrente?" />
                )}
            />
            {isRecurring && <RecurringTransactionFields />}
        </>
    );
};
