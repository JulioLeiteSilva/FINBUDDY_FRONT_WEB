import React from 'react';
import { Typography, Box, Avatar, Chip } from '@mui/material';
import { BankAccountSchemaType } from '../../../../schemas/BankAccount';
import { Bank } from '../../../../hooks/useBanks';
import { getAccountTypeLabel } from './utils/bankAccountUtils';

import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';

interface AccountDisplayInfoProps {
    bankAccount: BankAccountSchemaType;
    banks: Bank[];
}

const InfoRow: React.FC<{ icon: React.ReactElement; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, '& svg': { mr: 1.5, color: 'text.secondary' } }}>
        {icon}
        <Typography variant="body1">
            <Typography component="span" fontWeight="bold">{label}:</Typography> {value}
        </Typography>
    </Box>
);


export const AccountDisplayInfo: React.FC<AccountDisplayInfoProps> = ({ bankAccount, banks }) => {
    const matchedBank = banks.find((b) => b.code === bankAccount.bank);
    const balanceFormatted = bankAccount.balance.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const balanceColor = bankAccount.balance >= 0 ? 'success.main' : 'error.main';

    return (
        <Box>
            <InfoRow
                icon={<PersonIcon />}
                label="Nome"
                value={bankAccount.name}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <BusinessIcon />
                <Typography variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="span" fontWeight="bold" mr={0.5}>Banco:</Typography>
                    {matchedBank?.logoUrl && (
                        <Avatar
                            src={matchedBank.logoUrl}
                            alt={`Logo ${matchedBank.name}`}
                            sx={{ width: 24, height: 24, mr: 1, ml: 0.5 }}
                            slotProps={{ img: { style: { objectFit: 'contain' } } }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    )}
                    {matchedBank?.name || bankAccount.bank}
                </Typography>
            </Box>

            <InfoRow
                icon={<AttachMoneyIcon />}
                label="Saldo"
                value={
                    <Typography component="span" fontWeight="bold" color={balanceColor}>
                        R$ {balanceFormatted}
                    </Typography>
                }
            />
            <InfoRow
                icon={<CategoryIcon />}
                label="Tipo"
                value={
                    <Chip
                        label={getAccountTypeLabel(bankAccount.type)}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 0.5 }}
                    />
                }
            />
            <InfoRow
                icon={<PublicIcon />}
                label="Moeda"
                value={bankAccount.currency}
            />
        </Box>
    );
};
