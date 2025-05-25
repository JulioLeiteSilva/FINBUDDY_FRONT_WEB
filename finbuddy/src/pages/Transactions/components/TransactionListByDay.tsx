import React, { useMemo } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, Box, Skeleton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TransactionCard from './TransactionCard';
import { TransactionSchemaType } from '../../../schemas/Transactions';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { firestoreTimestampToDate } from './TransactionDetailsModal/utils/transactionUtils';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

interface TransactionListByDayProps {
    transactions: TransactionSchemaType[];
    isLoading: boolean;
    onDataChange: () => void;
}

export const TransactionListByDay: React.FC<TransactionListByDayProps> = ({ transactions, isLoading, onDataChange }) => {

    const transactionsByDay = useMemo(() => {
        return transactions.reduce((acc: { [key: string]: TransactionSchemaType[] }, transaction) => {
            // Usando o utilitário para um código mais limpo e seguro
            const dateObj = firestoreTimestampToDate(transaction.date);
            if (dateObj) {
                const formattedDateKey = dayjs(dateObj).format('YYYY-MM-DD');
                if (!acc[formattedDateKey]) {
                    acc[formattedDateKey] = [];
                }
                acc[formattedDateKey].push(transaction);
            }
            return acc;
        }, {});
    }, [transactions]);

    const sortedDays = useMemo(() => {
        return Object.keys(transactionsByDay).sort((a, b) => dayjs(b).valueOf() - dayjs(a).valueOf());
    }, [transactionsByDay]);

    if (isLoading) {
        return (
            <Box>
                {[...Array(3)].map((_, dayIndex) => (
                    <Box key={dayIndex} sx={{ mb: 2 }}>
                        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
                        {[...Array(2)].map((_, cardIndex) => (
                            <Skeleton key={cardIndex} variant="rectangular" height={70} sx={{ mb: 1.5, borderRadius: 2 }} />
                        ))}
                    </Box>
                ))}
            </Box>
        );
    }

    if (transactions.length === 0) {
        return (
            <Typography color="text.secondary" textAlign="center" sx={{ my: 3 }}>
                Nenhuma transação encontrada.
            </Typography>
        );
    }

    return (
        <List sx={{ width: '100%' }}>
            {sortedDays.map((day) => (
                <Accordion key={day} defaultExpanded sx={{ mb: 1, boxShadow: 'none', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${day}-content`} id={`panel-${day}-header`}>
                        <Typography variant="h6">{dayjs(day).format('LL')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List disablePadding>
                            {transactionsByDay[day].map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                    onTransactionUpdate={onDataChange}
                                />
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </List>
    );
};

export default TransactionListByDay;
