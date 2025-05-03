import { Box, Button, ButtonGroup, Card, CardContent, TextField, Typography } from "@mui/material";
import TransactionListByDay from "../../components/transactionListByDay";
import { useMemo, useState } from "react";
import { useTransactionsStore } from "../../store/transactionStore";

type TransactionType = 'all' | 'INCOME' | 'EXPENSE';

const TransactionsPage = () => {
    const { transactions } = useTransactionsStore();
    const [filterType, setFilterType] = useState<TransactionType>('all');
    const [searchText, setSearchText] = useState<string>('');


    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'INCOME' && transaction.type === 'INCOME') ||
                (filterType === 'EXPENSE' && transaction.type === 'EXPENSE');

            const matchesSearch =
                searchText === '' ||
                transaction.name.toLowerCase().includes(searchText.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [transactions, filterType, searchText]);

    const handleFilterChange = (newFilter: TransactionType) => {
        setFilterType(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    return (
        <Box>
            <Card sx={{ minWidth: 900, m: 5 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Histórico de Transações
                    </Typography>
                    <TextField
                        label="Pesquisar Transação"
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="dense"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <ButtonGroup variant="outlined" aria-label="transaction filter">
                        <Button onClick={() => handleFilterChange('all')} disabled={filterType === 'all'}>
                            Todas
                        </Button>
                        <Button onClick={() => handleFilterChange('INCOME')} disabled={filterType === 'INCOME'}>
                            Receitas
                        </Button>
                        <Button onClick={() => handleFilterChange('EXPENSE')} disabled={filterType === 'EXPENSE'}>
                            Despesas
                        </Button>
                    </ButtonGroup>
                    <TransactionListByDay transactions={filteredTransactions} />
                </CardContent>
            </Card>
        </Box>
    );
}
export default TransactionsPage;