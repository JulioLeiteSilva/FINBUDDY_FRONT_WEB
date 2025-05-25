import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, Box } from '@mui/material';
import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { UpdateBankAccountDTOSchemaType } from '../../../../schemas/BankAccount';
import { Bank } from '../../../../hooks/useBanks';
import { AccountType } from '../../../../enums/accountType';
import { getAccountTypeLabel } from './utils/bankAccountUtils';

interface AccountEditFormProps {
    control: Control<UpdateBankAccountDTOSchemaType>;
    register: UseFormRegister<UpdateBankAccountDTOSchemaType>;
    errors: FieldErrors<UpdateBankAccountDTOSchemaType>;
    banks: Bank[];
}

export const AccountEditForm: React.FC<AccountEditFormProps> = ({ control, register, errors, banks }) => {
    return (
        <>
            <TextField
                fullWidth
                autoFocus
                margin="dense"
                label="Nome"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <FormControl fullWidth margin="dense" error={!!errors.type}>
                <InputLabel id="account-type-label">Tipo de Conta</InputLabel>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select labelId="account-type-label" label="Tipo de Conta" {...field}>
                            {Object.values(AccountType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {getAccountTypeLabel(type)}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                <FormHelperText>{errors.type?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="dense" error={!!errors.bank}>
                <InputLabel id="bank-label">Banco</InputLabel>
                <Controller
                    name="bank"
                    control={control}
                    render={({ field }) => (
                        <Select labelId="bank-label" label="Banco" {...field}>
                            {banks.map((bank) => (
                                <MenuItem key={bank.code} value={bank.code}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            // Usando a propriedade correta do seu hook!
                                            src={bank.logoUrl}
                                            alt={`Logo ${bank.name}`}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                marginRight: '12px',
                                                objectFit: 'contain',
                                            }}
                                            // Opcional: Adiciona um logo padrão se a imagem falhar
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/1086/1086741.png';
                                            }}
                                        />
                                        <Typography variant="inherit">{bank.name}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                <FormHelperText>{errors.bank?.message}</FormHelperText>
            </FormControl>

            <TextField
                fullWidth
                margin="dense"
                label="Moeda"
                disabled
                value="BRL"
                {...register('currency')}
            />
        </>
    );
};