import { Box, Button, ButtonGroup, Card, CardContent, TextField, Typography } from "@mui/material";
import TransactionListByDay from "../../components/transactionListByDay";
import { useMemo, useState } from "react";
import { useTransactionsStore } from "../../store/transactionStore";

type TransactionType = 'all' | 'income' | 'expense';

const TransactionsPage = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const [filterType, setFilterType] = useState<TransactionType>('all');
    const [searchText, setSearchText] = useState<string>('');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'income' && transaction.amount > 0) ||
                (filterType === 'expense' && transaction.amount < 0);

            const matchesSearch =
                searchText === '' ||
                transaction.description.toLowerCase().includes(searchText.toLowerCase());

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
                        <Button onClick={() => handleFilterChange('income')} disabled={filterType === 'income'}>
                            Receitas
                        </Button>
                        <Button onClick={() => handleFilterChange('expense')} disabled={filterType === 'expense'}>
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