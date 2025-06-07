import {
    TextField, ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox,
    Select, MenuItem, InputLabel, FormControl, FormHelperText,
    Typography, Box,
} from '@mui/material';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useBankAccountStore } from '../../../../store/bankAccountStore';
import { useCategoriesStore } from '../../../../store/categoriesStore';
import { RecurringTransactionFields } from './RecurringTransactionFields';
import GetMuiIcon from '../../../../utils/getMuiIcon';

export const TransactionEditForm = () => {
    const { control, register, formState: { errors } } = useFormContext();
    const { bankAccounts } = useBankAccountStore();
    const { categories, defaultCategories } = useCategoriesStore();

    const isRecurring = useWatch({ control, name: 'isRecurring' });
    const transactionType = useWatch({ control, name: 'type' });

    const filteredCategories = [...categories, ...defaultCategories].filter(category => category.type === transactionType);

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
            <FormControl fullWidth margin="dense" error={!!errors.category}>
                <InputLabel id="category-label">Categoria</InputLabel>
                <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <Select
                            labelId="category-label"
                            id="category"
                            value={field.value || ''}
                            label="Categoria"
                            onChange={field.onChange}
                        >
                            {filteredCategories.map((category) => (
                                <MenuItem key={category.id} value={category.icon}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GetMuiIcon iconName={category.icon} />
                                        <Typography>{category.name}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.category && <FormHelperText>{errors.category.message as string}</FormHelperText>}
            </FormControl>
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
