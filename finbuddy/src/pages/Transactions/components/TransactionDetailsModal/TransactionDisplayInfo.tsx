// src/components/TransactionDetailsModal/TransactionDisplayInfo.tsx
import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { TransactionSchemaType } from '../../../../schemas/Transactions';
import { formatDate, frequencyMap, typeMap } from './utils/transactionUtils';
import GetMuiIcon from '../../../../utils/getMuiIcon';
import { useCategoriesStore } from '../../../../store/categoriesStore';

interface TransactionDisplayInfoProps {
    transaction: TransactionSchemaType;
    bankAccountName: string;
}

// Componente auxiliar para evitar repetição
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>{label}:</strong> {value}
    </Typography>
);

export const TransactionDisplayInfo: React.FC<TransactionDisplayInfoProps> = ({ transaction, bankAccountName }) => {
    const { categories, defaultCategories } = useCategoriesStore();
    
    const getCategoryInfo = (categoryIcon: string) => {
        const category = categories.find(cat => cat.icon === categoryIcon);
        const defaultCategory = defaultCategories.find(cat => cat.icon === categoryIcon);
        const categoryInfo = category || defaultCategory;
        
        return {
            icon: categoryInfo?.icon || categoryIcon,
            name: categoryInfo?.name || categoryIcon
        };
    };

    const categoryInfo = getCategoryInfo(transaction.category);

    return (
        <Box sx={{ mt: 1 }}>
            <InfoRow label="Nome" value={transaction.name} />
            <InfoRow 
                label="Categoria" 
                value={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GetMuiIcon iconName={categoryInfo.icon} />
                        <Typography variant="body1">{categoryInfo.name}</Typography>
                    </Box>
                } 
            />
            <InfoRow
                label="Valor"
                value={transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            />
            <InfoRow label="Data" value={formatDate(transaction.date)} />
            <InfoRow
                label="Tipo"
                value={<Chip label={typeMap[transaction.type]} size="small" color={transaction.type === 'INCOME' ? 'success' : 'error'} />}
            />
            <InfoRow
                label="Pago"
                value={<Chip label={transaction.isPaid ? 'Sim' : 'Não'} size="small" variant="outlined" />}
            />
            <InfoRow label="Recorrente" value={transaction.isRecurring ? 'Sim' : 'Não'} />

            {transaction.isRecurring && (
                <Box sx={{ pl: 2, borderLeft: '2px solid', borderColor: 'divider', mt: 1 }}>
                    <InfoRow label="Frequência" value={transaction.frequency ? frequencyMap[transaction.frequency] : '-'} />
                    <InfoRow label="Início" value={formatDate(transaction.startDate)} />
                    <InfoRow label="Fim" value={formatDate(transaction.endDate)} />
                </Box>
            )}

            <InfoRow label="Conta Bancária" value={bankAccountName} />
        </Box>
    );
};
