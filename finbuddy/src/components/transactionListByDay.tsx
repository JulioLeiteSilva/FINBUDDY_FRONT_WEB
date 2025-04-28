import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TransactionCard from './transactionCard';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importe o locale para português brasileiro
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { NewTransaction } from './newTransactionModal';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

interface TransactionListByDayProps {
    transactions: NewTransaction[];
}

// Agrupa as transações por dia
const TransactionListByDay: React.FC<TransactionListByDayProps> = ({ transactions }) => {
    // Agrupa as transações por dia
    const transactionsByDay: { [key: string]: NewTransaction[] } = transactions.reduce((acc: { [key: string]: NewTransaction[] }, transaction) => {
        const date = transaction.date;
        const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Formata a data para uma chave consistente
        if (!acc[formattedDate]) {
            acc[formattedDate] = [];
        }
        acc[formattedDate].push(transaction);
        return acc;
    }, {});

    return (
        <List>
            {Object.keys(transactionsByDay)
                .sort((a, b) => dayjs(b).valueOf() - dayjs(a).valueOf()) // Ordena por data decrescente usando Day.js
                .map((day) => (
                    <Accordion key={day} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${day}-content`} id={`panel-${day}-header`}>
                            <Typography variant="h6">{dayjs(day).format('LL')}</Typography> {/* Formata a data para um formato localizado */}
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {transactionsByDay[day].map((transaction) => (
                                    <TransactionCard key={transaction.id} transaction={transaction} />
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </List>
    );
};

export default TransactionListByDay;